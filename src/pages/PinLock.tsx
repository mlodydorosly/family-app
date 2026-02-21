import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// To zmień na swój PIN (musi być 4-cyfrowy string)
const APP_PIN = '1234';
const STORAGE_KEY = 'family_app_pin_unlocked';

interface PinLockProps {
    children: React.ReactNode;
}

export const PinLock: React.FC<PinLockProps> = ({ children }) => {
    const [unlocked, setUnlocked] = useState(false);
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Sprawdź czy już odblokowane w tej sesji
        const sessionUnlocked = sessionStorage.getItem(STORAGE_KEY);
        if (sessionUnlocked === 'true') {
            setUnlocked(true);
        }
        setLoading(false);
    }, []);

    const handleDigit = (digit: string) => {
        if (pin.length >= 4) return;
        const newPin = pin + digit;
        setPin(newPin);
        setError(false);

        if (newPin.length === 4) {
            setTimeout(() => {
                if (newPin === APP_PIN) {
                    sessionStorage.setItem(STORAGE_KEY, 'true');
                    setUnlocked(true);
                } else {
                    setError(true);
                    setPin('');
                }
            }, 200);
        }
    };

    const handleDelete = () => {
        setPin(prev => prev.slice(0, -1));
        setError(false);
    };

    if (loading) return null;
    if (unlocked) return <>{children}</>;

    const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--color-background)',
            padding: '2rem',
            gap: '2rem'
        }}>
            {/* Ikona i tytuł */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center' }}
            >
                <div style={{
                    fontSize: '3.5rem',
                    width: '90px', height: '90px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: 'var(--color-surface)',
                    borderRadius: '24px',
                    boxShadow: 'var(--shadow-md)',
                    margin: '0 auto 1rem'
                }}>
                    🏡
                </div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.5px' }}>HomeSync</h1>
                <p style={{ color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>Wpisz PIN, aby wejść</p>
            </motion.div>

            {/* Wskaźniki PIN */}
            <motion.div
                style={{ display: 'flex', gap: '1rem' }}
                animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
            >
                {[0, 1, 2, 3].map(i => (
                    <div
                        key={i}
                        style={{
                            width: '18px', height: '18px',
                            borderRadius: '50%',
                            backgroundColor: pin.length > i
                                ? (error ? 'var(--color-danger)' : 'var(--color-primary)')
                                : 'var(--color-border)',
                            transition: 'all 0.15s ease',
                            transform: pin.length > i ? 'scale(1.2)' : 'scale(1)'
                        }}
                    />
                ))}
            </motion.div>

            <AnimatePresence>
                {error && (
                    <motion.p
                        key="err"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ color: 'var(--color-danger)', fontWeight: 600, fontSize: '0.9rem' }}
                    >
                        Nieprawidłowy PIN. Spróbuj ponownie.
                    </motion.p>
                )}
            </AnimatePresence>

            {/* Klawiatura numeryczna */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                width: '100%',
                maxWidth: '300px'
            }}>
                {digits.map((d, i) => (
                    <motion.button
                        key={i}
                        whileTap={{ scale: d ? 0.9 : 1 }}
                        onClick={() => {
                            if (d === '⌫') handleDelete();
                            else if (d) handleDigit(d);
                        }}
                        style={{
                            height: '70px',
                            borderRadius: '16px',
                            border: 'none',
                            fontSize: d === '⌫' ? '1.5rem' : '1.75rem',
                            fontWeight: 700,
                            cursor: d ? 'pointer' : 'default',
                            backgroundColor: d ? 'var(--color-surface)' : 'transparent',
                            color: 'var(--color-text-main)',
                            boxShadow: d ? 'var(--shadow-sm)' : 'none',
                            transition: 'all 0.1s ease'
                        }}
                    >
                        {d}
                    </motion.button>
                ))}
            </div>

            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginTop: '1rem' }}>
                Domyślny PIN: <strong>1234</strong> — zmień go w pliku PinLock.tsx
            </p>
        </div>
    );
};
