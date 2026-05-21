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

  const handleSubmit = () => {
    if (validate()) navigate('/verify-email');
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

          <Field
            label="Contraseña"
            field="password"
            type="password"
            placeholder="Mínimo 8 caracteres"
            value={form.password}
            error={errors.password}
            onChange={handleChange}
            s={s}
          />
          <Field
            label="Confirmar Contraseña"
            field="confirmPassword"
            type="password"
            placeholder="Vuelve a ingresar la contraseña"
            value={form.confirmPassword}
            error={errors.confirmPassword}
            onChange={handleChange}
            onBlur={() => {
              if (form.confirmPassword) {
                const error = validateConfirmPassword(form.password, form.confirmPassword);
                if (error) setErrors((p) => ({ ...p, confirmPassword: error }));
              }
            }}
            s={s}
          />

          <button style={s.btn} onClick={handleSubmit}>
            Registrarte
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
      maxWidth: 1200,
      flexWrap: 'wrap',
    },
    card: {
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: t.xxl,
      padding: 'clamp(28px, 4vh, 40px) clamp(28px, 4vw, 42px)',
      width: '100%',
      maxWidth: 480,
      boxShadow: t.cardShadow,
      flexShrink: 0,
    },
    title: {
      fontFamily: t.fontPrimary,
      fontSize: 'clamp(24px, 2.2vw, 32px)',
      fontWeight: 800,
      backgroundImage: t.primaryGradient,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      width: '100%',
      whiteSpace: 'nowrap',
      lineHeight: 1.2,
      marginBottom: 6,
    },
    subtitle: {
      fontSize: 'clamp(13px, 1vw, 15px)',
      color: t.textSecondary,
      fontWeight: 400,
      marginBottom: 24,
    },
    field: { marginBottom: 14 },
    label: {
      display: 'block',
      fontSize: 'clamp(10px, 0.8vw, 11px)',
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
      padding: '11px 16px',
      fontFamily: t.fontSecondary,
      fontSize: 'clamp(13px, 1vw, 15px)',
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
      marginTop: 10,
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
    mascotWrap: {
      flexShrink: 0,
      width: 'clamp(250px, 30vw, 450px)',
      height: 'clamp(250px, 30vw, 450px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };
};

export default Register;
