import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
    id: string;
    message: string;
    type: 'success' | 'info' | 'warning';
}

interface NotificationContextType {
    notify: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const notify = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
        const id = crypto.randomUUID();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
    };

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}
            <div style={{
                position: 'fixed',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                width: '90%',
                maxWidth: '400px',
                pointerEvents: 'none'
            }}>
                <AnimatePresence>
                    {notifications.map(n => (
                        <motion.div
                            key={n.id}
                            initial={{ opacity: 0, y: -20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            style={{
                                padding: '12px 20px',
                                borderRadius: '12px',
                                backgroundColor: n.type === 'success' ? 'var(--color-success)' : n.type === 'warning' ? 'var(--color-warning)' : 'var(--color-primary)',
                                color: 'white',
                                boxShadow: 'var(--shadow-md)',
                                fontWeight: 600,
                                textAlign: 'center',
                                pointerEvents: 'auto'
                            }}
                        >
                            {n.message}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotify = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotify must be used within a NotificationProvider');
    }
    return context;
};
