import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export const Login: React.FC = () => {
    const { profiles, signInAs } = useAuth();

    return (
        <div className="page-container" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            paddingBottom: '2rem',
            backgroundColor: 'var(--color-background)'
        }}>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', marginBottom: '3rem' }}
            >
                <div style={{
                    fontSize: '3rem',
                    marginBottom: '1rem',
                    display: 'inline-block',
                    padding: '1rem',
                    backgroundColor: 'var(--color-surface)',
                    borderRadius: '24px',
                    boxShadow: 'var(--shadow-md)'
                }}>
                    🏡
                </div>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Witaj w domu!</h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                    Kto dzisiaj sprząta?
                </p>
            </motion.div>

            <div style={{
                display: 'flex',
                gap: '2rem',
                width: '100%',
                maxWidth: '400px',
                justifyContent: 'center'
            }}>
                {profiles.map((profile, i) => (
                    <motion.button
                        key={profile.id}
                        onClick={() => signInAs(profile.id)}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            background: 'var(--color-surface)',
                            border: 'none',
                            borderRadius: '24px',
                            padding: '2rem 1rem',
                            width: '140px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '1rem',
                            cursor: 'pointer',
                            boxShadow: 'var(--shadow-sm)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Top color bar */}
                        <div style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0,
                            height: '6px',
                            backgroundColor: profile.themeColor
                        }} />

                        <div style={{
                            fontSize: '3.5rem',
                            lineHeight: 1,
                            backgroundColor: `${profile.themeColor}15`,
                            width: '80px', height: '80px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderRadius: '50%'
                        }}>
                            {profile.avatarUrl}
                        </div>

                        <div style={{
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            color: 'var(--color-text-main)'
                        }}>
                            {profile.name}
                        </div>
                    </motion.button>
                ))}
            </div>

        </div>
    );
};
