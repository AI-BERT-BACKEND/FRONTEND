import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/Layout/AppLayout';
import ErrorMsg from '../components/ErrorMsg';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { validateEmail, validateRequired } from '../utils/validators';
import { createStyles } from '../theme/createStyles';

const Spinner = () => (
  <>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    <svg style={{ animation: 'spin 0.8s linear infinite', flexShrink: 0 }} width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  </>
);

const StudentProfile = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [form, setForm] = useState({ nombre: '', username: '', email: '', foto: null });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showDesactivarConfirm, setShowDesactivarConfirm] = useState(false);
  const [showEliminarConfirm, setShowEliminarConfirm] = useState(false);

  const validate = () => {
    const newErrors = {
      nombre: validateRequired(form.nombre, 'El nombre'),
      username: validateRequired(form.username, 'El nombre de usuario'),
      email: validateEmail(form.email),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((msg) => msg !== '');
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setForm((prev) => ({ ...prev, foto: url }));
    }
  };

  const s = getStyles(isDark);

  return (
    <AppLayout>
      {/* Wrapper centrado */}
      <div style={s.pageWrapper}>
        <button style={s.volverBtn} onClick={() => navigate(-1)}>← Volver</button>
        <h1 style={s.pageTitle}>Perfil de estudiante</h1>

        <div style={s.card}>
          <div style={s.fotoSection}>
            <div style={s.fotoCircle} onClick={() => fileRef.current?.click()}>
              {form.foto ? (
                <img
                  src={form.foto}
                  alt="Perfil"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                />
              ) : (
                <div style={s.fotoPlaceholder} />
              )}
              <div style={s.fotoBadge}>
                <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1l1.5 1.5H11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h2.5L7 1z"
                    stroke="#fff" strokeWidth="1.2" fill="none" strokeLinejoin="round" />
                  <circle cx="7" cy="7" r="1.8" stroke="#fff" strokeWidth="1.2" />
                </svg>
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*"
              style={{ display: 'none' }} onChange={handleFotoChange} />
            <span style={s.fotoLabel}>FOTO DE PERFIL</span>
          </div>

          <div style={s.fields}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Nombre completo</label>
              <input
                style={{ ...s.input, ...(errors.nombre ? s.inputError : {}) }}
                value={form.nombre}
                placeholder="Ingresa tu nombre completo"
                onChange={(e) => {
                  setForm((p) => ({ ...p, nombre: e.target.value }));
                  if (errors.nombre) setErrors((p) => ({ ...p, nombre: '' }));
                }}
              />
              <ErrorMsg message={errors.nombre} />
            </div>

            <div style={s.fieldGroup}>
              <label style={s.label}>Nombre de usuario</label>
              <input
                style={{ ...s.input, ...(errors.username ? s.inputError : {}) }}
                value={form.username}
                placeholder="Ingresa tu nombre de usuario"
                onChange={(e) => {
                  setForm((p) => ({ ...p, username: e.target.value }));
                  if (errors.username) setErrors((p) => ({ ...p, username: '' }));
                }}
              />
              <ErrorMsg message={errors.username} />
            </div>

            <div style={s.fieldGroup}>
              <label style={s.label}>Correo electrónico</label>
              <input
                style={{ ...s.input, ...(errors.email ? s.inputError : {}) }}
                type="email"
                value={form.email}
                placeholder="tucorreo@academia.edu"
                onChange={(e) => {
                  setForm((p) => ({ ...p, email: e.target.value }));
                  if (errors.email) setErrors((p) => ({ ...p, email: '' }));
                }}
              />
              <ErrorMsg message={errors.email} />
            </div>

            <div style={s.dangerZone}>
              <div style={s.dangerHeader}>
                <AlertTriangle size={15} color={isDark ? '#F7306D' : '#F00707'} />
                <span style={s.dangerTitle}>Zona de Peligro</span>
              </div>
              <div style={s.dangerRow}>
                <div style={s.dangerInfo}>
                  <span style={s.dangerItemTitle}>Desactivar cuenta temporalmente</span>
                  <span style={s.dangerItemDesc}>Oculta tu perfil hasta que decidas volver.</span>
                </div>
                <button style={s.dangerBtnOutline} onClick={() => setShowDesactivarConfirm(true)}>
                  Desactivar cuenta
                </button>
              </div>
              <div style={{ ...s.dangerRow, marginTop: 10 }}>
                <div style={s.dangerInfo}>
                  <span style={s.dangerItemTitle}>Eliminar cuenta permanentemente</span>
                  <span style={s.dangerItemDesc}>
                    Una acción borrará todos tus datos de forma irreversible.
                  </span>
                </div>
                <button style={s.dangerBtnFill} onClick={() => setShowEliminarConfirm(true)}>
                  <Trash2 size={14} color="#fff" /> Eliminar mi cuenta
                </button>
              </div>
            </div>

            <div style={s.actionRow}>
              <button style={s.cancelBtn} onClick={() => navigate('/dashboard')}>Cancelar</button>
              <button style={{ ...s.saveBtn, ...(loading ? { opacity: 0.7, cursor: 'not-allowed' } : {}) }} onClick={handleSave} disabled={loading}>
                {loading ? <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Spinner /> Guardando...</span> : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Desactivar */}
      {showDesactivarConfirm && (
        <div style={s.modalOverlay} onClick={() => setShowDesactivarConfirm(false)} role="presentation">
          <div 
            style={s.modalCard} 
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="desactivar-title"
          >
            <div style={s.modalHeader}>
              <AlertTriangle size={20} color="#FF8430" />
              <span id="desactivar-title" style={s.modalTitle}>Desactivar cuenta</span>
            </div>
            <p style={s.modalText}>
              Tu perfil quedará oculto temporalmente. Podrás reactivarlo cuando quieras iniciando sesión nuevamente.
            </p>
            <div style={s.modalFooter}>
              <button style={s.modalCancelBtn} onClick={() => setShowDesactivarConfirm(false)}>Cancelar</button>
              <button style={s.dangerBtnOutline} onClick={() => { setShowDesactivarConfirm(false); navigate('/login'); }}>
                Sí, desactivar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {showEliminarConfirm && (
        <div style={s.modalOverlay} onClick={() => setShowEliminarConfirm(false)} role="presentation">
          <div 
            style={s.modalCard} 
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="eliminar-title"
          >
            <div style={s.modalHeader}>
              <Trash2 size={20} color="#F00707" />
              <span id="eliminar-title" style={{ ...s.modalTitle, color: '#F00707', WebkitTextFillColor: '#F00707', background: 'none' }}>
                Eliminar cuenta
              </span>
            </div>
            <p style={s.modalText}>
              Esta acción es <strong>irreversible</strong>. Se borrarán todos tus datos, materias, tareas y progreso de forma permanente.
            </p>
            <div style={s.modalFooter}>
              <button style={s.modalCancelBtn} onClick={() => setShowEliminarConfirm(false)}>Cancelar</button>
              <button style={{ ...s.dangerBtnFill, padding: '9px 20px' }}
                onClick={() => { setShowEliminarConfirm(false); navigate('/login'); }}>
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

const getStyles = (isDark) => {
  const t = createStyles(isDark);
  return {
    pageWrapper: {
      width: '100%',
      maxWidth: 620,
      margin: '0 auto',
    },
    volverBtn: {
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: 'none', border: 'none', cursor: 'pointer',
      fontSize: 13, fontWeight: 600,
      color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.50)',
      fontFamily: t.fontSecondary, padding: '4px 0', marginBottom: 12,
    },
    pageTitle: {
      fontFamily: t.fontPrimary,
      fontSize: 28,
      fontWeight: 800,
      color: isDark ? '#FF5B2E' : '#FF8430',
      margin: '0 0 24px 0',
    },
    card: {
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 16,
      padding: '32px 40px',
      width: '100%',
      boxShadow: t.cardShadow,
    },
    fotoSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: 28,
      gap: 10,
    },
    fotoCircle: {
      width: 120,
      height: 120,
      borderRadius: '50%',
      border: `3px solid ${isDark ? 'rgba(196,16,122,0.55)' : 'rgba(247,48,109,0.40)'}`,
      background: isDark ? 'rgba(196,16,122,0.08)' : 'rgba(255,132,48,0.06)',
      cursor: 'pointer',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: isDark
        ? '0 0 0 4px rgba(196,16,122,0.12)'
        : '0 0 0 4px rgba(247,48,109,0.08)',
      transition: 'box-shadow 0.2s',
    },
    fotoPlaceholder: {
      width: 80,
      height: 80,
      borderRadius: '50%',
      background: t.inputBg,
    },
    fotoBadge: {
      position: 'absolute',
      bottom: 4,
      right: 4,
      width: 28,
      height: 28,
      borderRadius: '50%',
      background: t.primaryGradient,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: `2px solid ${t.cardBg}`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
    },
    fotoLabel: {
      fontSize: 10,
      letterSpacing: '0.10em',
      textTransform: 'uppercase',
      color: t.textSecondary,
      fontWeight: 600,
    },
    fields: { display: 'flex', flexDirection: 'column', gap: 18 },
    fieldGroup: { display: 'flex', flexDirection: 'column' },
    label: {
      fontSize: 13,
      fontWeight: 600,
      color: t.textPrimary,
      marginBottom: 7,
    },
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
    dangerZone: {
      background: isDark ? 'rgba(240,7,7,0.05)' : 'rgba(240,7,7,0.04)',
      border: `1px solid ${isDark ? 'rgba(240,7,7,0.20)' : 'rgba(240,7,7,0.15)'}`,
      borderRadius: 12,
      padding: '14px 18px',
      marginTop: 4,
    },
    dangerHeader: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 },
    dangerTitle: { fontSize: 12, fontWeight: 700, color: t.textPrimary },
    dangerRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
    dangerInfo: { display: 'flex', flexDirection: 'column', gap: 2, flex: 1 },
    dangerItemTitle: { fontSize: 12, fontWeight: 600, color: t.textPrimary },
    dangerItemDesc: { fontSize: 11, color: t.textSecondary },
    dangerBtnOutline: {
      padding: '7px 14px',
      borderRadius: 8,
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.20)' : 'rgba(0,0,0,0.20)'}`,
      background: 'transparent',
      cursor: 'pointer',
      fontFamily: t.fontSecondary,
      fontSize: 11,
      fontWeight: 600,
      color: t.textPrimary,
      whiteSpace: 'nowrap',
      flexShrink: 0,
      minWidth: 140,
      textAlign: 'center',
    },
    dangerBtnFill: {
      padding: '7px 14px',
      borderRadius: 8,
      border: '1px solid rgba(220,38,38,0.40)',
      background: '#DC2626',
      cursor: 'pointer',
      fontFamily: t.fontSecondary,
      fontSize: 11,
      fontWeight: 600,
      color: '#fff',
      whiteSpace: 'nowrap',
      flexShrink: 0,
      minWidth: 140,
      textAlign: 'center',
    },
    actionRow: { display: 'flex', justifyContent: 'center', gap: 12, marginTop: 8 },
    cancelBtn: {
      flex: 1,
      maxWidth: 180,
      padding: '10px 24px',
      borderRadius: 10,
      border: `1px solid ${t.inputBorder}`,
      background: 'transparent',
      cursor: 'pointer',
      fontFamily: t.fontSecondary,
      fontSize: 13,
      fontWeight: 500,
      color: t.textSecondary,
    },
    saveBtn: {
      flex: 1,
      maxWidth: 180,
      padding: '10px 24px',
      borderRadius: 10,
      border: 'none',
      background: t.primaryGradient,
      cursor: 'pointer',
      fontFamily: t.fontPrimary,
      fontSize: 13,
      fontWeight: 700,
      color: '#fff',
      letterSpacing: '0.03em',
    },
    modalOverlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.65)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
      backdropFilter: 'blur(2px)',
    },
    modalCard: {
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 16,
      width: '100%',
      maxWidth: 380,
      margin: '0 24px',
      padding: '24px',
      boxShadow: t.modalShadow,
    },
    modalHeader: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 },
    modalTitle: {
      fontFamily: t.fontPrimary,
      fontSize: 18,
      fontWeight: 700,
      backgroundImage: t.primaryGradient,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      width: 'fit-content',
    },
    modalText: { fontSize: 13, color: t.textSecondary, lineHeight: 1.6, marginBottom: 20 },
    modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: 10 },
    modalCancelBtn: {
      padding: '9px 18px',
      borderRadius: 8,
      border: `1px solid ${t.inputBorder}`,
      background: 'transparent',
      cursor: 'pointer',
      fontFamily: t.fontSecondary,
      fontSize: 13,
      fontWeight: 500,
      color: t.textSecondary,
    },
  };
};

export default StudentProfile;