'use client';

import {createContext, ReactNode, useContext, useEffect, useMemo, useState} from 'react';

type Theme = 'light' | 'dark';

interface DarkModeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    isDark: boolean;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export function DarkModeProvider({children}: { readonly children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof globalThis.window === 'undefined') {
            return 'light';
        }

        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'light';
    });
    const isDark = theme === 'dark';

    useEffect(() => {
        // HTMLタグにdarkクラスを追加/削除
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    const handleSetTheme = (newTheme: Theme) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const value = useMemo(() => ({theme, setTheme: handleSetTheme, isDark}), [theme, isDark]);

    return (
        <DarkModeContext.Provider value={value}>
            {children}
        </DarkModeContext.Provider>
    );
}

export function useDarkMode() {
    const context = useContext(DarkModeContext);
    if (context === undefined) {
        throw new Error('useDarkMode must be used within a DarkModeProvider');
    }
    return context;
}
