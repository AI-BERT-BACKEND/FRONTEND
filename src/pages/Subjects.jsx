import React, { useState, useEffect, useRef } from 'react';
import AppLayout from '../components/Layout/AppLayout';
import ErrorMsg from '../components/ErrorMsg';
import ProgressBar from '../components/ProgressBar';
import { useTheme } from '../context/ThemeContext';
import { createStyles } from '../theme/createStyles';

const ChevronDown = ({ color }) => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none"
    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
    <path d="M2 4l3.5 3.5L9 4" stroke={color || 'currentColor'} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const COLORS = ['#FF8430','#F7306D','#00CFFF','#A855F7','#22C55E','#EAB308','#FF5B2E','#C4107A'];
const HORAS = ['07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'];
const DIAS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

const Subjects = () => {
  const { isDark } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const menuRef = useRef(null);

  const [materias, setMaterias] = useState([
    {
      id: 1,
      nombre: 'Diseño de Operaciones de Software',
      profesor: 'Dr. Alberto García',
      creditos: '4',
      semestre: 'Sexto Semestre',
      color: '#FF8430',
      activo: true,
      progreso: 65,
    },
    {
      id: 2,
      nombre: 'Arquitectura y Sistemas de Red',
      profesor: 'Dra. María López',
      creditos: '3',
      semestre: 'Sexto Semestre',
      color: '#C4107A',
      activo: true,
      progreso: 40,
    },
    {
      id: 3,
      nombre: 'Ciclos de Vida y Desarrollo de Software',
      profesor: 'Martín Cantor',
      creditos: '4',
      semestre: 'Sexto Semestre',
      color: '#A855F7',
      activo: true,
      progreso: 55,
    },
  ]);

  const [form, setForm] = useState({
    nombre: '',
    profesor: '',
    creditos: '',
    semestre: '',
    color: '#FF8430',
    horario: {},
  });
  const [formErrors, setFormErrors] = useState({});

  const creditosOptions = ['1','2','3','4','5','6'];
  const semestresOptions = [
    'Primer Semestre','Segundo Semestre','Tercer Semestre','Cuarto Semestre',
    'Quinto Semestre','Sexto Semestre','Séptimo Semestre','Octavo Semestre',
    'Noveno Semestre','Décimo Semestre',
  ];

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(null);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggleHorario = (dia, hora) => {
    const key = `${dia}-${hora}`;
    setForm((prev) => {
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
    setMaterias((prev) => [...prev, { ...form, id: Date.now(), activo: true, progreso: 0 }]);
    setForm({ nombre: '', profesor: '', creditos: '', semestre: '', color: '#FF8430', horario: {} });
    setFormErrors({});
    setShowModal(false);
  };

  const handleEliminar = (id) => {
    setMaterias((prev) => prev.filter((m) => m.id !== id));
    setMenuOpen(null);
  };

  const handleEditar = (id) => {
    const m = materias.find((x) => x.id === id);
    if (m) {
      setForm({ ...m });
      setMaterias((prev) => prev.filter((x) => x.id !== id));
      setShowModal(true);
    }
    setMenuOpen(null);
  };

  const totalCreditos = materias.reduce((acc, m) => acc + Number(m.creditos || 0), 0);
  const s = getStyles(isDark);

  return (
    <AppLayout>
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

      {/* GRID MATERIAS + CRÉDITOS */}
      <div style={s.materiasGrid}>
        {materias.length === 0 && (
          <div style={s.emptyState}>
            <span style={{ fontSize: 32 }}>📚</span>
            <p style={s.emptyText}>Aún no tienes materias. ¡Agrega tu primera materia!</p>
          </div>
        )}

        {materias.map((m) => (
          <div key={m.id} style={s.materiaCard}>
            <div style={s.cardTop}>
              <div style={{
                ...s.activoBadge,
                background: m.activo ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.08)',
                color: m.activo ? '#22C55E' : 'rgba(255,255,255,0.40)',
              }}>
                {m.activo ? '● Activo' : '● Inactivo'}
              </div>
              <div style={{ position: 'relative' }} ref={menuOpen === m.id ? menuRef : null}>
                <button style={s.menuBtn} onClick={() => setMenuOpen(menuOpen === m.id ? null : m.id)}>
                  ⋮
                </button>
                {menuOpen === m.id && (
                  <div style={s.dropdown}>
                    <button style={s.dropdownItem} onClick={() => navigate(`/materias/:id`)}>
                      📊 Ver detalle
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

        {/* RESUMEN DE CRÉDITOS dentro del grid */}
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
          <ProgressBar value={Math.min(100, (totalCreditos / 18) * 100)} isDark={isDark} />
        </div>
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

      {/* MODAL NUEVA MATERIA */}
      {showModal && (
        <div style={s.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={s.modalCard} onClick={(e) => e.stopPropagation()}>
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
                  onChange={(e) => {
                    setForm((p) => ({ ...p, nombre: e.target.value }));
                    if (formErrors.nombre) setFormErrors((p) => ({ ...p, nombre: '' }));
                  }}
                />
                <ErrorMsg message={formErrors.nombre} />
              </div>

              <div style={s.mField}>
                <label style={s.mLabel}>Profesor titular</label>
                <div style={{ position: 'relative' }}>
                  <span style={s.inputIcon}>👤</span>
                  <input
                    style={{ ...s.mInput, paddingLeft: 32 }}
                    placeholder="Dr. Alberto García"
                    value={form.profesor}
                    onChange={(e) => setForm((p) => ({ ...p, profesor: e.target.value }))}
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
                      onChange={(e) => {
                        setForm((p) => ({ ...p, creditos: e.target.value }));
                        if (formErrors.creditos) setFormErrors((p) => ({ ...p, creditos: '' }));
                      }}
                    >
                      <option value="" disabled>Seleccionar</option>
                      {creditosOptions.map((c) => (
                        <option key={c} value={c}>{c} crédito{c !== '1' ? 's' : ''}</option>
                      ))}
                    </select>
                    <ChevronDown color={isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.40)'} />
                  </div>
                  <ErrorMsg message={formErrors.creditos} />
                </div>

                <div style={{ ...s.mField, flex: 1 }}>
                  <label style={s.mLabel}>Semestre</label>
                  <div style={{ position: 'relative' }}>
                    <select
                      style={{ ...s.mInput, ...s.mSelect, ...(formErrors.semestre ? s.inputError : {}) }}
                      value={form.semestre}
                      onChange={(e) => {
                        setForm((p) => ({ ...p, semestre: e.target.value }));
                        if (formErrors.semestre) setFormErrors((p) => ({ ...p, semestre: '' }));
                      }}
                    >
                      <option value="" disabled>Primer Semestre</option>
                      {semestresOptions.map((sem) => (
                        <option key={sem} value={sem}>{sem}</option>
                      ))}
                    </select>
                    <ChevronDown color={isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.40)'} />
                  </div>
                  <ErrorMsg message={formErrors.semestre} />
                </div>
              </div>

              <div style={s.mField}>
                <label style={s.mLabel}>Horario Semanal</label>
                <div style={s.horarioWrap}>
                  <div style={s.horarioGrid}>
                    <div style={s.horarioHeader}>
                      <div style={s.horaCell} />
                      {DIAS.map((d) => <div key={d} style={s.diaCell}>{d}</div>)}
                    </div>
                    {HORAS.map((hora) => (
                      <div key={hora} style={s.horarioRow}>
                        <div style={s.horaCell}>{hora}</div>
                        {DIAS.map((dia) => {
                          const key = `${dia}-${hora}`;
                          const sel = form.horario[key];
                          return (
                            <div
                              key={dia}
                              style={{
                                ...s.horarioCell,
                                background: sel ? form.color + 'AA' : isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
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

              <div style={s.mField}>
                <label style={s.mLabel}>Elige un color para identificar esta materia en tu horario</label>
                <div style={s.colorRow}>
                  {COLORS.map((c) => (
                    <div
                      key={c}
                      style={{
                        ...s.colorDot,
                        background: c,
                        border: form.color === c ? `3px solid ${isDark ? '#fff' : '#000'}` : '3px solid transparent',
                        transform: form.color === c ? 'scale(1.2)' : 'scale(1)',
                      }}
                      onClick={() => setForm((p) => ({ ...p, color: c }))}
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
    </AppLayout>
  );
};

const getStyles = (isDark) => {
  const t = createStyles(isDark);
  return {
    pageHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 28,
    },
    pageTitle: {
      fontFamily: t.fontPrimary,
      fontSize: 32,
      fontWeight: 800,
      color: isDark ? '#FF5B2E' : '#FF8430',
      margin: '0 0 4px 0',
    },
    pageDesc: { fontSize: 13, color: t.textSecondary, margin: 0 },
    newBtn: {
      background: t.primaryGradient,
      border: 'none',
      borderRadius: 10,
      padding: '10px 20px',
      color: '#fff',
      fontFamily: t.fontPrimary,
      fontSize: 13,
      fontWeight: 700,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      flexShrink: 0,
    },
    materiasGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: 16,
      marginBottom: 16,
    },
    emptyState: {
      gridColumn: '1 / -1',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12,
      padding: '48px 0',
      background: t.cardBg,
      borderRadius: 16,
      border: `1px dashed ${t.cardBorder}`,
    },
    emptyText: { fontSize: 13, color: t.textMuted, textAlign: 'center', margin: 0 },
    materiaCard: {
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 16,
      padding: '16px',
      boxShadow: t.cardShadow,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    },
    cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    activoBadge: {
      fontSize: 10,
      fontWeight: 600,
      padding: '3px 8px',
      borderRadius: 20,
      fontFamily: t.fontSecondary,
    },
    menuBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: 18,
      color: t.textSecondary,
      padding: '0 4px',
      lineHeight: 1,
    },
    dropdown: {
      position: 'absolute',
      right: 0,
      top: '100%',
      background: isDark ? '#1E1E1E' : '#FFFFFF',
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 10,
      padding: '6px',
      zIndex: 50,
      minWidth: 160,
      boxShadow: t.popupShadow,
    },
    dropdownItem: {
      display: 'block',
      width: '100%',
      padding: '8px 12px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontFamily: t.fontSecondary,
      fontSize: 12,
      fontWeight: 500,
      color: t.textPrimary,
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
      fontFamily: t.fontPrimary,
      fontSize: 14,
      fontWeight: 700,
      color: t.textPrimary,
      lineHeight: 1.3,
    },
    materiaSemestre: {
      fontSize: 9,
      letterSpacing: '0.08em',
      color: t.textMuted,
      fontWeight: 600,
    },
    materiaFooter: {
      display: 'flex',
      gap: 12,
      paddingTop: 10,
      borderTop: `1px solid ${t.cardBorder}`,
      marginTop: 'auto',
    },
    materiaInfo: { display: 'flex', alignItems: 'center', gap: 6, flex: 1 },
    infoIcon: { fontSize: 14, flexShrink: 0 },
    infoLabel: { fontSize: 8, letterSpacing: '0.06em', color: t.textMuted, fontWeight: 600 },
    infoVal: { fontSize: 11, fontWeight: 600, color: t.textPrimary },
    creditosCard: {
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 16,
      padding: '18px',
      boxShadow: t.cardShadow,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
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
      color: t.textSecondary,
    },
    creditosNum: { marginBottom: 8 },
    creditosBig: {
      fontFamily: t.fontPrimary,
      fontSize: 36,
      fontWeight: 800,
      color: isDark ? '#FF5B2E' : '#FF8430',
    },
    creditosTotal: { fontSize: 18, color: t.textMuted, fontWeight: 500 },
    creditosDesc: { fontSize: 11, color: t.textSecondary, lineHeight: 1.55, marginBottom: 14 },
    progressLabel: { display: 'flex', justifyContent: 'space-between', marginBottom: 6 },
    progressText: { fontSize: 10, color: t.textMuted, fontWeight: 500 },
    proximosCard: {
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 16,
      padding: '20px',
      display: 'flex',
      gap: 20,
      alignItems: 'center',
      boxShadow: t.cardShadow,
    },
    proximosImg: { width: 100, height: 80, borderRadius: 10, overflow: 'hidden', flexShrink: 0 },
    proximosImgPlaceholder: {
      width: '100%',
      height: '100%',
      background: t.inputBg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    proximosInfo: { flex: 1 },
    proximosTitle: {
      fontFamily: t.fontPrimary,
      fontSize: 15,
      fontWeight: 700,
      color: t.textPrimary,
      marginBottom: 6,
    },
    proximosDesc: { fontSize: 12, color: t.textSecondary, lineHeight: 1.55, margin: 0 },
    proximosBtn: {
      background: t.primaryGradient,
      border: 'none',
      borderRadius: 8,
      padding: '7px 16px',
      color: '#fff',
      fontFamily: t.fontSecondary,
      fontSize: 12,
      fontWeight: 600,
      cursor: 'pointer',
    },
    proximosBtnOutline: {
      background: 'transparent',
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 8,
      padding: '7px 16px',
      color: t.textSecondary,
      fontFamily: t.fontSecondary,
      fontSize: 12,
      fontWeight: 600,
      cursor: 'pointer',
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
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 16,
      width: '100%',
      maxWidth: 520,
      maxHeight: '88vh',
      margin: '0 20px',
      boxShadow: t.modalShadow,
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
      fontFamily: t.fontPrimary,
      fontSize: 18,
      fontWeight: 700,
      backgroundImage: t.primaryGradient,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      width: 'fit-content',
      marginBottom: 2,
    },
    modalSubtitle: { fontSize: 12, color: t.textMuted },
    modalClose: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: 14,
      color: t.textSecondary,
      padding: 4,
      lineHeight: 1,
      flexShrink: 0,
    },
    modalBody: { padding: '16px 24px', overflowY: 'auto', flex: 1 },
    modalFooter: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 12,
      padding: '12px 24px 20px',
      borderTop: `1px solid ${t.cardBorder}`,
      flexShrink: 0,
    },
    mField: { marginBottom: 14 },
    mRow: { display: 'flex', gap: 12, marginBottom: 14 },
    mLabel: {
      display: 'block',
      fontSize: 12,
      fontWeight: 600,
      color: t.textPrimary,
      marginBottom: 6,
      fontFamily: t.fontSecondary,
    },
    mInput: {
      width: '100%',
      background: t.inputBg,
      border: `1px solid ${t.inputBorder}`,
      borderRadius: 10,
      padding: '10px 12px',
      fontFamily: t.fontSecondary,
      fontSize: 12,
      color: t.textPrimary,
      outline: 'none',
      boxSizing: 'border-box',
      transition: 'border-color 0.2s',
    },
    mSelect: { appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer', paddingRight: 28 },
    inputError: { borderColor: t.error, boxShadow: `0 0 0 2px ${t.error}1a` },
    inputIcon: {
      position: 'absolute',
      left: 10,
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: 14,
      pointerEvents: 'none',
    },
    horarioWrap: { overflowX: 'auto', borderRadius: 8, border: `1px solid ${t.cardBorder}` },
    horarioGrid: { minWidth: 360 },
    horarioHeader: { display: 'flex', background: t.inputBg },
    horarioRow: { display: 'flex' },
    horaCell: {
      width: 44,
      flexShrink: 0,
      fontSize: 9,
      color: t.textMuted,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4px 2px',
      fontFamily: t.fontSecondary,
    },
    diaCell: {
      flex: 1,
      fontSize: 9,
      fontWeight: 700,
      color: t.textSecondary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '6px 2px',
      letterSpacing: '0.05em',
    },
    horarioCell: { flex: 1, height: 20, cursor: 'pointer', transition: 'all 0.1s', borderRadius: 2 },
    horarioHint: { fontSize: 10, color: t.textMuted, marginTop: 6, fontStyle: 'italic' },
    colorRow: { display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 },
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
      border: `1px solid ${t.inputBorder}`,
      background: 'transparent',
      cursor: 'pointer',
      fontFamily: t.fontSecondary,
      fontSize: 13,
      fontWeight: 500,
      color: t.textSecondary,
    },
    mCreateBtn: {
      padding: '9px 20px',
      borderRadius: 8,
      border: 'none',
      background: t.primaryGradient,
      cursor: 'pointer',
      fontFamily: t.fontPrimary,
      fontSize: 13,
      fontWeight: 700,
      color: '#fff',
      letterSpacing: '0.03em',
    },
  };
};

export default Subjects;