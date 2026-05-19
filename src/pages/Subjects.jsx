import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const COLORS = ['#FF8430', '#F7306D', '#00CFFF', '#A855F7', '#22C55E', '#EAB308', '#FF5B2E', '#C4107A'];

const HORAS = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
const DIAS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

const Subjects = ({ theme = 'light', onToggleTheme }) => {
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const menuRef = useRef(null);

  const [materias, setMaterias] = useState([]);

  const [form, setForm] = useState({
    nombre: '',
    profesor: '',
    creditos: '',
    semestre: '',
    color: '#FF8430',
    horario: {},
  });

  const [formErrors, setFormErrors] = useState({});

  const creditos = ['1', '2', '3', '4', '5', '6'];
  const semestres = [
    'Primer Semestre', 'Segundo Semestre', 'Tercer Semestre',
    'Cuarto Semestre', 'Quinto Semestre', 'Sexto Semestre',
    'Séptimo Semestre', 'Octavo Semestre', 'Noveno Semestre', 'Décimo Semestre',
  ];

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggleHorario = (dia, hora) => {
    const key = `${dia}-${hora}`;
    setForm(prev => {
      const h = { ...prev.horario };
      if (h[key]) delete h[key];
      else h[key] = true;
      return { ...prev, horario: h };
    });
  };

  const validateForm = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido';
    if (!form.creditos) e.creditos = 'Selecciona los créditos';
    if (!form.semestre) e.semestre = 'Selecciona el semestre';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCrear = () => {
    if (!validateForm()) return;
    setMaterias(prev => [...prev, { ...form, id: Date.now(), activo: true }]);
    setForm({ nombre: '', profesor: '', creditos: '', semestre: '', color: '#FF8430', horario: {} });
    setFormErrors({});
    setShowModal(false);
  };

  const handleEliminar = (id) => {
    setMaterias(prev => prev.filter(m => m.id !== id));
    setMenuOpen(null);
  };

  const handleEditar = (id) => {
    const m = materias.find(x => x.id === id);
    if (m) {
      setForm({ ...m });
      setMaterias(prev => prev.filter(x => x.id !== id));
      setShowModal(true);
    }
    setMenuOpen(null);
  };

  const totalCreditos = materias.reduce((acc, m) => acc + Number(m.creditos || 0), 0);

  const s = getStyles(isDark);

  const ErrorMsg = ({ field }) => formErrors[field] ? (
    <div style={s.errorRow}>
      <svg width="11" height="11" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
        <circle cx="6.5" cy="6.5" r="6" stroke="#F00707" strokeWidth="1.2" />
        <path d="M6.5 3.5v3.2" stroke="#F00707" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="6.5" cy="9.2" r="0.7" fill="#F00707" />
      </svg>
      <span>{formErrors[field]}</span>
    </div>
  ) : null;

  return (
    <div style={s.root}>

      <Sidebar theme={theme} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(p => !p)} />

      <div style={s.main}>
        {/* TOPBAR */}
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

            {/* HEADER */}
            <div style={s.pageHeader}>
              <div>
                <h1 style={s.pageTitle}>Mis Materias</h1>
                <p style={s.pageDesc}>Gestión académica y seguimiento de currículo actual.</p>
              </div>
              <button style={s.newBtn} onClick={() => setShowModal(true)}>
                + Nueva Materia
              </button>
            </div>

            <div style={s.layout}>
              {/* GRID MATERIAS */}
              <div style={s.leftCol}>
                <div style={s.materiasGrid}>
                  {materias.length === 0 && (
                    <div style={s.emptyState}>
                      <span style={{ fontSize: 32 }}>📚</span>
                      <p style={s.emptyText}>Aún no tienes materias. ¡Agrega tu primera materia!</p>
                    </div>
                  )}
                  {materias.map(m => (
                    <div key={m.id} style={s.materiaCard}>
                      <div style={s.cardTop}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ ...s.activoBadge, background: m.activo ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.08)', color: m.activo ? '#22C55E' : 'rgba(255,255,255,0.40)' }}>
                            {m.activo ? '● Activo' : '● Inactivo'}
                          </div>
                        </div>
                        <div style={{ position: 'relative' }} ref={menuOpen === m.id ? menuRef : null}>
                          <button style={s.menuBtn} onClick={() => setMenuOpen(menuOpen === m.id ? null : m.id)}>
                            ⋮
                          </button>
                          {menuOpen === m.id && (
                            <div style={s.dropdown}>
                              <button style={s.dropdownItem} onClick={() => handleEditar(m.id)}>
                                ✏️ Editar materia
                              </button>
                              <button style={{ ...s.dropdownItem, color: '#F00707' }} onClick={() => handleEliminar(m.id)}>
                                🗑 Eliminar materia
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ ...s.materiaIcon, background: m.color + '22', border: `2px solid ${m.color}44` }}>
                        <span style={{ fontSize: 22 }}>📖</span>
                      </div>

                      <div style={s.materiaName}>{m.nombre}</div>
                      <div style={s.materiaSemestre}>{m.semestre?.toUpperCase()}</div>

                      <div style={s.materiaFooter}>
                        <div style={s.materiaInfo}>
                          <span style={s.infoIcon}>👤</span>
                          <div>
                            <div style={s.infoLabel}>DOCENTE</div>
                            <div style={s.infoVal}>{m.profesor || '—'}</div>
                          </div>
                        </div>
                        <div style={s.materiaInfo}>
                          <span style={s.infoIcon}>📋</span>
                          <div>
                            <div style={s.infoLabel}>CRÉDITOS</div>
                            <div style={s.infoVal}>{m.creditos} Créditos</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* PRÓXIMOS SEMESTRES */}
                <div style={s.proximosCard}>
                  <div style={s.proximosImg}>
                    <div style={s.proximosImgPlaceholder}>
                      <span style={{ fontSize: 24 }}>🗓</span>
                    </div>
                  </div>
                  <div style={s.proximosInfo}>
                    <div style={s.proximosTitle}>Próximos Semestres</div>
                    <p style={s.proximosDesc}>
                      Anticípate a tus próximos retos académicos. Visualiza las materias disponibles y planifica tu carga horaria con nuestro asistente inteligente.
                    </p>
                    <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                      <button style={s.proximosBtn}>Planificar</button>
                      <button style={s.proximosBtnOutline}>Ver Malla</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* RESUMEN CRÉDITOS */}
              <div style={s.rightCol}>
                <div style={s.creditosCard}>
                  <div style={s.creditosHeader}>
                    <span style={s.creditosTitle}>RESUMEN DE CRÉDITOS</span>
                    <span style={{ fontSize: 16 }}>⭐</span>
                  </div>
                  <div style={s.creditosNum}>
                    <span style={s.creditosBig}>{totalCreditos}</span>
                    <span style={s.creditosTotal}> / 18</span>
                  </div>
                  <p style={s.creditosDesc}>
                    Has completado el {Math.round((totalCreditos / 18) * 100)}% de tu carga académica proyectada para este período.
                  </p>
                  <div style={s.progressLabel}>
                    <span style={s.progressText}>Progreso Actual</span>
                    <span style={{ ...s.progressText, color: isDark ? '#FF5B2E' : '#F7306D' }}>
                      Faltan {Math.max(0, 18 - totalCreditos)}
                    </span>
                  </div>
                  <div style={s.progressTrack}>
                    <div style={{ ...s.progressFill, width: `${Math.min(100, (totalCreditos / 18) * 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL NUEVA MATERIA */}
      {showModal && (
        <div style={s.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={s.modalCard} onClick={e => e.stopPropagation()}>

            <div style={s.modalHeader}>
              <div>
                <div style={s.modalTitle}>Nueva Materia</div>
                <div style={s.modalSubtitle}>Agrega una nueva materia a tu plan de estudios</div>
              </div>
              <button style={s.modalClose} onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div style={s.modalBody}>

              <div style={s.mField}>
                <label style={s.mLabel}>Nombre de la materia</label>
                <input
                  style={{ ...s.mInput, ...(formErrors.nombre ? s.inputError : {}) }}
                  placeholder="Ej: Inteligencia Artificial Aplicada"
                  value={form.nombre}
                  onChange={e => {
                    setForm(prev => ({ ...prev, nombre: e.target.value }));
                    if (formErrors.nombre) setFormErrors(prev => ({ ...prev, nombre: '' }));
                  }}
                />
                <ErrorMsg field="nombre" />
              </div>

              <div style={s.mField}>
                <label style={s.mLabel}>Profesor titular</label>
                <div style={{ position: 'relative' }}>
                  <span style={s.inputIcon}>👤</span>
                  <input
                    style={{ ...s.mInput, paddingLeft: 32 }}
                    placeholder="Dr. Alberto García"
                    value={form.profesor}
                    onChange={e => setForm(prev => ({ ...prev, profesor: e.target.value }))}
                  />
                </div>
              </div>

              <div style={s.mRow}>
                <div style={{ ...s.mField, flex: 1 }}>
                  <label style={s.mLabel}>Créditos</label>
                  <div style={{ position: 'relative' }}>
                    <select
                      style={{ ...s.mInput, ...s.mSelect, ...(formErrors.creditos ? s.inputError : {}) }}
                      value={form.creditos}
                      onChange={e => {
                        setForm(prev => ({ ...prev, creditos: e.target.value }));
                        if (formErrors.creditos) setFormErrors(prev => ({ ...prev, creditos: '' }));
                      }}
                    >
                      <option value="" disabled>Seleccionar</option>
                      {creditos.map(c => <option key={c} value={c}>{c} crédito{c !== '1' ? 's' : ''}</option>)}
                    </select>
                    <svg width="11" height="11" viewBox="0 0 14 14" fill="none"
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                      <path d="M3 5l4 4 4-4" stroke={isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.40)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <ErrorMsg field="creditos" />
                </div>

                <div style={{ ...s.mField, flex: 1 }}>
                  <label style={s.mLabel}>Semestre</label>
                  <div style={{ position: 'relative' }}>
                    <select
                      style={{ ...s.mInput, ...s.mSelect, ...(formErrors.semestre ? s.inputError : {}) }}
                      value={form.semestre}
                      onChange={e => {
                        setForm(prev => ({ ...prev, semestre: e.target.value }));
                        if (formErrors.semestre) setFormErrors(prev => ({ ...prev, semestre: '' }));
                      }}
                    >
                      <option value="" disabled>Primer Semestre</option>
                      {semestres.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <svg width="11" height="11" viewBox="0 0 14 14" fill="none"
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                      <path d="M3 5l4 4 4-4" stroke={isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.40)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <ErrorMsg field="semestre" />
                </div>
              </div>

              {/* HORARIO */}
              <div style={s.mField}>
                <label style={s.mLabel}>Horario Semanal</label>
                <div style={s.horarioWrap}>
                  <div style={s.horarioGrid}>
                    <div style={s.horarioHeader}>
                      <div style={s.horaCell} />
                      {DIAS.map(d => (
                        <div key={d} style={s.diaCell}>{d}</div>
                      ))}
                    </div>
                    {HORAS.map(hora => (
                      <div key={hora} style={s.horarioRow}>
                        <div style={s.horaCell}>{hora}</div>
                        {DIAS.map(dia => {
                          const key = `${dia}-${hora}`;
                          const sel = form.horario[key];
                          return (
                            <div
                              key={dia}
                              style={{
                                ...s.horarioCell,
                                background: sel ? form.color + 'AA' : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'),
                                border: sel ? `1px solid ${form.color}` : `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                              }}
                              onClick={() => toggleHorario(dia, hora)}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
                <p style={s.horarioHint}>Haz clic en los bloques para seleccionar las horas de clase.</p>
              </div>

              {/* COLOR */}
              <div style={s.mField}>
                <label style={s.mLabel}>Elige un color para identificar esta materia en tu horario</label>
                <div style={s.colorRow}>
                  {COLORS.map(c => (
                    <div
                      key={c}
                      style={{
                        ...s.colorDot,
                        background: c,
                        border: form.color === c ? `3px solid ${isDark ? '#fff' : '#000'}` : '3px solid transparent',
                        transform: form.color === c ? 'scale(1.2)' : 'scale(1)',
                      }}
                      onClick={() => setForm(prev => ({ ...prev, color: c }))}
                    />
                  ))}
                </div>
              </div>

            </div>

            <div style={s.modalFooter}>
              <button style={s.mCancelBtn} onClick={() => setShowModal(false)}>Cancelar</button>
              <button style={s.mCreateBtn} onClick={handleCrear}>Crear materia</button>
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
  pageHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  pageTitle: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 32,
    fontWeight: 800,
    color: isDark ? '#FF5B2E' : '#FF8430',
    margin: '0 0 4px 0',
  },
  pageDesc: {
    fontSize: 13,
    color: isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.50)',
    margin: 0,
  },
  newBtn: {
    background: isDark
      ? 'linear-gradient(90deg, #C4107A, #FF5B2E)'
      : 'linear-gradient(90deg, #FF8430, #F7306D)',
    border: 'none',
    borderRadius: 10,
    padding: '10px 20px',
    color: '#fff',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  layout: {
    display: 'flex',
    gap: 20,
    alignItems: 'flex-start',
  },
  leftCol: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  rightCol: {
    width: 220,
    flexShrink: 0,
  },
  materiasGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 16,
  },
  emptyState: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    padding: '48px 0',
    background: isDark ? '#171717' : '#FEFAF9',
    borderRadius: 16,
    border: `1px dashed ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
  },
  emptyText: {
    fontSize: 13,
    color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.40)',
    textAlign: 'center',
    margin: 0,
  },
  materiaCard: {
    background: isDark ? '#171717' : '#FEFAF9',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(220,193,181,0.30)'}`,
    borderRadius: 16,
    padding: '16px',
    boxShadow: isDark
      ? '0 4px 24px rgba(196,16,122,0.10)'
      : '0 4px 24px rgba(253,214,189,0.50)',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activoBadge: {
    fontSize: 10,
    fontWeight: 600,
    padding: '3px 8px',
    borderRadius: 20,
    fontFamily: "'Poppins', sans-serif",
  },
  menuBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 18,
    color: isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.40)',
    padding: '0 4px',
    lineHeight: 1,
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: '100%',
    background: isDark ? '#1E1E1E' : '#FFFFFF',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)'}`,
    borderRadius: 10,
    padding: '6px',
    zIndex: 50,
    minWidth: 160,
    boxShadow: isDark
      ? '0 8px 32px rgba(0,0,0,0.60)'
      : '0 8px 32px rgba(0,0,0,0.12)',
  },
  dropdownItem: {
    display: 'block',
    width: '100%',
    padding: '8px 12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'Poppins', sans-serif",
    fontSize: 12,
    fontWeight: 500,
    color: isDark ? 'rgba(255,255,255,0.80)' : 'rgba(0,0,0,0.75)',
    textAlign: 'left',
    borderRadius: 6,
  },
  materiaIcon: {
    width: 52,
    height: 52,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  materiaName: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 14,
    fontWeight: 700,
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
    lineHeight: 1.3,
  },
  materiaSemestre: {
    fontSize: 9,
    letterSpacing: '0.08em',
    color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
    fontWeight: 600,
  },
  materiaFooter: {
    display: 'flex',
    gap: 12,
    paddingTop: 10,
    borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
  },
  materiaInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  infoIcon: { fontSize: 14, flexShrink: 0 },
  infoLabel: {
    fontSize: 8,
    letterSpacing: '0.06em',
    color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
    fontWeight: 600,
  },
  infoVal: {
    fontSize: 11,
    fontWeight: 600,
    color: isDark ? 'rgba(255,255,255,0.80)' : 'rgba(0,0,0,0.75)',
  },
  proximosCard: {
    background: isDark ? '#171717' : '#FEFAF9',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(220,193,181,0.30)'}`,
    borderRadius: 16,
    padding: '20px',
    display: 'flex',
    gap: 20,
    alignItems: 'center',
    boxShadow: isDark
      ? '0 4px 24px rgba(196,16,122,0.10)'
      : '0 4px 24px rgba(253,214,189,0.50)',
  },
  proximosImg: {
    width: 100,
    height: 80,
    borderRadius: 10,
    overflow: 'hidden',
    flexShrink: 0,
  },
  proximosImgPlaceholder: {
    width: '100%',
    height: '100%',
    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  proximosInfo: { flex: 1 },
  proximosTitle: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 15,
    fontWeight: 700,
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
    marginBottom: 6,
  },
  proximosDesc: {
    fontSize: 12,
    color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)',
    lineHeight: 1.55,
    margin: 0,
  },
  proximosBtn: {
    background: isDark
      ? 'linear-gradient(90deg, #C4107A, #FF5B2E)'
      : 'linear-gradient(90deg, #FF8430, #F7306D)',
    border: 'none',
    borderRadius: 8,
    padding: '7px 16px',
    color: '#fff',
    fontFamily: "'Poppins', sans-serif",
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
  proximosBtnOutline: {
    background: 'transparent',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.20)' : 'rgba(0,0,0,0.20)'}`,
    borderRadius: 8,
    padding: '7px 16px',
    color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.65)',
    fontFamily: "'Poppins', sans-serif",
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
  creditosCard: {
    background: isDark ? '#171717' : '#FEFAF9',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(220,193,181,0.30)'}`,
    borderRadius: 16,
    padding: '18px',
    boxShadow: isDark
      ? '0 4px 24px rgba(196,16,122,0.10)'
      : '0 4px 24px rgba(253,214,189,0.50)',
  },
  creditosHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  creditosTitle: {
    fontSize: 10,
    letterSpacing: '0.08em',
    fontWeight: 700,
    color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)',
  },
  creditosNum: {
    marginBottom: 8,
  },
  creditosBig: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 36,
    fontWeight: 800,
    color: isDark ? '#FF5B2E' : '#FF8430',
  },
  creditosTotal: {
    fontSize: 18,
    color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.40)',
    fontWeight: 500,
  },
  creditosDesc: {
    fontSize: 11,
    color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)',
    lineHeight: 1.55,
    marginBottom: 14,
  },
  progressLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressText: {
    fontSize: 10,
    color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)',
    fontWeight: 500,
  },
  progressTrack: {
    height: 6,
    borderRadius: 4,
    background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    background: isDark
      ? 'linear-gradient(90deg, #FF5B2E, #C4107A)'
      : 'linear-gradient(90deg, #FF8430, #F7306D)',
    transition: 'width 0.4s ease',
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
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.70)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
    backdropFilter: 'blur(2px)',
  },
  modalCard: {
    background: isDark ? '#1A1A1A' : '#FFFFFF',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(220,193,181,0.40)'}`,
    borderRadius: 16,
    width: '100%',
    maxWidth: 520,
    maxHeight: '88vh',
    margin: '0 20px',
    boxShadow: isDark
      ? '0 0 0 1px rgba(196,16,122,0.25), 0 24px 64px rgba(0,0,0,0.80)'
      : '0 24px 64px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '20px 24px 0',
    flexShrink: 0,
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
    marginBottom: 2,
  },
  modalSubtitle: {
    fontSize: 12,
    color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)',
  },
  modalClose: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 14,
    color: isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.40)',
    padding: 4,
    lineHeight: 1,
    flexShrink: 0,
  },
  modalBody: {
    padding: '16px 24px',
    overflowY: 'auto',
    flex: 1,
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
    padding: '12px 24px 20px',
    borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
    flexShrink: 0,
  },
  mField: { marginBottom: 14 },
  mRow: { display: 'flex', gap: 12, marginBottom: 14 },
  mLabel: {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.70)',
    marginBottom: 6,
    fontFamily: "'Poppins', sans-serif",
  },
  mInput: {
    width: '100%',
    background: isDark ? 'rgba(255,255,255,0.06)' : '#F5F5F8',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#E0E0E8'}`,
    borderRadius: 10,
    padding: '10px 12px',
    fontFamily: "'Poppins', sans-serif",
    fontSize: 12,
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  mSelect: {
    appearance: 'none',
    WebkitAppearance: 'none',
    cursor: 'pointer',
    paddingRight: 28,
  },
  inputError: {
    borderColor: '#F00707',
    boxShadow: '0 0 0 2px rgba(240,7,7,0.10)',
  },
  inputIcon: {
    position: 'absolute',
    left: 10,
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: 14,
    pointerEvents: 'none',
  },
  horarioWrap: {
    overflowX: 'auto',
    borderRadius: 8,
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
  },
  horarioGrid: { minWidth: 360 },
  horarioHeader: {
    display: 'flex',
    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
  },
  horarioRow: { display: 'flex' },
  horaCell: {
    width: 44,
    flexShrink: 0,
    fontSize: 9,
    color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px 2px',
    fontFamily: "'Poppins', sans-serif",
  },
  diaCell: {
    flex: 1,
    fontSize: 9,
    fontWeight: 700,
    color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px 2px',
    letterSpacing: '0.05em',
  },
  horarioCell: {
    flex: 1,
    height: 20,
    cursor: 'pointer',
    transition: 'all 0.1s',
    borderRadius: 2,
  },
  horarioHint: {
    fontSize: 10,
    color: isDark ? 'rgba(255,255,255,0.30)' : 'rgba(0,0,0,0.30)',
    marginTop: 6,
    fontStyle: 'italic',
  },
  colorRow: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    marginTop: 4,
  },
  colorDot: {
    width: 26,
    height: 26,
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'all 0.15s',
    boxSizing: 'border-box',
  },
  mCancelBtn: {
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
  mCreateBtn: {
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

export default Subjects;