import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppLayout from '../components/Layout/AppLayout';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { createStyles } from '../theme/createStyles';
import profileService from '../services/profileService';

const ADMIN_SECTIONS = [
  { label: 'Inicio',              path: '/admin/perfil' },
  { label: 'Gestión de usuarios', path: '/admin/usuarios' },
  { label: 'Estadísticas',        path: '/admin/estadisticas' },
  { label: 'Configuración',       path: '/admin/configuracion' },
];

const AdminNav = ({ isDark, t }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const s = navSt(isDark, t);
  return (
    <nav style={s.nav}>
      {ADMIN_SECTIONS.map((sec) => {
        const active = location.pathname === sec.path;
        return (
          <button key={sec.path} style={s.navItem(isDark, active)} onClick={() => navigate(sec.path)}>
            {sec.label}
          </button>
        );
      })}
    </nav>
  );
};

const AdminConfig = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const t = createStyles(isDark);
  const [form, setForm]       = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  const validate = () => {
    if (!form.currentPassword) return 'Ingresa tu contraseña actual.';
    if (form.newPassword.length < 8) return 'La nueva contraseña debe tener mínimo 8 caracteres.';
    if (form.newPassword !== form.confirmPassword) return 'Las contraseñas no coinciden.';
    return '';
  };

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await profileService.changePassword(user.id, {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess('Contraseña actualizada correctamente.');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e) {
      setError(e?.response?.data?.message ?? 'No se pudo actualizar la contraseña. Verifica tu contraseña actual.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setError('');
    setSuccess('');
  };

  const s = st(isDark, t);

  return (
    <AppLayout>
      <div style={s.pageWrapper}>
        <AdminNav isDark={isDark} t={t} />

        <div style={s.pageHeader}>
          <h1 style={s.pageTitle}>Configuración</h1>
          <p style={s.pageDesc}>Gestiona la seguridad de tu cuenta.</p>
        </div>

        <div style={s.card}>
          <h2 style={s.cardTitle(isDark)}>Cambiar contraseña</h2>
          <p style={s.cardDesc(isDark)}>
            Elige una contraseña segura con mínimo 8 caracteres.
          </p>

          {error   && <div style={s.errorBanner}>{error}</div>}
          {success && <div style={s.successBanner}>{success}</div>}

          <div style={s.fieldGroup}>
            <label style={s.fieldLabel(isDark)}>Contraseña actual</label>
            <input
              type="password"
              value={form.currentPassword}
              onChange={handleChange('currentPassword')}
              placeholder="••••••••"
              style={s.input(isDark)}
              autoComplete="current-password"
            />
          </div>

          <div style={s.fieldGroup}>
            <label style={s.fieldLabel(isDark)}>Nueva contraseña</label>
            <input
              type="password"
              value={form.newPassword}
              onChange={handleChange('newPassword')}
              placeholder="Mínimo 8 caracteres"
              style={s.input(isDark)}
              autoComplete="new-password"
            />
            {form.newPassword.length > 0 && form.newPassword.length < 8 && (
              <span style={s.fieldHint}>Mínimo 8 caracteres</span>
            )}
          </div>

          <div style={s.fieldGroup}>
            <label style={s.fieldLabel(isDark)}>Confirmar nueva contraseña</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={handleChange('confirmPassword')}
              placeholder="Repite la nueva contraseña"
              style={s.input(isDark)}
              autoComplete="new-password"
            />
            {form.confirmPassword.length > 0 && form.newPassword !== form.confirmPassword && (
              <span style={s.fieldHint}>Las contraseñas no coinciden</span>
            )}
          </div>

          <div style={s.actionRow}>
            <button style={s.cancelBtn(isDark)} onClick={handleCancel} disabled={loading}>
              Cancelar
            </button>
            <button style={s.saveBtn(isDark)} onClick={handleSubmit} disabled={loading}>
              {loading ? 'Actualizando…' : 'Actualizar contraseña'}
            </button>
          </div>
        </div>

      </div>
    </AppLayout>
  );
};

const navSt = (isDark, t) => ({
  nav: {
    display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 28, padding: '6px',
    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
    borderRadius: 14,
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'}`,
    width: 'fit-content',
  },
  navItem: (isDark, active) => ({
    padding: '8px 18px', borderRadius: 10, border: 'none',
    background: active ? (isDark ? 'linear-gradient(90deg,#FF5B2E,#C4107A)' : 'linear-gradient(90deg,#FF8430,#F7306D)') : 'transparent',
    color: active ? '#fff' : (isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.50)'),
    fontSize: 13, fontWeight: active ? 700 : 500, fontFamily: "'Poppins',sans-serif",
    cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
  }),
});

const st = (isDark, t) => ({
  pageWrapper: { width: '100%' },
  pageHeader: { marginBottom: 28 },
  pageTitle: {
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    fontSize: 'clamp(24px,4vw,34px)', fontWeight: 800,
    color: isDark ? '#FF5B2E' : '#FF8430', margin: '0 0 4px', letterSpacing: '-0.02em',
  },
  pageDesc: {
    fontSize: 13, color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.50)',
    fontFamily: "'Poppins',sans-serif", margin: 0,
  },
  card: {
    background: t.cardBg, border: `1px solid ${t.cardBorder}`,
    borderRadius: 20, padding: 'clamp(24px,3vw,36px)',
    boxShadow: t.cardShadow, maxWidth: 520,
  },
  cardTitle: (isDark) => ({
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    fontSize: 20, fontWeight: 800,
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.87)', margin: '0 0 6px',
  }),
  cardDesc: (isDark) => ({
    fontSize: 13, color: isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.45)',
    fontFamily: "'Poppins',sans-serif", margin: '0 0 24px', lineHeight: 1.5,
  }),
  errorBanner: {
    padding: '12px 16px', background: 'rgba(240,7,7,0.08)',
    border: '1px solid rgba(240,7,7,0.25)', borderRadius: 10,
    color: '#F00707', fontFamily: "'Poppins',sans-serif",
    fontSize: 13, marginBottom: 18,
  },
  successBanner: {
    padding: '12px 16px', background: 'rgba(34,197,94,0.08)',
    border: '1px solid rgba(34,197,94,0.25)', borderRadius: 10,
    color: '#22C55E', fontFamily: "'Poppins',sans-serif",
    fontSize: 13, marginBottom: 18,
  },
  fieldGroup: { marginBottom: 18 },
  fieldLabel: (isDark) => ({
    display: 'block', fontSize: 12, fontWeight: 600,
    color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.60)',
    fontFamily: "'Poppins',sans-serif", marginBottom: 6,
  }),
  input: (isDark) => ({
    width: '100%', boxSizing: 'border-box',
    padding: '11px 14px', borderRadius: 10,
    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.87)',
    fontFamily: "'Poppins',sans-serif", fontSize: 14,
    outline: 'none',
  }),
  fieldHint: {
    display: 'block', marginTop: 5,
    fontSize: 11, color: '#F00707',
    fontFamily: "'Poppins',sans-serif",
  },
  actionRow: {
    display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 28,
  },
  cancelBtn: (isDark) => ({
    padding: '10px 22px', borderRadius: 10,
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`,
    background: 'transparent',
    color: isDark ? 'rgba(255,255,255,0.60)' : 'rgba(0,0,0,0.55)',
    fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, fontWeight: 600,
    cursor: 'pointer',
  }),
  saveBtn: (isDark) => ({
    padding: '10px 22px', borderRadius: 10, border: 'none',
    background: isDark
      ? 'linear-gradient(90deg,#FF5B2E,#C4107A)'
      : 'linear-gradient(90deg,#FF8430,#F7306D)',
    color: '#fff', fontFamily: "'Plus Jakarta Sans',sans-serif",
    fontSize: 13, fontWeight: 700, cursor: 'pointer',
    boxShadow: isDark ? '0 4px 16px rgba(196,16,122,0.35)' : '0 4px 16px rgba(247,48,109,0.25)',
  }),
});

export default AdminConfig;
