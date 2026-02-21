import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, Gift, User, Layers } from 'lucide-react';
import './BottomNav.css';

export const BottomNav: React.FC = () => {
    return (
        <nav className="bottom-nav">
            <div className="bottom-nav-container">
                <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
                    <Home className="nav-icon" />
                    <span className="nav-label">Główna</span>
                </NavLink>

                <NavLink to="/events" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Calendar className="nav-icon" />
                    <span className="nav-label">Wydarzenia</span>
                </NavLink>

                <NavLink
                    to="/shop"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <Gift size={24} />
                    <span>Sklep</span>
                </NavLink>

                <NavLink
                    to="/hub"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <Layers size={24} />
                    <span>Hub</span>
                </NavLink>

                <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <User className="nav-icon" />
                    <span className="nav-label">Profil</span>
                </NavLink>
            </div>
        </nav>
    );
};
