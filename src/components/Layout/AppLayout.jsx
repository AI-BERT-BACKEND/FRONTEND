import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import Header from '../Header';
import GridBackground from '../GridBackground';
import { useTheme } from '../../context/ThemeContext';
import { tokens } from '../../theme/tokens';

export const AppLayout = ({ children }) => {
  const { isDark } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const styles = {
    root: {
      display: 'flex',
      minHeight: '100vh',
      width: '100%',
      fontFamily: tokens.fonts.secondary,
      position: 'relative',
      boxSizing: 'border-box',
      backgroundColor: isDark ? tokens.colors.bg.dark : tokens.colors.bg.light,
    },
    main: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      zIndex: 1,
      width: '100%',
      minWidth: 0,
    },
    scrollArea: {
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
    },
    content: {
      padding: '28px 32px',
      width: '100%',
      boxSizing: 'border-box',
    },
  };

  return (
    <div style={styles.root}>
      <GridBackground isDark={isDark} />
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((p) => !p)}
      />
      <div style={styles.main}>
        <Header />
        <div style={styles.scrollArea}>
          <div style={styles.content}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
