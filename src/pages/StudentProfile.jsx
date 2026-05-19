import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const StudentProfile = ({ theme = 'light', onToggleTheme }) => {
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    nombre: '',
    username: '',
    email: '',
    foto: null,
  });

  const [errors, setErrors] = useState({});
  const [showDesactivarConfirm, setShowDesactivarConfirm] = useState(false);
  const [showEliminarConfirm, setShowEliminarConfirm] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!form.username.trim()) newErrors.username = 'El nombre de usuario es requerido';
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email || !emailRx.test(form.email)) newErrors.email = 'Correo inválido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      navigate('/dashboard');
    }
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setForm(prev => ({ ...prev, foto: url }));
    }
  };

  const s = getStyles(isDark);

  const ErrorMsg = ({ field }) => errors[field] ? (
    <div style={s.errorRow}>
      <svg width="11" height="11" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
        <circle cx="6.5" cy="6.5" r="6" stroke="#F00707" strokeWidth="1.2" />
        <path d="M6.5 3.5v3.2" stroke="#F00707" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="6.5" cy="9.2" r="0.7" fill="#F00707" />
      </svg>
      <span>{errors[field]}</span>
    </div>
  ) : null;

  return (
    <div style={s.root}>

      <Sidebar
        theme={theme}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(p => !p)}
      />

      <div style={s.main}>
        <div style={s.topbar}>
          <div />
          <div style={s.topbarRight}>
            <button style={s.themeBtn} onClick={onToggleTheme}>
              <span style={{ fontSize: 15 }}>{isDark ? '☀️' : '🌙'}</span>
              <span style={{ fontSize: 12 }}>{isDark ? 'Modo claro' : 'Modo oscuro'}</span>
            </button>
            <button style={s.iconBtn}>🔔</button>
            <button style={s.socialBtn}>👥 Social</button>
          </div>
        </div>

        <div style={s.scrollArea}>
          <div style={s.content}>
            <h1 style={s.pageTitle}>Perfil de estudiante</h1>

            <div style={s.card}>

              <div style={s.fotoSection}>
                <div style={s.fotoCircle} onClick={() => fileRef.current?.click()}>
                  {form.foto ? (
                    <img src={form.foto} alt="Perfil"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
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
                    onChange={e => {
                      setForm(prev => ({ ...prev, nombre: e.target.value }));
                      if (errors.nombre) setErrors(prev => ({ ...prev, nombre: '' }));
                    }}
                  />
                  <ErrorMsg field="nombre" />
                </div>

                <div style={s.fieldGroup}>
                  <label style={s.label}>Nombre de usuario</label>
                  <input
                    style={{ ...s.input, ...(errors.username ? s.inputError : {}) }}
                    value={form.username}
                    placeholder="Ingresa tu nombre de usuario"
                    onChange={e => {
                      setForm(prev => ({ ...prev, username: e.target.value }));
                      if (errors.username) setErrors(prev => ({ ...prev, username: '' }));
                    }}
                  />
                  <ErrorMsg field="username" />
                </div>

                <div style={s.fieldGroup}>
                  <label style={s.label}>Correo electrónico</label>
                  <input
                    style={{ ...s.input, ...(errors.email ? s.inputError : {}) }}
                    type="email"
                    value={form.email}
                    placeholder="tucorreo@academia.edu"
                    onChange={e => {
                      setForm(prev => ({ ...prev, email: e.target.value }));
                      if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                    }}
                  />
                  <ErrorMsg field="email" />
                </div>

                <div style={s.dangerZone}>
                  <div style={s.dangerHeader}>
                    <span style={{ fontSize: 14 }}>⚠️</span>
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
                      <span style={s.dangerItemDesc}>Una acción borrará todos tus datos de forma irreversible.</span>
                    </div>
                    <button style={s.dangerBtnFill} onClick={() => setShowEliminarConfirm(true)}>
                      🗑 Eliminar mi cuenta
                    </button>
                  </div>
                </div>

                <div style={s.actionRow}>
                  <button style={s.cancelBtn} onClick={() => navigate('/dashboard')}>
                    Cancelar
                  </button>
                  <button style={s.saveBtn} onClick={handleSave}>
                    Guardar cambios
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDesactivarConfirm && (
        <div style={s.modalOverlay} onClick={() => setShowDesactivarConfirm(false)}>
          <div style={s.modalCard} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <span style={{ fontSize: 20 }}>⚠️</span>
              <span style={s.modalTitle}>Desactivar cuenta</span>
            </div>
            <p style={s.modalText}>
              Tu perfil quedará oculto temporalmente. Podrás reactivarlo cuando quieras iniciando sesión nuevamente.
            </p>
            <div style={s.modalFooter}>
              <button style={s.modalCancelBtn} onClick={() => setShowDesactivarConfirm(false)}>
                Cancelar
              </button>
              <button style={s.dangerBtnOutline} onClick={() => { setShowDesactivarConfirm(false); navigate('/login'); }}>
                Sí, desactivar
              </button>
            </div>
          </div>
        </div>
      )}

      {showEliminarConfirm && (
        <div style={s.modalOverlay} onClick={() => setShowEliminarConfirm(false)}>
          <div style={s.modalCard} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <span style={{ fontSize: 20 }}>🗑</span>
              <span style={{ ...s.modalTitle, color: '#F00707', WebkitTextFillColor: '#F00707', background: 'none' }}>
                Eliminar cuenta
              </span>
            </div>
            <p style={s.modalText}>
              Esta acción es <strong>irreversible</strong>. Se borrarán todos tus datos, materias, tareas y progreso de forma permanente.
            </p>
            <div style={s.modalFooter}>
              <button style={s.modalCancelBtn} onClick={() => setShowEliminarConfirm(false)}>
                Cancelar
              </button>
              <button style={{ ...s.dangerBtnFill, padding: '9px 20px' }} onClick={() => { setShowEliminarConfirm(false); navigate('/login'); }}>
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const getStyles = (isDark) => ({
  root: {
    display: 'flex',
    minHeight: '100vh',
    width: '100%',
    fontFamily: "'Poppins', sans-serif",
    position: 'relative',
    boxSizing: 'border-box',
  },
  grid: {
    position: 'fixed',
    inset: 0,
    backgroundColor: isDark ? '#050208' : '#FDF2EB',
    backgroundImage: `
      linear-gradient(${isDark ? 'rgba(4,27,54,0.7)' : 'rgba(253,238,230,0.9)'} 1px, transparent 1px),
      linear-gradient(90deg, ${isDark ? 'rgba(4,27,54,0.7)' : 'rgba(253,238,230,0.9)'} 1px, transparent 1px)
    `,
    backgroundSize: '36px 36px',
    pointerEvents: 'none',
    zIndex: 0,
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    zIndex: 1,
    minWidth: 0,
    backgroundColor: 'transparent',
  },
  topbar: {
    height: 56,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 28px',
    borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
    backgroundColor: isDark ? '#0F0E0F' : '#FEFBF9',
    position: 'sticky',
    top: 0,
    zIndex: 5,
  },
  topbarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  themeBtn: {
    background: isDark ? '#171717' : '#FEFAF9',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(220,193,181,0.30)'}`,
    borderRadius: 50,
    padding: '5px 14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontFamily: "'Poppins', sans-serif",
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
    fontSize: 12,
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 18,
    padding: '4px 6px',
  },
  socialBtn: {
    background: isDark
      ? 'linear-gradient(90deg, #C4107A, #FF5B2E)'
      : 'linear-gradient(90deg, #FF8430, #F7306D)',
    border: 'none',
    borderRadius: 8,
    padding: '6px 16px',
    color: '#fff',
    fontFamily: "'Poppins', sans-serif",
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
  scrollArea: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  content: {
    padding: '28px 32px',
    maxWidth: 600,
    boxSizing: 'border-box',
  },
  pageTitle: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 28,
    fontWeight: 800,
    color: isDark ? '#FF5B2E' : '#FF8430',
    margin: '0 0 24px 0',
  },
  card: {
    background: isDark ? '#171717' : '#FEFAF9',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(220,193,181,0.30)'}`,
    borderRadius: 16,
    padding: '28px 32px',
    boxShadow: isDark
      ? '0 4px 24px rgba(196,16,122,0.10)'
      : '0 4px 24px rgba(253,214,189,0.50)',
  },
  fotoSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 28,
    gap: 10,
  },
  fotoCircle: {
    width: 90,
    height: 90,
    borderRadius: '50%',
    border: `2px solid ${isDark ? 'rgba(196,16,122,0.50)' : 'rgba(247,48,109,0.35)'}`,
    background: isDark ? 'rgba(196,16,122,0.08)' : 'rgba(255,132,48,0.06)',
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  fotoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: '50%',
    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
  },
  fotoBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 22,
    height: 22,
    borderRadius: '50%',
    background: isDark
      ? 'linear-gradient(135deg, #C4107A, #FF5B2E)'
      : 'linear-gradient(135deg, #FF8430, #F7306D)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: `2px solid ${isDark ? '#171717' : '#FEFAF9'}`,
  },
  fotoLabel: {
    fontSize: 10,
    letterSpacing: '0.10em',
    textTransform: 'uppercase',
    color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.40)',
    fontWeight: 600,
  },
  fields: {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },
  fieldGroup: { display: 'flex', flexDirection: 'column' },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.75)',
    marginBottom: 7,
  },
  input: {
    width: '100%',
    background: isDark ? 'rgba(255,255,255,0.06)' : '#F5F5F8',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#E0E0E8'}`,
    borderRadius: 10,
    padding: '11px 14px',
    fontFamily: "'Poppins', sans-serif",
    fontSize: 13,
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  inputError: {
    borderColor: '#F00707',
    boxShadow: '0 0 0 2px rgba(240,7,7,0.10)',
  },
  errorRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    fontSize: 11,
    color: '#F00707',
    marginTop: 4,
    fontWeight: 500,
  },
  dangerZone: {
    background: isDark ? 'rgba(240,7,7,0.05)' : 'rgba(240,7,7,0.04)',
    border: `1px solid ${isDark ? 'rgba(240,7,7,0.20)' : 'rgba(240,7,7,0.15)'}`,
    borderRadius: 12,
    padding: '14px 18px',
    marginTop: 4,
  },
  dangerHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  dangerTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: isDark ? 'rgba(255,255,255,0.80)' : 'rgba(0,0,0,0.75)',
  },
  dangerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  dangerInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    flex: 1,
  },
  dangerItemTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: isDark ? 'rgba(255,255,255,0.80)' : 'rgba(0,0,0,0.75)',
  },
  dangerItemDesc: {
    fontSize: 11,
    color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.45)',
  },
  dangerBtnOutline: {
    padding: '7px 14px',
    borderRadius: 8,
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.20)' : 'rgba(0,0,0,0.20)'}`,
    background: 'transparent',
    cursor: 'pointer',
    fontFamily: "'Poppins', sans-serif",
    fontSize: 11,
    fontWeight: 600,
    color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.65)',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  dangerBtnFill: {
    padding: '7px 14px',
    borderRadius: 8,
    border: 'none',
    background: isDark
      ? 'linear-gradient(90deg, #C4107A, #FF5B2E)'
      : 'linear-gradient(90deg, #FF8430, #F7306D)',
    cursor: 'pointer',
    fontFamily: "'Poppins', sans-serif",
    fontSize: 11,
    fontWeight: 600,
    color: '#fff',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  actionRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    padding: '10px 24px',
    borderRadius: 10,
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#E0E0E8'}`,
    background: 'transparent',
    cursor: 'pointer',
    fontFamily: "'Poppins', sans-serif",
    fontSize: 13,
    fontWeight: 500,
    color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.60)',
  },
  saveBtn: {
    padding: '10px 24px',
    borderRadius: 10,
    border: 'none',
    background: isDark
      ? 'linear-gradient(90deg, #C4107A, #FF5B2E)'
      : 'linear-gradient(90deg, #FF8430, #F7306D)',
    cursor: 'pointer',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
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
    background: isDark ? '#1E1E1E' : '#FFFFFF',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(220,193,181,0.40)'}`,
    borderRadius: 16,
    width: '100%',
    maxWidth: 380,
    margin: '0 24px',
    padding: '24px',
    boxShadow: isDark
      ? '0 0 0 1px rgba(196,16,122,0.30), 0 20px 60px rgba(0,0,0,0.70)'
      : '0 20px 60px rgba(0,0,0,0.15)',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  modalTitle: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 18,
    fontWeight: 700,
    background: isDark
      ? 'linear-gradient(90deg, #FF5B2E, #C4107A)'
      : 'linear-gradient(90deg, #FF8430, #F7306D)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  modalText: {
    fontSize: 13,
    color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.60)',
    lineHeight: 1.6,
    marginBottom: 20,
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalCancelBtn: {
    padding: '9px 18px',
    borderRadius: 8,
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#E0E0E8'}`,
    background: 'transparent',
    cursor: 'pointer',
    fontFamily: "'Poppins', sans-serif",
    fontSize: 13,
    fontWeight: 500,
    color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.60)',
  },
});

export default StudentProfile;