import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { useNotify } from '../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';

export const Shop: React.FC = () => {
    const { rewards, purchaseReward } = useShop();
    const { currentUser } = useAuth();
    const { notify } = useNotify();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('Wszystkie');

    const categories = ['Wszystkie', 'Przywileje', 'Jedzenie', 'Rozrywka', 'Inne'];

    const filteredRewards = rewards.filter(reward => {
        const matchesSearch = reward.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'Wszystkie' || reward.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const handlePurchase = (id: string, title: string, cost: number) => {
        if (!currentUser) return;

        if (currentUser.points >= cost) {
            const success = purchaseReward(id);
            if (success) {
                notify(`Kupiono: ${title}! 🎉`, 'success');
            }
        } else {
            notify('Za mało monet! 🪙', 'warning');
        }
    };

    return (
        <div className="page-container animate-slide-up">
            <header className="mb-6" style={{ marginTop: '1rem' }}>
                <h1 className="text-3xl font-black" style={{ letterSpacing: '-1.5px' }}>Sklep Nagród</h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', fontWeight: 500 }}>Wymień monety na przyjemności</p>

                <div style={{
                    marginTop: '1.5rem',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--pastel-yellow)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>🪙</span>
                        <span style={{ fontWeight: 800, color: '#92400e' }}>Twoje saldo</span>
                    </div>
                    <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#92400e' }}>{currentUser?.points}</span>
                </div>
            </header>

            {/* Search Bar */}
            <div style={{ position: 'relative', marginBottom: '1.5rem', marginTop: '1.5rem' }}>
                <input
                    type="text"
                    placeholder="Szukaj nagrody..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '1.1rem 1.1rem 1.1rem 3.5rem',
                        borderRadius: '20px',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-surface)',
                        fontSize: '1rem',
                        outline: 'none',
                        boxShadow: 'var(--shadow-sm)',
                        fontWeight: 500
                    }}
                />
                <span style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.4rem' }}>🔍</span>
            </div>

            {/* Categories */}
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '1.5rem', scrollbarWidth: 'none', margin: '0 -1.5rem', paddingLeft: '1.5rem' }}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        style={{
                            padding: '0.6rem 1.25rem',
                            borderRadius: '14px',
                            border: 'none',
                            background: activeCategory === cat ? 'var(--color-primary)' : 'var(--color-surface)',
                            color: activeCategory === cat ? 'white' : 'var(--color-text-muted)',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            whiteSpace: 'nowrap',
                            cursor: 'pointer',
                            boxShadow: 'var(--shadow-sm)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Rewards Grid */}
            <section style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '1.25rem'
            }}>
                <AnimatePresence>
                    {filteredRewards.length === 0 ? (
                        <div style={{ gridColumn: '1 / -1', padding: '4rem 2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🎁</div>
                            Brak nagród w tej kategorii.
                        </div>
                    ) : (
                        filteredRewards.map((reward) => {
                            const canAfford = (currentUser?.points || 0) >= reward.cost;
                            return (
                                <motion.div
                                    key={reward.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="card-modern"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        padding: '1.5rem',
                                        position: 'relative'
                                    }}
                                >
                                    <div style={{
                                        fontSize: '3.5rem',
                                        marginBottom: '1rem',
                                        width: '85px', height: '85px',
                                        backgroundColor: 'var(--color-background)',
                                        borderRadius: '24px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        {reward.icon}
                                    </div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem', minHeight: '2.8rem', display: 'flex', alignItems: 'center' }}>
                                        {reward.title}
                                    </h3>

                                    <button
                                        onClick={() => handlePurchase(reward.id, reward.title, reward.cost)}
                                        style={{
                                            width: '100%',
                                            marginTop: '1rem',
                                            padding: '0.8rem',
                                            borderRadius: '16px',
                                            border: 'none',
                                            background: canAfford ? 'var(--color-primary)' : 'var(--color-border)',
                                            color: canAfford ? 'white' : 'var(--color-text-muted)',
                                            fontWeight: 900,
                                            fontSize: '1rem',
                                            cursor: canAfford ? 'pointer' : 'not-allowed',
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        {reward.cost} 🪙
                                    </button>
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </section>
        </div>
    );
};
