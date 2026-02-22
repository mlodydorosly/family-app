import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';

export interface UserProfile {
    id: string; // 'ola' or 'maciek'
    name: string;
    role: 'parent' | 'child'; // for permissions if needed later
    points: number; // For spending in shop
    xp: number; // For leveling up
    level: number;
    title: string;
    badges: string[];
    avatarUrl: string;
    themeColor: string;
}

const DEFAULT_PROFILES: UserProfile[] = [
    {
        id: 'ola',
        name: 'Ola',
        role: 'parent',
        points: 0,
        xp: 0,
        level: 1,
        title: 'Początkujący',
        badges: [],
        avatarUrl: '👩',
        themeColor: 'var(--color-secondary)' // Pink/Red
    },
    {
        id: 'maciek',
        name: 'Maciek',
        role: 'parent',
        points: 0,
        xp: 0,
        level: 1,
        title: 'Początkujący',
        badges: [],
        avatarUrl: '👨',
        themeColor: 'var(--color-primary)'  // Blue
    }
];

interface AuthContextType {
    currentUser: UserProfile | null;
    profiles: UserProfile[];
    loading: boolean;
    signInAs: (id: string) => void;
    signOut: () => void;
    addPoints: (amount: number, addXp?: boolean) => void;
    awardBadge: (id: string, badge: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
    const [profiles, setProfiles] = useState<UserProfile[]>(DEFAULT_PROFILES);
    const [loading, setLoading] = useState(true);

    // Load current user ID from LocalStorage on mount
    useEffect(() => {
        try {
            const storedUserId = localStorage.getItem('family_app_current_user_id');
            if (storedUserId) {
                // Wait for profiles to load from Firebase to set currentUser
                const profile = profiles.find(p => p.id === storedUserId);
                if (profile && !currentUser) {
                    setCurrentUser(profile);
                }
            }
        } catch (e) {
            console.error("Failed to load local user state", e);
        }
    }, [profiles, currentUser]);

    // Real-time listener for profiles from Firestore
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'profiles'), (snapshot) => {
            const loadedProfiles: UserProfile[] = [];
            let isInitialSetup = false;

            if (snapshot.empty && !loading) {
                // Initialize default profiles in Firestore if empty
                isInitialSetup = true;
                DEFAULT_PROFILES.forEach(async (p) => {
                    await setDoc(doc(db, 'profiles', p.id), p);
                });
            } else {
                snapshot.forEach(doc => {
                    loadedProfiles.push(doc.data() as UserProfile);
                });
                if (loadedProfiles.length > 0) {
                    // Sort to maintain original order (Ola then Maciek)
                    loadedProfiles.sort((a, b) => a.id.localeCompare(b.id)).reverse();
                    setProfiles(loadedProfiles);

                    // Update current user if it exists
                    if (currentUser) {
                        const updatedCur = loadedProfiles.find(p => p.id === currentUser.id);
                        if (updatedCur) setCurrentUser(updatedCur);
                    }
                }
            }
            if (!isInitialSetup) setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInAs = (id: string) => {
        const profile = profiles.find(p => p.id === id);
        if (profile) {
            setCurrentUser(profile);
            localStorage.setItem('family_app_current_user_id', id);
        }
    };

    const signOut = () => {
        setCurrentUser(null);
        localStorage.removeItem('family_app_current_user_id');
    };

    const calculateLevelAndTitle = (xp: number) => {
        const level = Math.floor(xp / 100) + 1; // 100 XP per level
        let title = 'Początkujący';
        if (level >= 5) title = 'Pomocnik';
        if (level >= 10) title = 'Ogarniacz';
        if (level >= 20) title = 'Mistrz Organizacji';
        if (level >= 50) title = 'Perfekcyjny Pan/Pani Domu';
        return { level, title };
    };

    const addPoints = async (amount: number, addXp: boolean = true) => {
        if (!currentUser) return;

        const newPoints = currentUser.points + amount;
        const newXp = addXp && amount > 0 ? currentUser.xp + amount : currentUser.xp;
        const { level, title } = calculateLevelAndTitle(newXp);

        try {
            await updateDoc(doc(db, 'profiles', currentUser.id), {
                points: newPoints < 0 ? 0 : newPoints,
                xp: newXp,
                level,
                title
            });
        } catch (e) {
            console.error('Failed to update points', e);
        }
    };

    const awardBadge = async (id: string, badge: string) => {
        const profile = profiles.find(p => p.id === id);
        if (profile && !profile.badges.includes(badge)) {
            try {
                await updateDoc(doc(db, 'profiles', id), {
                    badges: [...profile.badges, badge]
                });
            } catch (e) {
                console.error('Failed to award badge', e);
            }
        }
    };

    return (
        <AuthContext.Provider value={{ currentUser, profiles, loading, signInAs, signOut, addPoints, awardBadge }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
