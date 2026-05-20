import React from 'react';

export const ThemeToggle = ({ isDark, onToggle, variant = 'fixed' }) => {
  const styles = {
    btn: {
      zIndex: 100,
      background: isDark ? '#171717' : '#FEFAF9',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(220,193,181,0.30)'}`,
      padding: '6px 14px',
      borderRadius: 50,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
      fontFamily: "'Poppins', sans-serif",
      backdropFilter: 'blur(8px)',
      transition: 'all 0.2s ease',
      ...(variant === 'fixed'
        ? {
            position: 'fixed',
            top: 20,
            right: 24,
          }
        : {
            position: 'relative',
          }),
    },
    emoji: {
      fontSize: 16,
    },
    text: {
      fontSize: 13,
    },
  };

  return (
    <button style={styles.btn} onClick={onToggle}>
      <span style={styles.emoji}>{isDark ? '☀️' : '🌙'}</span>
      <span style={styles.text}>{isDark ? 'Modo claro' : 'Modo oscuro'}</span>
    </button>
  );
};

export default ThemeToggle;
