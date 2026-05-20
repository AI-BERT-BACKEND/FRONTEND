import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/Layout/AppLayout';
import CircleProgress from '../components/CircleProgress';
import ProgressBar from '../components/ProgressBar';
import StatusBadge from '../components/StatusBadge';
import MascotaGif from '../assets/aibert-logo-sin-negro-corregido.gif';
import { useTheme } from '../context/ThemeContext';
import { createStyles } from '../theme/createStyles';

const WarningIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#FF5B2E"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#22C55E"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const BarIcon = ({ color }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color || '#FF8430'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);
const TrendIcon = ({ isDark }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke={isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.30)'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);
const PlusIcon = ({ isDark }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke={isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.30)'}
    strokeWidth="2"
    strokeLinecap="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const SaveIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#fff"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);
const CloseIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="rgba(255,255,255,0.50)"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const MetaModalIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#fff"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);
const SugerenciaIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#FF5B2E"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const ChevronDown = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="rgba(255,255,255,0.40)"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const AddMetaModal = ({ isDark, onClose }) => {
  const [nombre, setNombre] = useState('');
  const [nota, setNota] = useState('');
  const [materia, setMateria] = useState('');
  const [nombreError, setNombreError] = useState('');
  const [notaError, setNotaError] = useState('');

  const handleGuardar = () => {
    let valid = true;
    if (!nombre.trim()) {
      setNombreError('El nombre no puede estar vacío.');
      valid = false;
    } else if (nombre.length < 3 || nombre.length > 100) {
      setNombreError('Debe contener entre 3 y 100 caracteres');
      valid = false;
    } else setNombreError('');

    if (nota !== '' && (parseFloat(nota) < 0.0 || parseFloat(nota) > 5.0)) {
      setNotaError('La nota debe estar entre 0.0 y 5.0');
      valid = false;
    } else setNotaError('');

    if (valid) onClose();
  };

  return (
    <div style={ms.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={ms.modal}>
        <div style={ms.modalHeader}>
          <div style={ms.modalIconWrap}>
            <MetaModalIcon />
          </div>
          <div style={ms.modalTitleGroup}>
            <h2 style={ms.modalTitle}>Agregar Nueva Meta</h2>
            <p style={ms.modalSubtitle}>
              Define tus objetivos académicos y haz seguimiento a tu progreso.
            </p>
          </div>
          <button style={ms.closeBtn} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div style={ms.divider} />

        <div style={ms.fieldGroup}>
          <div style={ms.labelRow}>
            <label style={ms.label}>Nombre de la meta</label>
            <span style={ms.charCount}>{nombre.length} / 100</span>
          </div>
          <input
            style={{ ...ms.input, ...(nombreError ? ms.inputError : {}) }}
            placeholder="Ej: Obtener promedio superior a 4.5"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            maxLength={100}
          />
          {nombreError && (
            <div style={ms.errorRow}>
              <span style={ms.errorText}>{nombreError}</span>
              <span style={ms.errorTextRight}>Debe contener entre 3 y 100 caracteres</span>
            </div>
          )}
        </div>

        <div style={ms.row2}>
          <div style={ms.fieldGroup}>
            <label style={ms.label}>Nota objetivo</label>
            <input
              style={{ ...ms.input, ...(notaError ? ms.inputError : {}) }}
              placeholder="0.0 - 5.0"
              value={nota}
              type="number"
              min="0"
              max="5"
              step="0.1"
              onChange={(e) => setNota(e.target.value)}
            />
            {notaError && <span style={ms.errorText}>{notaError}</span>}
            {!notaError && <span style={ms.helperText}>La nota debe estar entre 0.0 y 5.0</span>}
          </div>
          <div style={ms.fieldGroup}>
            <label style={ms.label}>
              Materia asociada <span style={ms.opcional}>(Opcional)</span>
            </label>
            <div style={ms.selectWrap}>
              <select
                style={ms.select}
                value={materia}
                onChange={(e) => setMateria(e.target.value)}
              >
                <option value="">Seleccionar materia...</option>
                <option value="arquitectura">Arquitectura de Software</option>
                <option value="ia">Inteligencia Artificial</option>
                <option value="redes">Redes de Computadores</option>
                <option value="bd">Bases de Datos</option>
              </select>
              <div style={ms.selectChevron}>
                <ChevronDown />
              </div>
            </div>
          </div>
        </div>

        <div style={ms.sugerenciaBox}>
          <div style={ms.sugerenciaLeft}>
            <div style={ms.sugerenciaImgWrap}>
              <img
                src={MascotaGif}
                alt="ALBERT"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          </div>
          <div style={ms.sugerenciaContent}>
            <div style={ms.sugerenciaHeader}>
              <SugerenciaIcon />
              <span style={ms.sugerenciaTag}>Sugerencia Inteligente IA</span>
            </div>
            <p style={ms.sugerenciaText}>
              Las metas específicas y medibles aumentan la probabilidad de éxito en un 40%. Intenta
              definir qué promedio buscas por corte para esta materia.
            </p>
          </div>
        </div>

        <div style={ms.modalFooter}>
          <div style={ms.autoSaveNote}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.30)"
              strokeWidth="2"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            <span style={ms.autoSaveText}>
              Todos los cambios se guardarán
              <br />
              automáticamente en tu perfil académico.
            </span>
          </div>
          <div style={ms.footerBtns}>
            <button style={ms.cancelBtn} onClick={onClose}>
              Cancelar
            </button>
            <button style={ms.guardarBtn} onClick={handleGuardar}>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
              Guardar Meta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ms = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    background: 'rgba(0,0,0,0.70)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    background: '#1A1A1F',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 20,
    padding: '28px 30px',
    width: '100%',
    maxWidth: 560,
    boxShadow: '0 24px 60px rgba(0,0,0,0.60)',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 20,
  },
  modalIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    flexShrink: 0,
    background: 'linear-gradient(135deg, #C4107A, #FF5B2E)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(196,16,122,0.40)',
  },
  modalTitleGroup: { flex: 1 },
  modalTitle: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 18,
    fontWeight: 800,
    margin: '0 0 4px 0',
    color: '#FFFFFF',
  },
  modalSubtitle: {
    fontSize: 12,
    margin: 0,
    color: 'rgba(255,255,255,0.45)',
    fontFamily: "'Poppins', sans-serif",
  },
  closeBtn: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 8,
    width: 34,
    height: 34,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
  },
  divider: {
    height: 1,
    background: 'rgba(255,255,255,0.07)',
    marginBottom: 22,
  },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 },
  labelRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.70)',
    fontFamily: "'Poppins', sans-serif",
  },
  opcional: { color: 'rgba(255,255,255,0.35)', fontWeight: 400 },
  charCount: { fontSize: 10, color: 'rgba(255,255,255,0.28)', fontFamily: "'Poppins', sans-serif" },
  input: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 10,
    padding: '11px 14px',
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: "'Poppins', sans-serif",
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  inputError: {
    border: '1px solid rgba(240,7,7,0.60)',
    background: 'rgba(240,7,7,0.06)',
  },
  errorRow: { display: 'flex', justifyContent: 'space-between' },
  errorText: { fontSize: 10, color: '#F00707', fontFamily: "'Poppins', sans-serif" },
  errorTextRight: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.30)',
    fontFamily: "'Poppins', sans-serif",
  },
  helperText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.28)',
    fontFamily: "'Poppins', sans-serif",
  },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 4 },
  selectWrap: { position: 'relative' },
  select: {
    width: '100%',
    appearance: 'none',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 10,
    padding: '11px 36px 11px 14px',
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    fontFamily: "'Poppins', sans-serif",
    outline: 'none',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  selectChevron: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
  },
  sugerenciaBox: {
    display: 'flex',
    gap: 14,
    alignItems: 'center',
    background: 'rgba(196,16,122,0.08)',
    border: '1px solid rgba(196,16,122,0.20)',
    borderRadius: 12,
    padding: '14px 16px',
    marginBottom: 22,
  },
  sugerenciaLeft: { flexShrink: 0 },
  sugerenciaImgWrap: { width: 52, height: 52 },
  sugerenciaContent: { flex: 1 },
  sugerenciaHeader: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 },
  sugerenciaTag: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.04em',
    color: '#FF5B2E',
    fontFamily: "'Poppins', sans-serif",
  },
  sugerenciaText: {
    fontSize: 11,
    lineHeight: 1.55,
    margin: 0,
    color: 'rgba(255,255,255,0.55)',
    fontFamily: "'Poppins', sans-serif",
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  autoSaveNote: { display: 'flex', alignItems: 'flex-start', gap: 7 },
  autoSaveText: {
    fontSize: 10,
    lineHeight: 1.5,
    color: 'rgba(255,255,255,0.28)',
    fontFamily: "'Poppins', sans-serif",
  },
  footerBtns: { display: 'flex', gap: 10 },
  cancelBtn: {
    padding: '10px 20px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 10,
    color: 'rgba(255,255,255,0.60)',
    fontFamily: "'Poppins', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  guardarBtn: {
    padding: '10px 20px',
    background: 'linear-gradient(90deg, #C4107A, #FF5B2E)',
    border: 'none',
    borderRadius: 10,
    color: '#fff',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    boxShadow: '0 4px 16px rgba(196,16,122,0.40)',
  },
};

const AcademicGoals = () => {
  const { isDark } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const s = getStyles(isDark);

  const metas = [
    {
      id: 1,
      materia: 'Arquitectura de Software',
      facultad: 'Facultad de Ingeniería',
      actual: 4.2,
      meta: 4.8,
      estado: 'EN CAMINO',
      estadoColor: isDark ? '#FF5B2E' : '#FF8430',
      estadoBg: isDark ? 'rgba(255,91,46,0.15)' : 'rgba(255,132,48,0.12)',
      icon: '🏛️',
      iconColor: isDark ? '#FF5B2E' : '#FF8430',
    },
    {
      id: 2,
      materia: 'Inteligencia Artificial',
      facultad: 'Ciencias Computacionales',
      actual: 4.9,
      meta: 5.0,
      estado: 'META ALTA',
      estadoColor: '#22C55E',
      estadoBg: 'rgba(34,197,94,0.15)',
      icon: '🎯',
      iconColor: '#22C55E',
    },
  ];

  return (
    <AppLayout>
      <div style={s.metaGeneralCard}>
        <CircleProgress pct={82} isDark={isDark} size={120} label="GLOBAL" />
        <div style={s.metaGeneralInfo}>
          <div style={s.metaGeneralTitle}>Meta General del Ciclo</div>
          <div style={s.metaGeneralRow}>
            <div style={s.metaGeneralStat}>
              <div style={s.statLabel}>PROMEDIO OBJETIVO</div>
              <div style={s.statVal}>
                4.5
                <StatusBadge
                  label="ALTO"
                  color="#FF8430"
                  bgColor={isDark ? 'rgba(255,132,48,0.18)' : 'rgba(255,132,48,0.12)'}
                />
              </div>
            </div>
            <div style={s.metaGeneralStat}>
              <div style={s.statLabel}>PROMEDIO ACTUAL</div>
              <div style={s.statVal}>
                4.1
                <StatusBadge
                  label="EN CAMINO"
                  color="#FF5B2E"
                  bgColor={isDark ? 'rgba(255,91,46,0.18)' : 'rgba(255,91,46,0.10)'}
                />
              </div>
            </div>
          </div>
          <ProgressBar value={82} isDark={isDark} />
        </div>
        <div style={s.trendBtn}>
          <TrendIcon isDark={isDark} />
        </div>
        <div style={s.statsCol}>
          <div style={s.statCard}>
            <div>
              <div style={s.statCardLabel}>EN RIESGO</div>
              <div style={s.statCardNum}>01</div>
            </div>
            <div style={s.statCardIcon}>
              <WarningIcon />
            </div>
          </div>
          <div style={s.statCard}>
            <div>
              <div style={s.statCardLabel}>CUMPLIDAS</div>
              <div style={{ ...s.statCardNum, color: '#22C55E' }}>12</div>
            </div>
            <div style={s.statCardIcon}>
              <CheckIcon />
            </div>
          </div>
          <div style={s.statCard}>
            <div>
              <div style={s.statCardLabel}>RENDIMIENTO</div>
              <div style={{ ...s.statCardNum, color: isDark ? '#FF5B2E' : '#FF8430' }}>
                A+
              </div>
            </div>
            <div style={s.statCardIcon}>
              <BarIcon color={isDark ? '#FF5B2E' : '#FF8430'} />
            </div>
          </div>
        </div>
      </div>

      <div style={s.sectionHeader}>
        <div style={s.sectionTitleRow}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke={isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.50)'}
            strokeWidth="2"
          >
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          <span style={s.sectionTitle}>Metas por Materia</span>
        </div>
        <button style={s.verTodasBtn}>VER TODAS</button>
      </div>

      <div style={s.metasGrid}>
        {metas.map((m) => (
          <div key={m.id} style={s.materiaMetaCard}>
            <div style={s.materiaMetaTop}>
              <div style={{ ...s.materiaMetaIcon, background: m.iconColor + '20' }}>
                <span style={{ fontSize: 18 }}>{m.icon}</span>
              </div>
              <StatusBadge label={m.estado} color={m.estadoColor} bgColor={m.estadoBg} />
            </div>
            <div style={s.materiaNombre}>{m.materia}</div>
            <div style={s.materiaFacultad}>{m.facultad}</div>
            <div style={s.metaRow}>
              <span style={s.metaLabel}>
                Actual: <strong style={{ color: m.estadoColor }}>{m.actual}</strong>
              </span>
              <span style={s.metaLabel}>
                Meta:{' '}
                <strong
                  style={{ color: isDark ? 'rgba(255,255,255,0.60)' : 'rgba(0,0,0,0.55)' }}
                >
                  {m.meta}
                </strong>
              </span>
            </div>
            <ProgressBar value={(m.actual / m.meta) * 100} isDark={isDark} color={m.estadoColor} />
          </div>
        ))}

        <div style={s.addMetaCard} onClick={() => setShowModal(true)}>
          <PlusIcon isDark={isDark} />
          <span style={s.addMetaText}>Agregar Nueva Meta</span>
        </div>
      </div>

      {/* IA */}
      <div style={s.iaCard}>
        <div style={s.iaImgWrap}>
          <img
            src={MascotaGif}
            alt="ALBERT"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
        <div style={s.iaContent}>
          <div style={s.iaTitle}>Recomendaciones IA</div>
          <p style={s.iaText}>
            "Tu rendimiento en <strong>Arquitectura de Software</strong> ha bajado 0.3 en la
            última semana. Sugiero revisar el módulo de Microservicios antes del examen del
            viernes para mantener tu meta de 4.8."
          </p>
        </div>
        <button style={s.saveBtn}>
          <SaveIcon /> GUARDAR METAS
        </button>
      </div>

      {showModal && <AddMetaModal isDark={isDark} onClose={() => setShowModal(false)} />}
    </AppLayout>
  );
};

const getStyles = (isDark) => {
  const t = createStyles(isDark);
  return {
    metaGeneralCard: {
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 16,
      padding: '20px 24px',
      marginBottom: 20,
      boxShadow: t.cardShadow,
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      flexWrap: 'wrap',
    },
    metaGeneralInfo: { flex: 1, minWidth: 200 },
    metaGeneralTitle: {
      fontFamily: t.fontPrimary,
      fontSize: 15,
      fontWeight: 700,
      color: t.textPrimary,
      marginBottom: 14,
    },
    metaGeneralRow: { display: 'flex', gap: 24, marginBottom: 14 },
    metaGeneralStat: {},
    statLabel: {
      fontSize: 9,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: t.textSecondary,
      marginBottom: 4,
    },
    statVal: {
      fontFamily: t.fontPrimary,
      fontSize: 22,
      fontWeight: 800,
      color: t.textPrimary,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    },
    trendBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 4,
      display: 'flex',
      alignItems: 'center',
    },
    statsCol: { display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 },
    statCard: {
      background: t.inputBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 10,
      padding: '10px 14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      minWidth: 160,
    },
    statCardLabel: {
      fontSize: 9,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: t.textSecondary,
      marginBottom: 2,
    },
    statCardNum: {
      fontFamily: t.fontPrimary,
      fontSize: 24,
      fontWeight: 800,
      color: t.textPrimary,
    },
    statCardIcon: { display: 'flex', alignItems: 'center' },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 14,
    },
    sectionTitleRow: { display: 'flex', alignItems: 'center', gap: 8 },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 700,
      color: t.textPrimary,
      fontFamily: t.fontSecondary,
    },
    verTodasBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.08em',
      color: isDark ? '#FF5B2E' : '#F7306D',
      fontFamily: t.fontSecondary,
    },
    metasGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 },
    materiaMetaCard: {
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 14,
      padding: '16px',
      boxShadow: t.cardShadow,
    },
    materiaMetaTop: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 10,
    },
    materiaMetaIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    materiaNombre: {
      fontSize: 13,
      fontWeight: 700,
      color: t.textPrimary,
      fontFamily: t.fontSecondary,
      marginBottom: 3,
    },
    materiaFacultad: {
      fontSize: 10,
      color: t.textSecondary,
      marginBottom: 12,
    },
    metaRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 6 },
    metaLabel: { fontSize: 11, color: t.textSecondary },
    addMetaCard: {
      background: 'transparent',
      border: `1.5px dashed ${t.cardBorder}`,
      borderRadius: 14,
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      cursor: 'pointer',
      minHeight: 120,
    },
    addMetaText: {
      fontSize: 12,
      fontWeight: 500,
      color: t.textMuted,
    },
    iaCard: {
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 16,
      padding: '20px 24px',
      boxShadow: t.cardShadow,
      display: 'flex',
      alignItems: 'center',
      gap: 20,
    },
    iaImgWrap: { width: 80, height: 80, flexShrink: 0 },
    iaContent: { flex: 1 },
    iaTitle: {
      fontFamily: t.fontPrimary,
      fontSize: 14,
      fontWeight: 700,
      color: isDark ? '#FF5B2E' : '#FF8430',
      marginBottom: 8,
    },
    iaText: {
      fontSize: 12,
      color: t.textSecondary,
      lineHeight: 1.6,
      margin: 0,
    },
    saveBtn: {
      flexShrink: 0,
      background: t.primaryGradient,
      border: 'none',
      borderRadius: 10,
      padding: '12px 20px',
      color: '#fff',
      fontFamily: t.fontPrimary,
      fontSize: 13,
      fontWeight: 700,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      letterSpacing: '0.04em',
    },
  };
};

export default AcademicGoals;
