import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

interface FavoritesState {
    favorites: Product[];
    addFavorite: (product: Product) => void;
    removeFavorite: (productId: string) => void;
    isFavorite: (productId: string) => boolean;
    toggleFavorite: (product: Product) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
    persist(
        (set, get) => ({
            favorites: [],

            addFavorite: (product) => {
                const { favorites } = get();
                if (!favorites.find(p => p.$id === product.$id)) {
                    set({ favorites: [...favorites, product] });
                }
            },

            removeFavorite: (productId) => {
                set({ favorites: get().favorites.filter(p => p.$id !== productId) });
            },

            isFavorite: (productId) => {
                return get().favorites.some(p => p.$id === productId);
            },

            toggleFavorite: (product) => {
                const { isFavorite, addFavorite, removeFavorite } = get();
                if (isFavorite(product.$id)) {
                    removeFavorite(product.$id);
                } else {
                    addFavorite(product);
                }
            }
        }),
        {
            name: 'favorites-storage',
        }
    )
);
