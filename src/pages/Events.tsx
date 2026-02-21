import React, { useState } from 'react';
import { useEvents } from '../context/EventsContext';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { MapPin, Clock, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Events: React.FC = () => {
    const { events, addEvent, deleteEvent } = useEvents();
    const { currentUser } = useAuth();
    const [showAddForm, setShowAddForm] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr + 'T12:00:00');
        return new Intl.DateTimeFormat('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' }).format(date);
    };

    const isToday = (dateStr: string) => {
        return new Date().toISOString().split('T')[0] === dateStr;
    };

    const isPast = (dateStr: string) => {
        return dateStr < new Date().toISOString().split('T')[0];
    };

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

        // Reset form
        setTitle('');
        setDate('');
        setTime('');
        setLocation('');
        setShowAddForm(false);
    };

    // Sort: upcoming first, then past
    const sortedEvents = [...events].sort((a, b) => a.date.localeCompare(b.date));
    const upcomingEvents = sortedEvents.filter(e => !isPast(e.date));
    const pastEvents = sortedEvents.filter(e => isPast(e.date));

    return (
        <div className="page-container animate-slide-up" style={{ paddingBottom: '6rem' }}>
            <header className="mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <div>
                    <h1 className="text-3xl font-black" style={{ letterSpacing: '-0.5px' }}>Wydarzenia</h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>Co nas czeka w najbliższym czasie?</p>
                </div>

                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowAddForm(!showAddForm)}
                    style={{
                        width: '44px', height: '44px', padding: 0, borderRadius: '50%',
                        fontSize: '1.5rem', lineHeight: 1,
                        backgroundColor: showAddForm ? 'var(--color-danger)' : 'var(--color-primary)',
                        color: 'white', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: 'var(--shadow-md)'
                    }}
                >
                    {showAddForm ? <X size={20} /> : <Plus size={20} />}
                </motion.button>
            </header>

            {/* Add Event Form */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.section
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ marginBottom: '2rem', overflow: 'hidden' }}
                    >
                        <Card style={{ padding: '1.5rem', borderTop: '4px solid var(--color-primary)' }}>
                            <h3 style={{ fontWeight: 800, marginBottom: '1rem', fontSize: '1.1rem' }}>➕ Dodaj nowe wydarzenie</h3>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <Input
                                    label="Tytuł wydarzenia *"
                                    placeholder="np. Wizyta u lekarza, Urodziny..."
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    required
                                    autoFocus
                                />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    <Input
                                        label="Data *"
                                        type="date"
                                        value={date}
                                        onChange={e => setDate(e.target.value)}
                                        required
                                    />
                                    <Input
                                        label="Godzina"
                                        type="time"
                                        value={time}
                                        onChange={e => setTime(e.target.value)}
                                    />
                                </div>
                                <Input
                                    label="Miejsce"
                                    placeholder="np. Centrum Medyczne, Kino..."
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                />
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                    <Button type="submit" fullWidth>Zapisz wydarzenie</Button>
                                    <Button type="button" variant="secondary" onClick={() => setShowAddForm(false)}>Anuluj</Button>
                                </div>
                            </form>
                        </Card>
                    </motion.section>
                )}
            </AnimatePresence>

            {/* Upcoming Events */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {upcomingEvents.length === 0 && !showAddForm ? (
                    <div style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📅</div>
                        <p>Brak nadchodzących wydarzeń.</p>
                        <button
                            onClick={() => setShowAddForm(true)}
                            style={{ marginTop: '1rem', background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer' }}
                        >
                            + Dodaj pierwsze wydarzenie
                        </button>
                    </div>
                ) : (
                    upcomingEvents.map(event => (
                        <motion.div key={event.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <Card style={{
                                padding: '1.25rem',
                                borderLeft: isToday(event.date) ? '4px solid var(--color-primary)' : '4px solid transparent',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <p style={{
                                            fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
                                            color: isToday(event.date) ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                            marginBottom: '0.25rem'
                                        }}>
                                            {isToday(event.date) ? '🔴 Dzisiaj' : formatDate(event.date)}
                                        </p>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                                            {event.title}
                                        </h3>
                                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                            {event.time && (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                                    <Clock size={14} /> {event.time}
                                                </span>
                                            )}
                                            {event.location && (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                                    <MapPin size={14} /> {event.location}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteEvent(event.id)}
                                        style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', opacity: 0.5, cursor: 'pointer', padding: '4px' }}
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </Card>
                        </motion.div>
                    ))
                )}
            </section>

            {/* Past Events (collapsed) */}
            {pastEvents.length > 0 && (
                <section style={{ marginTop: '2rem', opacity: 0.5 }}>
                    <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                        Minione
                    </h3>
                    {pastEvents.slice(0, 3).map(event => (
                        <div key={event.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid var(--color-border)' }}>
                            <div>
                                <p style={{ fontWeight: 600, textDecoration: 'line-through' }}>{event.title}</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{formatDate(event.date)}</p>
                            </div>
                            <button onClick={() => deleteEvent(event.id)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </section>
            )}
        </div>
    );
};
