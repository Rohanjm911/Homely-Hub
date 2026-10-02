import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Laptop } from 'lucide-react';

const ThemeToggle = ({ size = 'md' }) => {
  const { activeTheme, themePreference, setTheme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const isDark = activeTheme === 'dark';

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      {/* Quick Toggle Button with smooth rotation / scale animation */}
      <button
        type="button"
        onClick={(e) => toggleTheme(e)}
        onContextMenu={(e) => {
          e.preventDefault();
          setMenuOpen(!menuOpen);
        }}
        title={`Theme: ${activeTheme} (Preference: ${themePreference}). Right-click for options.`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '36px',
          height: '36px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-color)',
          backgroundColor: 'var(--input-bg)',
          color: isDark ? '#ffd60a' : 'var(--text-main)',
          cursor: 'pointer',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative',
          overflow: 'hidden',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
        aria-label="Toggle dark and light mode"
      >
        <div style={{
          position: 'relative',
          width: '20px',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Moon
            size={17}
            strokeWidth={2.2}
            style={{
              position: 'absolute',
              transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(100deg) scale(0)',
              opacity: isDark ? 1 : 0,
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease',
            }}
          />
          <Sun
            size={18}
            strokeWidth={2.2}
            style={{
              position: 'absolute',
              transform: !isDark ? 'rotate(0deg) scale(1)' : 'rotate(-100deg) scale(0)',
              opacity: !isDark ? 1 : 0,
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease',
            }}
          />
        </div>
      </button>

      {/* Mini Auto/Light/Dark selector badge toggle on hover or right click */}
      {menuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '115%',
            right: 0,
            zIndex: 1200,
            backgroundColor: 'var(--dropdown-bg)',
            border: '1px solid var(--dropdown-border)',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-xl)',
            padding: '0.4rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem',
            minWidth: '130px',
            animation: 'fadeIn 0.2s ease forwards',
          }}
          onMouseLeave={() => setMenuOpen(false)}
        >
          <button
            type="button"
            onClick={() => { setTheme('light'); setMenuOpen(false); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 0.65rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: themePreference === 'light' ? 'rgba(2, 132, 199, 0.15)' : 'transparent',
              color: themePreference === 'light' ? 'var(--primary)' : 'var(--text-main)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
            }}
          >
            <Sun size={14} /> Light
          </button>
          <button
            type="button"
            onClick={() => { setTheme('dark'); setMenuOpen(false); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 0.65rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: themePreference === 'dark' ? 'rgba(2, 132, 199, 0.15)' : 'transparent',
              color: themePreference === 'dark' ? 'var(--primary)' : 'var(--text-main)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
            }}
          >
            <Moon size={14} /> Dark
          </button>
          <button
            type="button"
            onClick={() => { setTheme('auto'); setMenuOpen(false); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 0.65rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: themePreference === 'auto' ? 'rgba(2, 132, 199, 0.15)' : 'transparent',
              color: themePreference === 'auto' ? 'var(--primary)' : 'var(--text-main)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
            }}
          >
            <Laptop size={14} /> Auto (System)
          </button>
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
