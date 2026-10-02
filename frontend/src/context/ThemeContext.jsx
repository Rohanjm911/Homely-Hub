import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // 'auto' (system sync) | 'light' | 'dark'
  const [themePreference, setThemePreference] = useState(() => {
    return localStorage.getItem('homelyhub_theme') || 'auto';
  });

  const [activeTheme, setActiveTheme] = useState('light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const resolveTheme = () => {
      if (themePreference === 'dark') return 'dark';
      if (themePreference === 'light') return 'light';
      return mediaQuery.matches ? 'dark' : 'light';
    };

    const current = resolveTheme();
    setActiveTheme(current);
    document.documentElement.setAttribute('data-theme', current);

    const listener = (e) => {
      if (themePreference === 'auto') {
        const next = e.matches ? 'dark' : 'light';
        setActiveTheme(next);
        document.documentElement.setAttribute('data-theme', next);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener);
    } else {
      mediaQuery.addListener(listener);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', listener);
      } else {
        mediaQuery.removeListener(listener);
      }
    };
  }, [themePreference]);

  const setTheme = (mode) => {
    setThemePreference(mode);
    localStorage.setItem('homelyhub_theme', mode);
  };

  const toggleTheme = (event) => {
    const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';

    // If browser supports View Transitions API, animate buttery smooth circular ripple from button
    if (document.startViewTransition) {
      // Find button coordinates or fallback to center
      let x = window.innerWidth - 60;
      let y = 30;

      if (event?.clientX !== undefined && event?.clientY !== undefined) {
        x = event.clientX;
        y = event.clientY;
      } else if (event?.currentTarget) {
        const rect = event.currentTarget.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      }

      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = document.startViewTransition(() => {
        setTheme(nextTheme);
      });

      transition.ready.then(() => {
        const isGoingToDark = nextTheme === 'dark';
        
        // Fluid ripple animation with apple-style natural spring physics
        if (isGoingToDark) {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`
              ],
            },
            {
              duration: 520,
              easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
              pseudoElement: '::view-transition-new(root)',
            }
          );
        } else {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(${endRadius}px at ${x}px ${y}px)`,
                `circle(0px at ${x}px ${y}px)`
              ],
            },
            {
              duration: 520,
              easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
              pseudoElement: '::view-transition-old(root)',
            }
          );
        }
      });
    } else {
      setTheme(nextTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ activeTheme, themePreference, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
