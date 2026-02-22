import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export interface ChecklistItem {
    id: string;
    text: string;
    isDone: boolean;
}

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface ChoreRecord {
    date: string; // ISO date
    time?: string; // HH:mm
    completedBy: string; // profile id
}

export interface Chore {
    id: string;
    title: string;
    description?: string;
    points: number;
    recurrence: RecurrenceType;
    assignedTo?: string; // profile id or empty for everyone
    checklist: ChecklistItem[];
    history: ChoreRecord[];
}

interface ChoresContextType {
    chores: Chore[];
    addChore: (chore: Omit<Chore, 'id' | 'history'>) => void;
    updateChore: (id: string, chore: Partial<Omit<Chore, 'id' | 'history'>>) => void;
    deleteChore: (id: string) => void;
    completeChore: (id: string, profileId: string) => void;
    toggleChecklistItem: (choreId: string, itemId: string) => void;
    isChoreDoneToday: (id: string) => boolean;
}

const ChoresContext = createContext<ChoresContextType | undefined>(undefined);

const INITIAL_CHORES: Chore[] = [
    {
        id: '1',
        title: 'Odkurzyć cały dom',
        points: 30,
        recurrence: 'weekly',
        checklist: [
            { id: '1a', text: 'Salon', isDone: false },
            { id: '1b', text: 'Sypialnia', isDone: false },
            { id: '1c', text: 'Korytarz', isDone: false }
        ],
        history: []
    },
    {
        id: '2',
        title: 'Wynieść śmieci',
        points: 10,
        recurrence: 'daily',
        checklist: [],
        history: []
    },
];

export const ChoresProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [chores, setChores] = useState<Chore[]>([]);
    const [initialized, setInitialized] = useState(false);
    const { addPoints } = useAuth();

    const getTodayStr = () => new Date().toLocaleDateString('pl-PL');

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'chores'), (snapshot) => {
            const loaded: Chore[] = [];
            let isInitialSetup = false;

            if (snapshot.empty && !initialized) {
                isInitialSetup = true;
                INITIAL_CHORES.forEach(async (c) => {
                    await setDoc(doc(db, 'chores', c.id), c);
                });
            } else {
                snapshot.forEach(doc => {
                    loaded.push(doc.data() as Chore);
                });
                setChores(loaded);
            }
            if (!isInitialSetup) setInitialized(true);
        });

        return () => unsubscribe();
    }, []);

    const addChore = async (choreData: Omit<Chore, 'id' | 'history'>) => {
        const id = crypto.randomUUID();
        try {
            await setDoc(doc(db, 'chores', id), { ...choreData, id, history: [] });
        } catch (e) { console.error(e); }
    };

    const updateChore = async (id: string, choreData: Partial<Omit<Chore, 'id' | 'history'>>) => {
        try {
            await updateDoc(doc(db, 'chores', id), choreData);
        } catch (e) { console.error(e); }
    };

    const deleteChore = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'chores', id));
        } catch (e) { console.error(e); }
    };

    const isChoreDoneToday = (id: string) => {
        const chore = chores.find(c => c.id === id);
        if (!chore) return false;
        return chore.history.some(record => record.date === getTodayStr());
    };

    const completeChore = async (id: string, profileId: string) => {
        const today = getTodayStr();
        if (isChoreDoneToday(id)) return;

        const chore = chores.find(c => c.id === id);
        if (!chore) return;

        addPoints(chore.points);

        const resetChecklist = chore.checklist.map(item => ({ ...item, isDone: false }));
        const nowTime = new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });

        try {
            await updateDoc(doc(db, 'chores', id), {
                checklist: chore.recurrence !== 'none' ? resetChecklist : chore.checklist,
                history: [...chore.history, { date: today, time: nowTime, completedBy: profileId }]
            });
        } catch (e) { console.error(e); }
    };

    const toggleChecklistItem = async (choreId: string, itemId: string) => {
        const chore = chores.find(c => c.id === choreId);
        if (!chore) return;

        const updatedChecklist = chore.checklist.map(item =>
            item.id === itemId ? { ...item, isDone: !item.isDone } : item
        );

        try {
            await updateDoc(doc(db, 'chores', choreId), {
                checklist: updatedChecklist
            });
        } catch (e) { console.error(e); }
    };

    return (
        <ChoresContext.Provider value={{ chores, addChore, updateChore, deleteChore, completeChore, toggleChecklistItem, isChoreDoneToday }}>
            {children}
        </ChoresContext.Provider>
    );
};

export const useChores = () => {
    const context = useContext(ChoresContext);
    if (context === undefined) {
        throw new Error('useChores must be used within a ChoresProvider');
    }
    return context;
};
