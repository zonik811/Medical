import { create } from 'zustand';
import { ThemeSettings, DEFAULT_THEME } from '@/types';

interface ThemeState {
    theme: ThemeSettings;
    setTheme: (settings: Partial<ThemeSettings>) => void;
    resetTheme: () => void;
    loadTheme: (theme: ThemeSettings) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
    theme: DEFAULT_THEME,
    setTheme: (settings) => set((state) => ({
        theme: { ...state.theme, ...settings }
    })),
    resetTheme: () => set({ theme: DEFAULT_THEME }),
    loadTheme: (theme) => set({ theme: { ...DEFAULT_THEME, ...theme } }),
}));
