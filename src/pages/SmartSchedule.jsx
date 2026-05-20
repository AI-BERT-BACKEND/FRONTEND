import React, { useState } from 'react';
import AppLayout from '../components/Layout/AppLayout';
import { useTheme } from '../context/ThemeContext';
import { createStyles } from '../theme/createStyles';

const ChevronLeft = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const ChevronRight = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const BrainIcon = ({ color }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2a2.5 2.5 0 0 1 5 0v.5"/>
    <path d="M14.5 2.5c1.5.5 2.5 2 2.5 3.5v1a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4v-1c0-1.5 1-3 2.5-3.5"/>
    <path d="M12 11v4"/><path d="M9 15h6"/>
    <path d="M7 15a5 5 0 0 0 10 0"/>
  </svg>
);

const MoonIcon = ({ color }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const AlertIcon = ({ color }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const DIAS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
const FECHAS = [14, 15, 16, 17, 18, 19, 20];
const DIA_HOY = 2;

const EVENTOS = {
  0: [
    { id: 1, hora: '08:00 - 10:00', nombre: 'Neurociencia I', color: '#3B82F6', tipo: 'clase' },
  ],
  1: [
    { id: 2, hora: '11:00 - 13:00', nombre: 'Examen: Cálculo II', color: '#F00707', tipo: 'examen', badge: 'ALTA PRIORIDAD' },
    { id: 3, hora: '15:00 - 16:00', nombre: 'Física Teórica', color: '#A855F7', tipo: 'clase' },
  ],
  2: [
    { id: 4, hora: '09:00 - 11:00', nombre: 'IA Aplicada', color: '#FF5B2E', tipo: 'clase' },
    { id: 5, hora: '13:00 - 14:00', nombre: 'Neurociencia I', color: '#3B82F6', tipo: 'clase' },
    { id: 6, hora: '14:00 - 15:00', nombre: 'Laboratorio', color: '#22C55E', tipo: 'lab' },
  ],
  3: [
    { id: 7, hora: '10:00 - 11:30', nombre: 'Neurociencia I', color: '#3B82F6', tipo: 'clase' },
    { id: 8, hora: '14:00 - 16:00', nombre: 'Entrega: Proyecto Final', color: '#EAB308', tipo: 'entrega' },
    { id: 9, hora: '', nombre: 'Estudio Grupal', color: '#6B7280', tipo: 'estudio' },
  ],
  4: [
    { id: 10, hora: '09:00 - 10:30', nombre: 'Física Teórica', color: '#A855F7', tipo: 'clase' },
    { id: 11, hora: '16:00 - 17:00', nombre: 'Sesión Mentoría', color: '#FF8430', tipo: 'mentoria', badge: '' },
    { id: 12, hora: '', nombre: 'Break', color: '#22C55E', tipo: 'break' },
  ],
  5: [
    { id: 13, hora: '', nombre: 'Taller Opcional', color: '#6B7280', tipo: 'opcional' },
    { id: 14, hora: '', nombre: 'Investigación', color: '#6B7280', tipo: 'estudio' },
    { id: 15, hora: '', nombre: 'Física Teórica', color: '#A855F7', tipo: 'clase' },
  ],
  6: [],
};

const DISTRIBUCION = [
  { label: 'Estudio', pct: 68, color: isDarkHelper => isDarkHelper ? '#FF5B2E' : '#FF8430' },
  { label: 'Práctica', pct: 22, color: () => '#C4107A' },
  { label: 'Descanso', pct: 10, color: () => '#3B82F6' },
];

const SmartSchedule = () => {
  const { isDark } = useTheme();
  const [semana, setSemana] = useState(12);
  const s = getStyles(isDark);

  return (
    <AppLayout>
      <div style={s.alertBanner}>
        <div style={s.alertLeft}>
          <div style={s.alertDot} />
          <span style={s.alertBrand}>Albert rebalanceo</span>
        </div>
        <span style={s.alertText}>Se han reorganizado 2 sesiones para optimizar tu descanso y maximizar la retención cognitiva.</span>
      </div>

      <div style={s.pageHeader}>
        <div>
          <h1 style={s.pageTitle}>Semana {semana}</h1>
          <p style={s.pageDesc}>Octubre 14 - Octubre 20, 2024</p>
        </div>
        <div style={s.headerBtns}>
          <button style={s.navBtn} onClick={() => setSemana(p => p - 1)}>
            <ChevronLeft color={isDark ? 'rgba(255,255,255,0.60)' : 'rgba(0,0,0,0.55)'} />
            Regresar
          </button>
          <button style={s.confirmBtn}>Confirmar</button>
        </div>
      </div>

      <div style={s.calendarCard}>
        <div style={s.calendarGrid}>
          {DIAS.map((dia, i) => (
            <div key={dia} style={s.diaCol}>
              <div style={s.diaHeader}>
                <span style={s.diaNombre}>{dia}</span>
                <span style={{
                  ...s.diaNum,
                  ...(i === DIA_HOY ? s.diaNumHoy : {}),
                }}>
                  {FECHAS[i]}
                </span>
              </div>
              <div style={s.diaEventos}>
                {(EVENTOS[i] || []).map(ev => (
                  <div key={ev.id} style={{
                    ...s.evento,
                    borderLeft: `3px solid ${ev.color}`,
                    background: ev.color + (isDark ? '18' : '12'),
                  }}>
                    {ev.badge && (
                      <span style={{ ...s.eventoBadge, background: ev.color + '30', color: ev.color }}>
                        {ev.badge}
                      </span>
                    )}
                    {ev.hora && <span style={s.eventoHora}>{ev.hora}</span>}
                    <span style={{ ...s.eventoNombre, color: ev.color }}>{ev.nombre}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={s.bottomRow}>
        <div style={s.distribucionCard}>
          <div style={s.sectionTitle}>Distribución de Carga</div>
          <div style={s.distribList}>
            {DISTRIBUCION.map(d => (
              <div key={d.label} style={s.distribItem}>
                <div style={s.distribLabelRow}>
                  <span style={s.distribLabel}>{d.label}</span>
                  <span style={{ fontSize: 10, color: d.color(isDark), fontWeight: 700 }}>{d.pct}%</span>
                </div>
                <div style={s.distribTrack}>
                  <div style={{ ...s.distribFill, width: `${d.pct}%`, background: d.color(isDark) }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={s.suenioCard}>
          <div style={s.suenioLeft}>
            <div style={s.sectionTitle}>Optimizador de Sueño</div>
            <p style={s.suenioDesc}>
              Se detectó que tu rendimiento bajó los jueves. He movido la sesión de Física al Viernes para asegurar 8 horas de sueño reparador.
            </p>
            <div style={s.suenioBtns}>
              <button style={s.suenioBtnOutline}>Los Descansos</button>
              <button style={s.suenioBtnGrad}>Sesión → 4hs</button>
            </div>
          </div>
          <div style={s.suenioCircleWrap}>
            <svg width="80" height="80" viewBox="0 0 80 80">
              <defs>
                <linearGradient id="sleepGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={isDark ? '#FF5B2E' : '#FF8430'} />
                  <stop offset="100%" stopColor={isDark ? '#C4107A' : '#F7306D'} />
                </linearGradient>
              </defs>
              <circle cx="40" cy="40" r="34" fill="none"
                stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}
                strokeWidth="7" />
              <circle cx="40" cy="40" r="34" fill="none"
                stroke="url(#sleepGrad)" strokeWidth="7"
                strokeDasharray={`${0.92 * 2 * Math.PI * 34} ${2 * Math.PI * 34}`}
                strokeDashoffset={2 * Math.PI * 34 * 0.25}
                strokeLinecap="round" />
            </svg>
            <div style={s.suenioCircleLabel}>92%</div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

const getStyles = (isDark) => {
  const t = createStyles(isDark);
  return {
    alertBanner: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      background: isDark
        ? 'linear-gradient(90deg, rgba(255,91,46,0.15), rgba(196,16,122,0.10))'
        : 'linear-gradient(90deg, rgba(255,132,48,0.12), rgba(247,48,109,0.08))',
      border: `1px solid ${isDark ? 'rgba(255,91,46,0.30)' : 'rgba(255,132,48,0.30)'}`,
      borderRadius: 10,
      padding: '10px 16px',
      marginBottom: 20,
    },
    alertLeft: { display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 },
    alertDot: {
      width: 8, height: 8, borderRadius: '50%',
      background: isDark ? '#FF5B2E' : '#FF8430',
    },
    alertBrand: {
      fontFamily: t.fontPrimary,
      fontSize: 11,
      fontWeight: 700,
      color: isDark ? '#FF5B2E' : '#FF8430',
      whiteSpace: 'nowrap',
    },
    alertText: { fontSize: 12, color: t.textSecondary, lineHeight: 1.4 },
    pageHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 20,
    },
    pageTitle: {
      fontFamily: t.fontPrimary,
      fontSize: 36,
      fontWeight: 800,
      backgroundImage: t.primaryGradient,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      width: 'fit-content',
      margin: '0 0 4px 0',
    },
    pageDesc: { fontSize: 12, color: t.textMuted, margin: 0 },
    headerBtns: { display: 'flex', gap: 10, alignItems: 'center' },
    navBtn: {
      display: 'flex', alignItems: 'center', gap: 6,
      background: 'transparent',
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 8, padding: '8px 14px',
      cursor: 'pointer', fontFamily: t.fontSecondary,
      fontSize: 12, fontWeight: 500, color: t.textSecondary,
    },
    confirmBtn: {
      background: t.primaryGradient,
      border: 'none', borderRadius: 8, padding: '8px 20px',
      color: '#fff', fontFamily: t.fontPrimary,
      fontSize: 12, fontWeight: 700, cursor: 'pointer',
    },
    calendarCard: {
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 16,
      padding: '16px 20px',
      boxShadow: t.cardShadow,
      marginBottom: 16,
      overflowX: 'auto',
    },
    calendarGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 8,
      minWidth: 700,
    },
    diaCol: { display: 'flex', flexDirection: 'column', gap: 8 },
    diaHeader: {
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: 4, paddingBottom: 10,
      borderBottom: `1px solid ${t.cardBorder}`,
    },
    diaNombre: {
      fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
      color: t.textMuted, fontFamily: t.fontSecondary,
    },
    diaNum: {
      fontSize: 14, fontWeight: 700,
      color: t.textSecondary, fontFamily: t.fontPrimary,
    },
    diaNumHoy: {
      width: 28, height: 28, borderRadius: '50%',
      background: isDark ? 'linear-gradient(135deg,#FF5B2E,#C4107A)' : 'linear-gradient(135deg,#FF8430,#F7306D)',
      color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 13,
    },
    diaEventos: { display: 'flex', flexDirection: 'column', gap: 6 },
    evento: {
      borderRadius: 8,
      padding: '7px 9px',
      display: 'flex', flexDirection: 'column', gap: 3,
      cursor: 'pointer',
    },
    eventoBadge: {
      fontSize: 8, fontWeight: 700, padding: '1px 6px',
      borderRadius: 20, letterSpacing: '0.04em',
      width: 'fit-content',
    },
    eventoHora: { fontSize: 9, color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.40)' },
    eventoNombre: { fontSize: 11, fontWeight: 600, fontFamily: t.fontSecondary, lineHeight: 1.3 },
    bottomRow: { display: 'flex', gap: 16, alignItems: 'stretch' },
    distribucionCard: {
      flex: 1,
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 14,
      padding: '18px 20px',
      boxShadow: t.cardShadow,
    },
    sectionTitle: {
      fontFamily: t.fontPrimary, fontSize: 14, fontWeight: 700,
      color: t.textPrimary, marginBottom: 16,
    },
    distribList: { display: 'flex', flexDirection: 'column', gap: 14 },
    distribItem: {},
    distribLabelRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 6 },
    distribLabel: { fontSize: 12, color: t.textSecondary, fontFamily: t.fontSecondary },
    distribTrack: {
      height: 6, borderRadius: 3,
      background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', overflow: 'hidden',
    },
    distribFill: { height: '100%', borderRadius: 3, transition: 'width 0.4s ease' },
    suenioCard: {
      flex: 1,
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 14,
      padding: '18px 20px',
      boxShadow: t.cardShadow,
      display: 'flex', alignItems: 'center', gap: 20,
    },
    suenioLeft: { flex: 1 },
    suenioDesc: { fontSize: 12, color: t.textSecondary, lineHeight: 1.55, margin: '0 0 14px 0' },
    suenioBtns: { display: 'flex', gap: 10 },
    suenioBtnOutline: {
      background: 'transparent',
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 8, padding: '7px 14px',
      cursor: 'pointer', fontFamily: t.fontSecondary,
      fontSize: 11, fontWeight: 600, color: t.textSecondary,
    },
    suenioBtnGrad: {
      background: t.primaryGradient,
      border: 'none', borderRadius: 8, padding: '7px 14px',
      cursor: 'pointer', fontFamily: t.fontSecondary,
      fontSize: 11, fontWeight: 600, color: '#fff',
    },
    suenioCircleWrap: { position: 'relative', width: 80, height: 80, flexShrink: 0 },
    suenioCircleLabel: {
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: t.fontPrimary, fontSize: 16, fontWeight: 800,
      color: isDark ? '#FF5B2E' : '#FF8430',
    },
  };
};

export default SmartSchedule;