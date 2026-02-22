import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

export interface Reward {
    id: string;
    title: string;
    cost: number;
    icon: string;
}

export interface PurchaseRecord {
    id: string;
    rewardTitle: string;
    purchasedBy: string; // profile id
    date: string; // ISO
    cost: number;
}

interface ShopContextType {
    rewards: Reward[];
    purchases: PurchaseRecord[];
    addReward: (reward: Omit<Reward, 'id'>) => void;
    deleteReward: (id: string) => void;
    purchaseReward: (id: string) => boolean;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const INITIAL_REWARDS: Reward[] = [
    { id: '1', title: '1 godzina grania', cost: 50, icon: '🎮' },
    { id: '2', title: 'Wyjście na lody', cost: 100, icon: '🍦' },
    { id: '3', title: 'Zwolnienie z jednego obowiązku', cost: 150, icon: '🎫' },
];

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
    const [initialized, setInitialized] = useState(false);
    const { currentUser, addPoints } = useAuth();

    useEffect(() => {
        const storedRewards = localStorage.getItem('family_app_rewards');
        if (storedRewards) setRewards(JSON.parse(storedRewards));
        else setRewards(INITIAL_REWARDS);

        const storedPurchases = localStorage.getItem('family_app_purchases');
        if (storedPurchases) setPurchases(JSON.parse(storedPurchases));

        setInitialized(true);
    }, []);

    useEffect(() => {
        if (initialized) {
            localStorage.setItem('family_app_rewards', JSON.stringify(rewards));
            localStorage.setItem('family_app_purchases', JSON.stringify(purchases));
        }
    }, [rewards, purchases, initialized]);

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
            addPoints(-reward.cost);
            
            const newPurchase: PurchaseRecord = {
                id: crypto.randomUUID(),
                rewardTitle: reward.title,
                purchasedBy: currentUser.id,
                date: new Date().toLocaleDateString('pl-PL'),
                cost: reward.cost
            };
            
            setPurchases(prev => [newPurchase, ...prev]);
            return true;
        }

        return false;
    };

    return (
        <ShopContext.Provider value={{ rewards, purchases, addReward, deleteReward, purchaseReward }}>
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
