import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/Layout/AuthLayout';
import MascotaGif from '../assets/aibert-logo-sin-negro-corregido.gif';
import ErrorIcon from '../components/ErrorIcon';
import { ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateRequired,
} from '../utils/validators';
import { createStyles } from '../theme/createStyles';

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const PasswordField = ({ label, field, placeholder, value, error, show, onToggle, onChange, onBlur, s, isDark }) => (
  <div style={s.field}>
    <label style={s.label}>{label}</label>
    <div style={s.passWrap}>
      <input
        style={{ ...s.input, paddingRight: 40, ...(error ? s.inputError : {}) }}
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        onBlur={onBlur}
      />
      <button style={s.eyeBtn} type="button" onClick={onToggle} tabIndex={-1} aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
        {show ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
    {error && (
      <div style={s.errorRow}>
        <ErrorIcon />
        <span>{error}</span>
      </div>
    )}
  </div>
);

const Field = ({ label, field, type = 'text', placeholder, value, error, onChange, onBlur, s }) => (
  <div style={s.field}>
    <label style={s.label}>{label}</label>
    <input
      style={{ ...s.input, ...(error ? s.inputError : {}) }}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(field, e.target.value)}
      onBlur={onBlur}
    />
    {error && (
      <div style={s.errorRow}>
        <ErrorIcon />
        <span>{error}</span>
      </div>
    )}
  </div>
);

const Register = () => {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    carrera: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const carreras = [
    'Ing. Sistemas',
    'Ing. Industrial',
    'Ing. Civil',
    'Ing. Electrónica',
    'Administración',
    'Contaduría',
    'Derecho',
    'Medicina',
    'Psicología',
    'Arquitectura',
  ];

  const validate = () => {
    const e = {
      nombre: validateRequired(form.nombre, 'El nombre'),
      email: validateEmail(form.email),
      carrera: validateRequired(form.carrera, 'La carrera'),
      password: validatePassword(form.password),
      confirmPassword: validateConfirmPassword(form.password, form.confirmPassword),
    };
    setErrors(e);
    return !Object.values(e).some((msg) => msg !== '');
  };

  const handleChange = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      navigate('/verify-email');
    } finally {
      setLoading(false);
    }
  };

  const s = getStyles(isDark);
  const t = createStyles(isDark);

  return (
    <AuthLayout>
      <div style={s.page}>
        <div style={s.card}>
          <h1 style={s.title}>Crea tu cuenta</h1>
          <p style={s.subtitle}>¡Únete y comienza a organizar tu éxito!</p>

          <Field
            label="Nombre Completo"
            field="nombre"
            placeholder="Isaac Burgos"
            value={form.nombre}
            error={errors.nombre}
            onChange={handleChange}
            s={s}
          />
          <Field
            label="Correo Institucional"
            field="email"
            type="email"
            placeholder="estudiante@mail.escuelang.edu.co"
            value={form.email}
            error={errors.email}
            onChange={handleChange}
            onBlur={() => {
              const error = validateEmail(form.email);
              if (form.email && error) setErrors((p) => ({ ...p, email: error }));
            }}
            s={s}
          />

          <div style={s.field}>
            <label style={s.label}>Carrera</label>
            <div style={{ position: 'relative' }}>
              <select
                style={{ ...s.input, ...s.select, ...(errors.carrera ? s.inputError : {}) }}
                value={form.carrera}
                onChange={(e) => handleChange('carrera', e.target.value)}
              >
                <option value="" disabled style={{ background: t.cardBg, color: t.textSecondary }}>
                  Selecciona tu carrera
                </option>
                {carreras.map((c) => (
                  <option key={c} value={c} style={{ background: t.cardBg, color: t.textPrimary }}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                color={isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.40)'}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }}
              />
            </div>
            {errors.carrera && (
              <div style={s.errorRow}>
                <ErrorIcon />
                <span>{errors.carrera}</span>
              </div>
            )}
          </div>

          <PasswordField
            label="Contraseña"
            field="password"
            placeholder="Mínimo 8 caracteres"
            value={form.password}
            error={errors.password}
            show={showPassword}
            onToggle={() => setShowPassword(p => !p)}
            onChange={handleChange}
            s={s}
            isDark={isDark}
          />
          <PasswordField
            label="Confirmar Contraseña"
            field="confirmPassword"
            placeholder="Vuelve a ingresar la contraseña"
            value={form.confirmPassword}
            error={errors.confirmPassword}
            show={showConfirm}
            onToggle={() => setShowConfirm(p => !p)}
            onChange={handleChange}
            onBlur={() => {
              if (form.confirmPassword) {
                const error = validateConfirmPassword(form.password, form.confirmPassword);
                if (error) setErrors((p) => ({ ...p, confirmPassword: error }));
              }
            }}
            s={s}
            isDark={isDark}
          />

          <button style={{ ...s.btn, ...(loading ? { opacity: 0.7, cursor: 'not-allowed' } : {}) }} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarte'}
          </button>

          <p style={s.loginRow}>
            ¿Ya tienes cuenta?{' '}
            <button style={s.link} onClick={() => navigate('/login')}>
              Inicia sesión
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
      maxWidth: 960,
      flexWrap: 'wrap',
    },
    card: {
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: t.xxl,
      padding: '36px 36px 28px',
      width: '100%',
      maxWidth: 380,
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
      margin: '0 auto 6px',
    },
    subtitle: {
      fontSize: 13,
      color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.60)',
      fontWeight: 400,
      marginBottom: 24,
      textAlign: 'center',
    },
    field: { marginBottom: 14 },
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
      padding: '10px 14px',
      fontFamily: t.fontSecondary,
      fontSize: 13,
      color: t.textPrimary,
      outline: 'none',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box',
    },
    select: { appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer', paddingRight: 32 },
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
      marginTop: 6,
      marginBottom: 16,
    },
    loginRow: {
      textAlign: 'center',
      fontSize: 12,
      color: t.textSecondary,
    },
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
    passWrap: { position: 'relative' },
    eyeBtn: {
      position: 'absolute',
      right: 10,
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 4,
      display: 'flex',
      alignItems: 'center',
      color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.35)',
    },
    mascotWrap: {
      flexShrink: 0,
      width: 380,
      height: 380,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
    },
  };
};

export default Register;
