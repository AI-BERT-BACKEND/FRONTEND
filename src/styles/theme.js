export const getBaseStyles = (isDark) => ({
  root: {
    position: 'relative',
    minHeight: '100vh',
    backgroundColor: isDark ? '#050208' : '#FDF2EB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    fontFamily: "'Poppins', sans-serif",
    transition: 'background-color 0.35s',
  },
  grid: {
    position: 'fixed',
    inset: 0,
    backgroundImage: `
      linear-gradient(${isDark ? '#041B36' : '#FDEEE6'} 1px, transparent 1px),
      linear-gradient(90deg, ${isDark ? '#041B36' : '#FDEEE6'} 1px, transparent 1px)
    `,
    backgroundSize: '36px 36px',
    opacity: 0.55,
    pointerEvents: 'none',
    zIndex: 0,
  },
  themeBtn: {
    position: 'fixed',
    top: 20,
    right: 24,
    zIndex: 100,
    background: isDark ? '#171717' : '#FEFAF9',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(220,193,181,0.30)'}`,
    borderRadius: 50,
    padding: '6px 14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontFamily: "'Poppins', sans-serif",
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
  },
  card: {
    position: 'relative',
    zIndex: 1,
    background: isDark ? '#171717' : '#FEFAF9',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(220,193,181,0.30)'}`,
    borderRadius: 20,
    boxShadow: isDark
      ? '0 0 0 1px rgba(196,16,122,0.35), 0 8px 48px rgba(196,16,122,0.22), 0 2px 16px rgba(0,0,0,0.60)'
      : '0 8px 40px rgba(253,214,189,0.60), 0 2px 12px rgba(196,16,122,0.08)',
  },
  label: {
    display: 'block',
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: isDark ? 'rgba(255,255,255,0.60)' : 'rgba(0,0,0,0.55)',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    background: isDark ? 'rgba(255,255,255,0.06)' : '#F5F5F8',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#E0E0E8'}`,
    borderRadius: 10,
    padding: '11px 14px',
    fontFamily: "'Poppins', sans-serif",
    fontSize: 13,
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  },
  inputError: {
    borderColor: '#F00707',
    boxShadow: '0 0 0 3px rgba(240,7,7,0.12)',
  },
  errorRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    fontSize: 11.5,
    color: '#F00707',
    marginTop: 5,
    fontWeight: 500,
  },
  btn: {
    width: '100%',
    padding: 13,
    border: 'none',
    borderRadius: 10,
    background: isDark
      ? 'linear-gradient(90deg, #C4107A, #FF5B2E)'
      : 'linear-gradient(90deg, #FF8430, #F7306D)',
    color: '#fff',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    cursor: 'pointer',
  },
  link: {
    fontSize: 12,
    color: isDark ? '#FF5B2E' : '#F7306D',
    textDecoration: 'none',
    fontWeight: 600,
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0,
    fontFamily: "'Poppins', sans-serif",
  },
  title: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: 800,
    background: isDark
      ? 'linear-gradient(90deg, #FF5B2E, #C4107A)'
      : 'linear-gradient(90deg, #FF8430, #F7306D)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
});

export const ErrorIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="6.5" cy="6.5" r="6" stroke="#F00707" strokeWidth="1.2" />
    <path d="M6.5 3.5v3.2" stroke="#F00707" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="6.5" cy="9.2" r="0.7" fill="#F00707" />
  </svg>
);