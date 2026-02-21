import React, { useState } from 'react';
import { useEvents } from '../context/EventsContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { MapPin, Clock } from 'lucide-react';

export const Events: React.FC = () => {
    const { events, deleteEvent } = useEvents();
    const [showAddForm, setShowAddForm] = useState(false);

    // Simple formatting helper
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' }).format(date);
    };

    const isToday = (dateStr: string) => {
        return new Date().toISOString().split('T')[0] === dateStr;
    };

    return (
        <div className="page-container animate-slide-up">
            <header className="mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <div>
                    <h1 className="text-3xl font-black" style={{ letterSpacing: '-0.5px' }}>Wydarzenia</h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>Co nas czeka w najbliższym czasie?</p>
                </div>

                <Button
                    style={{ width: '40px', height: '40px', padding: 0, borderRadius: '50%', fontSize: '1.5rem', lineHeight: 1 }}
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    {showAddForm ? '✕' : '+'}
                </Button>
            </header>

            {showAddForm && (
                <section style={{ marginBottom: '2rem' }} className="animate-slide-up">
                    <Card style={{ backgroundColor: 'var(--color-primary-light)' }}>
                        <h3 className="font-bold mb-4">Dodaj nowe wydarzenie (Wkrótce)</h3>
                        <p className="text-sm text-color-text-muted">Formularz dodawania pojawi się tutaj.</p>
                    </Card>
                </section>
            )}

            <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {events.length === 0 ? (
                    <div style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📅</div>
                        Brak nadchodzących wydarzeń.
                    </div>
                ) : (
                    events.map(event => (
                        <Card key={event.id} style={{
                            padding: '1.25rem',
                            borderLeft: isToday(event.date) ? '4px solid var(--color-primary)' : '4px solid transparent',
                            position: 'relative'
                        }}>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <p style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        color: isToday(event.date) ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                        marginBottom: '0.25rem'
                                    }}>
                                        {isToday(event.date) ? 'Dzisiaj' : formatDate(event.date)}
                                    </p>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>
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
                                    style={{
                                        background: 'none', border: 'none',
                                        color: 'var(--color-text-muted)',
                                        opacity: 0.5, cursor: 'pointer',
                                        padding: '8px'
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        </Card>
                    ))
                )}
            </section>
        </div>
    );
};
