import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import GridBackground from '../components/GridBackground';


const ModalidadIcon = ({ isDark }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke={isDark ? '#FF5B2E' : '#FF8430'} strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const MetodoIcon = ({ isDark }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke={isDark ? '#FF5B2E' : '#FF8430'} strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const AmbienteIcon = ({ isDark }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke={isDark ? '#FF5B2E' : '#FF8430'} strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const ResumenIcon = ({ isDark }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke={isDark ? '#FF5B2E' : '#FF8430'} strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);

const RecomendacionIcon = ({ isDark }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke={isDark ? '#FF5B2E' : '#FF8430'} strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="rgba(255,255,255,0.35)" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const PomodoroIcon = ({ active, isDark }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke={active ? '#fff' : (isDark ? '#FF5B2E' : '#FF8430')} strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const DeepWorkIcon = ({ active, isDark }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke={active ? '#fff' : (isDark ? '#FF5B2E' : '#FF8430')} strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const BloquesIcon = ({ active, isDark }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke={active ? '#fff' : (isDark ? '#FF5B2E' : '#FF8430')} strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
  </svg>
);

const RapidasIcon = ({ active, isDark }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke={active ? '#fff' : (isDark ? '#FF5B2E' : '#FF8430')} strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <polyline points="13 17 18 12 13 7"/>
    <polyline points="6 17 11 12 6 7"/>
  </svg>
);


const BibliotecaIcon = ({ active, isDark }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke={active ? '#fff' : (isDark ? '#FF5B2E' : '#FF8430')} strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);

const MusicaIcon = ({ active, isDark }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke={active ? '#fff' : (isDark ? '#FF5B2E' : '#FF8430')} strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13"/>
    <circle cx="6" cy="18" r="3"/>
    <circle cx="18" cy="16" r="3"/>
  </svg>
);

const SilencioIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke={active ? '#fff' : '#fff'} strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <line x1="23" y1="9" x2="17" y2="15"/>
    <line x1="17" y1="9" x2="23" y2="15"/>
  </svg>
);

const CasaIcon = ({ active, isDark }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke={active ? '#fff' : (isDark ? '#FF5B2E' : '#FF8430')} strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const AireLibreIcon = ({ active, isDark }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke={active ? '#fff' : (isDark ? '#FF5B2E' : '#FF8430')} strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
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


const StudyPreferences = ({ theme = 'light', onToggleTheme }) => {
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  const [modalidad, setModalidad] = useState('grupal');
  const [metodo, setMetodo] = useState('deepwork');
  const [ambiente, setAmbiente] = useState('silencio');

  const s = getStyles(isDark);

  return (
    <div style={s.root}>
      <GridBackground isDark={isDark} />

      <Sidebar
        theme={theme}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(p => !p)}
      />

      <div style={s.main}>
        <Header theme={theme} onToggleTheme={onToggleTheme} />

        <div style={s.scrollArea}>
          <div style={s.content}>


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
                      Enfoque optimizado para{' '}
                      <span style={s.resumenHighlight}>Deep Work</span>
                    </span>
                  </div>
                  <div style={s.resumenItem}>
                    <span style={{ ...s.dot, background: isDark ? '#C4107A' : '#F7306D' }} />
                    <span style={s.resumenText}>
                      Capacidad de retención estimada:{' '}
                      <span style={{ ...s.resumenHighlight, color: isDark ? '#C4107A' : '#F7306D' }}>87%</span>
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

                {/* Progress bar */}
                <div style={{ marginTop: 'auto', paddingTop: 20 }}>
                  <div style={s.progressTrack}>
                    <div style={{ ...s.progressFill, width: '72%' }} />
                  </div>
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
                {METODOS.map(m => {
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
                      <div style={{ ...s.metodoTitle, color: isActive ? '#fff' : (isDark ? '#fff' : 'rgba(0,0,0,0.85)') }}>
                        {m.titulo}
                      </div>
                      <div style={{ ...s.metodoDesc, color: isActive ? 'rgba(255,255,255,0.75)' : (isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.50)') }}>
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
                {AMBIENTES.map(a => {
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
                      <div style={{
                        ...s.ambienteLabel,
                        color: isActive ? '#fff' : (isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)'),
                      }}>
                        {a.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>


            <div style={s.footerRow}>
              <button style={s.saveBtn}>
                Guardar Preferencias →
              </button>
            </div>

          </div>
        </div>
      </div>
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
    backgroundColor: isDark ? '#050208' : '#FDF2EB',
  },
  main: {
    flex: 1, display: 'flex', flexDirection: 'column',
    position: 'relative', zIndex: 1, minWidth: 0,
  },
  scrollArea: { flex: 1, overflowY: 'auto', overflowX: 'hidden' },
  content: { padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 },


  row2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
  },


  card: {
    background: isDark ? '#171717' : '#FEFAF9',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(220,193,181,0.30)'}`,
    borderRadius: 16,
    padding: '20px 22px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: isDark
      ? '0 4px 24px rgba(196,16,122,0.10)'
      : '0 4px 24px rgba(253,214,189,0.40)',
  },
  cardFull: {
    background: isDark ? '#171717' : '#FEFAF9',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(220,193,181,0.30)'}`,
    borderRadius: 16,
    padding: '20px 22px',
    boxShadow: isDark
      ? '0 4px 24px rgba(196,16,122,0.10)'
      : '0 4px 24px rgba(253,214,189,0.40)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionLabel: {
    display: 'flex', alignItems: 'center', gap: 8,
  },
  sectionTitle: {
    fontSize: 13, fontWeight: 700,
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
    fontFamily: "'Poppins', sans-serif",
  },


  toggleWrap: {
    display: 'flex',
    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    borderRadius: 10,
    padding: 4,
    gap: 4,
    marginBottom: 16,
  },
  toggleBtnActive: {
    flex: 1, padding: '9px 0',
    border: 'none', borderRadius: 8,
    background: isDark
      ? 'linear-gradient(90deg, #C4107A, #FF5B2E)'
      : 'linear-gradient(90deg, #FF8430, #F7306D)',
    color: '#fff',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 13, fontWeight: 700,
    cursor: 'pointer',
  },
  toggleBtnInactive: {
    flex: 1, padding: '9px 0',
    border: 'none', borderRadius: 8,
    background: 'transparent',
    color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.40)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 13, fontWeight: 600,
    cursor: 'pointer',
  },


  recomBox: {
    background: isDark ? 'rgba(255,91,46,0.07)' : 'rgba(255,132,48,0.07)',
    border: `1px solid ${isDark ? 'rgba(255,91,46,0.20)' : 'rgba(255,132,48,0.20)'}`,
    borderRadius: 10,
    padding: '10px 12px',
  },
  recomHeader: {
    display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5,
  },
  recomTag: {
    fontSize: 9, fontWeight: 700, letterSpacing: '0.10em',
    color: isDark ? '#FF5B2E' : '#FF8430',
    fontFamily: "'Poppins', sans-serif",
  },
  recomText: {
    fontSize: 11, lineHeight: 1.55, margin: 0,
    color: isDark ? 'rgba(255,255,255,0.60)' : 'rgba(0,0,0,0.55)',
  },


  resumenList: { display: 'flex', flexDirection: 'column', gap: 10 },
  resumenItem: { display: 'flex', alignItems: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  resumenText: {
    fontSize: 12,
    color: isDark ? 'rgba(255,255,255,0.60)' : 'rgba(0,0,0,0.55)',
  },
  resumenHighlight: {
    fontWeight: 700,
    color: isDark ? '#FF5B2E' : '#FF8430',
  },
  progressTrack: {
    height: 6, borderRadius: 3,
    background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    overflow: 'hidden', marginBottom: 6,
  },
  progressFill: {
    height: '100%', borderRadius: 3,
    background: isDark
      ? 'linear-gradient(90deg,#FF5B2E,#C4107A)'
      : 'linear-gradient(90deg,#FF8430,#F7306D)',
  },
  progressLabel: {
    fontSize: 9, letterSpacing: '0.06em', textAlign: 'right',
    color: isDark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.30)',
    fontFamily: "'Poppins', sans-serif",
  },


  metodosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 12,
  },
  metodoCard: {
    background: isDark ? 'rgba(255,255,255,0.04)' : '#FDEEE6',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(220,193,181,0.30)'}`,
    borderRadius: 12,
    padding: '14px 12px',
    textAlign: 'left',
    cursor: 'pointer',
    display: 'flex', flexDirection: 'column', gap: 6,
  },
  metodoCardActive: {
    background: isDark
      ? 'linear-gradient(135deg, #C4107A, #FF5B2E)'
      : 'linear-gradient(135deg, #FF8430, #F7306D)',
    border: 'none',
    borderRadius: 12,
    padding: '14px 12px',
    textAlign: 'left',
    cursor: 'pointer',
    display: 'flex', flexDirection: 'column', gap: 6,
    boxShadow: isDark
      ? '0 6px 20px rgba(196,16,122,0.35)'
      : '0 6px 20px rgba(247,48,109,0.30)',
  },
  metodoIcon: { marginBottom: 4 },
  metodoTitle: {
    fontSize: 13, fontWeight: 700,
    fontFamily: "'Poppins', sans-serif",
  },
  metodoDesc: {
    fontSize: 10, lineHeight: 1.5,
  },


  ambientesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 12,
  },
  ambienteCard: {
    background: isDark ? 'rgba(255,255,255,0.04)' : '#FDEEE6',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(220,193,181,0.30)'}`,
    borderRadius: 12,
    padding: '18px 12px 14px',
    textAlign: 'center',
    cursor: 'pointer',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: 8,
  },
  ambienteCardActive: {
    background: isDark
      ? 'linear-gradient(135deg, #C4107A, #FF5B2E)'
      : 'linear-gradient(135deg, #FF8430, #F7306D)',
    border: 'none',
    borderRadius: 12,
    padding: '18px 12px 14px',
    textAlign: 'center',
    cursor: 'pointer',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: 8,
    boxShadow: isDark
      ? '0 6px 20px rgba(196,16,122,0.35)'
      : '0 6px 20px rgba(247,48,109,0.30)',
  },
  ambienteIcon: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  ambienteLabel: {
    fontSize: 11, fontWeight: 600,
    fontFamily: "'Poppins', sans-serif",
  },

  footerRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  saveBtn: {
    padding: '13px 28px',
    border: 'none', borderRadius: 12,
    background: isDark
      ? 'linear-gradient(90deg, #C4107A, #FF5B2E)'
      : 'linear-gradient(90deg, #FF8430, #F7306D)',
    color: '#fff',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 14, fontWeight: 700,
    letterSpacing: '0.03em',
    cursor: 'pointer',
    boxShadow: isDark
      ? '0 4px 18px rgba(196,16,122,0.40)'
      : '0 4px 18px rgba(247,48,109,0.35)',
  },
});

export default StudyPreferences;