import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MascotaGif from '../assets/aibert-logo-sin-negro-corregido.gif';
import ErrorIcon from '../components/ErrorIcon';

const Login = ({ theme = 'light', onToggleTheme }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = { email: '', password: '' };
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRx.test(email)) newErrors.email = 'Correo inválido';
    if (!password || password.length < 8) newErrors.password = 'Mínimo 8 caracteres requeridos';
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = () => {
    if (validate()) navigate('/academic-profile');
  };

  const s = getStyles(isDark);

  return (
    <div style={s.root}>
      <button style={s.themeBtn} onClick={onToggleTheme}>
        <span style={{ fontSize: 16 }}>{isDark ? '☀️' : '🌙'}</span>
        <span style={{ fontSize: 13 }}>{isDark ? 'Modo claro' : 'Modo oscuro'}</span>
      </button>

      <div style={s.page}>
        <div style={s.card}>
          <h1 style={s.title}>¡Bienvenido de vuelta!</h1>
          <p style={s.subtitle}>Ingresa a tu cuenta</p>

          {/* Campo Email */}
          <div style={s.field}>
            <label style={s.label}>Correo Institucional</label>
            <input
              style={{ ...s.input, ...(errors.email ? s.inputError : {}) }}
              type="email"
              placeholder="estudiante@mail.escuelang.edu.co"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                if (errors.email) setErrors(p => ({ ...p, email: '' }));
              }}
              onBlur={() => {
                const rx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (email && !rx.test(email)) setErrors(p => ({ ...p, email: 'Correo inválido' }));
              }}
            />
            {errors.email && (
              <div style={s.errorRow}>
                <ErrorIcon />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          {/* Campo Contraseña */}
          <div style={s.field}>
            <label style={s.label}>Contraseña</label>
            <input
              style={{ ...s.input, ...(errors.password ? s.inputError : {}) }}
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                if (e.target.value.length >= 8) setErrors(p => ({ ...p, password: '' }));
              }}
            />
            {errors.password && (
              <div style={s.errorRow}>
                <ErrorIcon />
                <span>{errors.password}</span>
              </div>
            )}
          </div>

          <div style={s.checkRow}>
            <label style={s.checkWrap}>
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                style={{ width: 14, height: 14, accentColor: isDark ? '#C4107A' : '#FF8430', cursor: 'pointer' }}
              />
              <span style={s.checkLabel}>Recordarme</span>
            </label>
            <button style={s.link} onClick={() => navigate('/forgot-password')}>
              ¿No recuerdas tu contraseña?
            </button>
          </div>

          <button style={s.btn} onClick={handleSubmit}>Iniciar Sesión</button>

          <p style={s.registerRow}>
            ¿No tienes una cuenta?{' '}
            <button style={s.link} onClick={() => navigate('/register')}>Regístrate</button>
          </p>
        </div>

        <div style={s.mascotWrap}>
          <img src={MascotaGif} alt="AI.BERT mascota" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
      </div>
    </div>
  );
};

const getStyles = (isDark) => ({
  root: {
    position: 'relative',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: isDark ? '#050208' : '#FDF2EB',
    backgroundImage: isDark
      ? `linear-gradient(#041B36 1px, transparent 1px), linear-gradient(90deg, #041B36 1px, transparent 1px)`
      : `linear-gradient(rgba(210,140,100,0.30) 1px, transparent 1px), linear-gradient(90deg, rgba(210,140,100,0.30) 1px, transparent 1px)`,
    backgroundSize: '36px 36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Poppins', sans-serif",
    boxSizing: 'border-box',
  },
  themeBtn: {
    position: 'fixed', top: 20, right: 24, zIndex: 100,
    background: isDark ? '#171717' : '#FEFAF9',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(220,193,181,0.30)'}`,
    borderRadius: 50, padding: '6px 14px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 8,
    fontFamily: "'Poppins', sans-serif", color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
  },
  page: {
    position: 'relative', zIndex: 1,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 'clamp(32px, 5vw, 80px)',
    padding: 'clamp(24px, 4vh, 60px) clamp(16px, 4vw, 60px)',
    width: '100%', maxWidth: 1200, flexWrap: 'wrap', boxSizing: 'border-box',
  },
  card: {
    background: isDark ? '#171717' : '#FEFAF9',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(220,193,181,0.30)'}`,
    borderRadius: 20,
    padding: 'clamp(28px, 3vw, 52px) clamp(24px, 3vw, 48px)',
    width: '100%',
    maxWidth: 'clamp(320px, 35vw, 480px)',
    boxShadow: isDark
      ? '0 0 0 1px rgba(196,16,122,0.35), 0 8px 48px rgba(196,16,122,0.22), 0 2px 16px rgba(0,0,0,0.60)'
      : '0 8px 40px rgba(253,214,189,0.60), 0 2px 12px rgba(196,16,122,0.08)',
    flexShrink: 0, boxSizing: 'border-box',
  },
  title: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 'clamp(22px, 2.2vw, 32px)', fontWeight: 800,
    background: isDark ? 'linear-gradient(90deg, #FF5B2E, #C4107A)' : 'linear-gradient(90deg, #FF8430, #F7306D)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
    lineHeight: 1.2, marginBottom: 6,
  },
  subtitle: {
    fontSize: 'clamp(13px, 1vw, 16px)',
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
    fontWeight: 400, marginBottom: 28,
  },
  field: { marginBottom: 18 },
  label: {
    display: 'block', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
    color: isDark ? 'rgba(255,255,255,0.60)' : 'rgba(0,0,0,0.55)', marginBottom: 6,
  },
  input: {
    width: '100%', background: isDark ? 'rgba(255,255,255,0.06)' : '#F5F5F8',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#E0E0E8'}`,
    borderRadius: 10, padding: '11px 14px', fontFamily: "'Poppins', sans-serif",
    fontSize: 13, color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)', outline: 'none',
    transition: 'border-color 0.2s', boxSizing: 'border-box',
  },
  inputError: { borderColor: '#F00707', boxShadow: '0 0 0 3px rgba(240,7,7,0.12)' },
  errorRow: {
    display: 'flex', alignItems: 'center', gap: 5,
    fontSize: 11.5, color: '#F00707', marginTop: 5, fontWeight: 500,
  },
  checkRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 },
  checkWrap: { display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' },
  checkLabel: { fontSize: 12, color: isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.45)' },
  link: {
    fontSize: 12, color: isDark ? '#FF5B2E' : '#F7306D',
    fontWeight: 500, cursor: 'pointer', background: 'none', border: 'none', padding: 0,
    fontFamily: "'Poppins', sans-serif",
  },
  btn: {
    width: '100%', padding: 13, border: 'none', borderRadius: 10,
    background: isDark ? 'linear-gradient(90deg, #C4107A, #FF5B2E)' : 'linear-gradient(90deg, #FF8430, #F7306D)',
    color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 'clamp(13px, 1vw, 15px)',
    fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer', marginBottom: 18,
  },
  registerRow: { textAlign: 'center', fontSize: 12, color: isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.45)' },
  mascotWrap: {
    flexShrink: 0,
    width: 'clamp(220px, 28vw, 420px)',
    height: 'clamp(220px, 28vw, 420px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
});

export default Login;