import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/Layout/AppLayout';
import ErrorMsg from '../components/ErrorMsg';
import { useTheme } from '../context/ThemeContext';
import { createStyles } from '../theme/createStyles';
import api from '../services/api';

const Settings = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordSaved, setPasswordSaved] = useState(false);

  const [privacy, setPrivacy] = useState({
    visibilidad: 'Solo amigos',
    compartirDisponibilidad: true,
    mostrarEstadisticas: false,
  });

  const validatePasswords = () => {
    const e = {};
    if (!passwords.current) e.current = 'Ingresa tu contraseña actual';
    if (!passwords.new || passwords.new.length < 8) e.new = 'Mínimo 8 caracteres';
    if (!passwords.confirm) e.confirm = 'Confirma tu nueva contraseña';
    else if (passwords.new !== passwords.confirm) e.confirm = 'Las contraseñas no coinciden';
    setPasswordErrors(e);
    return Object.keys(e).length === 0;
  };

  const [passwordError, setPasswordError] = useState('');

  const handleSavePassword = async () => {
    if (validatePasswords()) {
      try {
        setPasswordError('');
        await api.put('/api/auth/change-password', {
          currentPassword: passwords.current,
          newPassword: passwords.new,
        });
        setPasswordSaved(true);
        setPasswords({ current: '', new: '', confirm: '' });
        setTimeout(() => setPasswordSaved(false), 3000);
      } catch (err) {
        setPasswordError(err.response?.data?.message || 'Error al cambiar la contraseña');
      }
    }
  };

  const s = getStyles(isDark);

  const Toggle = ({ value, onChange }) => (
    <div style={{ ...s.toggle, background: value ? (isDark ? '#C4107A' : '#FF8430') : (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)') }}
      onClick={() => onChange(!value)}>
      <div style={{ ...s.toggleThumb, transform: value ? 'translateX(20px)' : 'translateX(2px)' }} />
    </div>
  );

  return (
    <AppLayout>
      <div style={s.pageWrapper}>
        <h1 style={s.pageTitle}>Configuración</h1>

        {/* PRIVACIDAD */}
        <div style={s.section}>
          <div style={s.sectionHeader}>
            <span style={s.sectionIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke={isDark ? '#FF5B2E' : '#FF8430'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </span>
            <span style={s.sectionTitle}>Privacidad</span>
          </div>

          <div style={s.settingRow}>
            <div style={s.settingInfo}>
              <div style={s.settingLabel}>Visibilidad del perfil</div>
              <div style={s.settingDesc}>Controla quién puede ver tus publicaciones e historial.</div>
            </div>
            <div style={s.visibilidadSelector}>
              {['Solo amigos', 'Todos', 'Nadie'].map((opt) => (
                <button
                  key={opt}
                  style={{ ...s.visibilidadBtn, ...(privacy.visibilidad === opt ? s.visibilidadBtnActive : {}) }}
                  onClick={() => setPrivacy((p) => ({ ...p, visibilidad: opt }))}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div style={s.divider} />

          <div style={s.settingRow}>
            <div style={s.settingInfo}>
              <div style={s.settingLabel}>Compartir disponibilidad</div>
              <div style={s.settingDesc}>Permite que otros vean cuando estás conectado.</div>
            </div>
            <Toggle value={privacy.compartirDisponibilidad} onChange={(v) => setPrivacy((p) => ({ ...p, compartirDisponibilidad: v }))} />
          </div>

          <div style={s.divider} />

          <div style={s.settingRow}>
            <div style={s.settingInfo}>
              <div style={s.settingLabel}>Mostrar estadísticas a amigos</div>
              <div style={s.settingDesc}>Comparte tus logros y tiempo de estudio con tu red.</div>
            </div>
            <Toggle value={privacy.mostrarEstadisticas} onChange={(v) => setPrivacy((p) => ({ ...p, mostrarEstadisticas: v }))} />
          </div>

          <div style={s.divider} />

          <div style={s.settingRow}>
            <div style={s.settingInfo}>
              <div style={s.settingLabel}>Datos y actividad</div>
              <div style={s.settingDesc}>Descarga o gestiona todo tu historial de aprendizaje.</div>
            </div>
            <button style={s.linkBtn} onClick={() => navigate('/estadisticas')}>Ver mis datos →</button>
          </div>
        </div>

        {/* CONTRASEÑA */}
        <div style={s.section}>
          <div style={s.sectionHeader}>
            <span style={s.sectionIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke={isDark ? '#FF5B2E' : '#FF8430'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </span>
            <span style={s.sectionTitle}>Contraseña</span>
          </div>

          <div style={s.subsectionTitle}>Cambiar contraseña</div>
          <div style={s.subsectionDesc}>Actualiza tu contraseña regularmente para mayor seguridad.</div>

          {passwordError && (
            <div style={s.errorMsg}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="#EF4444" strokeWidth="1.3"/>
                <path d="M5 5l4 4M9 5l-4 4" stroke="#EF4444" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              {passwordError}
            </div>
          )}
          {passwordSaved && (
            <div style={s.successMsg}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="#22C55E" strokeWidth="1.3"/>
                <path d="M4.5 7l2 2 3-3" stroke="#22C55E" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Contraseña actualizada correctamente
            </div>
          )}

          <div style={s.passwordFields}>
            <div style={s.fieldGroup}>
              <input
                style={{ ...s.input, ...(passwordErrors.current ? s.inputError : {}) }}
                type="password"
                placeholder="Contraseña actual"
                value={passwords.current}
                onChange={(e) => {
                  setPasswords((p) => ({ ...p, current: e.target.value }));
                  if (passwordErrors.current) setPasswordErrors((p) => ({ ...p, current: '' }));
                }}
              />
              <ErrorMsg message={passwordErrors.current} />
            </div>
            <div style={s.fieldGroup}>
              <input
                style={{ ...s.input, ...(passwordErrors.new ? s.inputError : {}) }}
                type="password"
                placeholder="Nueva contraseña"
                value={passwords.new}
                onChange={(e) => {
                  setPasswords((p) => ({ ...p, new: e.target.value }));
                  if (passwordErrors.new) setPasswordErrors((p) => ({ ...p, new: '' }));
                }}
              />
              <ErrorMsg message={passwordErrors.new} />
            </div>
            <div style={s.fieldGroup}>
              <input
                style={{ ...s.input, ...(passwordErrors.confirm ? s.inputError : {}) }}
                type="password"
                placeholder="Confirmar nueva contraseña"
                value={passwords.confirm}
                onChange={(e) => {
                  setPasswords((p) => ({ ...p, confirm: e.target.value }));
                  if (passwordErrors.confirm) setPasswordErrors((p) => ({ ...p, confirm: '' }));
                }}
              />
              <ErrorMsg message={passwordErrors.confirm} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button style={s.saveBtn} onClick={handleSavePassword}>
                Guardar contraseña
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

const getStyles = (isDark) => {
  const t = createStyles(isDark);
  return {
    pageWrapper: {
      maxWidth: 680,
      margin: '0 auto',
      width: '100%',
    },
    pageTitle: {
      fontFamily: t.fontPrimary,
      fontSize: 32,
      fontWeight: 800,
      backgroundImage: isDark
        ? 'linear-gradient(90deg, #FF5B2E, #C4107A)'
        : 'linear-gradient(90deg, #FF8430, #F7306D)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      width: 'fit-content',
      margin: '0 0 28px 0',
    },
    section: {
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 16,
      padding: '20px 24px',
      marginBottom: 16,
      boxShadow: t.cardShadow,
    },
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 18,
      paddingBottom: 14,
      borderBottom: `1px solid ${t.cardBorder}`,
    },
    sectionIcon: { display: 'flex', alignItems: 'center' },
    sectionTitle: {
      fontFamily: t.fontPrimary,
      fontSize: 15,
      fontWeight: 700,
      color: t.textPrimary,
    },
    subsectionTitle: {
      fontSize: 14,
      fontWeight: 600,
      color: t.textPrimary,
      marginBottom: 4,
      fontFamily: t.fontSecondary,
    },
    subsectionDesc: {
      fontSize: 12,
      color: t.textSecondary,
      marginBottom: 16,
    },
    passwordFields: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    },
    fieldGroup: { display: 'flex', flexDirection: 'column' },
    input: {
      width: '100%',
      background: t.inputBg,
      border: `1px solid ${t.inputBorder}`,
      borderRadius: 10,
      padding: '11px 14px',
      fontFamily: t.fontSecondary,
      fontSize: 13,
      color: t.textPrimary,
      outline: 'none',
      boxSizing: 'border-box',
      transition: 'border-color 0.2s',
    },
    inputError: { borderColor: t.error, boxShadow: `0 0 0 2px ${t.error}1a` },
    errorMsg: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 12,
      color: '#EF4444',
      background: 'rgba(239,68,68,0.10)',
      border: '1px solid rgba(239,68,68,0.25)',
      borderRadius: 8,
      padding: '8px 12px',
      marginBottom: 12,
    },
    successMsg: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 12,
      color: '#22C55E',
      background: 'rgba(34,197,94,0.10)',
      border: '1px solid rgba(34,197,94,0.25)',
      borderRadius: 8,
      padding: '8px 12px',
      marginBottom: 12,
    },
    saveBtn: {
      background: t.primaryGradient,
      border: 'none',
      borderRadius: 10,
      padding: '10px 24px',
      color: '#fff',
      fontFamily: t.fontPrimary,
      fontSize: 13,
      fontWeight: 700,
      cursor: 'pointer',
      letterSpacing: '0.03em',
    },
    settingRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      padding: '6px 0',
    },
    settingInfo: { flex: 1 },
    settingLabel: {
      fontSize: 13,
      fontWeight: 600,
      color: t.textPrimary,
      marginBottom: 3,
      fontFamily: t.fontSecondary,
    },
    settingDesc: {
      fontSize: 12,
      color: t.textSecondary,
      lineHeight: 1.4,
    },
    divider: {
      height: 1,
      background: t.cardBorder,
      margin: '10px 0',
    },
    toggle: {
      width: 44,
      height: 24,
      borderRadius: 12,
      cursor: 'pointer',
      position: 'relative',
      transition: 'background 0.25s',
      flexShrink: 0,
    },
    toggleThumb: {
      position: 'absolute',
      top: 2,
      width: 20,
      height: 20,
      borderRadius: '50%',
      background: '#fff',
      transition: 'transform 0.25s',
      boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
    },
    visibilidadSelector: {
      display: 'flex',
      gap: 6,
      flexShrink: 0,
    },
    visibilidadBtn: {
      padding: '5px 12px',
      borderRadius: 20,
      border: `1px solid ${t.inputBorder}`,
      background: 'transparent',
      cursor: 'pointer',
      fontFamily: t.fontSecondary,
      fontSize: 11,
      fontWeight: 500,
      color: t.textSecondary,
      transition: 'all 0.2s',
    },
    visibilidadBtnActive: {
      background: t.primaryGradient,
      border: 'none',
      color: '#fff',
      fontWeight: 600,
    },
    linkBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontFamily: t.fontSecondary,
      fontSize: 12,
      fontWeight: 600,
      color: isDark ? '#FF5B2E' : '#F7306D',
      padding: 0,
      whiteSpace: 'nowrap',
      flexShrink: 0,
    },
  };
};

export default Settings;