import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getBaseStyles } from '../styles/theme';

const EmailSent = ({ theme = 'light', onToggleTheme }) => {
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'estudiante@mail.escuelang.edu.co';

  const b = getBaseStyles(isDark);

  const s = {
    ...b,
    card: {
      ...b.card,
      padding: '40px 44px 36px',
      width: '100%',
      maxWidth: 420,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      margin: '0 24px',
    },
    title: { ...b.title, fontSize: 24, marginBottom: 18 },
    iconArea: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      marginBottom: 22,
    },
    linesWrap: {
      display: 'flex',
      flexDirection: 'column',
      gap: 5,
      alignItems: 'flex-end',
    },
    line: {
      width: 26,
      height: 2.5,
      borderRadius: 2,
      background: isDark
        ? 'linear-gradient(90deg, #FF5B2E, #C4107A)'
        : 'linear-gradient(90deg, #FF8430, #F7306D)',
    },
    iconCircle: {
      width: 64,
      height: 64,
      borderRadius: '50%',
      border: `2px solid ${isDark ? 'rgba(196,16,122,0.50)' : 'rgba(247,48,109,0.35)'}`,
      background: isDark ? 'rgba(196,16,122,0.08)' : 'rgba(255,132,48,0.06)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    checkBadge: {
      position: 'absolute',
      top: -2,
      right: -2,
      width: 20,
      height: 20,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #FF8430, #F7306D)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: `2px solid ${isDark ? '#171717' : '#FEFAF9'}`,
    },
    infoRow: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 8,
      textAlign: 'left',
      marginBottom: 18,
      maxWidth: 320,
    },
    infoText: {
      fontSize: 13,
      color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.60)',
      lineHeight: 1.65,
      margin: 0,
    },
    emailBold: {
      fontWeight: 700,
      color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
    },
    spamRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginBottom: 28,
    },
    spamText: {
      fontSize: 12,
      color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
    },
  };

  return (
    <div style={s.root}>
      <div style={s.grid} />

      <button style={s.themeBtn} onClick={onToggleTheme}>
        <span style={{ fontSize: 16 }}>{isDark ? '☀️' : '🌙'}</span>
        <span style={{ fontSize: 13 }}>{isDark ? 'Modo claro' : 'Modo oscuro'}</span>
      </button>

      <div style={s.card}>
        <div style={s.iconArea}>
          <div style={s.linesWrap}>
            <div style={s.line} />
            <div style={s.line} />
            <div style={{ ...s.line, width: 18 }} />
          </div>
          <div style={s.iconCircle}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path
                d="M4 10a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10z"
                stroke="url(#mailGrad)" strokeWidth="1.8" fill="none"
              />
              <path d="M4 10l12 9 12-9"
                stroke="url(#mailGrad)" strokeWidth="1.8" strokeLinecap="round" fill="none"
              />
              <defs>
                <linearGradient id="mailGrad" x1="4" y1="8" x2="28" y2="26" gradientUnits="userSpaceOnUse">
                  <stop stopColor={isDark ? '#FF5B2E' : '#FF8430'} />
                  <stop offset="1" stopColor={isDark ? '#C4107A' : '#F7306D'} />
                </linearGradient>
              </defs>
            </svg>
            <div style={s.checkBadge}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        <h1 style={s.title}>Correo Enviado</h1>

        <div style={s.infoRow}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="7.5" cy="7.5" r="6.5" stroke={isDark ? '#FF5B2E' : '#FF8430'} strokeWidth="1.3" />
            <path d="M5 7.5l2 2 3.5-3.5" stroke={isDark ? '#FF5B2E' : '#FF8430'} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p style={s.infoText}>
            Enviamos un enlace de recuperación a tu correo{' '}
            <strong style={s.emailBold}>{email}</strong>
            <br />
            Recuerda es válido por 5 minutos y solo puede usarse una vez.
          </p>
        </div>

        <div style={s.spamRow}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="6.5" cy="6.5" r="6" stroke={isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.30)'} strokeWidth="1" />
            <path d="M6.5 4v3.5" stroke={isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.30)'} strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="6.5" cy="9.2" r="0.6" fill={isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.30)'} />
          </svg>
          <span style={s.spamText}>Revisa tu bandeja de entrada o spam.</span>
        </div>

        <button style={s.btn} onClick={() => navigate('/login')}>
          Volver a Inicio de Sesión
        </button>
      </div>
    </div>
  );
};

export default EmailSent;