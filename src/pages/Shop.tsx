import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';

export const Shop: React.FC = () => {
    const { rewards, purchaseReward } = useShop();
    const { currentUser } = useAuth();
    const [successMsg, setSuccessMsg] = useState('');

    const handlePurchase = (id: string, name: string) => {
        const success = purchaseReward(id);
        if (success) {
            setSuccessMsg(`Kupiono: ${name}! 🎉`);
            setTimeout(() => setSuccessMsg(''), 3000);
        } else {
            setSuccessMsg('Za mało monet! 😢');
            setTimeout(() => setSuccessMsg(''), 2000);
        }
    };

    return (
        <div className="page-container animate-slide-up">
            <header className="mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <div>
                    <h1 className="text-3xl font-black" style={{ letterSpacing: '-0.5px' }}>Sklep</h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>Wymień monety na nagrody</p>
                </div>
                <div style={{
                    backgroundColor: 'var(--color-primary-light)',
                    color: 'var(--color-primary)',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    {currentUser?.points} 🪙
                </div>
            </header>

            <AnimatePresence>
                {successMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        style={{
                            backgroundColor: successMsg.includes('Za mało') ? 'var(--color-danger)' : 'var(--color-success)',
                            color: 'white',
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '1.5rem',
                            textAlign: 'center',
                            fontWeight: 600,
                            boxShadow: 'var(--shadow-md)'
                        }}
                    >
                        {successMsg}
                    </motion.div>
                )}
            </AnimatePresence>

            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
                {rewards.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', padding: '3rem 2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🎁</div>
                        Sklep jest obecnie pusty! Poproś rodzica o dodanie nagród.
                    </div>
                ) : (
                    rewards.map((reward, i) => {
                        const canAfford = (currentUser?.points || 0) >= reward.cost;
                        return (
                            <motion.div
                                key={reward.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Card style={{
                                    padding: '1.25rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    height: '100%',
                                    opacity: canAfford ? 1 : 0.7
                                }}>
                                    <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem', lineHeight: 1 }}>
                                        {reward.icon}
                                    </div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'auto', minHeight: '40px' }}>
                                        {reward.title}
                                    </h3>

                                    <div style={{ width: '100%', marginTop: '1rem' }}>
                                        <Button
                                            fullWidth
                                            variant={canAfford ? 'primary' : 'secondary'}
                                            onClick={() => handlePurchase(reward.id, reward.title)}
                                            style={{
                                                backgroundColor: canAfford ? 'var(--color-primary)' : 'var(--color-surface)',
                                                color: canAfford ? 'white' : 'var(--color-text-muted)',
                                                border: canAfford ? 'none' : '2px solid var(--color-border)',
                                                padding: '0.5rem'
                                            }}
                                        >
                                            {reward.cost} 🪙
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })
                )}
            </section>
        </div>
    );
};
