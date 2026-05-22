import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import statsService from '../services/statsService';
import academicService from '../services/academicService';
import AppLayout from '../components/Layout/AppLayout';
import CircleProgress from '../components/CircleProgress';
import ProgressBar from '../components/ProgressBar';
import { Pin, Circle, Calendar, Timer, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { createStyles } from '../theme/createStyles';

const DashboardIcon = ({ isDark }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke={isDark ? '#FF5B2E' : '#FF8430'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const CalendarIcon = ({ isDark }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke={isDark ? '#FF5B2E' : '#FF8430'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <circle cx="8" cy="15" r="1" fill={isDark ? '#FF5B2E' : '#FF8430'} />
    <circle cx="12" cy="15" r="1" fill={isDark ? '#FF5B2E' : '#FF8430'} />
    <circle cx="16" cy="15" r="1" fill={isDark ? '#FF5B2E' : '#FF8430'} />
  </svg>
);

const MetasIcon = ({ isDark }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke={isDark ? '#FF5B2E' : '#FF8430'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const PreferenciasIcon = ({ isDark }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke={isDark ? '#FF5B2E' : '#FF8430'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const SECCIONES = [
  {
    id: 'SEC_01',
    IconComp: DashboardIcon,
    titulo: 'Dashboard Académico',
    descripcion:
      'Resumen de rendimiento, promedio general, próximas entregas y progreso académico.',
    path: '/gestion/dashboard',
    accion: 'Entrar',
    extra: 'promedio',
  },
  {
    id: 'SEC_02',
    IconComp: CalendarIcon,
    titulo: 'Disponibilidad',
    descripcion:
      'Configuración de horarios, bloques de estudio, horas libres y calendario semanal.',
    path: '/gestion/disponibilidad',
    accion: 'Configurar',
    extra: 'dias',
  },
  {
    id: 'SEC_03',
    IconComp: MetasIcon,
    titulo: 'Metas Académicas',
    descripcion:
      'Metas de promedio, objetivos por materia y seguimiento de progreso en tiempo real.',
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

const AcademicManagement = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const s = getStyles(isDark);
  const t = createStyles(isDark);

  const [loading, setLoading] = useState(true);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [gradeEvolution, setGradeEvolution] = useState([]);
  const [promedio, setPromedio] = useState(0);
  const [progreso, setProgreso] = useState(0);
  const [entregas, setEntregas] = useState(0);
  const [rendimiento, setRendimiento] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboard, summary] = await Promise.all([
          statsService.getDashboard(),
          academicService.getSummary(),
        ]);

        setSessionHistory(dashboard.sessionHistory ?? []);
        setGradeEvolution(dashboard.gradeEvolution ?? []);
        setPromedio(dashboard.average ?? 0);
        setProgreso(dashboard.progress ?? 0);
        setEntregas(summary.pendingDeliveries ?? 0);
        setRendimiento(summary.performance ?? '');
      } catch {
        // Keep defaults on error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: t.textMuted }}>
          Cargando...
        </div>
      </AppLayout>
    );
  }

  const renderExtra = (extra) => {
    if (extra === 'promedio') {
      return (
        <div style={s.extraBlock}>
          <div style={s.promedioRow}>
            <span style={s.promedioLabel}>PROMEDIO GENERAL</span>
            <span style={s.promedioVal}>
              {promedio} <span style={s.promedioMax}>/5.0</span>
            </span>
          </div>
          <ProgressBar value={progreso} isDark={isDark} />
          <div style={s.badgeRow}>
            <span
              style={{
                ...s.badge,
                background: isDark ? 'rgba(196,16,122,0.18)' : 'rgba(255,132,48,0.12)',
                color: isDark ? '#FF5B2E' : '#FF8430',
                display: 'flex', alignItems: 'center', gap: 4
              }}
            >
              <Pin size={10} /> PRÓXIMAS ENTREGAS: {entregas}
            </span>
            <span
              style={{
                ...s.badge,
                background: isDark ? 'rgba(196,16,122,0.18)' : 'rgba(247,48,109,0.10)',
                color: isDark ? '#C4107A' : '#F7306D',
                display: 'flex', alignItems: 'center', gap: 4
              }}
            >
              <Circle size={8} fill="currentColor" /> {rendimiento}
            </span>
          </div>
        </div>
      );
    }
    if (extra === 'dias') {
      return (
        <div style={s.extraBlock}>
          <div style={s.diasRow}>
            {DIAS.map((d) => (
              <div key={d} style={s.diaCircle}>
                {d}
              </div>
            ))}
          </div>
          <div style={{ ...s.estadoBadge, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Calendar size={12} /> ESTADO: SEMANA PLANIFICADA
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
            <Timer size={16} color={isDark ? '#FF5B2E' : '#FF8430'} />
            <div>
              <div style={s.prefTitle}>Técnica: Pomodoro</div>
              <div style={s.prefSub}>Sesiones de 25 min + 5 break</div>
            </div>
          </div>
          <div style={{ ...s.prefItem, marginTop: 8 }}>
            <Sun size={16} color={isDark ? '#FF5B2E' : '#FF8430'} />
            <div style={s.prefTitle}>Modalidad de estudio preferida</div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <AppLayout>
      <h1 style={s.pageTitle}>Gestión Académica</h1>

      <div style={s.grid2}>
        {SECCIONES.map((sec) => (
          <div key={sec.id} style={{ ...s.card, cursor: 'pointer' }} onClick={() => navigate(sec.path)}>
            <div style={s.cardTop}>
              <div style={s.cardIcon}>
                <sec.IconComp isDark={isDark} />
              </div>
              <span style={s.secId}>{sec.id}</span>
            </div>
            <div style={s.cardTitle}>{sec.titulo}</div>
            <div style={s.cardDesc}>{sec.descripcion}</div>
            {renderExtra(sec.extra)}
            <button style={s.cardBtn} onClick={(e) => { e.stopPropagation(); navigate(sec.path); }}>
              {sec.accion}
            </button>
          </div>
        ))}
      </div>

      {/* ── PANEL ESTADÍSTICAS RÁPIDAS ── */}
      <div style={{ ...s.grid2, marginTop: 20 }}>
        <div style={{ ...s.card }}>
          <div style={{ fontSize: 11, color: t.textMuted, letterSpacing: '0.07em', marginBottom: 8 }}>HISTORIAL DE SESIONES</div>
          {sessionHistory.map(d => (
            <div key={d.dia} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: t.textSecondary, width: 80 }}>{d.dia}</span>
              <div style={{ flex: 1, height: 6, borderRadius: 3, background: t.inputBg, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 3, width: `${(d.horas / 4) * 100}%`, background: isDark ? 'linear-gradient(90deg,#FF5B2E,#C4107A)' : 'linear-gradient(90deg,#FF8430,#F7306D)' }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: isDark ? '#FF5B2E' : '#FF8430', minWidth: 32 }}>{d.horas}h</span>
            </div>
          ))}
        </div>
        <div style={{ ...s.card }}>
          <div style={{ fontSize: 11, color: t.textMuted, letterSpacing: '0.07em', marginBottom: 8 }}>EVOLUCIÓN DE NOTAS</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 80 }}>
            {gradeEvolution.map((n, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: '100%', borderRadius: 4, height: `${(n / 5) * 72}px`, background: i === 4 ? (isDark ? 'linear-gradient(180deg,#FF5B2E,#C4107A)' : 'linear-gradient(180deg,#FF8430,#F7306D)') : (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)') }} />
                <span style={{ fontSize: 9, color: t.textMuted }}>{n}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: '#22C55E', fontWeight: 600, marginTop: 8 }}>↑ Tendencia positiva</div>
        </div>
      </div>

    </AppLayout>
  );
};

const getStyles = (isDark) => {
  const t = createStyles(isDark);
  return {
    pageTitle: {
      fontFamily: t.fontPrimary,
      fontSize: 34,
      fontWeight: 800,
      margin: '0 0 28px 0',
      color: isDark ? '#FF5B2E' : '#FF8430',
      letterSpacing: '-0.02em',
    },
    grid2: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 },
    card: {
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 16,
      padding: '20px 22px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: t.cardShadow,
    },
    cardTop: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    cardIcon: {
      width: 40,
      height: 40,
      borderRadius: 10,
      background: isDark ? 'rgba(255,91,46,0.12)' : 'rgba(255,132,48,0.10)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    secId: {
      fontSize: 10,
      letterSpacing: '0.10em',
      color: t.textMuted,
      fontFamily: t.fontSecondary,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: 700,
      color: t.textPrimary,
      fontFamily: t.fontSecondary,
      marginBottom: 6,
    },
    cardDesc: {
      fontSize: 12,
      color: t.textSecondary,
      lineHeight: 1.5,
      marginBottom: 14,
    },
    extraBlock: { marginBottom: 16 },
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
      color: t.textMuted,
    },
    promedioVal: {
      fontSize: 16,
      fontWeight: 800,
      fontFamily: t.fontPrimary,
      color: isDark ? '#FF5B2E' : '#FF8430',
    },
    promedioMax: {
      fontSize: 11,
      fontWeight: 400,
      color: t.textMuted,
    },
    badgeRow: { display: 'flex', gap: 6, flexWrap: 'wrap' },
    badge: {
      fontSize: 9,
      fontWeight: 600,
      padding: '3px 8px',
      borderRadius: 20,
      letterSpacing: '0.04em',
    },
    diasRow: { display: 'flex', gap: 6, marginBottom: 10, justifyContent: 'center' },
    diaCircle: {
      width: 28,
      height: 28,
      borderRadius: '50%',
      background: t.inputBg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 10,
      fontWeight: 600,
      color: t.textSecondary,
    },
    estadoBadge: {
      fontSize: 10,
      fontWeight: 600,
      color: t.textSecondary,
      background: t.inputBg,
      borderRadius: 8,
      padding: '5px 10px',
      textAlign: 'center',
    },
    prefItem: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: t.inputBg,
      borderRadius: 8,
      padding: '8px 10px',
    },
    prefIcon: { fontSize: 16 },
    prefTitle: {
      fontSize: 12,
      fontWeight: 600,
      color: t.textPrimary,
    },
    prefSub: {
      fontSize: 10,
      color: t.textMuted,
      marginTop: 2,
    },
    cardBtn: {
      marginTop: 'auto',
      width: '100%',
      padding: '11px 0',
      border: 'none',
      borderRadius: 10,
      background: t.primaryGradient,
      color: '#fff',
      fontFamily: t.fontPrimary,
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: '0.04em',
      cursor: 'pointer',
    },
  };
};

export default AcademicManagement;
