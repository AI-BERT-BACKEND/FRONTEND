import React from 'react';

/* ── Icons ── */
const BellIcon = ({ isDark }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <linearGradient id="bellGradHeader" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={isDark ? '#FF5B2E' : '#FF8430'} />
        <stop offset="100%" stopColor={isDark ? '#C4107A' : '#F7306D'} />
      </linearGradient>
    </defs>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="url(#bellGradHeader)" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="url(#bellGradHeader)" />
  </svg>
);

const SocialIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const Header = ({ theme, onToggleTheme }) => {
  const isDark = theme === 'dark';

  return (
    <div style={getStyles(isDark).topbar}>
      <div />
      <div style={getStyles(isDark).topbarRight}>
        {/* THEME TOGGLE */}
        <button style={getStyles(isDark).themeBtn} onClick={onToggleTheme}>
          <span style={{ fontSize: 15 }}>{isDark ? '☀️' : '🌙'}</span>
          <span style={{ fontSize: 12 }}>{isDark ? 'Modo claro' : 'Modo oscuro'}</span>
        </button>

        {/* BELL */}
        <button style={getStyles(isDark).iconBtn}>
          <BellIcon isDark={isDark} />
        </button>

        {/* SOCIAL */}
        <button style={getStyles(isDark).socialBtn}>
          <SocialIcon />
          Social
        </button>
      </div>
    </div>
  );
};

const getStyles = (isDark) => ({
  topbar: {
    height: 56,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 28px',
    borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
    backgroundColor: isDark ? '#0F0E0F' : '#FEFBF9',
    position: 'sticky',
    top: 0,
    zIndex: 5,
  },
  topbarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  themeBtn: {
    background: isDark ? '#171717' : '#FEFAF9',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(220,193,181,0.30)'}`,
    borderRadius: 50,
    padding: '5px 14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontFamily: "'Poppins', sans-serif",
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
    fontSize: 12,
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px 6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialBtn: {
    background: isDark
      ? 'linear-gradient(90deg, #C4107A, #FF5B2E)'
      : 'linear-gradient(90deg, #FF8430, #F7306D)',
    border: 'none',
    borderRadius: 20,
    padding: '7px 16px',
    color: '#fff',
    fontFamily: "'Poppins', sans-serif",
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
});

export default Header;