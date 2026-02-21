import React, { createContext, useContext, useEffect, useState } from 'react';

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
        const stored = localStorage.getItem('family_app_events');
        if (stored) {
            setEvents(JSON.parse(stored));
        } else {
            setEvents(MOCK_EVENTS);
        }
        setInitialized(true);
    }, []);

    useEffect(() => {
        if (initialized) {
            localStorage.setItem('family_app_events', JSON.stringify(events));
        }
    }, [events, initialized]);

    const addEvent = (eventData: Omit<FamilyEvent, 'id'>) => {
        const newEvent: FamilyEvent = {
            ...eventData,
            id: crypto.randomUUID()
        };
        setEvents(prev => [...prev, newEvent].sort((a, b) => a.date.localeCompare(b.date)));
    };

    const deleteEvent = (id: string) => {
        setEvents(prev => prev.filter(e => e.id !== id));
    };

    const updateEvent = (id: string, data: Partial<FamilyEvent>) => {
        setEvents(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
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
