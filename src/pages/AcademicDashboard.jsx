import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const STATS_DEFAULT = [
  { id: 1, icon: '⭐', label: 'Promedio general', value: null, badge: '+0.3 este mes', badgeColor: '#4CAF50' },
  { id: 2, icon: '📋', label: 'Materias activas', value: null, badge: null },
  { id: 3, icon: '⏱️', label: 'Horas estudiadas', value: null, badge: null },
  { id: 4, icon: '📌', label: 'Tareas pendientes', value: null, badge: null },
];

const MATERIAS_DEFAULT = [
  { id: 1, nombre: '', nota: null, progreso: null, estado: '' },
  { id: 2, nombre: '', nota: null, progreso: null, estado: '' },
  { id: 3, nombre: '', nota: null, progreso: null, estado: '' },
];

const RENDIMIENTO_DEFAULT = [
  { id: 1, nombre: '', nota: null },
  { id: 2, nombre: '', nota: null },
  { id: 3, nombre: '', nota: null },
];

const ESTADO_COLORS = {
  ESTABLE:  { bg: 'rgba(76,175,80,0.18)',   text: '#4CAF50' },
  MEJORANDO:{ bg: 'rgba(33,150,243,0.18)',  text: '#2196F3' },
  CRÍTICO:  { bg: 'rgba(244,67,54,0.18)',   text: '#F44336' },
  ALTO:     { bg: 'rgba(76,175,80,0.18)',   text: '#4CAF50' },
};

const AcademicDashboard = ({ theme = 'light', onToggleTheme }) => {
  const isDark = theme === 'dark';
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const s = getStyles(isDark);


  const [stats] = useState([
    { ...STATS_DEFAULT[0], value: '4.8' },
    { ...STATS_DEFAULT[1], value: '6' },
    { ...STATS_DEFAULT[2], value: '124h' },
    { ...STATS_DEFAULT[3], value: '12' },
  ]);

  const [rendimiento] = useState([
    { id: 1, nombre: 'Arquitectura de Datos', nota: 4.9 },
    { id: 2, nombre: 'IA Avanzado',            nota: 4.7 },
    { id: 3, nombre: 'Ética Computacional',    nota: 4.2 },
  ]);

  const [materias] = useState([
    { id: 1, nombre: 'Criptografía I',      nota: 4.9, progreso: 82, estado: 'ESTABLE'   },
    { id: 2, nombre: 'Sistemas Operativos', nota: 4.2, progreso: 64, estado: 'MEJORANDO' },
    { id: 3, nombre: 'Redes Neuronales',    nota: 3.5, progreso: 45, estado: 'CRÍTICO'   },
  ]);

  const promedioGlobal = 92;

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

        <div style={s.scrollArea}>
          <div style={s.content}>

            {/* STATS CARDS */}
            <div style={s.statsRow}>
              {stats.map(stat => (
                <div key={stat.id} style={s.statCard}>
                  <div style={s.statTop}>
                    <span style={s.statIcon}>{stat.icon}</span>
                    {stat.badge && (
                      <span style={{ ...s.statBadge, color: stat.badgeColor || (isDark ? '#FF5B2E' : '#FF8430') }}>
                        {stat.badge}
                      </span>
                    )}
                  </div>
                  <div style={s.statLabel}>{stat.label}</div>
                  <div style={s.statValue}>{stat.value ?? '—'}</div>
                </div>
              ))}
            </div>

            {/* MIDDLE ROW */}
            <div style={s.midRow}>
              {/* RENDIMIENTO ACADÉMICO */}
              <div style={{ ...s.card, flex: 1 }}>
                <div style={s.cardHeader}>
                  <span style={s.cardTitle}>Rendimiento Académico</span>
                  <button style={s.editBtn}>✏️</button>
                </div>
                <div style={s.rendimientoBody}>
                  {/* Círculo */}
                  <div style={s.circleWrap}>
                    <CircleProgress pct={promedioGlobal} isDark={isDark} />
                  </div>
                  {/* Barras */}
                  <div style={s.barsList}>
                    {rendimiento.map(r => (
                      <div key={r.id} style={s.barItem}>
                        <div style={s.barLabelRow}>
                          <span style={s.barLabel}>{r.nombre || '—'}</span>
                          <span style={s.barVal}>{r.nota ?? '—'}</span>
                        </div>
                        <div style={s.barTrack}>
                          <div style={{
                            ...s.barFill,
                            width: r.nota ? `${(r.nota / 5) * 100}%` : '0%',
                            background: r.id === 1
                              ? (isDark ? 'linear-gradient(90deg,#FF5B2E,#C4107A)' : 'linear-gradient(90deg,#FF8430,#F7306D)')
                              : r.id === 2
                                ? (isDark ? '#C4107A' : '#F7306D')
                                : (isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.20)'),
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ACCESOS RÁPIDOS */}
              <div style={{ ...s.card, ...s.accesosCard }}>
                <span style={s.cardTitle}>Accesos Rápidos</span>
                <button style={s.accesoBtn} onClick={() => navigate('/calendario')}>
                  <span>📅</span>
                  <span>Configurar horario</span>
                </button>
                <button style={s.accesoBtn} onClick={() => navigate('/gestion/metas')}>
                  <span>🎯</span>
                  <span>Crear meta</span>
                </button>
                <button style={s.accesoSesionBtn} onClick={() => navigate('/sesion')}>
                  <span>▶</span>
                  <span>Iniciar sesión de estudio</span>
                </button>
              </div>
            </div>

            {/* MATERIAS CARDS */}
            <div style={s.materiasRow}>
              {materias.map(m => {
                const ec = ESTADO_COLORS[m.estado] || { bg: 'rgba(255,255,255,0.08)', text: '#fff' };
                return (
                  <div key={m.id} style={s.materiaCard}>
                    <div style={s.materiaTop}>
                      <span style={s.materiaNombre}>{m.nombre || '—'}</span>
                      <span style={{ ...s.estadoBadge, background: ec.bg, color: ec.text }}>
                        {m.estado || '—'}
                      </span>
                    </div>
                    <div style={s.materiaLabel}>Nota Actual</div>
                    <div style={s.materiaRow}>
                      <span style={s.materiaValor}>{m.nota ?? '—'}</span>
                      <div style={s.materiaProgresoWrap}>
                        <span style={s.materiaProgresoLabel}>Progreso</span>
                        <span style={s.materiaProgresoPct}>{m.progreso != null ? `${m.progreso}%` : '—'}</span>
                      </div>
                    </div>
                    <div style={s.materiaTrack}>
                      <div style={{
                        ...s.materiaFill,
                        width: m.progreso != null ? `${m.progreso}%` : '0%',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Circular Progress ── */
const CircleProgress = ({ pct, isDark }) => {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div style={{ position: 'relative', width: 130, height: 130 }}>
      <svg width="130" height="130" viewBox="0 0 130 130">
        <defs>
          <linearGradient id="acadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={isDark ? '#FF5B2E' : '#FF8430'} />
            <stop offset="100%" stopColor={isDark ? '#C4107A' : '#F7306D'} />
          </linearGradient>
        </defs>
        <circle cx="65" cy="65" r={r} fill="none"
          stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}
          strokeWidth="11" />
        <circle cx="65" cy="65" r={r} fill="none"
          stroke="url(#acadGrad)" strokeWidth="11"
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
          fontWeight: 800, fontSize: 24,
          color: isDark ? '#FF5B2E' : '#FF8430',
        }}>{pct}%</span>
        <span style={{
          fontSize: 9, letterSpacing: '0.08em',
          color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.40)',
          fontFamily: "'Poppins',sans-serif",
          textTransform: 'uppercase',
        }}>GLOBAL</span>
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
    margin: 0, padding: 0,
    boxSizing: 'border-box',
  },
  grid: {
    position: 'fixed', inset: 0,
    backgroundImage: `
      linear-gradient(${isDark ? 'rgba(4,27,54,0.7)' : 'rgba(253,238,230,0.9)'} 1px, transparent 1px),
      linear-gradient(90deg, ${isDark ? 'rgba(4,27,54,0.7)' : 'rgba(253,238,230,0.9)'} 1px, transparent 1px)
    `,
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
  iconBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, padding: '4px 6px' },
  socialBtn: {
    background: isDark
      ? 'linear-gradient(90deg, #C4107A, #FF5B2E)'
      : 'linear-gradient(90deg, #FF8430, #F7306D)',
    border: 'none', borderRadius: 8, padding: '6px 16px',
    color: '#fff', fontFamily: "'Poppins', sans-serif",
    fontSize: 12, fontWeight: 600, cursor: 'pointer',
  },
  scrollArea: { flex: 1, overflowY: 'auto', overflowX: 'hidden' },
  content: { padding: '24px 28px', width: '100%', boxSizing: 'border-box' },

  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 14, marginBottom: 16,
  },
  statCard: {
    background: isDark ? '#171717' : '#FEFAF9',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(220,193,181,0.30)'}`,
    borderRadius: 14, padding: '14px 16px',
    boxShadow: isDark ? '0 4px 20px rgba(196,16,122,0.08)' : '0 4px 20px rgba(253,214,189,0.40)',
  },
  statTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  statIcon: { fontSize: 18 },
  statBadge: { fontSize: 9, fontWeight: 600, letterSpacing: '0.04em' },
  statLabel: {
    fontSize: 11, color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)',
    marginBottom: 4,
  },
  statValue: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: 800, fontSize: 26,
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
  },

  midRow: { display: 'flex', gap: 14, marginBottom: 16, alignItems: 'stretch' },
  card: {
    background: isDark ? '#171717' : '#FEFAF9',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(220,193,181,0.30)'}`,
    borderRadius: 16, padding: '18px 20px',
    boxShadow: isDark ? '0 4px 24px rgba(196,16,122,0.10)' : '0 4px 24px rgba(253,214,189,0.40)',
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: {
    fontSize: 14, fontWeight: 700,
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
    fontFamily: "'Poppins', sans-serif",
  },
  editBtn: {
    background: 'none', border: 'none', cursor: 'pointer', fontSize: 14,
    color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.30)',
  },
  rendimientoBody: { display: 'flex', gap: 20, alignItems: 'center' },
  circleWrap: { flexShrink: 0 },
  barsList: { flex: 1, display: 'flex', flexDirection: 'column', gap: 12 },
  barItem: {},
  barLabelRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 4 },
  barLabel: { fontSize: 12, color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.60)' },
  barVal: { fontSize: 12, fontWeight: 700, color: isDark ? '#FF5B2E' : '#FF8430' },
  barTrack: {
    height: 6, borderRadius: 3,
    background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 3 },

  accesosCard: {
    width: 220, flexShrink: 0,
    display: 'flex', flexDirection: 'column', gap: 10,
  },
  accesoBtn: {
    display: 'flex', alignItems: 'center', gap: 10,
    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(220,193,181,0.30)'}`,
    borderRadius: 10, padding: '10px 14px',
    cursor: 'pointer', width: '100%',
    fontFamily: "'Poppins', sans-serif",
    fontSize: 12, fontWeight: 500,
    color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.70)',
    textAlign: 'left',
  },
  accesoSesionBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    background: isDark
      ? 'linear-gradient(90deg, #C4107A, #FF5B2E)'
      : 'linear-gradient(90deg, #FF8430, #F7306D)',
    border: 'none', borderRadius: 10, padding: '11px 14px',
    cursor: 'pointer', width: '100%',
    fontFamily: "'Poppins', sans-serif",
    fontSize: 12, fontWeight: 700, color: '#fff',
    marginTop: 4,
  },

  materiasRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 14,
  },
  materiaCard: {
    background: isDark ? '#171717' : '#FEFAF9',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(220,193,181,0.30)'}`,
    borderRadius: 14, padding: '16px 18px',
    boxShadow: isDark ? '0 4px 20px rgba(196,16,122,0.08)' : '0 4px 20px rgba(253,214,189,0.35)',
  },
  materiaTop: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 8,
  },
  materiaNombre: {
    fontSize: 13, fontWeight: 700,
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
    fontFamily: "'Poppins', sans-serif",
  },
  estadoBadge: {
    fontSize: 9, fontWeight: 700,
    padding: '3px 8px', borderRadius: 20,
    letterSpacing: '0.06em',
  },
  materiaLabel: {
    fontSize: 10, color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4,
  },
  materiaRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 },
  materiaValor: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: 800, fontSize: 28,
    color: isDark ? '#FF5B2E' : '#FF8430',
  },
  materiaProgresoWrap: { textAlign: 'right' },
  materiaProgresoLabel: {
    display: 'block', fontSize: 10,
    color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
  },
  materiaProgresoPct: {
    display: 'block', fontSize: 13, fontWeight: 700,
    color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.70)',
  },
  materiaTrack: {
    height: 5, borderRadius: 3,
    background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  materiaFill: {
    height: '100%', borderRadius: 3,
    background: isDark
      ? 'linear-gradient(90deg,#FF5B2E,#C4107A)'
      : 'linear-gradient(90deg,#FF8430,#F7306D)',
  },
});

export default AcademicDashboard;