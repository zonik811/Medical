import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Business } from '@/types';

interface BusinessState {
    business: Business | null;
    setBusiness: (business: Business) => void;
}

export const useBusinessStore = create<BusinessState>()(
    persist(
        (set) => ({
            business: null,
            setBusiness: (business) => set({ business }),
        }),
        {
            name: 'business-storage',
        }
    )
);
