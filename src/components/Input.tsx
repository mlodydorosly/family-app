import React from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, className = '', ...props }, ref) => {
        return (
            <div className={`app-input-container ${className}`}>
                {label && <label className="app-input-label">{label}</label>}
                <div className={`app-input-wrapper ${error ? 'app-input-error' : ''}`}>
                    {icon && <span className="app-input-icon">{icon}</span>}
                    <input
                        ref={ref}
                        className="app-input"
                        {...props}
                    />
                </div>
                {error && <span className="app-input-error-text">{error}</span>}
            </div>
        );
    }
);

Input.displayName = 'Input';
