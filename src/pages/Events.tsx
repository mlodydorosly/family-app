import React, { useState } from 'react';
import { useEvents } from '../context/EventsContext';
import { useAuth } from '../context/AuthContext';
import { useNotify } from '../context/NotificationContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';

export const Events: React.FC = () => {
    const { events, addEvent, deleteEvent } = useEvents();
    const { currentUser, profiles } = useAuth();
    const { notify } = useNotify();
    const [showAddForm, setShowAddForm] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !date) return;

        addEvent({
            title: title.trim(),
            date,
            time: time || undefined,
            location: location.trim() || undefined,
            createdBy: currentUser?.id || '',
        });

        notify(`Wydarzenie "${title}" dodane! 📅`, 'success');
        
        // Reset form
        setTitle('');
        setDate('');
        setTime('');
        setLocation('');
        setShowAddForm(false);
    };

    const upcomingEvents = events.filter(e => e.date >= new Date().toISOString().split('T')[0]);
    const pastEvents = events.filter(e => e.date < new Date().toISOString().split('T')[0]);

    return (
        <div className="page-container animate-slide-up">
            <header className="mb-8" style={{ marginTop: '1rem' }}>
                <h1 className="text-3xl font-black" style={{ letterSpacing: '-1.5px' }}>Wydarzenia</h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', fontWeight: 500 }}>Wspólne plany rodzinne</p>
            </header>

            {/* Add Event Form Modal-like Overlay */}
            <AnimatePresence>
                {showAddForm && (
                    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'flex-end' }}>
                        <motion.div 
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            style={{ 
                                width: '100%', 
                                backgroundColor: 'var(--color-surface)', 
                                padding: '2rem', 
                                borderTopLeftRadius: '32px', 
                                borderTopRightRadius: '32px',
                                boxShadow: '0 -10px 25px rgba(0,0,0,0.1)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>Nowe wydarzenie</h3>
                                <button onClick={() => setShowAddForm(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <Input
                                    label="Co planujemy? *"
                                    placeholder="np. Wizyta u dentysty, Kino..."
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    required
                                    autoFocus
                                />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <Input
                                        label="Kiedy? *"
                                        type="date"
                                        value={date}
                                        onChange={e => setDate(e.target.value)}
                                        required
                                    />
                                    <Input
                                        label="O której?"
                                        type="time"
                                        value={time}
                                        onChange={e => setTime(e.target.value)}
                                    />
                                </div>
                                <Input
                                    label="Gdzie?"
                                    placeholder="np. Galeria, Dom, Park..."
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                />
                                <Button type="submit" fullWidth style={{ padding: '1.2rem', marginTop: '1rem', fontSize: '1.1rem' }}>
                                    Zapisz wydarzenie
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {upcomingEvents.length === 0 ? (
                    <div style={{ padding: '4rem 2rem', textAlign: 'center', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '2px dashed var(--color-border)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🗓️</div>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', fontWeight: 500 }}>Brak nadchodzących planów.</p>
                    </div>
                ) : (
                    upcomingEvents.map((event) => {
                        const creator = profiles.find(p => p.id === event.createdBy);
                        const dateObj = new Date(event.date);
                        
                        return (
                            <motion.div
                                key={event.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="card-modern"
                                style={{ padding: '1.5rem', borderLeft: `6px solid ${creator?.themeColor || 'var(--color-primary)'}` }}
                            >
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                    <div style={{
                                        minWidth: '65px',
                                        height: '75px',
                                        background: 'var(--color-background)',
                                        borderRadius: '20px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                                    }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '2px' }}>
                                            {dateObj.toLocaleDateString('pl-PL', { month: 'short' })}
                                        </span>
                                        <span style={{ fontSize: '1.5rem', fontWeight: 900 }}>{dateObj.getDate()}</span>
                                    </div>
                                    
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.5px' }}>{event.title}</h4>
                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>⏰ {event.time || 'Cały dzień'}</span>
                                            {event.location && <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>📍 {event.location}</span>}
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => { if(window.confirm('Usunąć to wydarzenie?')) deleteEvent(event.id); }}
                                        style={{ border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer', opacity: 0.3 }}
                                    >🗑️</button>
                                </div>
                            </motion.div>
                        );
                    })
                )}

                {/* Past Section Divider */}
                {pastEvents.length > 0 && (
                    <div style={{ marginTop: '2rem' }}>
                        <h3 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '1px' }}>Zakończone</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', opacity: 0.5 }}>
                            {pastEvents.slice(0, 3).map(event => (
                                <div key={event.id} className="card-modern" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 600, textDecoration: 'line-through' }}>{event.title}</span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{event.date}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* FAB */}
            <button className="fab" onClick={() => setShowAddForm(true)} style={{ zIndex: 100 }}>+</button>
        </div>
    );
};
