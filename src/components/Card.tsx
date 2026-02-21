import React from 'react';
import { motion } from 'framer-motion';
import './Card.css';

interface CardProps extends React.ComponentProps<typeof motion.div> {
    children: React.ReactNode;
    noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    noPadding = false,
    className = '',
    ...props
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`app-card ${noPadding ? 'no-padding' : ''} ${className}`}
            {...props}
        >
            {children}
        </motion.div>
    );
};
