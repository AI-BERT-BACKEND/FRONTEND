import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorIcon from '../components/ErrorIcon';
import GridBackground from '../components/GridBackground';

const ForgotPassword = ({ theme = 'light', onToggleTheme }) => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({ email: '' });
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const validate = () => {
    const rx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !rx.test(email)) { setErrors({ email: 'Correo inválido' }); return false; }
    setErrors({ email: '' }); return true;
  };

  const handleSubmit = () => { if (validate()) navigate('/forgot-password/sent', { state: { email } }); };
  const s = getStyles(isDark);

  return (
    <div style={s.root}>
      <GridBackground isDark={isDark} />

      <button style={s.themeBtn} onClick={onToggleTheme}>
        <span style={{ fontSize: 16 }}>{isDark ? '☀️' : '🌙'}</span>
        <span style={{ fontSize: 13 }}>{isDark ? 'Modo claro' : 'Modo oscuro'}</span>
      </button>

      <div style={s.card}>
        <div style={s.iconWrap}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect x="7" y="16" width="22" height="16" rx="3" stroke="url(#lockGrad)" strokeWidth="2" fill="none" />
            <path d="M12 16v-5a6 6 0 1 1 12 0v5" stroke="url(#lockGrad)" strokeWidth="2" strokeLinecap="round" />
            <circle cx="18" cy="24" r="2" fill="url(#lockGrad)" />
            <defs>
              <linearGradient id="lockGrad" x1="7" y1="7" x2="29" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor={isDark ? '#FF5B2E' : '#FF8430'} />
                <stop offset="1" stopColor={isDark ? '#C4107A' : '#F7306D'} />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <h1 style={s.title}>Recuperar Contraseña</h1>
        <p style={s.description}>Ingresa tu correo electrónico institucional y a continuación te enviaremos un enlace seguro con las instrucciones para que puedas restablecer tu acceso.</p>

        <div style={s.field}>
          <label style={s.label}>Correo Institucional</label>
          <input
            style={{ ...s.input, ...(errors.email ? s.inputError : {}) }}
            type="email" placeholder="estudiante@mail.escuelang.edu.co" value={email}
            onChange={e => { setEmail(e.target.value); if (errors.email) setErrors({ email: '' }); }}
            onBlur={() => { const rx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; if (email && !rx.test(email)) setErrors({ email: 'Correo inválido' }); }}
          />
          {errors.email && <div style={s.errorRow}><ErrorIcon /><span>{errors.email}</span></div>}
        </div>

        <button style={s.btn} onClick={handleSubmit}>Enviar Instrucciones</button>

        <p style={s.backRow}>
          ¿Recordaste tu contraseña?{' '}
          <button style={s.link} onClick={() => navigate('/login')}>Inicia sesión</button>
        </p>
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
    borderRadius: 20, padding: '40px 40px 32px', width: '100%', maxWidth: 420,
    boxShadow: isDark
      ? '0 0 0 1px rgba(196,16,122,0.35), 0 8px 48px rgba(196,16,122,0.22), 0 2px 16px rgba(0,0,0,0.60)'
      : '0 8px 40px rgba(253,214,189,0.60), 0 2px 12px rgba(196,16,122,0.08)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', margin: '0 24px',
  },
  iconWrap: {
    width: 64, height: 64, borderRadius: '50%',
    border: `2px solid ${isDark ? 'rgba(196,16,122,0.45)' : 'rgba(247,48,109,0.30)'}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
    background: isDark ? 'rgba(196,16,122,0.08)' : 'rgba(255,132,48,0.06)',
  },
  title: {
    fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, fontWeight: 800,
    background: isDark ? 'linear-gradient(90deg, #FF5B2E, #C4107A)' : 'linear-gradient(90deg, #FF8430, #F7306D)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 12,
  },
  description: { fontSize: 13, color: isDark ? 'rgba(255,255,255,0.60)' : 'rgba(0,0,0,0.55)', lineHeight: 1.65, marginBottom: 24, maxWidth: 320 },
  field: { width: '100%', marginBottom: 18, textAlign: 'left' },
  label: { display: 'block', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: isDark ? 'rgba(255,255,255,0.60)' : 'rgba(0,0,0,0.55)', marginBottom: 6 },
  input: {
    width: '100%', background: isDark ? 'rgba(255,255,255,0.06)' : '#F5F5F8',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#E0E0E8'}`,
    borderRadius: 10, padding: '11px 14px', fontFamily: "'Poppins', sans-serif",
    fontSize: 13, color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
  },
  inputError: { borderColor: '#F00707', boxShadow: '0 0 0 3px rgba(240,7,7,0.12)' },
  errorRow: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: '#F00707', marginTop: 5, fontWeight: 500 },
  btn: {
    width: '100%', padding: 13, border: 'none', borderRadius: 10,
    background: isDark ? 'linear-gradient(90deg, #C4107A, #FF5B2E)' : 'linear-gradient(90deg, #FF8430, #F7306D)',
    color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14,
    fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer', marginBottom: 20,
  },
  backRow: { fontSize: 12, color: isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.45)' },
  link: { fontSize: 12, color: isDark ? '#FF5B2E' : '#F7306D', fontWeight: 600, cursor: 'pointer', background: 'none', border: 'none', padding: 0, fontFamily: "'Poppins', sans-serif" },
});

export default ForgotPassword;