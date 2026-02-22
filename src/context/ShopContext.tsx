import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { collection, doc, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore';

export interface Reward {
    id: string;
    title: string;
    cost: number;
    icon: string;
    category: string;
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
    { id: '1', title: '1 godzina grania', cost: 50, icon: '🎮', category: 'Rozrywka' },
    { id: '2', title: 'Wyjście na lody', cost: 100, icon: '🍦', category: 'Jedzenie' },
    { id: '3', title: 'Zwolnienie z obowiązku', cost: 150, icon: '🎫', category: 'Przywileje' },
];

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
    const [initialized, setInitialized] = useState(false);
    const { currentUser, addPoints } = useAuth();

    useEffect(() => {
        const unsubscribeRewards = onSnapshot(collection(db, 'rewards'), (snapshot) => {
            const loaded: Reward[] = [];
            let isInitialSetup = false;

            if (snapshot.empty && !initialized) {
                isInitialSetup = true;
                INITIAL_REWARDS.forEach(async (r) => {
                    await setDoc(doc(db, 'rewards', r.id), r);
                });
            } else {
                snapshot.forEach(doc => {
                    const data = doc.data() as Reward;
                    loaded.push({ ...data, category: data.category || 'Inne' });
                });
                setRewards(loaded);
            }
            if (!isInitialSetup) setInitialized(true);
        });

        const unsubscribePurchases = onSnapshot(collection(db, 'purchases'), (snapshot) => {
            const loaded: PurchaseRecord[] = [];
            snapshot.forEach(doc => loaded.push(doc.data() as PurchaseRecord));
            loaded.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setPurchases(loaded);
        });

        return () => {
            unsubscribeRewards();
            unsubscribePurchases();
        };
    }, []);

    const addReward = async (rewardData: Omit<Reward, 'id'>) => {
        const id = crypto.randomUUID();
        try {
            await setDoc(doc(db, 'rewards', id), { ...rewardData, id });
        } catch (e) { console.error(e); }
    };

    const deleteReward = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'rewards', id));
        } catch (e) { console.error(e); }
    };

    const purchaseReward = (id: string) => {
        // Zwraca sync true/false by zamknąć UI od razu,
        // a zapis do bazy leci w tle.
        if (!currentUser) return false;

        const reward = rewards.find(r => r.id === id);
        if (!reward) return false;

        if (currentUser.points >= reward.cost) {
            addPoints(-reward.cost);

            const purchaseId = crypto.randomUUID();
            const newPurchase: PurchaseRecord = {
                id: purchaseId,
                rewardTitle: reward.title,
                purchasedBy: currentUser.id,
                date: new Date().toISOString(),
                cost: reward.cost
            };

            setDoc(doc(db, 'purchases', purchaseId), newPurchase).catch(console.error);
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
