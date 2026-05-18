import React from 'react';
import { getBaseStyles } from '../styles/theme';

const ThemeToggle = ({ theme, onToggleTheme }) => {
  const isDark = theme === 'dark';
  const s = getBaseStyles(isDark);

  return (
    <button style={s.themeBtn} onClick={onToggleTheme}>
      <span style={{ fontSize: 16 }}>{isDark ? '☀️' : '🌙'}</span>
      <span style={{ fontSize: 13 }}>{isDark ? 'Modo claro' : 'Modo oscuro'}</span>
    </button>
  );
};

export default ThemeToggle;