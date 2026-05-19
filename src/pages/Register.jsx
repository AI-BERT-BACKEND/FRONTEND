import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MascotaGif from '../assets/aibert-logo-sin-negro-corregido.gif';
import ErrorIcon from '../components/ErrorIcon';
import GridBackground from '../components/GridBackground';

const Register = ({ theme = 'light', onToggleTheme }) => {
  const [form, setForm] = useState({ nombre: '', email: '', carrera: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const carreras = ['Ing. Sistemas','Ing. Industrial','Ing. Civil','Ing. Electrónica','Administración','Contaduría','Derecho','Medicina','Psicología','Arquitectura'];

  const validate = () => {
    const e = {};
    const rx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido';
    if (!form.email || !rx.test(form.email)) e.email = 'Correo inválido';
    if (!form.carrera) e.carrera = 'Selecciona una carrera';
    if (!form.password || form.password.length < 8) e.password = 'Mínimo 8 caracteres requeridos';
    if (!form.confirmPassword) e.confirmPassword = 'Confirma tu contraseña';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Las contraseñas no coinciden';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field, value) => {
    setForm(p => ({ ...p, [field]: value }));
    if (errors[field]) setErrors(p => ({ ...p, [field]: '' }));
  };

  const handleSubmit = () => { if (validate()) navigate('/verify-email'); };

  const s = getStyles(isDark);

  const Field = ({ label, field, type = 'text', placeholder }) => (
    <div style={s.field}>
      <label style={s.label}>{label}</label>
      <input
        style={{ ...s.input, ...(errors[field] ? s.inputError : {}) }}
        type={type} placeholder={placeholder} value={form[field]}
        onChange={e => handleChange(field, e.target.value)}
        onBlur={() => {
          if (field === 'email') { const rx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; if (form.email && !rx.test(form.email)) setErrors(p => ({ ...p, email: 'Correo inválido' })); }
          if (field === 'confirmPassword' && form.confirmPassword && form.password !== form.confirmPassword) setErrors(p => ({ ...p, confirmPassword: 'Las contraseñas no coinciden' }));
        }}
      />
      {errors[field] && <div style={s.errorRow}><ErrorIcon /><span>{errors[field]}</span></div>}
    </div>
  );

  return (
    <div style={s.root}>
      {/* ── Componente reutilizable de fondo ── */}
      <GridBackground isDark={isDark} />

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
              <select style={{ ...s.input, ...s.select, ...(errors.carrera ? s.inputError : {}) }}
                value={form.carrera} onChange={e => handleChange('carrera', e.target.value)}>
                <option value="" disabled>Selecciona tu carrera</option>
                {carreras.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <path d="M3 5l4 4 4-4" stroke={isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.40)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            {errors.carrera && <div style={s.errorRow}><ErrorIcon /><span>{errors.carrera}</span></div>}
          </div>

          <Field label="Contraseña" field="password" type="password" placeholder="Mínimo 8 caracteres" />
          <Field label="Confirmar Contraseña" field="confirmPassword" type="password" placeholder="Vuelve a ingresar la contraseña" />

          <button style={s.btn} onClick={handleSubmit}>Registrarte</button>

          <p style={s.loginRow}>
            ¿Ya tienes cuenta?{' '}
            <button style={s.link} onClick={() => navigate('/login')}>Inicia sesión</button>
          </p>
        </div>
      </div>
    </div>
  );
};

const getStyles = (isDark) => ({
  root: {
    position: 'relative', minHeight: '100vh',
    backgroundColor: isDark ? '#050208' : '#FDF2EB',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', fontFamily: "'Poppins', sans-serif",
  },
  themeBtn: {
    position: 'fixed', top: 20, right: 24, zIndex: 100,
    background: isDark ? '#171717' : '#FEFAF9',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(220,193,181,0.30)'}`,
    borderRadius: 50, padding: '6px 14px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 8,
    fontFamily: "'Poppins', sans-serif", color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
  },
  page: {
    position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: 56, padding: '32px 24px', width: '100%', maxWidth: 960, flexWrap: 'wrap',
  },
  card: {
    background: isDark ? '#171717' : '#FEFAF9',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(220,193,181,0.30)'}`,
    borderRadius: 20, padding: '36px 36px 28px', width: '100%', maxWidth: 380,
    boxShadow: isDark
      ? '0 0 0 1px rgba(196,16,122,0.35), 0 8px 48px rgba(196,16,122,0.22), 0 2px 16px rgba(0,0,0,0.60)'
      : '0 8px 40px rgba(253,214,189,0.60), 0 2px 12px rgba(196,16,122,0.08)',
    flexShrink: 0,
  },
  title: {
    fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 26, fontWeight: 800,
    background: isDark ? 'linear-gradient(90deg, #FF5B2E, #C4107A)' : 'linear-gradient(90deg, #FF8430, #F7306D)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
    lineHeight: 1.2, marginBottom: 6,
  },
  subtitle: { fontSize: 13, color: isDark ? 'rgba(255,255,255,0.70)' : 'rgba(0,0,0,0.65)', fontWeight: 400, marginBottom: 24 },
  field: { marginBottom: 14 },
  label: {
    display: 'block', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
    color: isDark ? 'rgba(255,255,255,0.60)' : 'rgba(0,0,0,0.55)', marginBottom: 6,
  },
  input: {
    width: '100%', background: isDark ? 'rgba(255,255,255,0.06)' : '#F5F5F8',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#E0E0E8'}`,
    borderRadius: 10, padding: '10px 14px', fontFamily: "'Poppins', sans-serif",
    fontSize: 13, color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)', outline: 'none',
    transition: 'border-color 0.2s', boxSizing: 'border-box',
  },
  select: { appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer', paddingRight: 32 },
  inputError: { borderColor: '#F00707', boxShadow: '0 0 0 3px rgba(240,7,7,0.12)' },
  errorRow: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: '#F00707', marginTop: 5, fontWeight: 500 },
  btn: {
    width: '100%', padding: 13, border: 'none', borderRadius: 10,
    background: isDark ? 'linear-gradient(90deg, #C4107A, #FF5B2E)' : 'linear-gradient(90deg, #FF8430, #F7306D)',
    color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14,
    fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer', marginTop: 6, marginBottom: 16,
  },
  loginRow: { textAlign: 'center', fontSize: 12, color: isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.45)' },
  link: {
    fontSize: 12, color: isDark ? '#FF5B2E' : '#F7306D', fontWeight: 600,
    cursor: 'pointer', background: 'none', border: 'none', padding: 0, fontFamily: "'Poppins', sans-serif",
  },
  mascotWrap: { flexShrink: 0, width: 300, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' },
});

export default Register;