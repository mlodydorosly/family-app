import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

export interface Reward {
    id: string;
    title: string;
    cost: number;
    icon: string;
}

interface ShopContextType {
    rewards: Reward[];
    addReward: (reward: Omit<Reward, 'id'>) => void;
    deleteReward: (id: string) => void;
    purchaseReward: (id: string) => boolean; // Returns true if success (enough points)
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const INITIAL_REWARDS: Reward[] = [
    { id: '1', title: '1 godzina grania', cost: 50, icon: '🎮' },
    { id: '2', title: 'Wyjście na lody', cost: 100, icon: '🍦' },
    { id: '3', title: 'Zwolnienie z jednego obowiązku', cost: 150, icon: '🎫' },
];

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [initialized, setInitialized] = useState(false);
    const { currentUser, addPoints } = useAuth();

    useEffect(() => {
        const stored = localStorage.getItem('family_app_rewards');
        if (stored) {
            setRewards(JSON.parse(stored));
        } else {
            setRewards(INITIAL_REWARDS);
        }
        setInitialized(true);
    }, []);

    useEffect(() => {
        if (initialized) {
            localStorage.setItem('family_app_rewards', JSON.stringify(rewards));
        }
    }, [rewards, initialized]);

    const addReward = (rewardData: Omit<Reward, 'id'>) => {
        setRewards(prev => [...prev, { ...rewardData, id: crypto.randomUUID() }]);
    };

    const deleteReward = (id: string) => {
        setRewards(prev => prev.filter(r => r.id !== id));
    };

    const purchaseReward = (id: string) => {
        if (!currentUser) return false;

        const reward = rewards.find(r => r.id === id);
        if (!reward) return false;

        if (currentUser.points >= reward.cost) {
            // Deduct points
            addPoints(-reward.cost);
            return true;
        }

        return false; // Not enough points
    };

    return (
        <ShopContext.Provider value={{ rewards, addReward, deleteReward, purchaseReward }}>
            {children}
        </ShopContext.Provider>
    );
};

export const useShop = () => {
    const context = useContext(ShopContext);
    if (context === undefined) {
        throw new Error('useShop must be used within a ShopProvider');
    }
    return context;
};
