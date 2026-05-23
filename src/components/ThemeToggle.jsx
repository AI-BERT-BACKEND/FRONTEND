import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { createStyles } from '../theme/createStyles';

export const ThemeToggle = ({ isDark, onToggle, variant = 'fixed' }) => {
  const t = createStyles(isDark);
  
  if (variant === 'inline') {
    const inlineStyles = {
      btn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '4px 6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        transition: t.appleTransition,
      },
    };

    return (
      <button style={inlineStyles.btn} onClick={onToggle} aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}>
        {isDark ? <Sun size={20} color={isDark ? '#FF5B2E' : '#FF8430'} strokeWidth={2} /> : <Moon size={20} color={isDark ? '#FF5B2E' : '#FF8430'} strokeWidth={2} />}
      </button>
    );
  }

  const styles = {
    btn: {
      zIndex: 100,
      background: isDark ? '#171717' : '#FEFAF9',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(220,193,181,0.30)'}`,
      padding: '7px 14px',
      borderRadius: 50,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
      fontFamily: "'Poppins', sans-serif",
      backdropFilter: 'blur(8px)',
      transition: t.appleTransition,
      boxShadow: isDark 
        ? '0 4px 12px rgba(0,0,0,0.3)' 
        : '0 4px 12px rgba(220,193,181,0.2)',
      position: 'fixed',
      top: 20,
      right: 24,
    },
    iconWrap: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: isDark ? '#FF5B2E' : '#F7306D',
    },
    text: {
      fontSize: 12,
      fontWeight: 600,
    },
  };

  return (
    <button style={styles.btn} onClick={onToggle}>
      <div style={styles.iconWrap}>
        {isDark ? <Sun size={15} strokeWidth={2.5} /> : <Moon size={15} strokeWidth={2.5} />}
      </div>
      <span style={styles.text}>{isDark ? 'Modo claro' : 'Modo oscuro'}</span>
    </button>
  );
};

export default ThemeToggle;
