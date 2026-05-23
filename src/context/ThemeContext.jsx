import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { flushSync } from 'react-dom';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme') || 'light';
    if (saved === 'dark') document.documentElement.classList.add('dark');
    return saved;
  });

  const toggleTheme = useCallback((event) => {
    // Check if browser supports View Transition API
    const isAppearanceTransition =
      document.startViewTransition &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Helper to update theme state and class
    const updateThemeState = () => {
      setTheme((prev) => {
        const next = prev === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', next);
        if (next === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        return next;
      });
    };

    if (!isAppearanceTransition) {
      updateThemeState();
      return;
    }

    // Get click position or use center of screen
    const x = event?.clientX ?? window.innerWidth / 2;
    const y = event?.clientY ?? window.innerHeight / 2;
    
    // Calculate distance to furthest corner
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      // Use flushSync to ensure DOM updates immediately for the transition snapshot
      flushSync(() => {
        updateThemeState();
      });
    });

    transition.ready.then(() => {
      // Circular reveal animation on the target theme
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 450,
          easing: 'ease-out',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  }, []);

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
      toggleTheme,
    }),
    [theme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
