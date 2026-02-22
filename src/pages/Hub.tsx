import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useChores } from '../context/ChoresContext';
import { useEvents } from '../context/EventsContext';
import { Calendar } from '../components/Calendar';

export interface ShoppingItem {
    id: string;
    name: string;
    isBought: boolean;
}

export interface StickyNote {
    id: string;
    text: string;
    color: string;
    author: string;
}

const NOTE_COLORS = ['#fef08a', '#fda4af', '#bae6fd', '#bbf7d0', '#e9d5ff'];

export const Hub: React.FC = () => {
    const { chores, isChoreDoneToday } = useChores();
    const { events } = useEvents();

    // --- Local State for Shopping List ---
    const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
    const [newItemName, setNewItemName] = useState('');

    // --- Local State for Notes ---
    const [notes, setNotes] = useState<StickyNote[]>([]);
    const [newNoteText, setNewNoteText] = useState('');

    const pendingChores = chores.filter(c => !isChoreDoneToday(c.id));
    const todayEvents = events.filter(e => e.date === new Date().toISOString().split('T')[0]);

    // Load from Firebase
    useEffect(() => {
        const unsubscribeShopping = onSnapshot(collection(db, 'shopping'), (snapshot) => {
            const loadedShopping: ShoppingItem[] = [];
            snapshot.forEach(doc => loadedShopping.push(doc.data() as ShoppingItem));
            setShoppingList(loadedShopping);
        });

        const unsubscribeNotes = onSnapshot(collection(db, 'notes'), (snapshot) => {
            const loadedNotes: StickyNote[] = [];
            snapshot.forEach(doc => loadedNotes.push(doc.data() as StickyNote));
            setNotes(loadedNotes);
        });

        return () => {
            unsubscribeShopping();
            unsubscribeNotes();
        };
    }, []);

    // Shopping handlers
    const handleAddShoppingItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemName.trim()) return;
        const id = crypto.randomUUID();
        const newItem: ShoppingItem = { id, name: newItemName, isBought: false };
        setNewItemName('');
        try {
            await setDoc(doc(db, 'shopping', id), newItem);
        } catch (e) { console.error(e); }
    };

    const toggleShoppingItem = async (id: string) => {
        const item = shoppingList.find(i => i.id === id);
        if (!item) return;
        try {
            await updateDoc(doc(db, 'shopping', id), { isBought: !item.isBought });
        } catch (e) { console.error(e); }
    };

    const removeShoppingItem = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'shopping', id));
        } catch (e) { console.error(e); }
    };

    // Note handlers
    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNoteText.trim()) return;
        const randomColor = NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];
        const id = crypto.randomUUID();
        const newNote: StickyNote = { id, text: newNoteText, color: randomColor, author: 'Ja' };
        setNewNoteText('');
        try {
            await setDoc(doc(db, 'notes', id), newNote);
        } catch (e) { console.error(e); }
    };

    const removeNote = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'notes', id));
        } catch (e) { console.error(e); }
    };

    return (
        <div className="page-container animate-slide-up">
            <header className="mb-6 flex justify-between items-center" style={{ marginTop: '1rem' }}>
                <div>
                    <h1 className="text-3xl font-black" style={{ letterSpacing: '-1.5px' }}>Hub Domowy</h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', fontWeight: 500 }}>Centrum dowodzenia</p>
                </div>
            </header>

            <Calendar chores={chores} events={events} />

            {/* Notification Cards Carousel */}
            <section style={{ marginBottom: '2.5rem' }}>
                <div style={{
                    display: 'flex',
                    gap: '1.25rem',
                    overflowX: 'auto',
                    paddingBottom: '1rem',
                    margin: '0 -1.5rem',
                    paddingLeft: '1.5rem',
                    scrollbarWidth: 'none'
                }}>
                    {/* Tasks Summary Card */}
                    <motion.div
                        whileTap={{ scale: 0.98 }}
                        style={{
                            minWidth: '280px',
                            padding: '1.5rem',
                            borderRadius: 'var(--radius-lg)',
                            background: 'var(--pastel-blue)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            minHeight: '180px',
                            boxShadow: 'var(--shadow-md)'
                        }}
                    >
                        <div style={{ paddingBottom: '1rem' }}>
                            <span style={{ fontSize: '2rem' }}>📝</span>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0.5rem 0' }}>Twoje zadania</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', opacity: 0.7 }}>Dzisiaj masz {pendingChores.length} rzeczy do zrobienia</p>
                        </div>
                        <div style={{ fontWeight: 900, fontSize: '1.5rem', alignSelf: 'flex-start' }}>{pendingChores.length} <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>pozostało</span></div>
                    </motion.div>

                    {/* Events Summary Card */}
                    <motion.div
                        whileTap={{ scale: 0.98 }}
                        style={{
                            minWidth: '280px',
                            padding: '1.5rem',
                            borderRadius: 'var(--radius-lg)',
                            background: 'var(--pastel-mint)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            minHeight: '180px',
                            boxShadow: 'var(--shadow-md)'
                        }}
                    >
                        <div style={{ paddingBottom: '1rem' }}>
                            <span style={{ fontSize: '2rem' }}>🗓️</span>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0.5rem 0' }}>Wydarzenia</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', opacity: 0.7 }}>
                                {todayEvents.length > 0 ? `Masz ${todayEvents.length} wydarzeń dzisiaj` : 'Brak wydarzeń na dziś'}
                            </p>
                        </div>
                        <div style={{ fontWeight: 900, fontSize: '1.5rem', alignSelf: 'flex-start' }}>{todayEvents.length} <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>dzisiaj</span></div>
                    </motion.div>

                    {/* Shop Promo Card */}
                    <motion.div
                        whileTap={{ scale: 0.98 }}
                        style={{
                            minWidth: '280px',
                            padding: '1.5rem',
                            borderRadius: 'var(--radius-lg)',
                            background: 'var(--pastel-pink)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            minHeight: '180px',
                            boxShadow: 'var(--shadow-md)'
                        }}
                    >
                        <div style={{ paddingBottom: '1rem' }}>
                            <span style={{ fontSize: '2rem' }}>🎁</span>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0.5rem 0' }}>Nowości w sklepie</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', opacity: 0.7 }}>Sprawdź nowe nagrody!</p>
                        </div>
                        <div style={{ fontWeight: 900, fontSize: '1rem', textTransform: 'uppercase', alignSelf: 'flex-start' }}>Zobacz sklep →</div>
                    </motion.div>
                </div>
            </section>

            {/* --- Notes Section --- */}
            <section style={{ marginBottom: '3rem' }}>
                <h2 className="text-xl font-black mb-3">Tablica Korkowa 📌</h2>

                <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Input
                        placeholder="Zostaw wiadomość na lodówce..."
                        value={newNoteText}
                        onChange={(e) => setNewNoteText(e.target.value)}
                        style={{ flex: 1 }}
                    />
                    <Button type="submit">Przyklej</Button>
                </form>

                <div style={{ display: 'flex', overflowX: 'auto', gap: '1rem', paddingBottom: '1rem', margin: '0 -1.5rem', paddingLeft: '1.5rem', scrollSnapType: 'x mandatory' }}>
                    <AnimatePresence>
                        {notes.length === 0 ? (
                            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', padding: '1rem 0' }}>Brak przyklejonych notatek.</div>
                        ) : (
                            notes.map(note => (
                                <motion.div
                                    key={note.id}
                                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                                    animate={{ opacity: 1, scale: 1, rotate: Math.random() * 6 - 3 }} // Random slight rotation
                                    exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                                    style={{
                                        minWidth: '160px', width: '160px',
                                        backgroundColor: note.color,
                                        padding: '1.25rem',
                                        borderRadius: '4px',
                                        boxShadow: 'var(--shadow-sm)',
                                        color: '#1f2937', // Always dark text on sticky notes
                                        scrollSnapAlign: 'start',
                                        position: 'relative'
                                    }}
                                >
                                    <button onClick={() => removeNote(note.id)} style={{ position: 'absolute', top: '4px', right: '4px', background: 'none', border: 'none', color: '#1f2937', opacity: 0.5, cursor: 'pointer' }}>✕</button>
                                    <p style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif', fontSize: '1.1rem', lineHeight: 1.3, marginBottom: '0.5rem' }}>{note.text}</p>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* --- Shopping List Section --- */}
            <section style={{ marginBottom: '3rem' }}>
                <h2 className="text-xl font-black mb-3">Lista Zakupów 🛒</h2>

                <Card style={{ padding: '1.5rem' }}>
                    <form onSubmit={handleAddShoppingItem} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <Input
                            placeholder="Co potrzebujemy kupić?"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            style={{ flex: 1 }}
                        />
                        <Button type="submit" variant="secondary">Dodaj</Button>
                    </form>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <AnimatePresence>
                            {shoppingList.length === 0 ? (
                                <p className="text-sm text-color-text-muted text-center py-4">Lista jest pusta. Lodówka pełna!</p>
                            ) : (
                                shoppingList.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-md)' }}
                                    >
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', flex: 1 }}>
                                            <input
                                                type="checkbox"
                                                checked={item.isBought}
                                                onChange={() => toggleShoppingItem(item.id)}
                                                style={{ width: '20px', height: '20px', accentColor: 'var(--color-primary)' }}
                                            />
                                            <span style={{ fontSize: '1.1rem', fontWeight: 600, textDecoration: item.isBought ? 'line-through' : 'none', color: item.isBought ? 'var(--color-text-muted)' : 'var(--color-text-main)' }}>
                                                {item.name}
                                            </span>
                                        </label>
                                        <button onClick={() => removeShoppingItem(item.id)} style={{ border: 'none', background: 'none', color: 'var(--color-danger)', opacity: 0.5, cursor: 'pointer', fontSize: '1.2rem' }}>🗑️</button>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </Card>
            </section>
        </div>
    );
};
