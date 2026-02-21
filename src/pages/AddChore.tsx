import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChores, type RecurrenceType, type ChecklistItem } from '../context/ChoresContext';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { motion, AnimatePresence } from 'framer-motion';

export const AddChore: React.FC = () => {
    const navigate = useNavigate();
    const { addChore } = useChores();
    const { profiles } = useAuth();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [points, setPoints] = useState(10);
    const [recurrence, setRecurrence] = useState<RecurrenceType>('daily');
    const [assignedTo, setAssignedTo] = useState<string>(''); // '' = everyone

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
            assignedTo: assignedTo || undefined,
            checklist,
        });

        navigate('/');
    };

    return (
        <div className="page-container animate-slide-up" style={{ paddingBottom: '6rem' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', marginBottom: '1.5rem' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-primary)' }}
                >
                    ←
                </button>
                <h1 className="text-2xl font-black" style={{ letterSpacing: '-0.5px' }}>Nowy obowiązek</h1>
            </header>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Podstawowe info */}
                <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Input
                        label="Co jest do zrobienia? *"
                        placeholder="Nakarmić psa, odkurzyć..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        autoFocus
                    />
                    <Input
                        label="Opis (opcjonalnie)"
                        placeholder="Dodatkowe szczegóły..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Nagroda w monetach</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <input
                                type="range"
                                min="5" max="100" step="5"
                                value={points}
                                onChange={(e) => setPoints(Number(e.target.value))}
                                style={{ flex: 1, accentColor: 'var(--color-primary)' }}
                            />
                            <span style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '1.25rem', minWidth: '60px' }}>{points} 🪙</span>
                        </div>
                    </div>
                </Card>

                {/* Przypisz osobę */}
                <Card style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>👤 Dla kogo?</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                        {/* Opcja dla wszystkich */}
                        <button
                            type="button"
                            onClick={() => setAssignedTo('')}
                            style={{
                                padding: '0.6rem 1.2rem',
                                borderRadius: 'var(--radius-full)',
                                border: 'none',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                backgroundColor: assignedTo === '' ? 'var(--color-primary)' : 'var(--color-background)',
                                color: assignedTo === '' ? 'white' : 'var(--color-text-main)'
                            }}
                        >
                            🏠 Wspólne
                        </button>
                        {profiles.map(profile => (
                            <button
                                type="button"
                                key={profile.id}
                                onClick={() => setAssignedTo(profile.id)}
                                style={{
                                    padding: '0.6rem 1.2rem',
                                    borderRadius: 'var(--radius-full)',
                                    border: 'none',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    backgroundColor: assignedTo === profile.id ? profile.themeColor : 'var(--color-background)',
                                    color: assignedTo === profile.id ? 'white' : 'var(--color-text-main)'
                                }}
                            >
                                {profile.avatarUrl} {profile.name}
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Częstotliwość */}
                <Card style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>🔁 Jak często?</h3>
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
                                {type === 'none' && 'Jednorazowo'}
                                {type === 'daily' && 'Codziennie'}
                                {type === 'weekly' && 'Co tydzień'}
                                {type === 'monthly' && 'Co miesiąc'}
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Checklista */}
                <Card style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>✅ Kroki (opcjonalnie)</h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>Podziel zadanie na mniejsze kroki.</p>

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
                                    <span>• {item.text}</span>
                                    <button type="button" onClick={(e) => handleRemoveChecklist(item.id, e)} style={{ border: 'none', background: 'none', color: 'var(--color-danger)', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Input
                            placeholder="Dodaj krok..."
                            value={checklistItemText}
                            onChange={(e) => setChecklistItemText(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddChecklist(e); } }}
                            style={{ flex: 1 }}
                        />
                        <Button type="button" variant="secondary" onClick={handleAddChecklist}>Dodaj</Button>
                    </div>
                </Card>

                <Button type="submit" fullWidth style={{ padding: '1rem', fontSize: '1.1rem' }}>
                    Zapisz obowiązek ✓
                </Button>
            </form>
        </div>
    );
};
