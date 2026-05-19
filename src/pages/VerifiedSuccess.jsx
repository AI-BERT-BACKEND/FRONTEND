import React from 'react';
import { useNavigate } from 'react-router-dom';
import GridBackground from '../components/GridBackground';

const VerifiedSuccess = ({ theme = 'light', onToggleTheme }) => {
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const s = getStyles(isDark);

  return (
    <div style={s.root}>
      {/* ── Componente reutilizable de fondo ── */}
      <GridBackground isDark={isDark} />

      <button style={s.themeBtn} onClick={onToggleTheme}>
        <span style={{ fontSize: 16 }}>{isDark ? '☀️' : '🌙'}</span>
        <span style={{ fontSize: 13 }}>{isDark ? 'Modo claro' : 'Modo oscuro'}</span>
      </button>

      <div style={s.card}>
        <div style={s.iconCircle}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path d="M8 18l7 7 13-13" stroke="url(#checkGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="checkGrad" x1="8" y1="11" x2="28" y2="25" gradientUnits="userSpaceOnUse">
                <stop stopColor={isDark ? '#FF5B2E' : '#FF8430'} />
                <stop offset="1" stopColor={isDark ? '#C4107A' : '#F7306D'} />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <h1 style={s.title}>{isDark ? '¡Codigo verificado!' : '¡CODIGO VERIFICADO!'}</h1>
        <p style={s.description}>Tu correo ha sido verificado correctamente.<br />Ahora puedes continuar.</p>

        <div style={s.infoBox}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
            <rect x="1" y="3" width="14" height="10" rx="2" stroke={isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.35)'} strokeWidth="1.2" fill="none" />
            <path d="M1 6h14" stroke={isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.35)'} strokeWidth="1.2" />
            <circle cx="5" cy="9.5" r="1" fill={isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.35)'} />
          </svg>
          <span style={s.infoText}>Te recomendamos, por seguridad cambia tu contraseña después de iniciar sesión.</span>
        </div>

        <button style={s.btn} onClick={() => navigate('/login')}>Continuar</button>
      </div>
    </div>
  );
};

const getStyles = (isDark) => ({
  root: {
    position: 'relative', minHeight: '100vh',
    backgroundColor: isDark ? '#050208' : '#FDF2EB',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', fontFamily: "'Poppins', sans-serif",
  },
  themeBtn: {
    position: 'fixed', top: 20, right: 24, zIndex: 100,
    background: isDark ? '#171717' : '#FEFAF9',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(220,193,181,0.30)'}`,
    borderRadius: 50, padding: '6px 14px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 8,
    fontFamily: "'Poppins', sans-serif", color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
  },
  card: {
    position: 'relative', zIndex: 1,
    background: isDark ? '#171717' : '#FEFAF9',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(220,193,181,0.30)'}`,
    borderRadius: 20, padding: '40px 40px 36px', width: '100%', maxWidth: 400,
    boxShadow: isDark
      ? '0 0 0 1px rgba(196,16,122,0.35), 0 8px 48px rgba(196,16,122,0.22), 0 2px 16px rgba(0,0,0,0.60)'
      : '0 8px 40px rgba(253,214,189,0.60), 0 2px 12px rgba(196,16,122,0.08)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', margin: '0 24px',
  },
  iconCircle: {
    width: 72, height: 72, borderRadius: '50%',
    border: `2px solid ${isDark ? 'rgba(196,16,122,0.50)' : 'rgba(247,48,109,0.35)'}`,
    background: isDark ? 'rgba(196,16,122,0.08)' : 'rgba(255,132,48,0.06)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22,
  },
  title: {
    fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 800,
    background: isDark ? 'linear-gradient(90deg, #FF5B2E, #C4107A)' : 'linear-gradient(90deg, #FF8430, #F7306D)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
    marginBottom: 10, letterSpacing: isDark ? 0 : '0.03em',
  },
  description: { fontSize: 13, color: isDark ? 'rgba(255,255,255,0.60)' : 'rgba(0,0,0,0.55)', lineHeight: 1.65, marginBottom: 22 },
  infoBox: {
    width: '100%', background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
    borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, textAlign: 'left',
  },
  infoText: { fontSize: 11.5, color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)', lineHeight: 1.55 },
  btn: {
    width: '100%', padding: 13, border: 'none', borderRadius: 10,
    background: isDark ? 'linear-gradient(90deg, #C4107A, #FF5B2E)' : 'linear-gradient(90deg, #FF8430, #F7306D)',
    color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14,
    fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer',
  },
});

export default VerifiedSuccess;