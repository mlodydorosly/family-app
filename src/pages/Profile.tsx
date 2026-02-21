import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { motion } from 'framer-motion';

export const Profile: React.FC = () => {
    const { currentUser, signOut } = useAuth();

    if (!currentUser) return null;

    const xpInCurrentLevel = currentUser.xp % 100;
    const progressPercent = (xpInCurrentLevel / 100) * 100;

    return (
        <div className="page-container animate-slide-up" style={{ paddingBottom: '6rem' }}>
            <header className="mb-6 flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <div>
                    <h1 className="text-3xl font-black" style={{ letterSpacing: '-0.5px' }}>Profil</h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>Twoje statystyki</p>
                </div>
            </header>

            <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <Card style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>

                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: `linear-gradient(90deg, ${currentUser.themeColor}, var(--color-primary-hover))` }} />

                    <div style={{
                        width: '120px', height: '120px',
                        borderRadius: '50%',
                        backgroundColor: `${currentUser.themeColor}15`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '4rem',
                        boxShadow: 'var(--shadow-md)',
                        marginBottom: '1rem',
                        border: `4px solid ${currentUser.themeColor}30`
                    }}>
                        {currentUser.avatarUrl}
                    </div>

                    <h2 className="text-2xl font-black mb-1">{currentUser.name}</h2>

                    <div style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        backgroundColor: 'var(--color-background)',
                        color: 'var(--color-text-muted)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.8rem', fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        {currentUser.title}
                    </div>

                    <div style={{ width: '100%', marginTop: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                            <span style={{ fontWeight: 800 }}>Poziom {currentUser.level}</span>
                            <span style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>{xpInCurrentLevel} / 100 XP</span>
                        </div>

                        <div style={{ width: '100%', height: '12px', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                style={{
                                    height: '100%',
                                    backgroundColor: 'var(--color-primary)',
                                    borderRadius: 'var(--radius-full)'
                                }}
                            />
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.5rem', textAlign: 'center' }}>
                            Zdobywaj XP wykonując codzienne obowiązki!
                        </p>
                    </div>
                </Card>

                {/* Stats Row */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Card style={{ flex: 1, textAlign: 'center', padding: '1.5rem' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🪙</div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Portfel</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 900 }}>{currentUser.points}</p>
                    </Card>

                    <Card style={{ flex: 1, textAlign: 'center', padding: '1.5rem' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Odznaki</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 900 }}>{currentUser.badges.length}</p>
                    </Card>
                </div>

                {/* Odznaki Section */}
                <Card>
                    <h3 className="font-bold mb-4">Zdobyte odznaki</h3>
                    {currentUser.badges.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-md)' }}>
                            Brak odznak. Rozpocznij sprzątanie, aby je odblokować!
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                            {currentUser.badges.map((badge, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        backgroundColor: 'var(--color-primary-light)',
                                        color: 'var(--color-primary)',
                                        borderRadius: 'var(--radius-full)',
                                        fontWeight: 700,
                                        fontSize: '0.9rem',
                                        display: 'flex', alignItems: 'center', gap: '0.5rem'
                                    }}
                                >
                                    ⭐ {badge}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </Card>

                <Button variant="outline" fullWidth onClick={signOut} style={{ marginTop: '1rem', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}>
                    Wyloguj profil
                </Button>
            </section>
        </div>
    );
};
