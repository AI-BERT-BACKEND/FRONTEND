import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MascotaGif from '../assets/aibert-logo-sin-negro-corregido.gif';
import { getBaseStyles, ErrorIcon } from '../styles/theme';
import ThemeToggle from '../components/ThemeToggle';

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
    if (validate()) {
      // → navigate('/dashboard');
    }
  };

  const b = getBaseStyles(isDark);

  const s = {
    ...b,
    page: {
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 56,
      padding: '32px 24px',
      width: '100%',
      maxWidth: 900,
      flexWrap: 'wrap',
    },
    card: {
      ...b.card,
      padding: '40px 36px',
      width: '100%',
      maxWidth: 360,
      flexShrink: 0,
    },
    title: { ...b.title, fontSize: 26, lineHeight: 1.2, marginBottom: 6 },
    subtitle: {
      fontSize: 14,
      color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
      fontWeight: 400,
      marginBottom: 28,
    },
    field: { marginBottom: 18 },
    checkRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 22,
    },
    checkWrap: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      cursor: 'pointer',
    },
    checkLabel: {
      fontSize: 12,
      color: isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.45)',
    },
    btn: { ...b.btn, marginBottom: 18 },
    registerRow: {
      textAlign: 'center',
      fontSize: 12,
      color: isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.45)',
    },
    mascotWrap: {
      flexShrink: 0,
      width: 300,
      height: 300,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };

  return (
    <div style={s.root}>
      <div style={s.grid} />

      <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />

      <div style={s.page}>
        <div style={s.card}>
          <h1 style={s.title}>¡Bienvenido de vuelta!</h1>
          <p style={s.subtitle}>Ingresa a tu cuenta</p>

          <div style={s.field}>
            <label style={s.label}>Correo Institucional</label>
            <input
              style={{ ...s.input, ...(errors.email ? s.inputError : {}) }}
              type="email"
              placeholder="estudiante@mail.escuelang.edu.co"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
              }}
              onBlur={() => {
                const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (email && !emailRx.test(email))
                  setErrors(prev => ({ ...prev, email: 'Correo inválido' }));
              }}
            />
            {errors.email && (
              <div style={s.errorRow}>
                <ErrorIcon />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          <div style={s.field}>
            <label style={s.label}>Contraseña</label>
            <input
              style={{ ...s.input, ...(errors.password ? s.inputError : {}) }}
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                if (e.target.value.length >= 8)
                  setErrors(prev => ({ ...prev, password: '' }));
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

          <button style={s.btn} onClick={handleSubmit}>
            Iniciar Sesión
          </button>

          <p style={s.registerRow}>
            ¿No tienes una cuenta?{' '}
            <button style={s.link} onClick={() => navigate('/register')}>
              Regístrate
            </button>
          </p>
        </div>

        <div style={s.mascotWrap}>
          <img
            src={MascotaGif}
            alt="AI.BERT mascota"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;