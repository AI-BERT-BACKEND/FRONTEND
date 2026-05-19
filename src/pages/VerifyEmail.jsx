import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/LOGO.png';

const VerifyEmail = ({ theme = 'light', onToggleTheme }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef([]);
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(prev => prev - 1), 1000);
      return () => clearTimeout(t);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const newCode = [...code];
    newCode[idx] = val;
    setCode(newCode);
    setError('');
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !code[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newCode = [...code];
    pasted.split('').forEach((ch, i) => { newCode[i] = ch; });
    setCode(newCode);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = () => {
    const full = code.join('');
    if (full.length < 6) {
      setError('Ingresa los 6 dígitos del código');
      return;
    }
    navigate('/verified-success');
  };

  const handleResend = () => {
    if (!canResend) return;
    setTimer(60);
    setCanResend(false);
    setCode(['', '', '', '', '', '']);
    setError('');
  };

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const s = getStyles(isDark);

  return (
    <div style={s.root}>

      <button style={s.themeBtn} onClick={onToggleTheme}>
        <span style={{ fontSize: 16 }}>{isDark ? '☀️' : '🌙'}</span>
        <span style={{ fontSize: 13 }}>{isDark ? 'Modo claro' : 'Modo oscuro'}</span>
      </button>

      <div style={s.card}>

        {/* Logo */}
        <div style={s.logoWrap}>
          <img src={Logo} alt="AI.BERT logo" style={s.logo} />
        </div>

        <h1 style={s.title}>
          {isDark ? 'Verifica tu cuenta' : 'VERIFICA TU CORREO'}
        </h1>

        <p style={s.description}>
          Ingresa el código de verificación que<br />
          enviamos a tu correo institucional.
        </p>

        {/* Campo código */}
        <div style={s.field}>
          <label style={s.label}>Código de Verificación</label>
          <div style={s.codeRow}>
            {code.map((digit, idx) => (
              <input
                key={idx}
                ref={el => inputs.current[idx] = el}
                style={{
                  ...s.codeInput,
                  ...(error ? s.codeInputError : {}),
                  ...(digit ? s.codeInputFilled : {}),
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(e.target.value, idx)}
                onKeyDown={e => handleKeyDown(e, idx)}
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

        <button style={s.btn} onClick={handleSubmit}>
          Verificar correo
        </button>

        {/* Reenviar */}
        <div style={s.resendWrap}>
          <span style={s.resendLabel}>
            Reenviar código en
          </span>
          {!canResend && (
            <span style={s.timer}>{formatTime(timer)}</span>
          )}
          <button
            style={{ ...s.resendBtn, opacity: canResend ? 1 : 0.4, cursor: canResend ? 'pointer' : 'default' }}
            onClick={handleResend}
            disabled={!canResend}
          >
            Reenviar código
          </button>
        </div>

      </div>
    </div>
  );
};

const getStyles = (isDark) => ({
  root: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    fontFamily: "'Poppins', sans-serif",
    transition: 'background-color 0.35s',
  },
  grid: {
    position: 'fixed',
    inset: 0,
    backgroundColor: isDark ? '#050208' : '#FDF2EB',
    backgroundImage: `
      linear-gradient(${isDark ? '#041B36' : '#FDEEE6'} 1px, transparent 1px),
      linear-gradient(90deg, ${isDark ? '#041B36' : '#FDEEE6'} 1px, transparent 1px)
    `,
    backgroundSize: '36px 36px',
    opacity: 0.55,
    pointerEvents: 'none',
    zIndex: 0,
  },
  themeBtn: {
    position: 'fixed',
    top: 20,
    right: 24,
    zIndex: 100,
    backgroundColor: 'transparent',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(220,193,181,0.30)'}`,
    borderRadius: 50,
    padding: '6px 14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontFamily: "'Poppins', sans-serif",
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
  },
  card: {
    position: 'relative',
    zIndex: 1,
    background: isDark ? '#171717' : '#FEFAF9',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(220,193,181,0.30)'}`,
    borderRadius: 20,
    padding: '36px 40px 32px',
    width: '100%',
    maxWidth: 400,
    boxShadow: isDark
      ? '0 0 0 1px rgba(196,16,122,0.35), 0 8px 48px rgba(196,16,122,0.22), 0 2px 16px rgba(0,0,0,0.60)'
      : '0 8px 40px rgba(253,214,189,0.60), 0 2px 12px rgba(196,16,122,0.08)',
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
  logo: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  title: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: isDark ? 22 : 20,
    fontWeight: 800,
    background: isDark
      ? 'linear-gradient(90deg, #FF5B2E, #C4107A)'
      : 'linear-gradient(90deg, #FF8430, #F7306D)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: 10,
    letterSpacing: isDark ? 0 : '0.04em',
  },
  description: {
    fontSize: 13,
    color: isDark ? 'rgba(255,255,255,0.60)' : 'rgba(0,0,0,0.55)',
    lineHeight: 1.65,
    marginBottom: 24,
  },
  field: {
    width: '100%',
    marginBottom: 20,
    textAlign: 'left',
  },
  label: {
    display: 'block',
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: isDark ? 'rgba(255,255,255,0.60)' : 'rgba(0,0,0,0.55)',
    marginBottom: 10,
  },
  codeRow: {
    display: 'flex',
    gap: 8,
    justifyContent: 'center',
  },
  codeInput: {
    width: 44,
    height: 44,
    borderRadius: 10,
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#E0E0E8'}`,
    background: isDark ? 'rgba(255,255,255,0.06)' : '#F5F5F8',
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
    fontSize: 18,
    fontWeight: 600,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    textAlign: 'center',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  },
  codeInputFilled: {
    borderColor: isDark ? 'rgba(196,16,122,0.60)' : 'rgba(255,132,48,0.60)',
    boxShadow: `0 0 0 2px ${isDark ? 'rgba(196,16,122,0.15)' : 'rgba(255,132,48,0.12)'}`,
  },
  codeInputError: {
    borderColor: '#F00707',
    boxShadow: '0 0 0 2px rgba(240,7,7,0.12)',
  },
  errorRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    fontSize: 11.5,
    color: '#F00707',
    marginTop: 8,
    fontWeight: 500,
  },
  btn: {
    width: '100%',
    padding: 13,
    border: 'none',
    borderRadius: 10,
    background: isDark
      ? 'linear-gradient(90deg, #C4107A, #FF5B2E)'
      : 'linear-gradient(90deg, #FF8430, #F7306D)',
    color: '#fff',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    marginBottom: 20,
  },
  resendWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  resendLabel: {
    fontSize: 12,
    color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)',
  },
  timer: {
    fontSize: 13,
    fontWeight: 600,
    color: isDark ? 'rgba(255,255,255,0.70)' : 'rgba(0,0,0,0.65)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  resendBtn: {
    fontSize: 12,
    color: isDark ? '#FF5B2E' : '#F7306D',
    fontWeight: 600,
    background: 'none',
    border: 'none',
    padding: 0,
    fontFamily: "'Poppins', sans-serif",
    cursor: 'pointer',
  },
});

export default VerifyEmail;