import React from 'react';
import GridBackground from '../GridBackground';
import ThemeToggle from '../ThemeToggle';
import { useTheme } from '../../context/ThemeContext';
import { tokens } from '../../theme/tokens';

export const AuthLayout = ({ children }) => {
  const { isDark, toggleTheme } = useTheme();

  const styles = {
    root: {
      position: 'relative',
      minHeight: '100vh',
      backgroundColor: isDark ? tokens.colors.bg.dark : tokens.colors.bg.light,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      fontFamily: tokens.fonts.secondary,
    },
    content: {
      position: 'relative',
      zIndex: 1,
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  };

  return (
    <div style={styles.root}>
      <GridBackground isDark={isDark} />
      <ThemeToggle isDark={isDark} onToggle={toggleTheme} variant="fixed" />
      <div style={styles.content}>{children}</div>
    </div>
  );
};


export default AuthLayout;
