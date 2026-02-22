import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export interface FamilyEvent {
    id: string;
    title: string;
    date: string; // ISO yyyy-mm-dd
    time?: string;
    location?: string;
    createdBy: string;
}

interface EventsContextType {
    events: FamilyEvent[];
    addEvent: (event: Omit<FamilyEvent, 'id'>) => void;
    deleteEvent: (id: string) => void;
    updateEvent: (id: string, event: Partial<FamilyEvent>) => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

// Initial mock data if empty
const MOCK_EVENTS: FamilyEvent[] = [
    { id: '1', title: 'Wizyta u dentysty', date: new Date().toISOString().split('T')[0], time: '14:30', createdBy: 'ola' },
    { id: '2', title: 'Kino - Premiera', date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], time: '19:00', location: 'Multikino', createdBy: 'maciek' }
];

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [events, setEvents] = useState<FamilyEvent[]>([]);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'events'), (snapshot) => {
            const loaded: FamilyEvent[] = [];
            let isInitialSetup = false;

            if (snapshot.empty && !initialized) {
                isInitialSetup = true;
                MOCK_EVENTS.forEach(async (e) => {
                    await setDoc(doc(db, 'events', e.id), e);
                });
            } else {
                snapshot.forEach(doc => {
                    loaded.push(doc.data() as FamilyEvent);
                });
                loaded.sort((a, b) => a.date.localeCompare(b.date));
                setEvents(loaded);
            }
            if (!isInitialSetup) setInitialized(true);
        });

        return () => unsubscribe();
    }, []);

    const addEvent = async (eventData: Omit<FamilyEvent, 'id'>) => {
        const id = crypto.randomUUID();
        const newEvent: FamilyEvent = { ...eventData, id };
        try {
            await setDoc(doc(db, 'events', id), newEvent);
        } catch (e) { console.error(e); }
    };

    const deleteEvent = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'events', id));
        } catch (e) { console.error(e); }
    };

    const updateEvent = async (id: string, data: Partial<FamilyEvent>) => {
        try {
            await updateDoc(doc(db, 'events', id), data);
        } catch (e) { console.error(e); }
    };

    return (
        <EventsContext.Provider value={{ events, addEvent, deleteEvent, updateEvent }}>
            {children}
        </EventsContext.Provider>
    );
};

export const useEvents = () => {
    const context = useContext(EventsContext);
    if (context === undefined) {
        throw new Error('useEvents must be used within an EventsProvider');
    }
    return context;
};
