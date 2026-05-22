import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/Layout/AppLayout';
import CircleProgress from '../components/CircleProgress';
import ProgressBar from '../components/ProgressBar';
import StatusBadge from '../components/StatusBadge';
import { useTheme } from '../context/ThemeContext';
import { createStyles } from '../theme/createStyles';

const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#F9A825" stroke="#F9A825" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FB923C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const PinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F472B6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const EditIcon = ({ isDark }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#FF5B2E' : '#FF8430'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const CalendarAccesoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const MetaAccesoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F7306D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const PlayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff" stroke="none">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const ESTADO_COLORS = {
  ESTABLE:   { bg: 'rgba(76,175,80,0.18)',  text: '#4CAF50' },
  MEJORANDO: { bg: 'rgba(33,150,243,0.18)', text: '#2196F3' },
  CRÍTICO:   { bg: 'rgba(244,67,54,0.18)',  text: '#F44336' },
};

const AcademicDashboard = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const s = getStyles(isDark);

  const stats = [
    { id: 1, IconComp: StarIcon,  label: 'Promedio general',   value: '4.8', badge: '+0.3 este mes', badgeColor: '#4CAF50' },
    { id: 2, IconComp: BookIcon,  label: 'Materias activas',   value: '6',   badge: null },
    { id: 3, IconComp: ClockIcon, label: 'Horas estudiadas',   value: '124h',badge: null },
    { id: 4, IconComp: PinIcon,   label: 'Tareas pendientes',  value: '12',  badge: null },
  ];

  const rendimiento = [
    { id: 1, nombre: 'Arquitectura de Datos', nota: 4.9 },
    { id: 2, nombre: 'IA Avanzado',           nota: 4.7 },
    { id: 3, nombre: 'Ética Computacional',   nota: 4.2 },
  ];

  const materias = [
    { id: 1, nombre: 'Criptografía I',      nota: 4.9, progreso: 82, estado: 'ESTABLE',   color: '#FF8430' },
    { id: 2, nombre: 'Sistemas Operativos', nota: 4.2, progreso: 64, estado: 'MEJORANDO', color: '#C4107A' },
    { id: 3, nombre: 'Redes Neuronales',    nota: 3.5, progreso: 45, estado: 'CRÍTICO',   color: '#F7306D' },
  ];

  return (
    <AppLayout>
      <button style={s.volverBtn} onClick={() => navigate(-1)}>← Volver</button>

      {/* STATS */}
      <div style={s.statsRow}>
        {stats.map((stat) => (
          <div key={stat.id} style={s.statCard}>
            <div style={s.statTop}>
              <stat.IconComp />
              <StatusBadge
                label={stat.badge}
                color={stat.badgeColor}
                bgColor="transparent"
                style={{ padding: 0 }}
              />
            </div>
            <div style={s.statLabel}>{stat.label}</div>
            <div style={s.statValue}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* MIDDLE ROW */}
      <div style={s.midRow}>
        <div style={{ ...s.card, flex: 1 }}>
          <div style={s.cardHeader}>
            <span style={s.cardTitle}>Rendimiento Académico</span>
            <button style={s.editBtn}>
              <EditIcon isDark={isDark} />
            </button>
          </div>
          <div style={s.rendimientoBody}>
            <div style={s.circleWrap}>
              <CircleProgress pct={92} isDark={isDark} size={130} label="GLOBAL" />
            </div>
            <div style={s.barsList}>
              {rendimiento.map((r) => (
                <div key={r.id} style={s.barItem}>
                  <div style={s.barLabelRow}>
                    <span style={s.barLabel}>{r.nombre}</span>
                    <span style={s.barVal}>{r.nota}</span>
                  </div>
                  <ProgressBar
                    value={(r.nota / 5) * 100}
                    isDark={isDark}
                    color={
                      r.id === 1
                        ? isDark ? 'linear-gradient(90deg,#FF5B2E,#C4107A)' : 'linear-gradient(90deg,#FF8430,#F7306D)'
                        : r.id === 2
                          ? isDark ? '#C4107A' : '#F7306D'
                          : isDark ? 'rgba(255,255,255,0.20)' : 'rgba(0,0,0,0.15)'
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ ...s.card, ...s.accesosCard }}>
          <span style={s.cardTitle}>Accesos Rápidos</span>
          <button style={s.accesoBtn} onClick={() => navigate('/calendario')}>
            <CalendarAccesoIcon />
            <span>Configurar horario</span>
          </button>
          <button style={s.accesoBtn} onClick={() => navigate('/gestion/metas')}>
            <MetaAccesoIcon />
            <span>Crear meta</span>
          </button>
          <button style={s.accesoSesionBtn} onClick={() => navigate('/sesion')}>
            <PlayIcon />
            <span>Iniciar sesión de estudio</span>
          </button>
        </div>
      </div>

      <div style={s.materiasRow}>
        {materias.map((m) => {
          const ec = ESTADO_COLORS[m.estado] || { bg: 'rgba(255,255,255,0.08)', text: '#fff' };
          return (
            <div key={m.id} style={s.materiaCard}>
              <div style={s.materiaTop}>
                <span style={s.materiaNombre}>{m.nombre}</span>
                <StatusBadge label={m.estado} color={ec.text} bgColor={ec.bg} />
              </div>
              <div style={s.materiaLabel}>NOTA ACTUAL</div>
              <div style={s.materiaRow}>
                <span style={s.materiaValor}>{m.nota}</span>
                <div style={s.materiaProgresoWrap}>
                  <span style={s.materiaProgresoLabel}>Progreso</span>
                  <span style={s.materiaProgresoPct}>{m.progreso}%</span>
                </div>
              </div>
              <ProgressBar value={m.progreso} isDark={isDark} color={m.color} />
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
};

const getStyles = (isDark) => {
  const t = createStyles(isDark);
  return {
    volverBtn: {
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: 'none', border: 'none', cursor: 'pointer',
      fontSize: 13, fontWeight: 600,
      color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.50)',
      fontFamily: t.fontSecondary, padding: '4px 0', marginBottom: 12,
    },
    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 16 },
    statCard: {
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 14,
      padding: '14px 16px',
      boxShadow: t.cardShadow,
    },
    statTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    statLabel: { fontSize: 11, color: t.textMuted, marginBottom: 4 },
    statValue: { fontFamily: t.fontPrimary, fontWeight: 800, fontSize: 26, color: t.textPrimary },
    midRow: { display: 'flex', gap: 14, marginBottom: 16, alignItems: 'stretch' },
    card: {
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 16,
      padding: '18px 20px',
      boxShadow: t.cardShadow,
    },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    cardTitle: { fontSize: 14, fontWeight: 700, color: t.textPrimary, fontFamily: t.fontSecondary },
    editBtn: { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 2 },
    rendimientoBody: { display: 'flex', gap: 20, alignItems: 'center' },
    circleWrap: { flexShrink: 0 },
    barsList: { flex: 1, display: 'flex', flexDirection: 'column', gap: 12 },
    barItem: {},
    barLabelRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 4 },
    barLabel: { fontSize: 12, color: t.textSecondary },
    barVal: { fontSize: 12, fontWeight: 700, color: isDark ? '#FF5B2E' : '#FF8430' },
    accesosCard: { width: 220, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 10 },
    accesoBtn: {
      display: 'flex', alignItems: 'center', gap: 10,
      background: t.inputBg, border: `1px solid ${t.inputBorder}`,
      borderRadius: 10, padding: '10px 14px', cursor: 'pointer',
      width: '100%', fontFamily: t.fontSecondary, fontSize: 12,
      fontWeight: 500, color: t.textPrimary, textAlign: 'left',
    },
    accesoSesionBtn: {
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      background: t.primaryGradient, border: 'none', borderRadius: 10,
      padding: '11px 14px', cursor: 'pointer', width: '100%',
      fontFamily: t.fontSecondary, fontSize: 12, fontWeight: 700,
      color: '#fff', marginTop: 4,
    },
    materiasRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 },
    materiaCard: {
      background: t.cardBg, border: `1px solid ${t.cardBorder}`,
      borderRadius: 14, padding: '16px 18px', boxShadow: t.cardShadow,
    },
    materiaTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
    materiaNombre: { fontSize: 13, fontWeight: 700, color: t.textPrimary, fontFamily: t.fontSecondary },
    materiaLabel: { fontSize: 10, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 },
    materiaRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 },
    materiaValor: { fontFamily: t.fontPrimary, fontWeight: 800, fontSize: 28, color: isDark ? '#FF5B2E' : '#FF8430' },
    materiaProgresoWrap: { textAlign: 'right' },
    materiaProgresoLabel: { display: 'block', fontSize: 10, color: t.textMuted },
    materiaProgresoPct: { display: 'block', fontSize: 13, fontWeight: 700, color: t.textSecondary },
  };
};

export default AcademicDashboard;