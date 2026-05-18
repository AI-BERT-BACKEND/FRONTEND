import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBaseStyles, ErrorIcon } from '../styles/theme';

const ForgotPassword = ({ theme = 'light', onToggleTheme }) => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({ email: '' });
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const validate = () => {
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRx.test(email)) {
      setErrors({ email: 'Correo inválido' });
      return false;
    }
    setErrors({ email: '' });
    return true;
  };

  const handleSubmit = () => {
    if (validate()) {
      navigate('/forgot-password/sent', { state: { email } });
    }
  };

  const b = getBaseStyles(isDark);

  const s = {
    ...b,
    card: {
      ...b.card,
      padding: '40px 40px 32px',
      width: '100%',
      maxWidth: 420,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      margin: '0 24px',
    },
    title: { ...b.title, fontSize: 24, marginBottom: 12 },
    iconWrap: {
      width: 64,
      height: 64,
      borderRadius: '50%',
      border: `2px solid ${isDark ? 'rgba(196,16,122,0.45)' : 'rgba(247,48,109,0.30)'}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
      background: isDark ? 'rgba(196,16,122,0.08)' : 'rgba(255,132,48,0.06)',
    },
    description: {
      fontSize: 13,
      color: isDark ? 'rgba(255,255,255,0.60)' : 'rgba(0,0,0,0.55)',
      lineHeight: 1.65,
      marginBottom: 24,
      maxWidth: 320,
    },
    field: { width: '100%', marginBottom: 18, textAlign: 'left' },
    btn: { ...b.btn, marginBottom: 20 },
    backRow: {
      fontSize: 12,
      color: isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.45)',
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
        <div style={s.iconWrap}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect x="7" y="16" width="22" height="16" rx="3"
              stroke="url(#lockGrad)" strokeWidth="2" fill="none" />
            <path d="M12 16v-5a6 6 0 1 1 12 0v5"
              stroke="url(#lockGrad)" strokeWidth="2" strokeLinecap="round" />
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
        <p style={s.description}>
          Ingresa tu correo electrónico institucional y a continuación te
          enviaremos un enlace seguro con las instrucciones para que
          puedas restablecer tu acceso.
        </p>

        <div style={s.field}>
          <label style={s.label}>Correo Institucional</label>
          <input
            style={{ ...s.input, ...(errors.email ? s.inputError : {}) }}
            type="email"
            placeholder="estudiante@mail.escuelang.edu.co"
            value={email}
            onChange={e => {
              setEmail(e.target.value);
              if (errors.email) setErrors({ email: '' });
            }}
            onBlur={() => {
              const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (email && !emailRx.test(email))
                setErrors({ email: 'Correo inválido' });
            }}
          />
          {errors.email && (
            <div style={s.errorRow}>
              <ErrorIcon />
              <span>{errors.email}</span>
            </div>
          )}
        </div>

        <button style={s.btn} onClick={handleSubmit}>
          Enviar Instrucciones
        </button>

        <p style={s.backRow}>
          ¿Recordaste tu contraseña?{' '}
          <button
            style={s.link}
            onClick={() => navigate('/login')}
          >
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;