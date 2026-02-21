import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';

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
    // --- Local State for Shopping List ---
    const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
    const [newItemName, setNewItemName] = useState('');

    // --- Local State for Notes ---
    const [notes, setNotes] = useState<StickyNote[]>([]);
    const [newNoteText, setNewNoteText] = useState('');

    // Load from local storage
    useEffect(() => {
        const sList = localStorage.getItem('family_app_shopping');
        if (sList) setShoppingList(JSON.parse(sList));

        const sNotes = localStorage.getItem('family_app_notes');
        if (sNotes) setNotes(JSON.parse(sNotes));
    }, []);

    // Save to local storage
    useEffect(() => {
        localStorage.setItem('family_app_shopping', JSON.stringify(shoppingList));
    }, [shoppingList]);

    useEffect(() => {
        localStorage.setItem('family_app_notes', JSON.stringify(notes));
    }, [notes]);

    // Shopping handlers
    const handleAddShoppingItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemName.trim()) return;
        setShoppingList([{ id: crypto.randomUUID(), name: newItemName, isBought: false }, ...shoppingList]);
        setNewItemName('');
    };

    const toggleShoppingItem = (id: string) => {
        setShoppingList(prev => prev.map(item => item.id === id ? { ...item, isBought: !item.isBought } : item));
    };

    const removeShoppingItem = (id: string) => {
        setShoppingList(prev => prev.filter(i => i.id !== id));
    };

    // Note handlers
    const handleAddNote = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNoteText.trim()) return;
        const randomColor = NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];
        setNotes([{ id: crypto.randomUUID(), text: newNoteText, color: randomColor, author: 'Ja' }, ...notes]);
        setNewNoteText('');
    };

    const removeNote = (id: string) => {
        setNotes(prev => prev.filter(n => n.id !== id));
    };

    return (
        <div className="page-container animate-slide-up" style={{ paddingBottom: '6rem' }}>
            <header className="mb-6 flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <div>
                    <h1 className="text-3xl font-black" style={{ letterSpacing: '-0.5px' }}>Hub Domowy</h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>Wspólna przestrzeń organizacyjna</p>
                </div>
            </header>

            {/* --- Notes Section --- */}
            <section style={{ marginBottom: '3rem' }}>
                <h2 className="text-xl font-bold mb-3">Tablica Korkowa 📌</h2>

                <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Input
                        placeholder="Zostaw wiadomość na lodówce..."
                        value={newNoteText}
                        onChange={(e) => setNewNoteText(e.target.value)}
                        style={{ flex: 1 }}
                    />
                    <Button type="submit">Przyklej</Button>
                </form>

                <div style={{ display: 'flex', overflowX: 'auto', gap: '1rem', paddingBottom: '1rem', margin: '0 -1rem', paddingLeft: '1rem', scrollSnapType: 'x mandatory' }}>
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
            <section>
                <h2 className="text-xl font-bold mb-3">Lista Zakupów 🛒</h2>

                <Card style={{ padding: '1rem' }}>
                    <form onSubmit={handleAddShoppingItem} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <Input
                            placeholder="Co potrzebujemy kupić?"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            style={{ flex: 1 }}
                        />
                        <Button type="submit" variant="secondary">Dodaj</Button>
                    </form>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'var(--color-background)', borderRadius: '8px' }}
                                    >
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', flex: 1 }}>
                                            <input
                                                type="checkbox"
                                                checked={item.isBought}
                                                onChange={() => toggleShoppingItem(item.id)}
                                                style={{ width: '20px', height: '20px', accentColor: 'var(--color-primary)' }}
                                            />
                                            <span style={{ fontSize: '1rem', textDecoration: item.isBought ? 'line-through' : 'none', color: item.isBought ? 'var(--color-text-muted)' : 'var(--color-text-main)' }}>
                                                {item.name}
                                            </span>
                                        </label>
                                        <button onClick={() => removeShoppingItem(item.id)} style={{ border: 'none', background: 'none', color: 'var(--color-danger)', opacity: 0.5, cursor: 'pointer' }}>Usuń</button>
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
