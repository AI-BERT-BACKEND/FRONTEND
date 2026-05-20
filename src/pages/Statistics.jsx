import React, { useState } from 'react';
import AppLayout from '../components/Layout/AppLayout';
import { useTheme } from '../context/ThemeContext';
import { createStyles } from '../theme/createStyles';

// ── ICONS ──
const InfoIcon = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const FilterIcon = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="20" y2="6"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
    <line x1="11" y1="18" x2="13" y2="18"/>
  </svg>
);

const ArrowRightIcon = ({ color }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

const AlertTriangle = ({ color }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const BrainIcon = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2a2.5 2.5 0 0 1 5 0v.5"/>
    <path d="M14.5 2.5c1.5.5 2.5 2 2.5 3.5v1a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4v-1c0-1.5 1-3 2.5-3.5"/>
    <path d="M12 11v4"/><path d="M9 15h6"/>
    <path d="M7 15a5 5 0 0 0 10 0"/>
  </svg>
);

// ── DATA ──
const SEMESTRES = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'];
const NOTAS = [3.2, 3.5, 4.8, 3.8, 3.9, 4.1];
const NOTA_ACTUAL_IDX = 2; // Sem 3 es el actual (más alto)

const RECOMENDACIONES = [
  {
    id: 1,
    tipo: 'ENFOQUE',
    titulo: 'Enfoque: Árboles B+',
    descripcion: 'Tus últimas pruebas muestran debilidad en la rotación de nodos. Dedica 45 min extra a ejercicios de balanceo.',
  },
  {
    id: 2,
    tipo: 'ALERTA',
    titulo: 'Próximo Parcial (Impacto 30%)',
    descripcion: 'El examen final es en 10 días. Inicia el plan de repaso "Estructuras Dinámicas" para subir tu promedio a 4.2.',
  },
];

const Statistics = () => {
  const { isDark } = useTheme();
  const [filtroActivo, setFiltroActivo] = useState('GRAFOS & ÁRBOLES');
  const [semestreActivo, setSemestreActivo] = useState('SEM-03');
  const s = getStyles(isDark);

  const maxNota = Math.max(...NOTAS);

  return (
    <AppLayout>
      {/* ── PAGE HEADER ── */}
      <div style={s.pageHeader}>
        <div>
          <div style={s.carreraLabel}>INGENIERÍA DE SISTEMAS</div>
          <h1 style={s.pageTitle}>Estadísticas</h1>
          <div style={s.filtrosRow}>
            {['GRAFOS & ÁRBOLES', 'CÁLCULO'].map(f => (
              <button
                key={f}
                style={{ ...s.filtroBadge, ...(filtroActivo === f ? s.filtroBadgeActive : {}) }}
                onClick={() => setFiltroActivo(f)}
              >
                {f}
              </button>
            ))}
            {['SEM-03'].map(s2 => (
              <button
                key={s2}
                style={{ ...s.filtroBadge, ...(semestreActivo === s2 ? s.filtroBadgeActive : {}) }}
                onClick={() => setSemestreActivo(s2)}
              >
                {s2}
              </button>
            ))}
          </div>
        </div>

        <div style={s.promedioHeaderCard}>
          <div style={s.promedioHeaderLabel}>Promedio Actual</div>
          <div style={s.promedioHeaderVal}>3.8 / 5.0</div>
          <div style={s.riesgoModerado}>
            <AlertTriangle color="#EAB308" />
            <span>RIESGO MODERADO</span>
          </div>
        </div>
      </div>

      {/* ── MAIN ROW ── */}
      <div style={s.mainRow}>
        {/* GRÁFICO EVOLUCIÓN */}
        <div style={s.chartCard}>
          <div style={s.chartHeader}>
            <span style={s.chartTitle}>Evolución de Calificaciones</span>
            <div style={s.chartLegend}>
              <div style={s.legendItem}>
                <div style={{ ...s.legendDot, background: isDark ? '#FF5B2E' : '#FF8430' }} />
                <span style={s.legendText}>Actual</span>
              </div>
              <div style={s.legendItem}>
                <div style={{ ...s.legendDot, background: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.20)' }} />
                <span style={s.legendText}>Meta</span>
              </div>
            </div>
          </div>

          {/* BARRAS */}
          <div style={s.barsWrap}>
            {SEMESTRES.map((sem, i) => {
              const nota = NOTAS[i];
              const heightPct = (nota / 5.0) * 100;
              const isActual = i === NOTA_ACTUAL_IDX;
              return (
                <div key={sem} style={s.barCol}>
                  <div style={s.barOuter}>
                    <div style={{
                      ...s.barFill,
                      height: `${heightPct}%`,
                      background: isActual
                        ? isDark
                          ? 'linear-gradient(180deg, #FF5B2E, #C4107A)'
                          : 'linear-gradient(180deg, #FF8430, #F7306D)'
                        : isDark
                          ? 'rgba(255,255,255,0.14)'
                          : 'rgba(0,0,0,0.10)',
                    }} />
                  </div>
                  <span style={{ ...s.barLabel, color: isActual ? (isDark ? '#FF5B2E' : '#FF8430') : s.barLabel.color }}>
                    {sem}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMNA DERECHA STATS */}
        <div style={s.statsCol}>
          {/* Tiempo de Estudio */}
          <div style={s.statCard}>
            <div style={s.statCardHeader}>
              <span style={s.statCardTitle}>Tiempo de Estudio</span>
              <InfoIcon color={isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.30)'} />
            </div>
            <div style={s.statBig}>24.5</div>
            <div style={s.statUnit}>Horas / Sem</div>
            <div style={s.statTrend}>
              <div style={s.trendTrack}>
                <div style={{ ...s.trendFill, width: '72%' }} />
              </div>
              <span style={s.trendText}>+12% vs semana anterior</span>
            </div>
          </div>

          {/* Progreso de Tareas */}
          <div style={s.statCard}>
            <div style={s.statCardHeader}>
              <span style={s.statCardTitle}>Progreso de Tareas</span>
              <FilterIcon color={isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.30)'} />
            </div>
            <div style={s.statBig}>82%</div>
            <div style={s.statUnit}>Completado</div>
            <div style={s.progressTrack}>
              <div style={{ ...s.progressFill, width: '82%' }} />
            </div>
            <div style={s.statSubText}>Nota: 17 entregadas</div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW: Recomendaciones + AI.BERT ── */}
      <div style={s.bottomRow}>
        {/* RECOMENDACIONES */}
        <div style={s.recomCard}>
          <div style={s.recomHeader}>
            <BrainIcon color={isDark ? '#FF5B2E' : '#FF8430'} />
            <span style={s.recomTitle}>Recomendaciones de AIBert</span>
          </div>
          {RECOMENDACIONES.map(r => (
            <div key={r.id} style={s.recomItem}>
              <div style={s.recomItemLeft}>
                <div style={{
                  ...s.recomItemIcon,
                  background: r.tipo === 'ALERTA'
                    ? 'rgba(234,179,8,0.15)'
                    : isDark ? 'rgba(255,91,46,0.12)' : 'rgba(255,132,48,0.10)',
                }}>
                  {r.tipo === 'ALERTA'
                    ? <AlertTriangle color="#EAB308" />
                    : <BrainIcon color={isDark ? '#FF5B2E' : '#FF8430'} />
                  }
                </div>
                <div>
                  <div style={s.recomItemTitle}>{r.titulo}</div>
                  <div style={s.recomItemDesc}>{r.descripcion}</div>
                </div>
              </div>
              <button style={s.recomArrow}>
                <ArrowRightIcon color={isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.35)'} />
              </button>
            </div>
          ))}
        </div>

        {/* AI.BERT CARD */}
        <div style={s.aibertCard}>
          {/* Círculo animado */}
          <div style={s.aibertCircleWrap}>
            <div style={s.aibertCircle1} />
            <div style={s.aibertCircle2} />
            <div style={s.aibertCircle3} />
            <div style={s.aibertLabel}>AI.BERT</div>
          </div>
          <p style={s.aibertQuote}>
            "¡Estás a solo 5 tareas de alcanzar el nivel <strong>Experto en Grafos!</strong>"
          </p>
          <button style={s.aibertBtn}>INICIAR SESIÓN DE ESTUDIO</button>
        </div>
      </div>
    </AppLayout>
  );
};

const getStyles = (isDark) => {
  const t = createStyles(isDark);
  return {
    pageHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 24,
      gap: 16,
    },
    carreraLabel: {
      fontSize: 10,
      letterSpacing: '0.10em',
      fontWeight: 700,
      color: isDark ? '#FF5B2E' : '#FF8430',
      fontFamily: t.fontSecondary,
      marginBottom: 4,
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
      margin: '0 0 12px 0',
    },
    filtrosRow: { display: 'flex', gap: 8, flexWrap: 'wrap' },
    filtroBadge: {
      padding: '4px 12px',
      borderRadius: 20,
      border: `1px solid ${t.cardBorder}`,
      background: 'transparent',
      cursor: 'pointer',
      fontFamily: t.fontSecondary,
      fontSize: 10,
      fontWeight: 600,
      color: t.textSecondary,
      letterSpacing: '0.04em',
    },
    filtroBadgeActive: {
      background: isDark ? 'rgba(255,91,46,0.18)' : 'rgba(255,132,48,0.15)',
      border: `1px solid ${isDark ? 'rgba(255,91,46,0.40)' : 'rgba(255,132,48,0.40)'}`,
      color: isDark ? '#FF5B2E' : '#FF8430',
    },
    promedioHeaderCard: {
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 14,
      padding: '14px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      alignItems: 'flex-end',
      boxShadow: t.cardShadow,
      flexShrink: 0,
    },
    promedioHeaderLabel: { fontSize: 10, color: t.textMuted, fontFamily: t.fontSecondary },
    promedioHeaderVal: {
      fontFamily: t.fontPrimary,
      fontSize: 22,
      fontWeight: 800,
      color: isDark ? '#FF5B2E' : '#FF8430',
    },
    riesgoModerado: {
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      background: 'rgba(234,179,8,0.15)',
      border: '1px solid rgba(234,179,8,0.30)',
      borderRadius: 20,
      padding: '3px 10px',
      fontSize: 9,
      fontWeight: 700,
      color: '#EAB308',
      letterSpacing: '0.05em',
    },

    // MAIN ROW
    mainRow: { display: 'flex', gap: 16, marginBottom: 16, alignItems: 'stretch' },

    // CHART
    chartCard: {
      flex: 1,
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 16,
      padding: '20px 24px',
      boxShadow: t.cardShadow,
    },
    chartHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    chartTitle: { fontFamily: t.fontPrimary, fontSize: 16, fontWeight: 700, color: t.textPrimary },
    chartLegend: { display: 'flex', gap: 14 },
    legendItem: { display: 'flex', alignItems: 'center', gap: 5 },
    legendDot: { width: 8, height: 8, borderRadius: '50%' },
    legendText: { fontSize: 11, color: t.textSecondary, fontFamily: t.fontSecondary },
    barsWrap: {
      display: 'flex',
      gap: 12,
      alignItems: 'flex-end',
      height: 160,
      padding: '0 8px',
    },
    barCol: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      height: '100%',
    },
    barOuter: {
      flex: 1,
      width: '100%',
      display: 'flex',
      alignItems: 'flex-end',
      background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
      borderRadius: 6,
      overflow: 'hidden',
    },
    barFill: {
      width: '100%',
      borderRadius: 6,
      transition: 'height 0.4s ease',
    },
    barLabel: {
      fontSize: 10,
      fontFamily: t.fontSecondary,
      color: t.textMuted,
      fontWeight: 500,
    },

    // STATS COL
    statsCol: { width: 220, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14 },
    statCard: {
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 14,
      padding: '16px 18px',
      boxShadow: t.cardShadow,
      flex: 1,
    },
    statCardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    statCardTitle: { fontSize: 12, fontWeight: 600, color: t.textSecondary, fontFamily: t.fontSecondary },
    statBig: {
      fontFamily: t.fontPrimary,
      fontSize: 32,
      fontWeight: 800,
      color: isDark ? '#FF5B2E' : '#FF8430',
      lineHeight: 1,
      marginBottom: 2,
    },
    statUnit: { fontSize: 11, color: t.textMuted, fontFamily: t.fontSecondary, marginBottom: 10 },
    statTrend: { display: 'flex', flexDirection: 'column', gap: 5 },
    trendTrack: {
      height: 4,
      borderRadius: 2,
      background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
      overflow: 'hidden',
    },
    trendFill: {
      height: '100%',
      borderRadius: 2,
      background: isDark ? 'linear-gradient(90deg,#FF5B2E,#C4107A)' : 'linear-gradient(90deg,#FF8430,#F7306D)',
    },
    trendText: { fontSize: 10, color: isDark ? '#22C55E' : '#16A34A', fontWeight: 600 },
    progressTrack: {
      height: 5,
      borderRadius: 3,
      background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
      overflow: 'hidden',
      marginBottom: 6,
    },
    progressFill: {
      height: '100%',
      borderRadius: 3,
      background: isDark ? 'linear-gradient(90deg,#FF5B2E,#C4107A)' : 'linear-gradient(90deg,#FF8430,#F7306D)',
    },
    statSubText: { fontSize: 10, color: t.textMuted },

    // BOTTOM ROW
    bottomRow: { display: 'flex', gap: 16, alignItems: 'stretch' },

    // RECOMENDACIONES
    recomCard: {
      flex: 1,
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 16,
      padding: '18px 20px',
      boxShadow: t.cardShadow,
    },
    recomHeader: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 },
    recomTitle: { fontFamily: t.fontPrimary, fontSize: 14, fontWeight: 700, color: t.textPrimary },
    recomItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
      background: t.inputBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 10,
      padding: '12px 14px',
      marginBottom: 10,
    },
    recomItemLeft: { display: 'flex', alignItems: 'flex-start', gap: 10, flex: 1 },
    recomItemIcon: {
      width: 30, height: 30, borderRadius: 8, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    recomItemTitle: { fontFamily: t.fontSecondary, fontSize: 12, fontWeight: 600, color: t.textPrimary, marginBottom: 3 },
    recomItemDesc: { fontSize: 11, color: t.textSecondary, lineHeight: 1.45 },
    recomArrow: {
      background: 'none', border: 'none', cursor: 'pointer',
      display: 'flex', alignItems: 'center', padding: 4, flexShrink: 0,
    },

    // AI.BERT
    aibertCard: {
      width: 220,
      flexShrink: 0,
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 16,
      padding: '20px',
      boxShadow: t.cardShadow,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 14,
    },
    aibertCircleWrap: {
      position: 'relative',
      width: 100,
      height: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    aibertCircle1: {
      position: 'absolute',
      width: 100, height: 100,
      borderRadius: '50%',
      border: `2px solid ${isDark ? 'rgba(255,91,46,0.25)' : 'rgba(255,132,48,0.20)'}`,
    },
    aibertCircle2: {
      position: 'absolute',
      width: 76, height: 76,
      borderRadius: '50%',
      border: `2px solid ${isDark ? 'rgba(255,91,46,0.40)' : 'rgba(255,132,48,0.35)'}`,
    },
    aibertCircle3: {
      position: 'absolute',
      width: 54, height: 54,
      borderRadius: '50%',
      background: isDark
        ? 'radial-gradient(circle, rgba(255,91,46,0.25), rgba(196,16,122,0.15))'
        : 'radial-gradient(circle, rgba(255,132,48,0.20), rgba(247,48,109,0.10))',
      border: `1px solid ${isDark ? 'rgba(255,91,46,0.50)' : 'rgba(255,132,48,0.45)'}`,
    },
    aibertLabel: {
      position: 'relative',
      fontFamily: t.fontPrimary,
      fontSize: 12,
      fontWeight: 800,
      backgroundImage: t.primaryGradient,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      zIndex: 1,
    },
    aibertQuote: {
      fontSize: 12,
      color: t.textSecondary,
      textAlign: 'center',
      lineHeight: 1.5,
      margin: 0,
    },
    aibertBtn: {
      width: '100%',
      padding: '10px',
      border: 'none',
      borderRadius: 10,
      background: isDark
        ? 'linear-gradient(90deg, #C4107A, #FF5B2E)'
        : 'linear-gradient(90deg, #FF8430, #F7306D)',
      color: '#fff',
      fontFamily: t.fontPrimary,
      fontSize: 11,
      fontWeight: 700,
      cursor: 'pointer',
      letterSpacing: '0.04em',
    },
  };
};

export default Statistics;