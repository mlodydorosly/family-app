import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChores } from '../context/ChoresContext';
import { useNotify } from '../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';

export const Home: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser, profiles } = useAuth();
    const { notify } = useNotify();
    const { chores, completeChore, deleteChore, isChoreDoneToday } = useChores();
    const [animatingId, setAnimatingId] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'date' | 'points'>('date');

    const sortedChores = [...chores].sort((a, b) => {
        if (sortBy === 'points') return b.points - a.points;
        return a.title.localeCompare(b.title);
    });

    const pendingChores = sortedChores.filter(c => !isChoreDoneToday(c.id));
    const completedChores = sortedChores.filter(c => isChoreDoneToday(c.id));

    const handleComplete = (id: string) => {
        if (!currentUser) return;
        setAnimatingId(id);
        const chore = chores.find(c => c.id === id);
        setTimeout(() => {
            completeChore(id, currentUser.id);
            setAnimatingId(null);
            notify(`Zadanie "${chore?.title}" ukończone! +${chore?.points} 🪙`, 'success');
        }, 600);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Czy na pewno chcesz usunąć to zadanie?')) {
            deleteChore(id);
        }
    };

    return (
        <div className="page-container animate-slide-up">
            <header className="mb-8" style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="text-3xl font-black" style={{ letterSpacing: '-1.5px' }}>Zadania</h1>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', fontWeight: 500 }}>Dzisiaj masz {pendingChores.length} do zrobienia</p>
                    </div>
                    <div 
                        onClick={() => navigate('/profile')}
                        style={{
                            width: '56px', height: '56px',
                            borderRadius: '20px',
                            backgroundColor: `${currentUser?.themeColor}20`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.8rem',
                            cursor: 'pointer',
                            boxShadow: 'var(--shadow-sm)',
                            border: `2px solid ${currentUser?.themeColor}30`
                        }}
                    >
                        {currentUser?.avatarUrl}
                    </div>
                </div>
            </header>

            {/* Sorting */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
                <button 
                    onClick={() => setSortBy('date')}
                    style={{
                        padding: '0.6rem 1.2rem',
                        borderRadius: '16px',
                        border: 'none',
                        background: sortBy === 'date' ? 'var(--color-primary)' : 'var(--color-surface)',
                        color: sortBy === 'date' ? 'white' : 'var(--color-text-muted)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        whiteSpace: 'nowrap',
                        boxShadow: 'var(--shadow-sm)',
                        cursor: 'pointer'
                    }}
                >
                    📅 Wszystkie
                </button>
                <button 
                    onClick={() => setSortBy('points')}
                    style={{
                        padding: '0.6rem 1.2rem',
                        borderRadius: '16px',
                        border: 'none',
                        background: sortBy === 'points' ? 'var(--color-primary)' : 'var(--color-surface)',
                        color: sortBy === 'points' ? 'white' : 'var(--color-text-muted)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        whiteSpace: 'nowrap',
                        boxShadow: 'var(--shadow-sm)',
                        cursor: 'pointer'
                    }}
                >
                    🪙 Najwyżej punktowane
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <AnimatePresence>
                    {pendingChores.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            style={{ padding: '3rem 2rem', textAlign: 'center', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '2px dashed var(--color-border)' }}
                        >
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
                            <h3 style={{ fontWeight: 800, fontSize: '1.25rem' }}>Wszystko zrobione!</h3>
                        </motion.div>
                    ) : (
                        pendingChores.map(chore => (
                            <motion.div
                                key={chore.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="card-modern"
                                style={{ padding: '1.25rem' }}
                            >
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <button
                                        onClick={() => handleComplete(chore.id)}
                                        disabled={animatingId === chore.id}
                                        style={{
                                            width: '32px', height: '32px',
                                            borderRadius: '12px',
                                            border: '2px solid var(--color-border)',
                                            backgroundColor: animatingId === chore.id ? 'var(--color-success)' : 'transparent',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: 'white',
                                            cursor: 'pointer',
                                            marginTop: '4px'
                                        }}
                                    >
                                        {animatingId === chore.id && '✓'}
                                    </button>
                                    
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>{chore.title}</h4>
                                            <div style={{ background: 'var(--pastel-blue)', color: 'var(--color-primary-hover)', padding: '0.25rem 0.6rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 900 }}>
                                                +{chore.points} 🪙
                                            </div>
                                        </div>
                                        <p style={{ margin: '0.25rem 0 0.75rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                                            {chore.description || 'Brak opisu'}
                                        </p>
                                        
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', background: 'var(--color-background)', padding: '4px 8px', borderRadius: '8px' }}>
                                                🔁 {chore.recurrence === 'daily' ? 'Codziennie' : chore.recurrence === 'weekly' ? 'Co tydzień' : 'Raz'}
                                            </span>
                                            {chore.assignedTo && (
                                                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-text-muted)', background: 'var(--color-background)', padding: '4px 8px', borderRadius: '8px' }}>
                                                    👤 {profiles.find(p => p.id === chore.assignedTo)?.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <button onClick={() => navigate(`/edit/${chore.id}`)} style={{ border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer', opacity: 0.5 }}>✏️</button>
                                        <button onClick={() => handleDelete(chore.id)} style={{ border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer', opacity: 0.5 }}>🗑️</button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Completed */}
            {completedChores.length > 0 && (
                <div style={{ marginTop: '3rem' }}>
                    <h3 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '1px' }}>Wykonane dziś</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', opacity: 0.6 }}>
                        {completedChores.map(chore => (
                            <div key={chore.id} className="card-modern" style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ textDecoration: 'line-through', fontWeight: 600 }}>{chore.title}</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>+{chore.points} 🪙</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <button className="fab" onClick={() => navigate('/add')}>+</button>
        </div>
    );
};
