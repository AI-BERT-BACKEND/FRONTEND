import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

/* ── SVG Icons para cada tarjeta ── */
const DashboardIcon = ({ isDark }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke={isDark ? '#FF5B2E' : '#FF8430'} strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const CalendarIcon = ({ isDark }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke={isDark ? '#FF5B2E' : '#FF8430'} strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <circle cx="8" cy="15" r="1" fill={isDark ? '#FF5B2E' : '#FF8430'}/>
    <circle cx="12" cy="15" r="1" fill={isDark ? '#FF5B2E' : '#FF8430'}/>
    <circle cx="16" cy="15" r="1" fill={isDark ? '#FF5B2E' : '#FF8430'}/>
  </svg>
);

const MetasIcon = ({ isDark }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke={isDark ? '#FF5B2E' : '#FF8430'} strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

const PreferenciasIcon = ({ isDark }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke={isDark ? '#FF5B2E' : '#FF8430'} strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

/* ── Campana y Social para topbar ── */
const BellIcon = ({ isDark }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <linearGradient id="bellGradAM" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={isDark ? '#FF5B2E' : '#FF8430'}/>
        <stop offset="100%" stopColor={isDark ? '#C4107A' : '#F7306D'}/>
      </linearGradient>
    </defs>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="url(#bellGradAM)"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="url(#bellGradAM)"/>
  </svg>
);

const SocialIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const SECCIONES = [
  {
    id: 'SEC_01',
    IconComp: DashboardIcon,
    titulo: 'Dashboard Académico',
    descripcion: 'Resumen de rendimiento, promedio general, próximas entregas y progreso académico.',
    path: '/gestion/dashboard',
    accion: 'Entrar',
    extra: 'promedio',
  },
  {
    id: 'SEC_02',
    IconComp: CalendarIcon,
    titulo: 'Disponibilidad',
    descripcion: 'Configuración de horarios, bloques de estudio, horas libres y calendario semanal.',
    path: '/gestion/disponibilidad',
    accion: 'Configurar',
    extra: 'dias',
  },
  {
    id: 'SEC_03',
    IconComp: MetasIcon,
    titulo: 'Metas Académicas',
    descripcion: 'Metas de promedio, objetivos por materia y seguimiento de progreso en tiempo real.',
    path: '/gestion/metas',
    accion: 'Definir Metas',
    extra: 'circular',
  },
  {
    id: 'SEC_04',
    IconComp: PreferenciasIcon,
    titulo: 'Preferencias de Estudio',
    descripcion: 'Ajusta tu técnica de estudio, horario favorito y duración de las sesiones.',
    path: '/gestion/preferencias',
    accion: 'Personalizar',
    extra: 'preferencias',
  },
];

const DIAS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

const AcademicManagement = ({ theme = 'light', onToggleTheme }) => {
  const isDark = theme === 'dark';
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const navigate = useNavigate();
  const s = getStyles(isDark);

  const renderExtra = (extra) => {
    if (extra === 'promedio') {
      return (
        <div style={s.extraBlock}>
          <div style={s.promedioRow}>
            <span style={s.promedioLabel}>PROMEDIO GENERAL</span>
            <span style={s.promedioVal}>4.8 <span style={s.promedioMax}>/5.0</span></span>
          </div>
          <div style={s.progressTrack}>
            <div style={{ ...s.progressFill, width: '96%' }} />
          </div>
          <div style={s.badgeRow}>
            <span style={{ ...s.badge, background: isDark ? 'rgba(196,16,122,0.18)' : 'rgba(255,132,48,0.12)', color: isDark ? '#FF5B2E' : '#FF8430' }}>
              📌 PRÓXIMAS ENTREGAS: 2
            </span>
            <span style={{ ...s.badge, background: isDark ? 'rgba(196,16,122,0.18)' : 'rgba(247,48,109,0.10)', color: isDark ? '#C4107A' : '#F7306D' }}>
              ● RENDIMIENTO ALTO
            </span>
          </div>
        </div>
      );
    }
    if (extra === 'dias') {
      return (
        <div style={s.extraBlock}>
          <div style={s.diasRow}>
            {DIAS.map(d => (
              <div key={d} style={s.diaCircle}>{d}</div>
            ))}
          </div>
          <div style={s.estadoBadge}>
            📅 ESTADO: SEMANA PLANIFICADA
          </div>
        </div>
      );
    }
    if (extra === 'circular') {
      return (
        <div style={{ ...s.extraBlock, display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
          <CircleProgress pct={75} isDark={isDark} label="Progreso" />
        </div>
      );
    }
    if (extra === 'preferencias') {
      return (
        <div style={s.extraBlock}>
          <div style={s.prefItem}>
            <span style={s.prefIcon}>⏱️</span>
            <div>
              <div style={s.prefTitle}>Técnica: Pomodoro</div>
              <div style={s.prefSub}>Sesiones de 25 min + 5 break</div>
            </div>
          </div>
          <div style={{ ...s.prefItem, marginTop: 8 }}>
            <span style={s.prefIcon}>☀️</span>
            <div style={s.prefTitle}>Modalidad de estudio preferida</div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={s.root}>
      <div style={s.grid} />
      <Sidebar
        theme={theme}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(p => !p)}
      />
      <div style={s.main}>
        {/* TOPBAR */}
        <div style={s.topbar}>
          <div />
          <div style={s.topbarRight}>
            <button style={s.themeBtn} onClick={onToggleTheme}>
              <span style={{ fontSize: 15 }}>{isDark ? '☀️' : '🌙'}</span>
              <span style={{ fontSize: 12 }}>{isDark ? 'Modo claro' : 'Modo oscuro'}</span>
            </button>
            <button style={s.iconBtn}><BellIcon isDark={isDark} /></button>
            <button style={s.socialBtn}><SocialIcon /> Social</button>
          </div>
        </div>

        {/* CONTENT */}
        <div style={s.scrollArea}>
          <div style={s.content}>
            {!isDark && <h1 style={s.pageTitle}>Gestión Académica</h1>}

            <div style={s.grid2}>
              {SECCIONES.map(sec => (
                <div key={sec.id} style={s.card}>
                  <div style={s.cardTop}>
                    <div style={s.cardIcon}>
                      <sec.IconComp isDark={isDark} />
                    </div>
                    <span style={s.secId}>{sec.id}</span>
                  </div>
                  <div style={s.cardTitle}>{sec.titulo}</div>
                  <div style={s.cardDesc}>{sec.descripcion}</div>
                  {renderExtra(sec.extra)}
                  <button style={s.cardBtn} onClick={() => navigate(sec.path)}>
                    {sec.accion}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Circular Progress */
const CircleProgress = ({ pct, isDark, label }) => {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div style={{ position: 'relative', width: 100, height: 100 }}>
      <svg width="100" height="100" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="cg2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={isDark ? '#FF5B2E' : '#FF8430'}/>
            <stop offset="100%" stopColor={isDark ? '#C4107A' : '#F7306D'}/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r={r} fill="none"
          stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} strokeWidth="9"/>
        <circle cx="50" cy="50" r={r} fill="none"
          stroke="url(#cg2)" strokeWidth="9"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ / 4} strokeLinecap="round"/>
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 800, fontSize: 18,
          color: isDark ? '#FF5B2E' : '#FF8430',
        }}>{pct}%</span>
        <span style={{
          fontSize: 8,
          color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.40)',
          fontFamily: "'Poppins',sans-serif",
        }}>{label}</span>
      </div>
    </div>
  );
};

const getStyles = (isDark) => ({
  root: {
    display: 'flex', minHeight: '100vh', width: '100%',
    backgroundColor: isDark ? '#050208' : '#FDF2EB',
    fontFamily: "'Poppins', sans-serif",
    position: 'relative', margin: 0, padding: 0, boxSizing: 'border-box',
  },
  grid: {
    position: 'fixed', inset: 0,
    backgroundImage: isDark
      ? `linear-gradient(rgba(30,80,160,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(30,80,160,0.35) 1px, transparent 1px)`
      : `linear-gradient(rgba(220,150,120,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(220,150,120,0.25) 1px, transparent 1px)`,
    backgroundSize: '36px 36px',
    pointerEvents: 'none', zIndex: 0,
  },
  main: {
    flex: 1, display: 'flex', flexDirection: 'column',
    position: 'relative', zIndex: 1, minWidth: 0,
    backgroundColor: isDark ? '#050208' : '#FDF2EB',
  },
  topbar: {
    height: 56, display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', padding: '0 28px',
    borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
    backgroundColor: isDark ? '#0F0E0F' : '#FEFBF9',
    position: 'sticky', top: 0, zIndex: 5,
  },
  topbarRight: { display: 'flex', alignItems: 'center', gap: 10 },
  themeBtn: {
    background: isDark ? '#171717' : '#FEFAF9',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(220,193,181,0.30)'}`,
    borderRadius: 50, padding: '5px 14px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 6,
    fontFamily: "'Poppins', sans-serif",
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)', fontSize: 12,
  },
  iconBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    padding: '4px 6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  socialBtn: {
    background: isDark
      ? 'linear-gradient(90deg, #C4107A, #FF5B2E)'
      : 'linear-gradient(90deg, #FF8430, #F7306D)',
    border: 'none', borderRadius: 20, padding: '7px 16px',
    color: '#fff', fontFamily: "'Poppins', sans-serif",
    fontSize: 12, fontWeight: 600, cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 6,
  },
  scrollArea: { flex: 1, overflowY: 'auto', overflowX: 'hidden' },
  content: { padding: '28px 32px', width: '100%', boxSizing: 'border-box' },
  pageTitle: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 34, fontWeight: 800, margin: '0 0 28px 0',
    color: isDark ? '#FF5B2E' : '#FF8430',
  },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 },
  card: {
    background: isDark ? '#171717' : '#FEFAF9',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(220,193,181,0.30)'}`,
    borderRadius: 16, padding: '20px 22px',
    display: 'flex', flexDirection: 'column',
    boxShadow: isDark ? '0 4px 24px rgba(196,16,122,0.10)' : '0 4px 24px rgba(253,214,189,0.40)',
  },
  cardTop: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 12,
  },
  cardIcon: {
    width: 40, height: 40, borderRadius: 10,
    background: isDark ? 'rgba(255,91,46,0.12)' : 'rgba(255,132,48,0.10)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  secId: {
    fontSize: 10, letterSpacing: '0.10em',
    color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)',
    fontFamily: "'Poppins', sans-serif",
  },
  cardTitle: {
    fontSize: 16, fontWeight: 700,
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
    fontFamily: "'Poppins', sans-serif", marginBottom: 6,
  },
  cardDesc: {
    fontSize: 12, color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.50)',
    lineHeight: 1.5, marginBottom: 14,
  },
  extraBlock: { marginBottom: 16 },
  promedioRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  promedioLabel: {
    fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase',
    color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
  },
  promedioVal: {
    fontSize: 16, fontWeight: 800,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    color: isDark ? '#FF5B2E' : '#FF8430',
  },
  promedioMax: {
    fontSize: 11, fontWeight: 400,
    color: isDark ? 'rgba(255,255,255,0.30)' : 'rgba(0,0,0,0.30)',
  },
  progressTrack: {
    height: 6, borderRadius: 3,
    background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    overflow: 'hidden', marginBottom: 10,
  },
  progressFill: {
    height: '100%', borderRadius: 3,
    background: isDark ? 'linear-gradient(90deg,#FF5B2E,#C4107A)' : 'linear-gradient(90deg,#FF8430,#F7306D)',
  },
  badgeRow: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  badge: { fontSize: 9, fontWeight: 600, padding: '3px 8px', borderRadius: 20, letterSpacing: '0.04em' },
  diasRow: { display: 'flex', gap: 6, marginBottom: 10, justifyContent: 'center' },
  diaCircle: {
    width: 28, height: 28, borderRadius: '50%',
    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 10, fontWeight: 600,
    color: isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.50)',
  },
  estadoBadge: {
    fontSize: 10, fontWeight: 600,
    color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.40)',
    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    borderRadius: 8, padding: '5px 10px', textAlign: 'center',
  },
  prefItem: {
    display: 'flex', alignItems: 'center', gap: 10,
    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
    borderRadius: 8, padding: '8px 10px',
  },
  prefIcon: { fontSize: 16 },
  prefTitle: { fontSize: 12, fontWeight: 600, color: isDark ? 'rgba(255,255,255,0.70)' : 'rgba(0,0,0,0.70)' },
  prefSub: { fontSize: 10, color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)', marginTop: 2 },
  cardBtn: {
    marginTop: 'auto', width: '100%', padding: '11px 0',
    border: 'none', borderRadius: 10,
    background: isDark ? 'linear-gradient(90deg, #C4107A, #FF5B2E)' : 'linear-gradient(90deg, #FF8430, #F7306D)',
    color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 13, fontWeight: 700, letterSpacing: '0.04em', cursor: 'pointer',
  },
});

export default AcademicManagement;