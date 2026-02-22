import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChores } from '../context/ChoresContext';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';

type HistoryFilter = 'all' | 'chores' | 'purchases';

export const History: React.FC = () => {
    const navigate = useNavigate();
    const { chores } = useChores();
    const { purchases } = useShop();
    const { profiles } = useAuth();
    const [filter, setFilter] = useState<HistoryFilter>('all');

    // Chores activity
    const choreHistory = chores.flatMap(chore => 
        chore.history.map(record => ({
            id: `chore-${chore.id}-${record.date}-${record.completedBy}`,
            title: chore.title,
            points: chore.points,
            date: record.date,
            user: record.completedBy,
            type: 'chore' as const
        }))
    );

    // Purchase activity
    const purchaseHistory = purchases.map(p => ({
        id: `purchase-${p.id}`,
        title: p.rewardTitle,
        points: -p.cost,
        date: p.date,
        user: p.purchasedBy,
        type: 'purchase' as const
    }));

    const allActivity = [...choreHistory, ...purchaseHistory]
        .sort((a, b) => {
            // Very simple date string sorting for this demo
            const dateA = a.date.split('.').reverse().join('-');
            const dateB = b.date.split('.').reverse().join('-');
            return dateB.localeCompare(dateA);
        })
        .filter(item => {
            if (filter === 'chores') return item.type === 'chore';
            if (filter === 'purchases') return item.type === 'purchase';
            return true;
        });

    return (
        <div className="page-container animate-slide-up">
            <header className="mb-8" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-primary)' }}
                >
                    ←
                </button>
                <h1 className="text-3xl font-black" style={{ letterSpacing: '-1.5px' }}>Historia Rodziny</h1>
            </header>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
                {(['all', 'chores', 'purchases'] as HistoryFilter[]).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: '0.6rem 1.25rem',
                            borderRadius: '14px',
                            border: 'none',
                            background: filter === f ? 'var(--color-primary)' : 'var(--color-surface)',
                            color: filter === f ? 'white' : 'var(--color-text-muted)',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            boxShadow: 'var(--shadow-sm)'
                        }}
                    >
                        {f === 'all' && 'Wszystko'}
                        {f === 'chores' && 'Zadania'}
                        {f === 'purchases' && 'Nagrody'}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <AnimatePresence mode="popLayout">
                    {allActivity.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--color-text-muted)' }}
                        >
                            <span style={{ fontSize: '3rem' }}>📜</span>
                            <p>Brak aktywności do wyświetlenia.</p>
                        </motion.div>
                    ) : (
                        allActivity.map((item) => {
                            const profile = profiles.find(p => p.id === item.user);
                            const isChore = item.type === 'chore';
                            
                            return (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="card-modern"
                                    style={{ padding: '1rem 1.25rem' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ 
                                                width: '45px', height: '45px', 
                                                borderRadius: '15px', 
                                                backgroundColor: profile ? `${profile.themeColor}15` : 'var(--color-background)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '1.5rem'
                                            }}>
                                                {profile?.avatarUrl || '👤'}
                                            </div>
                                            <div>
                                                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>{item.title}</h4>
                                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                                                    {item.date} • {profile?.name || 'Ktoś'} • {isChore ? '🎯 Zadanie' : '🎁 Nagroda'}
                                                </p>
                                            </div>
                                        </div>
                                        <div style={{ 
                                            fontWeight: 900, 
                                            fontSize: '1.1rem',
                                            color: isChore ? 'var(--color-success)' : 'var(--color-danger)'
                                        }}>
                                            {isChore ? `+${item.points}` : item.points} 🪙
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
