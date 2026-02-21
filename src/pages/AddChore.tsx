import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChores, type RecurrenceType, type ChecklistItem } from '../context/ChoresContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { motion, AnimatePresence } from 'framer-motion';

export const AddChore: React.FC = () => {
    const navigate = useNavigate();
    const { addChore } = useChores();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [points, setPoints] = useState(10);
    const [recurrence, setRecurrence] = useState<RecurrenceType>('daily');

    const [checklistItemText, setChecklistItemText] = useState('');
    const [checklist, setChecklist] = useState<ChecklistItem[]>([]);

    const handleAddChecklist = (e: React.FormEvent) => {
        e.preventDefault();
        if (!checklistItemText.trim()) return;
        setChecklist([...checklist, { id: crypto.randomUUID(), text: checklistItemText, isDone: false }]);
        setChecklistItemText('');
    };

    const handleRemoveChecklist = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        setChecklist(checklist.filter(c => c.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        addChore({
            title,
            description,
            points,
            recurrence,
            checklist,
        });

        navigate('/'); // Wróć na stronę główną
    };

    return (
        <div className="page-container animate-slide-up" style={{ paddingBottom: '6rem' }}>
            <header className="mb-6 flex justify-between items-center" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-primary)' }}
                >
                    ←
                </button>
                <h1 className="text-2xl font-black flex-1" style={{ letterSpacing: '-0.5px' }}>Nowy obowiązek</h1>
            </header>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Input
                        label="Co jest do zrobienia?"
                        placeholder="Nakarmić psa..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        autoFocus
                    />

                    <Input
                        label="Krótki opis (opcjonalnie)"
                        placeholder="Zwróć uwagę na..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label className="text-sm font-medium">Liczba Monet</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <input
                                type="range"
                                min="5" max="100" step="5"
                                value={points}
                                onChange={(e) => setPoints(Number(e.target.value))}
                                style={{ flex: 1, accentColor: 'var(--color-primary)' }}
                            />
                            <span style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '1.25rem', width: '60px' }}>{points} 🪙</span>
                        </div>
                    </div>
                </Card>

                {/* Sekcja Powtarzania */}
                <Card style={{ padding: '1.5rem' }}>
                    <h3 className="font-bold mb-3">Jak często?</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {(['none', 'daily', 'weekly', 'monthly'] as RecurrenceType[]).map(type => (
                            <button
                                type="button"
                                key={type}
                                onClick={() => setRecurrence(type)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: 'var(--radius-full)',
                                    border: 'none',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    backgroundColor: recurrence === type ? 'var(--color-primary)' : 'var(--color-background)',
                                    color: recurrence === type ? 'white' : 'var(--color-text-main)'
                                }}
                            >
                                {type === 'none' && 'Raz'}
                                {type === 'daily' && 'Codziennie'}
                                {type === 'weekly' && 'Co tydzień'}
                                {type === 'monthly' && 'Co miesiąc'}
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Sekcja Checklisty */}
                <Card style={{ padding: '1.5rem' }}>
                    <h3 className="font-bold mb-3">Kroki (Checklista)</h3>
                    <p className="text-sm text-color-text-muted mb-4">Podziel zadanie na mniejsze części.</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                        <AnimatePresence>
                            {checklist.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--color-background)', padding: '0.5rem 1rem', borderRadius: '8px' }}
                                >
                                    <span>{item.text}</span>
                                    <button type="button" onClick={(e) => handleRemoveChecklist(item.id, e)} style={{ border: 'none', background: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}>✕</button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Input
                            placeholder="Dodaj punkt..."
                            value={checklistItemText}
                            onChange={(e) => setChecklistItemText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddChecklist(e)}
                            style={{ flex: 1 }}
                        />
                        <Button type="button" variant="secondary" onClick={handleAddChecklist}>Dodaj</Button>
                    </div>
                </Card>

                <Button type="submit" fullWidth style={{ padding: '1rem', fontSize: '1.2rem', marginTop: '1rem' }}>
                    Zapisz Obowiązek
                </Button>
            </form>
        </div>
    );
};
