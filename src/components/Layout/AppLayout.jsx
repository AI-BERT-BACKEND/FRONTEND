import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import Header from '../Header';
import GridBackground from '../GridBackground';
import { useTheme } from '../../context/ThemeContext';
import { tokens } from '../../theme/tokens';

export const AppLayout = ({ children }) => {
  const { isDark } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    backdrop: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.55)',
      backdropFilter: 'blur(2px)',
      zIndex: 15,
    },
    main: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      zIndex: 1,
      minWidth: 0,
      overflow: 'hidden',
    },
    scrollArea: {
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
    },
    content: {
      padding: isMobile
        ? '16px 16px 32px'
        : 'clamp(20px, 3vw, 40px) clamp(20px, 4vw, 60px)',
      width: '100%',
      maxWidth: 1600,
      boxSizing: 'border-box',
      margin: '0 auto',
    },
  };

  return (
    <div style={styles.root}>
      <GridBackground isDark={isDark} />
      <Sidebar
        collapsed={isMobile ? false : sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((p) => !p)}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      {isMobile && mobileOpen && (
        <div style={styles.backdrop} onClick={() => setMobileOpen(false)} />
      )}
      <div style={styles.main}>
        <Header
          isMobile={isMobile}
          onMenuClick={() => setMobileOpen((p) => !p)}
        />
        <div style={styles.scrollArea}>
          <div style={styles.content} className="page-transition">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;