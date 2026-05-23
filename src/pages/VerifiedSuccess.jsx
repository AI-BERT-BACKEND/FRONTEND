import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/Layout/AuthLayout';
import { useTheme } from '../context/ThemeContext';
import { createStyles } from '../theme/createStyles';

const VerifiedSuccess = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const s = getStyles(isDark);

  return (
    <AuthLayout>
      <div style={s.page}>
        <div style={s.iconCircle}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path
              d="M8 18l7 7 13-13"
              stroke="url(#checkGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient
                id="checkGrad"
                x1="8"
                y1="11"
                x2="28"
                y2="25"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor={isDark ? '#FF5B2E' : '#FF8430'} />
                <stop offset="1" stopColor={isDark ? '#C4107A' : '#F7306D'} />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <h1 style={s.title}>{isDark ? '¡Codigo verificado!' : '¡CODIGO VERIFICADO!'}</h1>
        <p style={s.description}>
          Tu correo ha sido verificado correctamente.
          <br />
          Ahora puedes continuar.
        </p>

        <div style={s.infoBox}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
            <rect
              x="1"
              y="3"
              width="14"
              height="10"
              rx="2"
              stroke={isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.35)'}
              strokeWidth="1.2"
              fill="none"
            />
            <path
              d="M1 6h14"
              stroke={isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.35)'}
              strokeWidth="1.2"
            />
            <circle
              cx="5"
              cy="9.5"
              r="1"
              fill={isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.35)'}
            />
          </svg>
          <span style={s.infoText}>
            Te recomendamos, por seguridad cambia tu contraseña después de iniciar sesión.
          </span>
        </div>

        <button style={s.btn} onClick={() => navigate('/login')}>
          Continuar
        </button>
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
      borderRadius: 20,
      padding: '40px 40px 36px',
      width: '100%',
      maxWidth: 400,
      boxShadow: t.cardShadow,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      margin: '0 24px',
    },
    iconCircle: {
      width: 72,
      height: 72,
      borderRadius: '50%',
      border: `2px solid ${isDark ? 'rgba(196,16,122,0.50)' : 'rgba(247,48,109,0.35)'}`,
      background: isDark ? 'rgba(196,16,122,0.08)' : 'rgba(255,132,48,0.06)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 22,
    },
    title: {
      fontFamily: t.fontPrimary,
      fontSize: 22,
      fontWeight: 800,
      backgroundImage: t.primaryGradient,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      width: 'fit-content',
      margin: '0 auto',
      marginBottom: 10,
      letterSpacing: isDark ? 0 : '0.03em',
    },
    description: {
      fontSize: 13,
      color: t.textSecondary,
      lineHeight: 1.65,
      marginBottom: 22,
    },
    infoBox: {
      width: '100%',
      background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 10,
      padding: '10px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 24,
      textAlign: 'left',
    },
    infoText: {
      fontSize: 11.5,
      color: t.textSecondary,
      lineHeight: 1.55,
    },
    btn: {
      width: '100%',
      padding: 13,
      border: 'none',
      borderRadius: 10,
      background: t.primaryGradient,
      color: '#fff',
      fontFamily: t.fontPrimary,
      fontSize: 14,
      fontWeight: 700,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      cursor: 'pointer',
    },
  };
};

export default VerifiedSuccess;
