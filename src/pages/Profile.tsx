import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Profile: React.FC = () => {
    const { currentUser, signOut } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    if (!currentUser) return null;

    const xpInCurrentLevel = currentUser.xp % 100;
    const progressPercent = (xpInCurrentLevel / 100) * 100;

    return (
        <div className="page-container animate-slide-up" style={{ paddingBottom: '6rem' }}>
            {/* Minimalist Header */}
            <header className="mb-8" style={{ marginTop: '1rem', textAlign: 'center' }}>
                <h1 className="text-3xl font-black" style={{ letterSpacing: '-1.5px' }}>Twój Profil</h1>
            </header>

            <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* Main Profile Info */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        style={{
                            width: '120px', height: '120px',
                            borderRadius: '50%',
                            backgroundColor: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '4.5rem',
                            boxShadow: 'var(--shadow-float)',
                            marginBottom: '1.5rem',
                            border: `4px solid ${currentUser.themeColor}`
                        }}
                    >
                        {currentUser.avatarUrl}
                    </motion.div>
                    
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.25rem', letterSpacing: '-0.5px' }}>{currentUser.name}</h2>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', fontWeight: 500, marginBottom: '1.5rem' }}>{currentUser.title}</p>
                    
                    {/* Progress Bar Container */}
                    <div style={{ width: '100%', maxWidth: '300px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                            <span>Poziom {currentUser.level}</span>
                            <span>{xpInCurrentLevel}/100 XP</span>
                        </div>
                        <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--color-border)', borderRadius: '10px', overflow: 'hidden' }}>
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                style={{ height: '100%', background: 'var(--color-primary)', borderRadius: '10px' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="card-modern" style={{ textAlign: 'center', padding: '1.5rem' }}>
                        <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>🪙</span>
                        <span style={{ fontSize: '1.4rem', fontWeight: 900 }}>{currentUser.points}</span>
                        <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginTop: '0.25rem' }}>Monety</p>
                    </div>
                    <div className="card-modern" style={{ textAlign: 'center', padding: '1.5rem' }}>
                        <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>⭐</span>
                        <span style={{ fontSize: '1.4rem', fontWeight: 900 }}>{currentUser.badges.length}</span>
                        <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginTop: '0.25rem' }}>Odznaki</p>
                    </div>
                </div>

                {/* Options / Settings List */}
                <div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '1px' }}>Ustawienia</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        
                        <div onClick={toggleTheme} className="card-modern" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', cursor: 'pointer' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ fontSize: '1.2rem' }}>{theme === 'light' ? '☀️' : '🌙'}</span>
                                <span style={{ fontWeight: 700 }}>Tryb {theme === 'light' ? 'Jasny' : 'Ciemny'}</span>
                            </div>
                            <div style={{ width: '44px', height: '24px', background: theme === 'light' ? 'var(--color-border)' : 'var(--color-primary)', borderRadius: '20px', position: 'relative' }}>
                                <motion.div animate={{ x: theme === 'light' ? 2 : 22 }} style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px' }} />
                            </div>
                        </div>

                        <div onClick={() => navigate('/history')} className="card-modern" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', cursor: 'pointer' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ fontSize: '1.2rem' }}>📜</span>
                                <span style={{ fontWeight: 700 }}>Historia aktywności</span>
                            </div>
                            <span style={{ opacity: 0.3 }}>→</span>
                        </div>

                        <div onClick={signOut} className="card-modern" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', cursor: 'pointer', border: '1px solid #fee2e2' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ fontSize: '1.2rem' }}>🚪</span>
                                <span style={{ fontWeight: 700, color: '#ef4444' }}>Wyloguj się</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Social Connect Placeholder */}
                <div className="card-modern" style={{ background: 'var(--pastel-blue)', border: 'none', padding: '1.5rem', textAlign: 'center' }}>
                    <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Połącz rodzinę</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-main)', opacity: 0.7, marginBottom: '1rem' }}>Zsynchronizuj obowiązki z innymi urządzeniami.</p>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                        <button style={{ padding: '0.5rem 1rem', borderRadius: '10px', border: 'none', background: 'white', fontWeight: 700, fontSize: '0.8rem' }}>Google</button>
                        <button style={{ padding: '0.5rem 1rem', borderRadius: '10px', border: 'none', background: 'white', fontWeight: 700, fontSize: '0.8rem' }}>Apple</button>
                    </div>
                </div>

            </section>
        </div>
    );
};
