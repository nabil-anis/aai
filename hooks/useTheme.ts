import React, { useEffect } from 'react';

export const useTheme = () => {
    useEffect(() => {
        const applyTheme = (theme: string) => {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('asap-ai-theme', theme);
        };

        const savedTheme = localStorage.getItem('asap-ai-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme) {
            applyTheme(savedTheme);
        } else {
            applyTheme(prefersDark ? 'dark' : 'light');
        }
    }, []);
};

export const toggleTheme = (event: React.MouseEvent) => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';

    // @ts-ignore
    if (!document.startViewTransition) {
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('asap-ai-theme', newTheme);
        return;
    }

    const x = event.clientX;
    const y = event.clientY;

    document.documentElement.style.setProperty('--x', `${x}px`);
    document.documentElement.style.setProperty('--y', `${y}px`);

    // @ts-ignore
    document.startViewTransition(() => {
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('asap-ai-theme', newTheme);
    });
};