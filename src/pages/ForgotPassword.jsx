import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/Layout/AuthLayout';
import ErrorIcon from '../components/ErrorIcon';
import { useTheme } from '../context/ThemeContext';
import { validateEmail } from '../utils/validators';
import { createStyles } from '../theme/createStyles';
import authService from '../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({ email: '' });
  const [loading, setLoading] = useState(false);
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const validate = () => {
    const error = validateEmail(email);
    setErrors({ email: error });
    return !error;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await authService.forgotPassword({ email });
      navigate('/forgot-password/sent', { state: { email } });
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Error al enviar correo';
      setErrors({ email: msg });
    } finally {
      setLoading(false);
    }
  };
  const s = getStyles(isDark);

  return (
    <AuthLayout>
      <div style={s.page}>
        <div style={s.iconWrap}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect
              x="7"
              y="16"
              width="22"
              height="16"
              rx="3"
              stroke="url(#lockGrad)"
              strokeWidth="2"
            />
            <path
              d="M11 16v-5a7 7 0 1 1 14 0v5"
              stroke="url(#lockGrad)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="18" cy="24" r="2" fill="url(#lockGrad)" />
            <defs>
              <linearGradient id="lockGrad" x1="7" y1="11" x2="29" y2="32">
                <stop stopColor={isDark ? '#FF5B2E' : '#FF8430'} />
                <stop offset="1" stopColor={isDark ? '#C4107A' : '#F7306D'} />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <h1 style={s.title}>¿Olvidaste tu contraseña?</h1>
        <p style={s.description}>
          No te preocupes, dinos tu correo y te enviaremos instrucciones para recuperarla.
        </p>

        <div style={s.field}>
          <label style={s.label}>Correo Institucional</label>
          <input
            style={{ ...s.input, ...(errors.email ? s.inputError : {}) }}
            type="email"
            placeholder="estudiante@mail.escuelang.edu.co"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({ email: '' });
            }}
            onBlur={() => {
              const error = validateEmail(email);
              if (email && error) setErrors({ email: error });
            }}
          />
          {errors.email && (
            <div style={s.errorRow}>
              <ErrorIcon />
              <span>{errors.email}</span>
            </div>
          )}
        </div>

        <button style={{ ...s.btn, ...(loading ? { opacity: 0.7, cursor: 'not-allowed' } : {}) }} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Enviando...' : 'Recuperar Contraseña'}
        </button>

        <p style={s.backRow}>
          <button style={s.link} onClick={() => navigate('/login')}>
            Volver al inicio de sesión
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};

const getStyles = (isDark) => {
  const t = createStyles(isDark);
  return {
    page: {
      position: 'relative',
      zIndex: 1,
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: t.xxl,
      padding: '40px 44px 36px',
      width: '100%',
      maxWidth: 420,
      boxShadow: t.cardShadow,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      margin: '0 24px',
    },
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
    title: {
      fontFamily: t.fontPrimary,
      fontSize: 24,
      fontWeight: 800,
      backgroundImage: t.primaryGradient,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      width: 'fit-content',
      margin: '0 auto',
      marginBottom: 12,
    },
    description: {
      fontSize: 13,
      color: t.textSecondary,
      lineHeight: 1.65,
      marginBottom: 24,
      maxWidth: 320,
    },
    field: { width: '100%', marginBottom: 18, textAlign: 'left' },
    label: {
      display: 'block',
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: t.textSecondary,
      marginBottom: 6,
    },
    input: {
      width: '100%',
      background: t.inputBg,
      border: `1px solid ${t.inputBorder}`,
      borderRadius: t.md,
      padding: '11px 14px',
      fontFamily: t.fontSecondary,
      fontSize: 13,
      color: t.textPrimary,
      outline: 'none',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box',
    },
    inputError: { borderColor: t.error, boxShadow: `0 0 0 3px ${t.error}22` },
    errorRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      fontSize: 11.5,
      color: t.error,
      marginTop: 5,
      fontWeight: 500,
    },
    btn: {
      width: '100%',
      padding: 13,
      border: 'none',
      borderRadius: t.md,
      background: t.primaryGradient,
      color: '#fff',
      fontFamily: t.fontPrimary,
      fontSize: 14,
      fontWeight: 700,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      cursor: 'pointer',
      marginBottom: 20,
    },
    backRow: { fontSize: 12, color: t.textSecondary },
    link: {
      fontSize: 12,
      color: isDark ? '#FF5B2E' : '#F7306D',
      fontWeight: 600,
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      padding: 0,
      fontFamily: t.fontSecondary,
    },
  };
};

export default ForgotPassword;
