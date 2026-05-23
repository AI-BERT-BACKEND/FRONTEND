import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../components/Layout/AuthLayout';
import Logo from '../assets/LOGO.png';
import { useTheme } from '../context/ThemeContext';
import { createStyles } from '../theme/createStyles';
import profileService from '../services/profileService';

const VerifyEmail = () => {
  const { isDark } = useTheme();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  useEffect(() => {
    const pendingEmail = localStorage.getItem('pendingVerifyEmail');
    if (!pendingEmail) {
      setError('No hay un registro pendiente de verificación. Por favor regístrate primero.');
    }
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => {
      setTimer((p) => p - 1);
      if (timer - 1 <= 0) setCanResend(true);
    }, 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const handleChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const n = [...code];
    n[idx] = val;
    setCode(n);
    setError('');
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !code[idx] && idx > 0) inputs.current[idx - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const p = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const n = [...code];
    p.split('').forEach((ch, i) => {
      n[i] = ch;
    });
    setCode(n);
    inputs.current[Math.min(p.length, 5)]?.focus();
  };

  const handleSubmit = async () => {
    const full = code.join('');
    if (full.length < 6) {
      setError('Ingresa los 6 dígitos del código');
      return;
    }
    try {
      await profileService.verifyOtp(userId, full);
      navigate('/verified-success');
    } catch (err) {
      setError('Código inválido o expirado');
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      await profileService.resendVerification(location.state?.email);
    } catch (err) {
      setError('Error al reenviar el código');
    }
    setTimer(60);
    setCanResend(false);
    setCode(['', '', '', '', '', '']);
    setError('');
  };

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const s = getStyles(isDark);

  return (
    <AuthLayout>
      <div style={s.page}>
        <div style={s.logoWrap}>
          <img src={Logo} alt="AI.BERT logo" style={s.logo} />
        </div>
        <h1 style={s.title}>{isDark ? 'Verifica tu cuenta' : 'VERIFICA TU CORREO'}</h1>
        <p style={s.description}>
          Ingresa el código de verificación que
          <br />
          enviamos a tu correo institucional.
        </p>

        <div style={s.field}>
          <label style={s.label}>Código de Verificación</label>
          <div style={s.codeRow}>
            {code.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputs.current[idx] = el)}
                style={{
                  ...s.codeInput,
                  ...(error ? s.codeInputError : {}),
                  ...(digit ? s.codeInputFilled : {}),
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                onPaste={handlePaste}
              />
            ))}
          </div>
          {error && (
            <div style={s.errorRow}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="6.5" cy="6.5" r="6" stroke="#F00707" strokeWidth="1.2" />
                <path d="M6.5 3.5v3.2" stroke="#F00707" strokeWidth="1.4" strokeLinecap="round" />
                <circle cx="6.5" cy="9.2" r="0.7" fill="#F00707" />
              </svg>
              <span>{error}</span>
            </div>
          )}
        </div>

         <button 
           style={{
             ...s.btn,
             ...(loading ? { opacity: 0.7, cursor: 'not-allowed' } : {}),
           }} 
           onClick={handleSubmit}
           disabled={loading}
         >
           {loading ? 'Verificando...' : 'Verificar correo'}
         </button>

        <div style={s.resendWrap}>
          <span style={s.resendLabel}>Reenviar código en</span>
          {!canResend && <span style={s.timer}>{formatTime(timer)}</span>}
          <button
            style={{
              ...s.resendBtn,
              opacity: canResend ? 1 : 0.4,
              cursor: canResend ? 'pointer' : 'default',
            }}
            onClick={handleResend}
            disabled={!canResend}
          >
            Reenviar código
          </button>
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
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 20,
      padding: '36px 40px 32px',
      width: '100%',
      maxWidth: 400,
      boxShadow: t.cardShadow,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      margin: '0 24px',
    },
    logoWrap: {
      width: 64,
      height: 64,
      marginBottom: 18,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: { width: '100%', height: '100%', objectFit: 'contain' },
    title: {
      fontFamily: t.fontPrimary,
      fontSize: isDark ? 22 : 20,
      fontWeight: 800,
      backgroundImage: t.primaryGradient,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      width: 'fit-content',
      margin: '0 auto',
      marginBottom: 10,
      letterSpacing: isDark ? 0 : '0.04em',
    },
    description: {
      fontSize: 13,
      color: t.textSecondary,
      lineHeight: 1.65,
      marginBottom: 24,
    },
    field: { width: '100%', marginBottom: 20, textAlign: 'left' },
    label: {
      display: 'block',
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: t.textSecondary,
      marginBottom: 10,
    },
    codeRow: { display: 'flex', gap: 8, justifyContent: 'center' },
    codeInput: {
      width: 44,
      height: 44,
      borderRadius: 10,
      border: `1px solid ${t.inputBorder}`,
      background: t.inputBg,
      color: t.textPrimary,
      fontSize: 18,
      fontWeight: 600,
      fontFamily: t.fontPrimary,
      textAlign: 'center',
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      boxSizing: 'border-box',
    },
    codeInputFilled: {
      borderColor: isDark ? 'rgba(196,16,122,0.60)' : 'rgba(255,132,48,0.60)',
      boxShadow: `0 0 0 2px ${isDark ? 'rgba(196,16,122,0.15)' : 'rgba(255,132,48,0.12)'}`,
    },
    codeInputError: { borderColor: t.error, boxShadow: `0 0 0 2px ${t.error}22` },
    errorRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
      fontSize: 11.5,
      color: t.error,
      marginTop: 8,
      fontWeight: 500,
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
      marginBottom: 20,
    },
    resendWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
    resendLabel: { fontSize: 12, color: t.textSecondary },
    timer: {
      fontSize: 13,
      fontWeight: 600,
      color: t.textPrimary,
      fontFamily: t.fontPrimary,
    },
    resendBtn: {
      fontSize: 12,
      color: isDark ? '#FF5B2E' : '#F7306D',
      fontWeight: 600,
      background: 'none',
      border: 'none',
      padding: 0,
      fontFamily: t.fontSecondary,
      cursor: 'pointer',
    },
  };
};

export default VerifyEmail;
