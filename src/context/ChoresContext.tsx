import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

export interface ChecklistItem {
    id: string;
    text: string;
    isDone: boolean;
}

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface ChoreRecord {
    date: string; // ISO date
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
        const stored = localStorage.getItem('family_app_chores_v2');
        if (stored) {
            setChores(JSON.parse(stored));
        } else {
            setChores(INITIAL_CHORES);
        }
        setInitialized(true);
    }, []);

    useEffect(() => {
        if (initialized) {
            localStorage.setItem('family_app_chores_v2', JSON.stringify(chores));
        }
    }, [chores, initialized]);

    const addChore = (choreData: Omit<Chore, 'id' | 'history'>) => {
        setChores(prev => [...prev, { ...choreData, id: crypto.randomUUID(), history: [] }]);
    };

    const deleteChore = (id: string) => {
        setChores(prev => prev.filter(c => c.id !== id));
    };

    const isChoreDoneToday = (id: string) => {
        const chore = chores.find(c => c.id === id);
        if (!chore) return false;
        return chore.history.some(record => record.date === getTodayStr());
    };

    const completeChore = (id: string, profileId: string) => {
        const today = getTodayStr();

        if (isChoreDoneToday(id)) return;

        setChores(prev => prev.map(chore => {
            if (chore.id === id) {
                addPoints(chore.points);

                // Reset checklist for recurring tasks when completed
                const resetChecklist = chore.checklist.map(item => ({ ...item, isDone: false }));

                return {
                    ...chore,
                    checklist: chore.recurrence !== 'none' ? resetChecklist : chore.checklist,
                    history: [...chore.history, { date: today, completedBy: profileId }]
                };
            }
            return chore;
        }));
    };

    const toggleChecklistItem = (choreId: string, itemId: string) => {
        setChores(prev => prev.map(chore => {
            if (chore.id !== choreId) return chore;
            return {
                ...chore,
                checklist: chore.checklist.map(item =>
                    item.id === itemId ? { ...item, isDone: !item.isDone } : item
                )
            };
        }));
    };

    return (
        <ChoresContext.Provider value={{ chores, addChore, deleteChore, completeChore, toggleChecklistItem, isChoreDoneToday }}>
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
