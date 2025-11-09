import React, { useState, useEffect } from 'react';
import { toggleTheme } from '../hooks/useTheme';
import { SunIcon, MoonIcon } from './icons';

const ThemeToggle: React.FC = () => {
    // This state is only for rendering the correct icon.
    // The source of truth is the 'data-theme' attribute on the <html> element.
    const [isDark, setIsDark] = useState(() => document.documentElement.getAttribute('data-theme') === 'dark');

    const handleToggle = (event: React.MouseEvent) => {
        // The toggleTheme function handles the logic of switching the theme.
        toggleTheme(event);
        // We manually update the icon state to match.
        setIsDark(prev => !prev);
    }
    
    // This effect synchronizes the component's state with the actual theme
    // if it's changed by other means (e.g., system preference on initial load).
    useEffect(() => {
        const observer = new MutationObserver(() => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            setIsDark(currentTheme === 'dark');
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        return () => observer.disconnect();
    }, []);

    return (
        <button
            onClick={handleToggle}
            className="p-2 rounded-lg text-[--foreground-secondary] hover:bg-[--background-tertiary] transition-colors"
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
            {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
        </button>
    );
};

export default ThemeToggle;