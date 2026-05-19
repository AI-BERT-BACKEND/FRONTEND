import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const AcademicProfile = ({ theme = 'light', onToggleTheme }) => {
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [nuevaMateria, setNuevaMateria] = useState('');
  const [modalError, setModalError] = useState('');

  const [form, setForm] = useState({
    carreraPrincipal: '',
    carreraSecundaria: '',
    semestre: '',
    promedio: '',
    materias: [],
    disponibilidad: '',
    estudioHoras: 4,
    trabaja: null,
    objetivo: '',
  });

  const [errors, setErrors] = useState({});

  const carreras = [
    'Ingeniería de Sistemas', 'Ingeniería Industrial', 'Ingeniería Civil',
    'Ingeniería Electrónica', 'Administración', 'Contaduría',
    'Derecho', 'Medicina', 'Psicología', 'Arquitectura',
  ];

  const semestres = [
    'Primer Semestre (1°)', 'Segundo Semestre (2°)', 'Tercer Semestre (3°)',
    'Cuarto Semestre (4°)', 'Quinto Semestre (5°)', 'Sexto Semestre (6°)',
    'Séptimo Semestre (7°)', 'Octavo Semestre (8°)', 'Noveno Semestre (9°)',
    'Décimo Semestre (10°)',
  ];

  const disponibilidades = [
    { label: 'Mañana', inicio: '07:00', fin: '12:00' },
    { label: 'Tarde', inicio: '13:00', fin: '18:00' },
    { label: 'Noche', inicio: '18:00', fin: '22:00' },
  ];

  const validate = () => {
    const newErrors = {};
    if (!form.carreraPrincipal) newErrors.carreraPrincipal = 'Selecciona tu carrera principal';
    if (!form.semestre) newErrors.semestre = 'Selecciona tu semestre actual';
    if (!form.promedio) newErrors.promedio = 'Ingresa tu promedio actual';
    else if (isNaN(form.promedio) || form.promedio < 0 || form.promedio > 5)
      newErrors.promedio = 'Ingresa un promedio válido (0.0 - 5.0)';
    if (form.materias.length === 0) newErrors.materias = 'Agrega al menos una materia';
    if (!form.disponibilidad) newErrors.disponibilidad = 'Selecciona tu disponibilidad';
    if (form.trabaja === null) newErrors.trabaja = '¿Trabajas actualmente?';
    if (!form.objetivo) newErrors.objetivo = 'Selecciona tu objetivo académico';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) navigate('/dashboard');
  };

  const handleGuardarMateria = () => {
    const m = nuevaMateria.trim();
    if (!m) {
      setModalError('El nombre de la materia es requerido');
      return;
    }
    if (form.materias.includes(m)) {
      setModalError('Esta materia ya está en tu lista');
      return;
    }
    setForm(prev => ({ ...prev, materias: [...prev.materias, m] }));
    if (errors.materias) setErrors(prev => ({ ...prev, materias: '' }));
    setNuevaMateria('');
    setModalError('');
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNuevaMateria('');
    setModalError('');
  };

  const handleRemoveMateria = (m) => {
    setForm(prev => ({ ...prev, materias: prev.materias.filter(x => x !== m) }));
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

            <h1 style={s.pageTitle}>Configura tu perfil académico</h1>
            <p style={s.pageDesc}>
              Personaliza ALBERT para que se adapte a tu ritmo de estudio. Esta información nos ayuda a generar horarios y recordatorios optimizados para ti.
            </p>

            <div style={s.layout}>

              {/* COLUMNA IZQUIERDA */}
              <div style={s.leftCol}>

                {/* DATOS ACADÉMICOS */}
                <div style={s.card}>
                  <div style={s.cardHeader}>
                    <span style={s.cardIcon}>🎓</span>
                    <span style={s.cardTitle}>Datos Académicos</span>
                  </div>

                  <div style={s.formRow}>
                    <div style={s.formGroup}>
                      <label style={s.label}>Carrera principal</label>
                      <div style={{ position: 'relative' }}>
                        <select
                          style={{ ...s.input, ...s.select, ...(errors.carreraPrincipal ? s.inputError : {}) }}
                          value={form.carreraPrincipal}
                          onChange={e => {
                            setForm(prev => ({ ...prev, carreraPrincipal: e.target.value }));
                            if (errors.carreraPrincipal) setErrors(prev => ({ ...prev, carreraPrincipal: '' }));
                          }}
                        >
                          <option value="" disabled>Selecciona tu carrera</option>
                          {carreras.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none"
                          style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                          <path d="M3 5l4 4 4-4" stroke={isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.40)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <ErrorMsg field="carreraPrincipal" />
                    </div>

                    <div style={s.formGroup}>
                      <label style={s.label}>Carrera secundaria (opcional)</label>
                      <div style={{ position: 'relative' }}>
                        <select
                          style={{ ...s.input, ...s.select }}
                          value={form.carreraSecundaria}
                          onChange={e => setForm(prev => ({ ...prev, carreraSecundaria: e.target.value }))}
                        >
                          <option value="">Selecciona la carrera</option>
                          {carreras.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none"
                          style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                          <path d="M3 5l4 4 4-4" stroke={isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.40)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div style={s.formRow}>
                    <div style={s.formGroup}>
                      <label style={s.label}>Semestre actual</label>
                      <div style={{ position: 'relative' }}>
                        <select
                          style={{ ...s.input, ...s.select, ...(errors.semestre ? s.inputError : {}) }}
                          value={form.semestre}
                          onChange={e => {
                            setForm(prev => ({ ...prev, semestre: e.target.value }));
                            if (errors.semestre) setErrors(prev => ({ ...prev, semestre: '' }));
                          }}
                        >
                          <option value="" disabled>Selecciona el semestre</option>
                          {semestres.map(sem => <option key={sem} value={sem}>{sem}</option>)}
                        </select>
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none"
                          style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                          <path d="M3 5l4 4 4-4" stroke={isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.40)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <ErrorMsg field="semestre" />
                    </div>

                    <div style={s.formGroup}>
                      <label style={s.label}>Promedio actual</label>
                      <input
                        style={{ ...s.input, ...(errors.promedio ? s.inputError : {}) }}
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        placeholder="Ej: 4.5"
                        value={form.promedio}
                        onChange={e => {
                          setForm(prev => ({ ...prev, promedio: e.target.value }));
                          if (errors.promedio) setErrors(prev => ({ ...prev, promedio: '' }));
                        }}
                      />
                      <ErrorMsg field="promedio" />
                    </div>
                  </div>
                </div>

                {/* MATERIAS CURSADAS */}
                <div style={s.card}>
                  <div style={s.cardHeader}>
                    <span style={s.cardIcon}>📚</span>
                    <span style={s.cardTitle}>Materias Cursadas</span>
                  </div>
                  <div style={s.tagRow}>
                    {form.materias.length === 0 && (
                      <span style={s.emptyTag}>Aún no has agregado materias</span>
                    )}
                    {form.materias.map(m => (
                      <div key={m} style={s.tag}>
                        <span style={s.tagText}>{m}</span>
                        <button style={s.tagClose} onClick={() => handleRemoveMateria(m)}>✕</button>
                      </div>
                    ))}
                    <button style={s.addMateriaBtn} onClick={() => setShowModal(true)}>
                      + Añadir materia
                    </button>
                  </div>
                  <ErrorMsg field="materias" />
                </div>

                {/* OBJETIVO ACADÉMICO */}
                <div style={s.card}>
                  <div style={s.cardHeader}>
                    <span style={s.cardIcon}>🎯</span>
                    <span style={s.cardTitle}>Objetivo Académico</span>
                  </div>
                  <div style={s.objetivoRow}>
                    {[
                      { key: 'Mejorar', label: 'Mejorar promedio', icon: '📈' },
                      { key: 'Aprobar', label: 'Aprobar todo', icon: '✅' },
                      { key: 'Ambas', label: 'Ambas (Equilibrio)', icon: '⚖️' },
                    ].map(obj => (
                      <button
                        key={obj.key}
                        style={{ ...s.objetivoBtn, ...(form.objetivo === obj.key ? s.objetivoBtnActive : {}) }}
                        onClick={() => {
                          setForm(prev => ({ ...prev, objetivo: obj.key }));
                          if (errors.objetivo) setErrors(prev => ({ ...prev, objetivo: '' }));
                        }}
                      >
                        <span style={{ fontSize: 20 }}>{obj.icon}</span>
                        <span style={s.objetivoLabel}>{obj.label}</span>
                      </button>
                    ))}
                  </div>
                  <ErrorMsg field="objetivo" />
                </div>

              </div>

              {/* COLUMNA DERECHA */}
              <div style={s.rightCol}>

                {/* DISPONIBILIDAD */}
                <div style={s.card}>
                  <div style={{ ...s.cardTitle, marginBottom: 14, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    DISPONIBILIDAD
                  </div>
                  {disponibilidades.map(d => (
                    <div
                      key={d.label}
                      style={{ ...s.dispItem, ...(form.disponibilidad === d.label ? s.dispItemActive : {}) }}
                      onClick={() => {
                        setForm(prev => ({ ...prev, disponibilidad: d.label }));
                        if (errors.disponibilidad) setErrors(prev => ({ ...prev, disponibilidad: '' }));
                      }}
                    >
                      <div style={s.dispRadio}>
                        {form.disponibilidad === d.label && <div style={s.dispRadioFill} />}
                      </div>
                      <span style={s.dispLabel}>{d.label}</span>
                      <span style={s.dispHours}>{d.inicio} – {d.fin}</span>
                    </div>
                  ))}
                  <ErrorMsg field="disponibilidad" />
                  <div style={s.estudioRow}>
                    <span style={s.estudioLabel}>Estudio diario</span>
                    <div style={s.estudioSlider}>
                      <input
                        type="range" min="1" max="12"
                        value={form.estudioHoras}
                        onChange={e => setForm(prev => ({ ...prev, estudioHoras: Number(e.target.value) }))}
                        style={{ width: '100%', accentColor: isDark ? '#C4107A' : '#FF8430' }}
                      />
                      <span style={s.estudioVal}>{form.estudioHoras}h</span>
                    </div>
                  </div>
                </div>

                {/* ¿TRABAJAS? */}
                <div style={s.card}>
                  <div style={{ ...s.cardTitle, marginBottom: 14 }}>¿TRABAJAS?</div>
                  <div style={s.trabajaRow}>
                    <button
                      style={{ ...s.trabajaBtn, ...(form.trabaja === true ? s.trabajaBtnActive : {}) }}
                      onClick={() => {
                        setForm(prev => ({ ...prev, trabaja: true }));
                        if (errors.trabaja) setErrors(prev => ({ ...prev, trabaja: '' }));
                      }}
                    >Sí</button>
                    <button
                      style={{ ...s.trabajaBtn, ...(form.trabaja === false ? s.trabajaBtnActiveNo : {}) }}
                      onClick={() => {
                        setForm(prev => ({ ...prev, trabaja: false }));
                        if (errors.trabaja) setErrors(prev => ({ ...prev, trabaja: '' }));
                      }}
                    >No</button>
                  </div>
                  <ErrorMsg field="trabaja" />
                </div>

                {/* FRASE */}
                <div style={s.quoteCard}>
                  <span style={s.quoteIcon}>💬</span>
                  <p style={s.quoteText}>
                    "La disciplina es el puente entre tus metas académicas y tus logros profesionales."
                  </p>
                </div>

                <button style={s.saveBtn} onClick={handleSave}>
                  Guardar cambios
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL AÑADIR MATERIA */}
      {showModal && (
        <div style={s.modalOverlay} onClick={handleCloseModal}>
          <div style={s.modalCard} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <div style={s.modalTitleRow}>
                <span style={{ fontSize: 18 }}>📚</span>
                <span style={s.modalTitle}>Añadir materia</span>
              </div>
              <button style={s.modalClose} onClick={handleCloseModal}>✕</button>
            </div>

            <div style={s.modalBody}>
              <label style={s.modalLabel}>
                Nombre de la materia <span style={{ color: isDark ? '#FF5B2E' : '#FF8430' }}>*</span>
              </label>
              <input
                style={{ ...s.modalInput, ...(modalError ? s.inputError : {}) }}
                placeholder="Ej. Cálculo Integral"
                value={nuevaMateria}
                onChange={e => {
                  setNuevaMateria(e.target.value);
                  if (modalError) setModalError('');
                }}
                onKeyDown={e => e.key === 'Enter' && handleGuardarMateria()}
                autoFocus
              />
              {modalError && (
                <div style={s.errorRow}>
                  <svg width="11" height="11" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
                    <circle cx="6.5" cy="6.5" r="6" stroke="#F00707" strokeWidth="1.2" />
                    <path d="M6.5 3.5v3.2" stroke="#F00707" strokeWidth="1.4" strokeLinecap="round" />
                    <circle cx="6.5" cy="9.2" r="0.7" fill="#F00707" />
                  </svg>
                  <span>{modalError}</span>
                </div>
              )}
              <div style={s.modalInfo}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="7" cy="7" r="6" stroke={isDark ? '#FF5B2E' : '#FF8430'} strokeWidth="1.2" />
                  <path d="M7 4.5v3.5" stroke={isDark ? '#FF5B2E' : '#FF8430'} strokeWidth="1.2" strokeLinecap="round" />
                  <circle cx="7" cy="9.8" r="0.6" fill={isDark ? '#FF5B2E' : '#FF8430'} />
                </svg>
                <span style={s.modalInfoText}>
                  Al añadir una materia, ALBERT comenzará a rastrear tus fechas de entrega y materiales de estudio automáticamente.
                </span>
              </div>
            </div>

            <div style={s.modalFooter}>
              <button style={s.modalCancelBtn} onClick={handleCloseModal}>
                Cancelar
              </button>
              <button style={s.modalSaveBtn} onClick={handleGuardarMateria}>
                Guardar materia
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
    width: '100%',
    boxSizing: 'border-box',
  },
  pageTitle: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 28,
    fontWeight: 800,
    color: isDark ? '#FF5B2E' : '#FF8430',
    margin: '0 0 8px 0',
  },
  pageDesc: {
    fontSize: 13,
    color: isDark ? 'rgba(255,255,255,0.60)' : 'rgba(0,0,0,0.55)',
    lineHeight: 1.6,
    marginBottom: 28,
    maxWidth: 680,
  },
  layout: {
    display: 'flex',
    gap: 20,
    alignItems: 'flex-start',
  },
  leftCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    minWidth: 0,
  },
  rightCol: {
    width: 220,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  card: {
    background: isDark ? '#171717' : '#FEFAF9',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(220,193,181,0.30)'}`,
    borderRadius: 16,
    padding: '18px 22px',
    boxShadow: isDark
      ? '0 4px 24px rgba(196,16,122,0.10)'
      : '0 4px 24px rgba(253,214,189,0.50)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 18,
  },
  cardIcon: { fontSize: 18 },
  cardTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
    fontFamily: "'Poppins', sans-serif",
  },
  formRow: {
    display: 'flex',
    gap: 16,
    marginBottom: 16,
  },
  formGroup: { flex: 1, minWidth: 0 },
  label: {
    display: 'block',
    fontSize: 11,
    fontWeight: 500,
    color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    background: isDark ? 'rgba(255,255,255,0.06)' : '#F5F5F8',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#E0E0E8'}`,
    borderRadius: 10,
    padding: '9px 12px',
    fontFamily: "'Poppins', sans-serif",
    fontSize: 12,
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  select: {
    appearance: 'none',
    WebkitAppearance: 'none',
    cursor: 'pointer',
    paddingRight: 28,
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
  tagRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  emptyTag: {
    fontSize: 11,
    color: isDark ? 'rgba(255,255,255,0.30)' : 'rgba(0,0,0,0.30)',
    fontStyle: 'italic',
  },
  tag: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    background: isDark ? 'rgba(196,16,122,0.15)' : 'rgba(255,132,48,0.12)',
    border: `1px solid ${isDark ? 'rgba(196,16,122,0.35)' : 'rgba(255,132,48,0.30)'}`,
    borderRadius: 20,
    padding: '4px 10px',
  },
  tagText: {
    fontSize: 11,
    color: isDark ? '#FF5B2E' : '#FF8430',
    fontWeight: 500,
  },
  tagClose: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 9,
    color: isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.40)',
    padding: 0,
    lineHeight: 1,
  },
  addMateriaBtn: {
    background: 'transparent',
    border: `1px dashed ${isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.22)'}`,
    borderRadius: 20,
    padding: '4px 12px',
    fontSize: 11,
    fontWeight: 500,
    color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.50)',
    cursor: 'pointer',
    fontFamily: "'Poppins', sans-serif",
  },
  objetivoRow: {
    display: 'flex',
    gap: 12,
  },
  objetivoBtn: {
    flex: 1,
    padding: '14px 8px',
    borderRadius: 12,
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)'}`,
    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    transition: 'all 0.2s',
  },
  objetivoBtnActive: {
    background: isDark
      ? 'linear-gradient(135deg, #C4107A, #FF5B2E)'
      : 'linear-gradient(135deg, #FF8430, #F7306D)',
    border: 'none',
  },
  objetivoLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: isDark ? 'rgba(255,255,255,0.80)' : 'rgba(0,0,0,0.70)',
    textAlign: 'center',
    fontFamily: "'Poppins', sans-serif",
  },
  dispItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 10,
    marginBottom: 8,
    cursor: 'pointer',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
    background: 'transparent',
    transition: 'all 0.2s',
  },
  dispItemActive: {
    background: isDark
      ? 'linear-gradient(90deg, #C4107A, #FF5B2E)'
      : 'linear-gradient(90deg, #FF8430, #F7306D)',
    border: 'none',
  },
  dispRadio: {
    width: 14,
    height: 14,
    borderRadius: '50%',
    border: `2px solid ${isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.30)'}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dispRadioFill: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#fff',
  },
  dispLabel: {
    fontSize: 12,
    fontWeight: 500,
    color: isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.80)',
    flex: 1,
  },
  dispHours: {
    fontSize: 11,
    color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.50)',
  },
  estudioRow: {
    marginTop: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  estudioLabel: {
    fontSize: 11,
    color: isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.50)',
  },
  estudioSlider: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  estudioVal: {
    fontSize: 12,
    fontWeight: 700,
    color: isDark ? '#FF5B2E' : '#FF8430',
    minWidth: 24,
  },
  trabajaRow: {
    display: 'flex',
    gap: 10,
  },
  trabajaBtn: {
    flex: 1,
    padding: '9px',
    borderRadius: 10,
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#E0E0E8'}`,
    background: 'transparent',
    cursor: 'pointer',
    fontFamily: "'Poppins', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    color: isDark ? 'rgba(255,255,255,0.70)' : 'rgba(0,0,0,0.65)',
    transition: 'all 0.2s',
  },
  trabajaBtnActive: {
    background: isDark
      ? 'linear-gradient(90deg, #C4107A, #FF5B2E)'
      : 'linear-gradient(90deg, #FF8430, #F7306D)',
    border: 'none',
    color: '#fff',
  },
  trabajaBtnActiveNo: {
    background: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)',
    border: 'none',
    color: isDark ? '#fff' : 'rgba(0,0,0,0.85)',
  },
  quoteCard: {
    background: isDark ? 'rgba(196,16,122,0.08)' : 'rgba(255,132,48,0.08)',
    border: `1px solid ${isDark ? 'rgba(196,16,122,0.20)' : 'rgba(255,132,48,0.20)'}`,
    borderRadius: 12,
    padding: '14px 16px',
    display: 'flex',
    gap: 10,
    alignItems: 'flex-start',
  },
  quoteIcon: { fontSize: 16, flexShrink: 0 },
  quoteText: {
    fontSize: 11.5,
    color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.60)',
    lineHeight: 1.6,
    fontStyle: 'italic',
    margin: 0,
  },
  saveBtn: {
    width: '100%',
    padding: 13,
    border: 'none',
    borderRadius: 10,
    background: isDark
      ? 'linear-gradient(90deg, #C4107A, #FF5B2E)'
      : 'linear-gradient(90deg, #FF8430, #F7306D)',
    color: '#fff',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: '0.04em',
    cursor: 'pointer',
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
    maxWidth: 420,
    margin: '0 24px',
    boxShadow: isDark
      ? '0 0 0 1px rgba(196,16,122,0.30), 0 20px 60px rgba(0,0,0,0.70)'
      : '0 20px 60px rgba(0,0,0,0.15)',
    overflow: 'hidden',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px 0',
  },
  modalTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
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
  modalClose: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 14,
    color: isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.40)',
    padding: 4,
    lineHeight: 1,
  },
  modalBody: {
    padding: '20px 24px',
  },
  modalLabel: {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.70)',
    marginBottom: 8,
    fontFamily: "'Poppins', sans-serif",
  },
  modalInput: {
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
    marginBottom: 12,
  },
  modalInfo: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    background: isDark ? 'rgba(255,91,46,0.08)' : 'rgba(255,132,48,0.07)',
    border: `1px solid ${isDark ? 'rgba(255,91,46,0.20)' : 'rgba(255,132,48,0.20)'}`,
    borderRadius: 8,
    padding: '10px 12px',
    marginTop: 4,
  },
  modalInfoText: {
    fontSize: 11.5,
    color: isDark ? 'rgba(255,255,255,0.60)' : 'rgba(0,0,0,0.55)',
    lineHeight: 1.55,
    fontFamily: "'Poppins', sans-serif",
  },
  modalFooter: {
    display: 'flex',
    gap: 12,
    padding: '0 24px 22px',
    justifyContent: 'flex-end',
  },
  modalCancelBtn: {
    padding: '9px 20px',
    borderRadius: 8,
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#E0E0E8'}`,
    background: 'transparent',
    cursor: 'pointer',
    fontFamily: "'Poppins', sans-serif",
    fontSize: 13,
    fontWeight: 500,
    color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.60)',
  },
  modalSaveBtn: {
    padding: '9px 20px',
    borderRadius: 8,
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
});

export default AcademicProfile;