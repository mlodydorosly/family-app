import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export const Login: React.FC = () => {
    const { profiles, signInAs } = useAuth();

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, var(--pastel-blue) 0%, var(--pastel-purple) 40%, var(--color-background) 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '4rem 2rem'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', marginBottom: '4rem' }}
            >
                <div style={{
                    fontSize: '3rem',
                    marginBottom: '1.5rem',
                    width: '80px', height: '80px',
                    backgroundColor: 'var(--color-surface)',
                    borderRadius: '24px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto',
                    boxShadow: 'var(--shadow-md)'
                }}>
                    🏠
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: '0.5rem' }}>Witaj w domu!</h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', fontWeight: 500 }}>Wybierz swój profil, aby wejść</p>
            </motion.div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.5rem',
                width: '100%',
                maxWidth: '400px'
            }}>
                {profiles.map((profile, i) => (
                    <motion.button
                        key={profile.id}
                        onClick={() => signInAs(profile.id)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -5, boxShadow: 'var(--shadow-float)' }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            background: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '2.5rem 1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '1rem',
                            cursor: 'pointer',
                            boxShadow: 'var(--shadow-md)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, height: '6px',
                            backgroundColor: profile.themeColor
                        }} />

                        <div style={{
                            fontSize: '3rem',
                            width: '70px', height: '70px',
                            backgroundColor: `${profile.themeColor}10`,
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {profile.avatarUrl}
                        </div>
                        <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{profile.name}</span>
                    </motion.button>
                ))}
            </div>

            <div style={{ marginTop: 'auto', textAlign: 'center', width: '100%', maxWidth: '400px' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>Lub zaloguj się przez</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button style={{ width: '56px', height: '56px', borderRadius: '16px', border: '1px solid var(--color-border)', background: 'white', fontSize: '1.2rem', cursor: 'pointer' }}>G</button>
                    <button style={{ width: '56px', height: '56px', borderRadius: '16px', border: '1px solid var(--color-border)', background: 'white', fontSize: '1.2rem', cursor: 'pointer' }}>f</button>
                    <button style={{ width: '56px', height: '56px', borderRadius: '16px', border: '1px solid var(--color-border)', background: 'white', fontSize: '1.2rem', cursor: 'pointer' }}>🍎</button>
                </div>
            </div>
        </div>
    );
};
