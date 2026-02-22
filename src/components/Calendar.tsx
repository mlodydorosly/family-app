import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CalendarProps {
    chores: any[];
    events: any[];
}

export const Calendar: React.FC<CalendarProps> = ({ chores, events }) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    
    // Generate 14 days for a better horizontal scroll experience
    const days = Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return {
            full: d.toISOString().split('T')[0],
            dayNum: d.getDate(),
            dayName: d.toLocaleDateString('pl-PL', { weekday: 'short' }),
            monthName: d.toLocaleDateString('pl-PL', { month: 'short' })
        };
    });

    const getItemsForDate = (dateStr: string) => {
        const dayEvents = events.filter(e => e.date === dateStr);
        // Simple mock for reminders/tasks on calendar for visual demo
        const hasTasks = chores.length > 0; 
        return { dayEvents, hasTasks };
    };

    const selectedData = getItemsForDate(selectedDate);

    return (
        <div style={{ marginBottom: '2.5rem' }}>
            {/* Horizontal Scroll Calendar */}
            <div style={{ 
                display: 'flex', 
                overflowX: 'auto', 
                gap: '1rem', 
                padding: '0.5rem 0 1.5rem', 
                margin: '0 -1.5rem', 
                paddingLeft: '1.5rem',
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch'
            }}>
                {days.map((day) => {
                    const isSelected = selectedDate === day.full;
                    const { dayEvents, hasTasks } = getItemsForDate(day.full);

                    return (
                        <motion.button
                            key={day.full}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedDate(day.full)}
                            style={{
                                minWidth: '70px',
                                height: '100px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '24px',
                                border: 'none',
                                backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--color-surface)',
                                color: isSelected ? 'white' : 'var(--color-text-main)',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                flexShrink: 0,
                                boxShadow: isSelected ? '0 10px 15px -3px rgba(125, 211, 252, 0.4)' : 'var(--shadow-sm)',
                                position: 'relative'
                            }}
                        >
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', opacity: isSelected ? 0.9 : 0.5, marginBottom: '4px' }}>{day.dayName}</span>
                            <span style={{ fontSize: '1.5rem', fontWeight: 900 }}>{day.dayNum}</span>
                            
                            {/* Status Dots */}
                            <div style={{ display: 'flex', gap: '4px', marginTop: '6px', position: 'absolute', bottom: '12px' }}>
                                {dayEvents.length > 0 && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isSelected ? 'white' : '#60a5fa' }} title="Wydarzenie" />}
                                {hasTasks && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isSelected ? 'white' : '#34d399' }} title="Zadanie" />}
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            {/* Selected Date Details Card */}
            <div className="card-modern" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900 }}>
                        {selectedDate === new Date().toISOString().split('T')[0] ? 'Plan na dziś ✨' : `Plan na ${selectedDate}`}
                    </h3>
                    <button style={{ 
                        background: 'var(--pastel-blue)', 
                        border: 'none', 
                        padding: '0.5rem 1rem', 
                        borderRadius: '12px', 
                        color: 'var(--color-primary-hover)', 
                        fontWeight: 800, 
                        fontSize: '0.8rem' 
                    }}>+ Dodaj</button>
                </div>
                
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedDate}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                    >
                        {selectedData.dayEvents.length === 0 ? (
                            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                                Brak zaplanowanych wydarzeń.
                            </div>
                        ) : (
                            selectedData.dayEvents.map(event => (
                                <div key={event.id} style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '1rem', 
                                    padding: '1rem', 
                                    background: 'var(--color-background)', 
                                    borderRadius: '16px',
                                    borderLeft: '4px solid #60a5fa'
                                }}>
                                    <div style={{ fontSize: '1.5rem' }}>📅</div>
                                    <div>
                                        <p style={{ fontWeight: 800, fontSize: '1rem', margin: 0 }}>{event.title}</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>{event.time} {event.location ? `• ${event.location}` : ''}</p>
                                    </div>
                                </div>
                            ))
                        )}

                        {/* Visual Chore Indicator for Calendar View */}
                        <div style={{ 
                            padding: '1rem', 
                            background: 'var(--pastel-mint)', 
                            borderRadius: '16px', 
                            borderLeft: '4px solid #34d399',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                        }}>
                            <div style={{ fontSize: '1.5rem' }}>✅</div>
                            <div>
                                <p style={{ fontWeight: 800, fontSize: '1rem', margin: 0 }}>Zadania domowe</p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>Sprawdź listę w zakładce Zadania</p>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
