import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/Layout/AppLayout';
import ProgressBar from '../components/ProgressBar';
import { useTheme } from '../context/ThemeContext';
import { createStyles } from '../theme/createStyles';

const ModalidadIcon = ({ isDark }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke={isDark ? '#FF5B2E' : '#FF8430'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const MetodoIcon = ({ isDark }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke={isDark ? '#FF5B2E' : '#FF8430'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const AmbienteIcon = ({ isDark }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke={isDark ? '#FF5B2E' : '#FF8430'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const ResumenIcon = ({ isDark }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke={isDark ? '#FF5B2E' : '#FF8430'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const RecomendacionIcon = ({ isDark }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke={isDark ? '#FF5B2E' : '#FF8430'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const ClockIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="rgba(255,255,255,0.35)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const PomodoroIcon = ({ active, isDark }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke={active ? '#fff' : isDark ? '#FF5B2E' : '#FF8430'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const DeepWorkIcon = ({ active, isDark }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke={active ? '#fff' : isDark ? '#FF5B2E' : '#FF8430'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const BloquesIcon = ({ active, isDark }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke={active ? '#fff' : isDark ? '#FF5B2E' : '#FF8430'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
);

const RapidasIcon = ({ active, isDark }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke={active ? '#fff' : isDark ? '#FF5B2E' : '#FF8430'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="13 17 18 12 13 7" />
    <polyline points="6 17 11 12 6 7" />
  </svg>
);

const BibliotecaIcon = ({ active, isDark }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke={active ? '#fff' : isDark ? '#FF5B2E' : '#FF8430'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const MusicaIcon = ({ active, isDark }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke={active ? '#fff' : isDark ? '#FF5B2E' : '#FF8430'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

const SilencioIcon = ({ active }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke={active ? '#fff' : '#fff'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
);

const CasaIcon = ({ active, isDark }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke={active ? '#fff' : isDark ? '#FF5B2E' : '#FF8430'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const AireLibreIcon = ({ active, isDark }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke={active ? '#fff' : isDark ? '#FF5B2E' : '#FF8430'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const METODOS = [
  {
    id: 'pomodoro',
    IconComp: PomodoroIcon,
    titulo: 'Pomodoro',
    desc: 'Ciclos de 25min de foco y 5min de descanso activo.',
  },
  {
    id: 'deepwork',
    IconComp: DeepWorkIcon,
    titulo: 'Deep Work',
    desc: 'Inmersión total de 90min en interrupciones digitales.',
    defaultActive: true,
  },
  {
    id: 'bloques',
    IconComp: BloquesIcon,
    titulo: 'Bloques Largos',
    desc: 'Sesiones extendidas de 3h para redacción técnica.',
  },
  {
    id: 'rapidas',
    IconComp: RapidasIcon,
    titulo: 'Sesiones Rápidas',
    desc: 'Ráfagas de 15min para repasos y tarjetas de memoria.',
  },
];

const AMBIENTES = [
  { id: 'biblioteca', IconComp: BibliotecaIcon, label: 'Biblioteca' },
  { id: 'musica', IconComp: MusicaIcon, label: 'Con música' },
  { id: 'silencio', IconComp: SilencioIcon, label: 'Silencio', defaultActive: true },
  { id: 'casa', IconComp: CasaIcon, label: 'En casa' },
  { id: 'airelibre', IconComp: AireLibreIcon, label: 'Al aire libre' },
];

const SuccessToast = ({ onClose }) => (
  <div
    style={{
      position: 'fixed',
      bottom: 32,
      right: 32,
      zIndex: 2000,
      background: '#1A1A1F',
      border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: 14,
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      boxShadow: '0 8px 32px rgba(0,0,0,0.50)',
      minWidth: 320,
      maxWidth: 400,
      animation: 'slideInToast 0.3s ease',
    }}
  >
    <style>{`@keyframes slideInToast { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: 10,
        flexShrink: 0,
        background: 'linear-gradient(135deg, #C4107A, #FF5B2E)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 14px rgba(196,16,122,0.40)',
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
    <div style={{ flex: 1 }}>
      <div
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 13,
          fontWeight: 700,
          color: '#FFFFFF',
          marginBottom: 3,
        }}
      >
        ¡Preferencias guardadas!
      </div>
      <div
        style={{
          fontSize: 11,
          color: 'rgba(255,255,255,0.45)',
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        Tu configuración de estudio se ha guardado con éxito.
      </div>
    </div>
    <button
      onClick={onClose}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 4,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  </div>
);

const StudyPreferences = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [modalidad, setModalidad] = useState('grupal');
  const [metodo, setMetodo] = useState('deepwork');
  const [ambiente, setAmbiente] = useState('silencio');
  const [showToast, setShowToast] = useState(false);

  const handleGuardar = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const s = getStyles(isDark);

  return (
    <AppLayout>
      <div style={s.row2}>
        <div style={s.card}>
          <div style={s.cardHeader}>
            <div style={s.sectionLabel}>
              <ModalidadIcon isDark={isDark} />
              <span style={s.sectionTitle}>Modalidad de estudio preferida</span>
            </div>
            <ClockIcon />
          </div>

          <div style={s.toggleWrap}>
            <button
              style={modalidad === 'individual' ? s.toggleBtnActive : s.toggleBtnInactive}
              onClick={() => setModalidad('individual')}
            >
              Individual
            </button>
            <button
              style={modalidad === 'grupal' ? s.toggleBtnActive : s.toggleBtnInactive}
              onClick={() => setModalidad('grupal')}
            >
              Grupal
            </button>
          </div>

          <div style={s.recomBox}>
            <div style={s.recomHeader}>
              <RecomendacionIcon isDark={isDark} />
              <span style={s.recomTag}>RECOMENDACIÓN IA</span>
            </div>
            <p style={s.recomText}>
              Tu ritmo circadiano muestra picos de cortisol entre las 14:00 y las 17:00.
              Prioriza tareas de síntesis compleja en este horario.
            </p>
          </div>
        </div>

        <div style={s.card}>
          <div style={s.cardHeader}>
            <div style={s.sectionLabel}>
              <ResumenIcon isDark={isDark} />
              <span style={s.sectionTitle}>Resumen Inteligente</span>
            </div>
          </div>

          <div style={s.resumenList}>
            <div style={s.resumenItem}>
              <span style={{ ...s.dot, background: isDark ? '#FF5B2E' : '#FF8430' }} />
              <span style={s.resumenText}>
                Enfoque optimizado para <span style={s.resumenHighlight}>Deep Work</span>
              </span>
            </div>
            <div style={s.resumenItem}>
              <span style={{ ...s.dot, background: isDark ? '#C4107A' : '#F7306D' }} />
              <span style={s.resumenText}>
                Capacidad de retención estimada:{' '}
                <span
                  style={{ ...s.resumenHighlight, color: isDark ? '#C4107A' : '#F7306D' }}
                >
                  87%
                </span>
              </span>
            </div>
            <div style={s.resumenItem}>
              <span style={{ ...s.dot, background: isDark ? '#FF5B2E' : '#FF8430' }} />
              <span style={s.resumenText}>
                Próximo hito:{' '}
                <span style={s.resumenHighlight}>Nivel Investigador Senior</span>
              </span>
            </div>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: 20 }}>
            <ProgressBar value={72} isDark={isDark} />
            <div style={s.progressLabel}>Configuración 72% Completa</div>
          </div>
        </div>
      </div>

      <div style={s.cardFull}>
        <div style={s.cardHeader}>
          <div style={s.sectionLabel}>
            <MetodoIcon isDark={isDark} />
            <span style={s.sectionTitle}>
              {isDark ? 'Método de estudio preferido' : 'Técnica de Estudio'}
            </span>
          </div>
        </div>

        <div style={s.metodosGrid}>
          {METODOS.map((m) => {
            const isActive = metodo === m.id;
            return (
              <button
                key={m.id}
                style={isActive ? s.metodoCardActive : s.metodoCard}
                onClick={() => setMetodo(m.id)}
              >
                <div style={s.metodoIcon}>
                  <m.IconComp active={isActive} isDark={isDark} />
                </div>
                <div
                  style={{
                    ...s.metodoTitle,
                    color: isActive ? '#fff' : isDark ? '#fff' : 'rgba(0,0,0,0.85)',
                  }}
                >
                  {m.titulo}
                </div>
                <div
                  style={{
                    ...s.metodoDesc,
                    color: isActive
                      ? 'rgba(255,255,255,0.75)'
                      : isDark
                        ? 'rgba(255,255,255,0.45)'
                        : 'rgba(0,0,0,0.50)',
                  }}
                >
                  {m.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={s.cardFull}>
        <div style={s.cardHeader}>
          <div style={s.sectionLabel}>
            <AmbienteIcon isDark={isDark} />
            <span style={s.sectionTitle}>
              {isDark ? 'Ambiente de estudio preferido' : 'Duración Ideal'}
            </span>
          </div>
        </div>

        <div style={s.ambientesGrid}>
          {AMBIENTES.map((a) => {
            const isActive = ambiente === a.id;
            return (
              <button
                key={a.id}
                style={isActive ? s.ambienteCardActive : s.ambienteCard}
                onClick={() => setAmbiente(a.id)}
              >
                <div style={s.ambienteIcon}>
                  <a.IconComp active={isActive} isDark={isDark} />
                </div>
                <div
                  style={{
                    ...s.ambienteLabel,
                    color: isActive
                      ? '#fff'
                      : isDark
                        ? 'rgba(255,255,255,0.65)'
                        : 'rgba(0,0,0,0.65)',
                  }}
                >
                  {a.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={s.footerRow}>
        <button style={s.saveBtn} onClick={handleGuardar}>
          Guardar Preferencias →
        </button>
      </div>

      {showToast && <SuccessToast onClose={() => setShowToast(false)} />}
    </AppLayout>
  );
};

const getStyles = (isDark) => {
  const t = createStyles(isDark);
  return {
    row2: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16,
      marginBottom: 16,
    },
    card: {
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 16,
      padding: '20px 22px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: t.cardShadow,
    },
    cardFull: {
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 16,
      padding: '20px 22px',
      boxShadow: t.cardShadow,
      marginBottom: 16,
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    sectionLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: 700,
      color: t.textPrimary,
      fontFamily: t.fontSecondary,
    },
    toggleWrap: {
      display: 'flex',
      background: t.inputBg,
      borderRadius: 10,
      padding: 4,
      gap: 4,
      marginBottom: 16,
    },
    toggleBtnActive: {
      flex: 1,
      padding: '9px 0',
      border: 'none',
      borderRadius: 8,
      background: t.primaryGradient,
      color: '#fff',
      fontFamily: t.fontPrimary,
      fontSize: 13,
      fontWeight: 700,
      cursor: 'pointer',
    },
    toggleBtnInactive: {
      flex: 1,
      padding: '9px 0',
      border: 'none',
      borderRadius: 8,
      background: 'transparent',
      color: t.textSecondary,
      fontFamily: t.fontPrimary,
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer',
    },
    recomBox: {
      background: isDark ? 'rgba(255,91,46,0.07)' : 'rgba(255,132,48,0.07)',
      border: `1px solid ${isDark ? 'rgba(255,91,46,0.20)' : 'rgba(255,132,48,0.20)'}`,
      borderRadius: 10,
      padding: '10px 12px',
    },
    recomHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginBottom: 5,
    },
    recomTag: {
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: '0.10em',
      color: isDark ? '#FF5B2E' : '#FF8430',
      fontFamily: t.fontSecondary,
    },
    recomText: {
      fontSize: 11,
      lineHeight: 1.55,
      margin: 0,
      color: t.textSecondary,
    },
    resumenList: { display: 'flex', flexDirection: 'column', gap: 10 },
    resumenItem: { display: 'flex', alignItems: 'center', gap: 8 },
    dot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
    resumenText: {
      fontSize: 12,
      color: t.textSecondary,
    },
    resumenHighlight: {
      fontWeight: 700,
      color: isDark ? '#FF5B2E' : '#FF8430',
    },
    progressLabel: {
      fontSize: 9,
      letterSpacing: '0.06em',
      textAlign: 'right',
      color: t.textMuted,
      fontFamily: t.fontSecondary,
    },
    metodosGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 12,
    },
    metodoCard: {
      background: t.inputBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 12,
      padding: '14px 12px',
      textAlign: 'left',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
    },
    metodoCardActive: {
      background: t.primaryGradient,
      border: 'none',
      borderRadius: 12,
      padding: '14px 12px',
      textAlign: 'left',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      boxShadow: t.cardShadow,
    },
    metodoIcon: { marginBottom: 4 },
    metodoTitle: {
      fontSize: 13,
      fontWeight: 700,
      fontFamily: t.fontSecondary,
    },
    metodoDesc: {
      fontSize: 10,
      lineHeight: 1.5,
    },
    ambientesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: 12,
    },
    ambienteCard: {
      background: t.inputBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 12,
      padding: '18px 12px 14px',
      textAlign: 'center',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
    },
    ambienteCardActive: {
      background: t.primaryGradient,
      border: 'none',
      borderRadius: 12,
      padding: '18px 12px 14px',
      textAlign: 'center',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      boxShadow: t.cardShadow,
    },
    ambienteIcon: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
    ambienteLabel: {
      fontSize: 11,
      fontWeight: 600,
      fontFamily: t.fontSecondary,
    },
    footerRow: {
      display: 'flex',
      justifyContent: 'flex-end',
      paddingBottom: 8,
    },
    saveBtn: {
      padding: '13px 28px',
      border: 'none',
      borderRadius: 12,
      background: t.primaryGradient,
      color: '#fff',
      fontFamily: t.fontPrimary,
      fontSize: 14,
      fontWeight: 700,
      letterSpacing: '0.03em',
      cursor: 'pointer',
      boxShadow: t.cardShadow,
    },
  };
};

export default StudyPreferences;
