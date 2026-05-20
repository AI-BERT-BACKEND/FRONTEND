import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/Layout/AuthLayout';
import MascotaGif from '../assets/aibert-logo-sin-negro-corregido.gif';
import ErrorIcon from '../components/ErrorIcon';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword } from '../utils/validators';
import { createStyles } from '../theme/createStyles';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const validate = () => {
    const eError = validateEmail(email);
    const pError = validatePassword(password);
    setErrors({ email: eError, password: pError });
    return !eError && !pError;
  };

  const handleSubmit = async () => {
    if (validate()) {
      await login({ email, password });
      navigate('/academic-profile');
    }
  };

  const s = getStyles(isDark);

  return (
    <AuthLayout>
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
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((p) => ({ ...p, email: '' }));
              }}
              onBlur={() => {
                const error = validateEmail(email);
                if (email && error) setErrors((p) => ({ ...p, email: error }));
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
              onChange={(e) => {
                setPassword(e.target.value);
                if (e.target.value.length >= 8) setErrors((p) => ({ ...p, password: '' }));
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
                onChange={(e) => setRemember(e.target.checked)}
                style={{
                  width: 14,
                  height: 14,
                  accentColor: isDark ? '#C4107A' : '#FF8430',
                  cursor: 'pointer',
                }}
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
    </AuthLayout>
  );
};

const getStyles = (isDark) => {
  const t = createStyles(isDark);
  return {
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
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: t.xxl,
      padding: '40px 36px',
      width: '100%',
      maxWidth: 360,
      boxShadow: t.cardShadow,
      flexShrink: 0,
    },
    title: {
      fontFamily: t.fontPrimary,
      fontSize: 26,
      fontWeight: 800,
      backgroundImage: t.primaryGradient,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      width: 'fit-content',
      lineHeight: 1.2,
      marginBottom: 6,
    },
    subtitle: {
      fontSize: 14,
      color: t.textPrimary,
      fontWeight: 400,
      marginBottom: 28,
    },
    field: { marginBottom: 18 },
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
    checkRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 22,
    },
    checkWrap: { display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' },
    checkLabel: { fontSize: 12, color: t.textSecondary },
    link: {
      fontSize: 12,
      color: isDark ? '#FF5B2E' : '#F7306D',
      textDecoration: 'none',
      fontWeight: 500,
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      padding: 0,
      fontFamily: t.fontSecondary,
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
      marginBottom: 18,
    },
    registerRow: {
      textAlign: 'center',
      fontSize: 12,
      color: t.textSecondary,
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
};

export default Login;
