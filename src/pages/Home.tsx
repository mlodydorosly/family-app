import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChores } from '../context/ChoresContext';
import { Card } from '../components/Card';
import { motion, AnimatePresence } from 'framer-motion';

export const Home: React.FC = () => {
    const { currentUser, profiles } = useAuth();
    const { chores, completeChore, toggleChecklistItem, isChoreDoneToday } = useChores();
    const [animatingId, setAnimatingId] = useState<string | null>(null);

    const pendingChores = chores.filter(c => !isChoreDoneToday(c.id));
    const completedChores = chores.filter(c => isChoreDoneToday(c.id));

    const handleComplete = (id: string) => {
        if (!currentUser) return;
        setAnimatingId(id);
        setTimeout(() => {
            completeChore(id, currentUser.id);
            setAnimatingId(null);
        }, 600);
    };

    const getChecklistProgress = (checklist: any[]) => {
        if (!checklist || checklist.length === 0) return null;
        const done = checklist.filter(c => c.isDone).length;
        return `${done}/${checklist.length}`;
    };

    return (
        <div className="page-container animate-slide-up">
            <header className="mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <div>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Przegląd dnia
                    </p>
                    <h1 className="text-3xl font-black" style={{ letterSpacing: '-0.5px' }}>
                        Hej, {currentUser?.name}! 👋
                    </h1>
                </div>
                <div style={{
                    width: '50px', height: '50px',
                    borderRadius: '50%',
                    backgroundColor: `${currentUser?.themeColor}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    {currentUser?.avatarUrl}
                </div>
            </header>

            {/* Quick Stats Banner */}
            <section style={{ marginBottom: '2rem' }}>
                <Card style={{
                    background: `linear-gradient(135deg, ${currentUser?.themeColor} 0%, var(--color-primary-hover) 100%)`,
                    color: 'white',
                    border: 'none',
                    boxShadow: 'var(--shadow-md)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ fontSize: '0.875rem', opacity: 0.9, fontWeight: 500 }}>Twoje Monety</p>
                            <motion.p
                                key={currentUser?.points}
                                initial={{ scale: 1.2, color: '#fef08a' }}
                                animate={{ scale: 1, color: '#ffffff' }}
                                style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1, marginTop: '0.25rem' }}
                            >
                                {currentUser?.points}
                            </motion.p>
                        </div>
                        <div style={{ fontSize: '3rem', opacity: 0.9 }}>
                            🪙
                        </div>
                    </div>
                </Card>
            </section>

            {/* Chores Section */}
            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
                    <h2 className="text-xl font-bold">Do zrobienia dzisiaj</h2>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>
                        {completedChores.length} / {chores.length}
                    </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <AnimatePresence>
                        {pendingChores.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                style={{ padding: '2rem', textAlign: 'center', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '2px dashed var(--color-border)' }}
                            >
                                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✨</div>
                                <h3 style={{ fontWeight: 700 }}>Wszystko zrobione!</h3>
                                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Świetna robota! Odpocznij sobie.</p>
                            </motion.div>
                        ) : (
                            pendingChores.map(chore => {
                                const checklistProgress = getChecklistProgress(chore.checklist);
                                const isAllChecked = chore.checklist && chore.checklist.length > 0 && chore.checklist.every(c => c.isDone);

                                return (
                                    <motion.div
                                        key={chore.id}
                                        layout
                                        initial={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
                                        style={{
                                            backgroundColor: 'var(--color-surface)',
                                            borderRadius: '16px',
                                            padding: '1rem',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.75rem',
                                            boxShadow: 'var(--shadow-sm)'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <button
                                                    onClick={() => handleComplete(chore.id)}
                                                    disabled={animatingId === chore.id || (chore.checklist && chore.checklist.length > 0 && !isAllChecked)}
                                                    style={{
                                                        width: '28px', height: '28px',
                                                        borderRadius: '50%',
                                                        border: '2px solid var(--color-border)',
                                                        backgroundColor: animatingId === chore.id ? 'var(--color-success)' : 'transparent',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        color: 'white',
                                                        cursor: (chore.checklist && chore.checklist.length > 0 && !isAllChecked) ? 'not-allowed' : 'pointer',
                                                        opacity: (chore.checklist && chore.checklist.length > 0 && !isAllChecked) ? 0.3 : 1,
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    {animatingId === chore.id && '✓'}
                                                </button>
                                                <div>
                                                    <h4 style={{ fontWeight: 600, fontSize: '1.05rem' }}>
                                                        {chore.title}
                                                        {chore.description && <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>{chore.description}</span>}
                                                    </h4>
                                                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '2px', flexWrap: 'wrap' }}>
                                                        <span>{chore.recurrence === 'daily' ? 'Codziennie' : chore.recurrence === 'weekly' ? 'Co tydzień' : chore.recurrence === 'monthly' ? 'Co miesiąc' : 'Jednorazowe'}</span>
                                                        {checklistProgress && <span style={{ backgroundColor: 'var(--color-background)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>{checklistProgress} kroków</span>}
                                                        {chore.assignedTo ? (
                                                            <span style={{ backgroundColor: 'var(--color-background)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>
                                                                {profiles.find(p => p.id === chore.assignedTo)?.avatarUrl} {profiles.find(p => p.id === chore.assignedTo)?.name}
                                                            </span>
                                                        ) : (
                                                            <span style={{ backgroundColor: 'var(--color-background)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>🏠 Wspólne</span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div style={{
                                                backgroundColor: 'var(--color-primary-light)',
                                                color: 'var(--color-primary)',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '8px',
                                                fontWeight: 700,
                                                fontSize: '0.85rem'
                                            }}>
                                                +{chore.points} 🪙
                                            </div>
                                        </div>

                                        {/* Checklist renderer */}
                                        {chore.checklist && chore.checklist.length > 0 && (
                                            <div style={{ marginLeft: '45px', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                                                {chore.checklist.map(item => (
                                                    <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: item.isDone ? 'var(--color-text-muted)' : 'var(--color-text-main)', cursor: 'pointer', textDecoration: item.isDone ? 'line-through' : 'none' }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={item.isDone}
                                                            onChange={() => toggleChecklistItem(chore.id, item.id)}
                                                            style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                                                        />
                                                        {item.text}
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )
                            })
                        )}
                    </AnimatePresence>
                </div>

                {/* Ukończone dzisiaj */}
                {completedChores.length > 0 && (
                    <div style={{ marginTop: '2rem' }}>
                        <h3 className="text-sm font-bold text-color-text-muted mb-3" style={{ textTransform: 'uppercase' }}>Wykonane dzisiaj</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {completedChores.map(chore => {
                                return (
                                    <div key={chore.id} style={{
                                        display: 'flex', alignItems: 'center', gap: '1rem',
                                        opacity: 0.6,
                                        padding: '0.75rem 1rem',
                                        backgroundColor: 'var(--color-surface)',
                                        borderRadius: '12px',
                                        justifyContent: 'space-between'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--color-success)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>✓</div>
                                            <span style={{ textDecoration: 'line-through' }}>{chore.title}</span>
                                        </div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                                            Zaliczone przez Ciebie
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};
