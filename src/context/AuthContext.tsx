import React, { createContext, useContext, useEffect, useState } from 'react';

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

    // Load state from LocalStorage on mount
    useEffect(() => {
        try {
            const storedProfiles = localStorage.getItem('family_app_profiles');
            if (storedProfiles) {
                setProfiles(JSON.parse(storedProfiles));
            }

            const storedUser = localStorage.getItem('family_app_current_user');
            if (storedUser) {
                setCurrentUser(JSON.parse(storedUser));
            }
        } catch (e) {
            console.error("Failed to load auth state", e);
        } finally {
            setLoading(false);
        }
    }, []);

    // Save profiles whenever they change
    useEffect(() => {
        localStorage.setItem('family_app_profiles', JSON.stringify(profiles));
    }, [profiles]);

    // Save current user whenever it changes
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('family_app_current_user', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('family_app_current_user');
        }
    }, [currentUser]);

    const signInAs = (id: string) => {
        const profile = profiles.find(p => p.id === id);
        if (profile) {
            setCurrentUser(profile);
        }
    };

    const signOut = () => {
        setCurrentUser(null);
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

    const addPoints = (amount: number, addXp: boolean = true) => {
        if (!currentUser) return;

        // Update local context user
        const newPoints = currentUser.points + amount;
        const newXp = addXp && amount > 0 ? currentUser.xp + amount : currentUser.xp;
        const { level, title } = calculateLevelAndTitle(newXp);

        const updatedUser = {
            ...currentUser,
            points: newPoints < 0 ? 0 : newPoints, // Prevent negative points visually
            xp: newXp,
            level,
            title
        };
        setCurrentUser(updatedUser);

        // Update the profile array
        setProfiles(prev => prev.map(p => p.id === currentUser.id ? updatedUser : p));
    };

    const awardBadge = (id: string, badge: string) => {
        setProfiles(prev => prev.map(p => {
            if (p.id === id && !p.badges.includes(badge)) {
                const updatedUser = { ...p, badges: [...p.badges, badge] };
                if (currentUser?.id === id) setCurrentUser(updatedUser);
                return updatedUser;
            }
            return p;
        }));
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
