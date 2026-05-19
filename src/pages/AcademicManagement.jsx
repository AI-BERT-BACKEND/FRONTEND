import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const SECCIONES = [
  {
    id: 'SEC_01',
    icon: '⊞',
    titulo: 'Dashboard Académico',
    descripcion: 'Resumen de rendimiento, promedio general, próximas entregas y progreso académico.',
    path: '/gestion/dashboard',
    accion: 'Entrar',
    extra: 'promedio',
  },
  {
    id: 'SEC_02',
    icon: '📅',
    titulo: 'Disponibilidad',
    descripcion: 'Configuración de horarios, bloques de estudio, horas libres y calendario semanal.',
    path: '/gestion/disponibilidad',
    accion: 'Configurar',
    extra: 'dias',
  },
  {
    id: 'SEC_03',
    icon: '🎯',
    titulo: 'Metas Académicas',
    descripcion: 'Metas de promedio, objetivos por materia y seguimiento de progreso en tiempo real.',
    path: '/gestion/metas',
    accion: 'Definir Metas',
    extra: 'circular',
  },
  {
    id: 'SEC_04',
    icon: '💡',
    titulo: 'Preferencias de Estudio',
    descripcion: 'Ajusta tu técnica de estudio, horario favorito y duración de las sesiones.',
    path: '/gestion/preferencias',
    accion: 'Personalizar',
    extra: 'preferencias',
  },
];

const DIAS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

const GestionAcademica = ({ theme = 'light', onToggleTheme }) => {
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
        <div style={{ ...s.extraBlock, alignItems: 'center', display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
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
            <button style={s.iconBtn}>🔔</button>
            <button style={s.socialBtn}>👥 Social</button>
          </div>
        </div>

        {/* CONTENT */}
        <div style={s.scrollArea}>
          <div style={s.content}>
            {/* TÍTULO - solo en modo claro según diseño */}
            {!isDark && (
              <h1 style={s.pageTitle}>Gestión Académica</h1>
            )}

            {/* GRID DE TARJETAS */}
            <div style={s.grid2}>
              {SECCIONES.map(sec => (
                <div key={sec.id} style={s.card}>
                  <div style={s.cardTop}>
                    <div style={s.cardIcon}>{sec.icon}</div>
                    <span style={s.secId}>{sec.id}</span>
                  </div>
                  <div style={s.cardTitle}>{sec.titulo}</div>
                  <div style={s.cardDesc}>{sec.descripcion}</div>

                  {renderExtra(sec.extra)}

                  <button
                    style={s.cardBtn}
                    onClick={() => navigate(sec.path)}
                  >
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
            <stop offset="0%" stopColor={isDark ? '#FF5B2E' : '#FF8430'} />
            <stop offset="100%" stopColor={isDark ? '#C4107A' : '#F7306D'} />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r={r} fill="none"
          stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}
          strokeWidth="9" />
        <circle cx="50" cy="50" r={r} fill="none"
          stroke="url(#cg2)" strokeWidth="9"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ / 4}
          strokeLinecap="round" />
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
    display: 'flex',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: isDark ? '#050208' : '#FDF2EB',
    fontFamily: "'Poppins', sans-serif",
    position: 'relative',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  },
  grid: {
    position: 'fixed',
    inset: 0,
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
    backgroundColor: isDark ? '#050208' : '#FDF2EB',
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
    fontSize: 34,
    fontWeight: 800,
    margin: '0 0 28px 0',
    color: isDark ? '#FF5B2E' : '#FF8430',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 20,
  },
  card: {
    background: isDark ? '#171717' : '#FEFAF9',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(220,193,181,0.30)'}`,
    borderRadius: 16,
    padding: '20px 22px',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    boxShadow: isDark
      ? '0 4px 24px rgba(196,16,122,0.10)'
      : '0 4px 24px rgba(253,214,189,0.40)',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardIcon: {
    fontSize: 22,
    width: 40,
    height: 40,
    borderRadius: 10,
    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,132,48,0.10)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secId: {
    fontSize: 10,
    letterSpacing: '0.10em',
    color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)',
    fontFamily: "'Poppins', sans-serif",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
    fontFamily: "'Poppins', sans-serif",
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 12,
    color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.50)',
    lineHeight: 1.5,
    marginBottom: 14,
  },
  extraBlock: {
    marginBottom: 16,
  },
  promedioRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  promedioLabel: {
    fontSize: 9,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
  },
  promedioVal: {
    fontSize: 16,
    fontWeight: 800,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    color: isDark ? '#FF5B2E' : '#FF8430',
  },
  promedioMax: {
    fontSize: 11,
    fontWeight: 400,
    color: isDark ? 'rgba(255,255,255,0.30)' : 'rgba(0,0,0,0.30)',
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    background: isDark
      ? 'linear-gradient(90deg,#FF5B2E,#C4107A)'
      : 'linear-gradient(90deg,#FF8430,#F7306D)',
  },
  badgeRow: {
    display: 'flex',
    gap: 6,
    flexWrap: 'wrap',
  },
  badge: {
    fontSize: 9,
    fontWeight: 600,
    padding: '3px 8px',
    borderRadius: 20,
    letterSpacing: '0.04em',
  },
  diasRow: {
    display: 'flex',
    gap: 6,
    marginBottom: 10,
    justifyContent: 'center',
  },
  diaCircle: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 10,
    fontWeight: 600,
    color: isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.50)',
  },
  estadoBadge: {
    fontSize: 10,
    fontWeight: 600,
    color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.40)',
    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: '5px 10px',
    textAlign: 'center',
  },
  prefItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
    borderRadius: 8,
    padding: '8px 10px',
  },
  prefIcon: {
    fontSize: 16,
  },
  prefTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: isDark ? 'rgba(255,255,255,0.70)' : 'rgba(0,0,0,0.70)',
  },
  prefSub: {
    fontSize: 10,
    color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
    marginTop: 2,
  },
  cardBtn: {
    marginTop: 'auto',
    width: '100%',
    padding: '11px 0',
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
});

export default GestionAcademica;