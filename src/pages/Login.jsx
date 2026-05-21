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
  const [isLoading, setIsLoading] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
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
      setIsLoading(true);
      try {
        await login({ email, password });
        // Iniciamos la animación de salida
        setIsExiting(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      } catch (err) {
        setIsLoading(false);
      }
    }
  };

  const s = getStyles(isDark);

  return (
    <AuthLayout>
      <div style={s.page} className={isExiting ? 'exit-transition' : ''}>
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

          <button style={s.btn} onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
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
      maxWidth: 1200,
      flexWrap: 'wrap',
    },
    card: {
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: t.xxl,
      padding: 'clamp(32px, 5vh, 48px) clamp(28px, 4vw, 42px)',
      width: '100%',
      maxWidth: 480,
      boxShadow: t.cardShadow,
      flexShrink: 0,
    },
    title: {
      fontFamily: t.fontPrimary,
      fontSize: 'clamp(26px, 2.5vw, 36px)',
      fontWeight: 800,
      backgroundImage: t.primaryGradient,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      width: '100%',
      whiteSpace: 'nowrap',
      lineHeight: 1.2,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 'clamp(14px, 1.2vw, 16px)',
      color: t.textPrimary,
      fontWeight: 400,
      marginBottom: 32,
    },
    field: { marginBottom: 22 },
    label: {
      display: 'block',
      fontSize: 'clamp(10px, 0.8vw, 11px)',
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: t.textSecondary,
      marginBottom: 8,
    },
    input: {
      width: '100%',
      background: t.inputBg,
      border: `1px solid ${t.inputBorder}`,
      borderRadius: t.md,
      padding: '13px 16px',
      fontFamily: t.fontSecondary,
      fontSize: 'clamp(13px, 1vw, 15px)',
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
      padding: 15,
      border: 'none',
      borderRadius: t.md,
      background: t.primaryGradient,
      color: '#fff',
      fontFamily: t.fontPrimary,
      fontSize: 'clamp(14px, 1.2vw, 16px)',
      fontWeight: 700,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      cursor: 'pointer',
      marginBottom: 20,
    },
    registerRow: {
      textAlign: 'center',
      fontSize: 12,
      color: t.textSecondary,
    },
    mascotWrap: {
      flexShrink: 0,
      width: 'clamp(300px, 30vw, 500px)',
      height: 'clamp(300px, 30vw, 500px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };
};

export default Login;
