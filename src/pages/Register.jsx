import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MascotaGif from '../assets/aibert-logo-sin-negro-corregido.gif';
import { getBaseStyles, ErrorIcon } from '../styles/theme';

const Register = ({ theme = 'light', onToggleTheme }) => {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    carrera: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const carreras = [
    'Ing. Sistemas', 'Ing. Industrial', 'Ing. Civil',
    'Ing. Electrónica', 'Administración', 'Contaduría',
    'Derecho', 'Medicina', 'Psicología', 'Arquitectura',
  ];

  const validate = () => {
    const newErrors = {};
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!form.email || !emailRx.test(form.email)) newErrors.email = 'Correo inválido';
    if (!form.carrera) newErrors.carrera = 'Selecciona una carrera';
    if (!form.password || form.password.length < 8) newErrors.password = 'Mínimo 8 caracteres requeridos';
    if (!form.confirmPassword) newErrors.confirmPassword = 'Confirma tu contraseña';
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
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
      maxWidth: 960,
      flexWrap: 'wrap',
    },
    card: {
      ...b.card,
      padding: '36px 36px 28px',
      width: '100%',
      maxWidth: 380,
      flexShrink: 0,
    },
    title: { ...b.title, fontSize: 26, lineHeight: 1.2, marginBottom: 6 },
    subtitle: {
      fontSize: 13,
      color: isDark ? 'rgba(255,255,255,0.70)' : 'rgba(0,0,0,0.65)',
      fontWeight: 400,
      marginBottom: 24,
    },
    field: { marginBottom: 14 },
    select: {
      appearance: 'none',
      WebkitAppearance: 'none',
      cursor: 'pointer',
      paddingRight: 32,
    },
    btn: { ...b.btn, marginTop: 6, marginBottom: 16 },
    loginRow: {
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

  const Field = ({ label, field, type = 'text', placeholder }) => (
    <div style={s.field}>
      <label style={s.label}>{label}</label>
      <input
        style={{ ...s.input, ...(errors[field] ? s.inputError : {}) }}
        type={type}
        placeholder={placeholder}
        value={form[field]}
        onChange={e => handleChange(field, e.target.value)}
        onBlur={() => {
          if (field === 'email') {
            const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (form.email && !emailRx.test(form.email))
              setErrors(prev => ({ ...prev, email: 'Correo inválido' }));
          }
          if (field === 'confirmPassword' && form.confirmPassword && form.password !== form.confirmPassword)
            setErrors(prev => ({ ...prev, confirmPassword: 'Las contraseñas no coinciden' }));
        }}
      />
      {errors[field] && (
        <div style={s.errorRow}>
          <ErrorIcon />
          <span>{errors[field]}</span>
        </div>
      )}
    </div>
  );

  return (
    <div style={s.root}>
      <div style={s.grid} />

      <button style={s.themeBtn} onClick={onToggleTheme}>
        <span style={{ fontSize: 16 }}>{isDark ? '☀️' : '🌙'}</span>
        <span style={{ fontSize: 13 }}>{isDark ? 'Modo claro' : 'Modo oscuro'}</span>
      </button>

      <div style={s.page}>
        <div style={s.mascotWrap}>
          <img src={MascotaGif} alt="AI.BERT mascota" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>

        <div style={s.card}>
          <h1 style={s.title}>Crea tu cuenta</h1>
          <p style={s.subtitle}>¡Únete y comienza a organizar tu éxito!</p>

          <Field label="Nombre Completo" field="nombre" placeholder="Isaac Burgos" />
          <Field label="Correo Institucional" field="email" type="email" placeholder="estudiante@mail.escuelang.edu.co" />

          <div style={s.field}>
            <label style={s.label}>Carrera</label>
            <div style={{ position: 'relative' }}>
              <select
                style={{ ...s.input, ...s.select, ...(errors.carrera ? s.inputError : {}) }}
                value={form.carrera}
                onChange={e => handleChange('carrera', e.target.value)}
              >
                <option value="" disabled>Selecciona tu carrera</option>
                {carreras.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <path d="M3 5l4 4 4-4" stroke={isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.40)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            {errors.carrera && (
              <div style={s.errorRow}>
                <ErrorIcon />
                <span>{errors.carrera}</span>
              </div>
            )}
          </div>

          <Field label="Contraseña" field="password" type="password" placeholder="Mínimo 8 caracteres" />
          <Field label="Confirmar Contraseña" field="confirmPassword" type="password" placeholder="Vuelve a ingresar la contraseña" />

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
      </div>
    </div>
  );
};

export default Register;