import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/Layout/AppLayout';
import { useTheme } from '../context/ThemeContext';
import { createStyles } from '../theme/createStyles';
import statsService from '../services/statsService';
import notificationService from '../services/notificationService';
import academicService from '../services/academicService';
import enginePlanningService from '../services/enginePlanningService';

const AlertTriangle = ({ color, size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const BrainIcon = ({ color, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2a2.5 2.5 0 0 1 5 0v.5"/>
    <path d="M14.5 2.5c1.5.5 2.5 2 2.5 3.5v1a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4v-1c0-1.5 1-3 2.5-3.5"/>
    <path d="M12 11v4"/>
    <path d="M9 15h6"/>
    <path d="M7 15a5 5 0 0 0 10 0"/>
  </svg>
);

const ArrowRightIcon = ({ color }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

const TrendUpIcon = ({ color, size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
    <polyline points="16 7 22 7 22 13"/>
  </svg>
);

const CalendarIcon = ({ color, size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const StarIcon = ({ color, size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const AwardIcon = ({ color, size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7"/>
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
  </svg>
);

const BookOpenIcon = ({ color, size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

const ClockIcon = ({ color, size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const CheckCircleIcon = ({ color, size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const CHART_H = 148;

const COLORS_PALETTE = ['#FF8430', '#F7306D', '#22C55E', '#EAB308', '#6366F1', '#00CFFF', '#A855F7', '#FF5B2E'];

const adaptSemesterData = (dashboard, academicSummary) => {
  if (dashboard?.semesters?.length) {
    return dashboard.semesters.map((s, i) => ({
      sem: s.name || s.label || `Semestre ${s.semester || i + 1}`,
      nota: s.average ?? s.grade ?? s.gpa ?? 3.5,
      materias: s.subjects?.map((sub) => ({
        nombre: sub.name || sub.nombre || sub.label || 'Materia',
        nota: sub.grade ?? sub.nota ?? sub.average ?? 3.5,
      })) || [],
    }));
  }
  if (academicSummary?.semesters?.length) {
    return academicSummary.semesters.map((s, i) => ({
      sem: s.name || `Semestre ${i + 1}`,
      nota: s.average ?? 3.5,
      materias: s.subjects?.map((sub) => ({
        nombre: sub.name || 'Materia',
        nota: sub.grade ?? 3.5,
      })) || [],
    }));
  }
  return [];
};

const adaptWeeklyData = (dashboard) => {
  if (dashboard?.weeklyPerformance?.length) {
    return dashboard.weeklyPerformance.map((w, i) => ({
      sem: w.week || w.label || `Semana ${i + 1}`,
      nota: w.average ?? w.grade ?? 3.8,
    }));
  }
  return [];
};

const adaptSubjectPerformance = (subjectsStats, dashboard) => {
  if (subjectsStats?.length) {
    return subjectsStats.map((s, i) => ({
      nombre: s.name || s.nombre || s.subject || 'Materia',
      nota: s.grade ?? s.nota ?? s.average ?? s.score ?? 3.5,
      creditos: s.credits ?? s.creditos ?? 3,
      color: s.color || COLORS_PALETTE[i % COLORS_PALETTE.length],
    }));
  }
  if (dashboard?.subjects?.length) {
    return dashboard.subjects.map((s, i) => ({
      nombre: s.name || s.nombre || 'Materia',
      nota: s.grade ?? s.average ?? 3.5,
      creditos: s.credits ?? 3,
      color: COLORS_PALETTE[i % COLORS_PALETTE.length],
    }));
  }
  return [];
};

const adaptRecommendations = (suggestions, alerts, criticalRecs) => {
  const items = [];
  
  if (suggestions?.suggestions?.length) {
    suggestions.suggestions.forEach((s, i) => {
      items.push({
        id: `sug-${i}`,
        tipo: 'ENFOQUE',
        titulo: s.title || s.titulo || s.subject || 'Recomendación',
        descripcion: s.description || s.message || s.texto || '',
      });
    });
  } else if (Array.isArray(suggestions) && suggestions.length) {
    suggestions.forEach((s, i) => {
      items.push({
        id: `sug-${i}`,
        tipo: 'ENFOQUE',
        titulo: s.title || s.subject || 'Recomendación',
        descripcion: s.description || s.message || '',
      });
    });
  }

  if (alerts?.alerts?.length) {
    alerts.alerts.forEach((a, i) => {
      items.push({
        id: `alert-${i}`,
        tipo: 'ALERTA',
        titulo: a.title || a.titulo || a.label || 'Alerta',
        descripcion: a.description || a.message || a.texto || '',
      });
    });
  } else if (Array.isArray(alerts) && alerts.length) {
    alerts.forEach((a, i) => {
      items.push({
        id: `alert-${i}`,
        tipo: 'ALERTA',
        titulo: a.title || 'Alerta',
        descripcion: a.description || a.message || '',
      });
    });
  }

  if (criticalRecs?.recommendations?.length) {
    criticalRecs.recommendations.forEach((r, i) => {
      items.push({
        id: `crit-${i}`,
        tipo: r.priority === 'high' ? 'ALERTA' : 'ENFOQUE',
        titulo: r.title || r.titulo || 'Recomendación',
        descripcion: r.description || r.message || '',
      });
    });
  }

  return items;
};

const adaptSessionData = (dashboard) => {
  if (dashboard?.studySessions?.length) {
    return dashboard.studySessions.map((s) => ({
      dia: s.day || s.dia || s.label || '?',
      horas: s.hours ?? s.horas ?? s.duration ?? 1,
      sesiones: s.count ?? s.sessions ?? 1,
    }));
  }
  return [];
};

const Statistics = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [vistaChart, setVistaChart] = useState('semestre');
  const [selectedSemestre, setSelectedSemestre] = useState(null);
  const [loading, setLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState(null);
  const [subjectsStats, setSubjectsStats] = useState([]);
  const [academicSummary, setAcademicSummary] = useState(null);
  const [studySuggestions, setStudySuggestions] = useState(null);
  const [statsAlerts, setStatsAlerts] = useState(null);
  const [criticalRecs, setCriticalRecs] = useState(null);

  const s = getStyles(isDark);
  const t = createStyles(isDark);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await Promise.allSettled([
          statsService.getDashboard().catch(() => null),
          statsService.getSubjectsStatistics().catch(() => []),
          academicService.getSummary().catch(() => null),
          notificationService.getStudySuggestions().catch(() => null),
          notificationService.getStatsAlerts().catch(() => null),
          enginePlanningService.getRecommendationsCritical().catch(() => null),
        ]);

        const dashboard = results[0].status === 'fulfilled' ? results[0].value : null;
        const subjects = results[1].status === 'fulfilled' ? results[1].value : [];
        const academic = results[2].status === 'fulfilled' ? results[2].value : null;
        const suggestions = results[3].status === 'fulfilled' ? results[3].value : null;
        const alerts = results[4].status === 'fulfilled' ? results[4].value : null;
        const critical = results[5].status === 'fulfilled' ? results[5].value : null;

        setDashboardData(dashboard);
        setSubjectsStats(subjects.subjects || subjects || []);
        setAcademicSummary(academic);
        setStudySuggestions(suggestions);
        setStatsAlerts(alerts);
        setCriticalRecs(critical);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const semestresData = adaptSemesterData(dashboardData, academicSummary);
  const semanasData = adaptWeeklyData(dashboardData);
  const materiasRendimiento = adaptSubjectPerformance(subjectsStats, dashboardData);
  const recomendaciones = adaptRecommendations(studySuggestions, statsAlerts, criticalRecs);
  const sesionesDia = adaptSessionData(dashboardData);

  const chartData = vistaChart === 'semestre' ? semestresData : semanasData;
  const hasChartData = chartData.length > 0;
  const maxNota = hasChartData ? Math.max(...chartData.map(d => d.nota)) : 4.0;
  const refLineTop = CHART_H - (4.0 / 5.0) * CHART_H;

  const calcPromedioGeneral = () => {
    if (dashboardData?.overallAverage != null) return dashboardData.overallAverage.toFixed(2);
    if (academicSummary?.gpa != null || academicSummary?.average != null) {
      return (academicSummary.gpa ?? academicSummary.average).toFixed(2);
    }
    if (semestresData.length > 0) {
      const avg = semestresData.reduce((acc, d) => acc + d.nota, 0) / semestresData.length;
      return avg.toFixed(2);
    }
    return '—';
  };

  const promedioGeneral = calcPromedioGeneral();
  const hasPromedio = promedioGeneral !== '—';

  const findBestSemestre = () => {
    if (semestresData.length === 0) return null;
    return semestresData.reduce((a, b) => (a.nota >= b.nota ? a : b));
  };
  const bestSemestre = findBestSemestre();

  const maxHorasDia = sesionesDia.length > 0 ? Math.max(...sesionesDia.map(d => d.horas)) : 1;

  const getMiniCardValue = (cardIdx) => {
    switch (cardIdx) {
      case 0:
        if (semestresData.length > 0) return String(semestresData.length);
        if (dashboardData?.semestersCompleted != null) return String(dashboardData.semestersCompleted);
        return '—';
      case 1:
        if (bestSemestre) return bestSemestre.nota.toFixed(1);
        if (dashboardData?.bestSemester?.average != null) return dashboardData.bestSemester.average.toFixed(1);
        return '—';
      case 2:
        if (dashboardData?.creditsEarned != null) return String(dashboardData.creditsEarned);
        if (academicSummary?.credits?.earned != null) return String(academicSummary.credits.earned);
        return '—';
      case 3:
        if (subjectsStats.length > 0) return String(subjectsStats.filter(s => s.passed || s.grade >= 3.0).length || subjectsStats.length);
        if (dashboardData?.subjectsPassed != null) return String(dashboardData.subjectsPassed);
        return '—';
      case 4:
        if (dashboardData?.weeklyStudyHours != null) return String(dashboardData.weeklyStudyHours);
        if (sesionesDia.length > 0) {
          const total = sesionesDia.reduce((acc, d) => acc + d.horas, 0);
          return total.toFixed(1);
        }
        return '—';
      case 5:
        if (dashboardData?.tasksCompletionRate != null) return `${Math.round(dashboardData.tasksCompletionRate)}%`;
        if (dashboardData?.completedTasks != null && dashboardData?.totalTasks != null) {
          const pct = Math.round((dashboardData.completedTasks / dashboardData.totalTasks) * 100);
          return `${pct}%`;
        }
        return '—';
      default:
        return '—';
    }
  };

  const getMiniCardSub = (cardIdx) => {
    switch (cardIdx) {
      case 0:
        if (dashboardData?.totalSemesters != null) return `de ${dashboardData.totalSemesters}`;
        if (academicSummary?.totalSemesters) return `de ${academicSummary.totalSemesters}`;
        return 'semestres';
      case 1:
        if (bestSemestre) return bestSemestre.sem;
        if (dashboardData?.bestSemester?.name) return dashboardData.bestSemester.name;
        return 'Mejor semestre';
      case 2:
        if (dashboardData?.totalCredits != null) return `de ${dashboardData.totalCredits}`;
        if (academicSummary?.credits?.total) return `de ${academicSummary.credits.total}`;
        return 'créditos';
      case 3: return 'materias';
      case 4: return 'horas de estudio';
      case 5:
        if (dashboardData?.completedTasks != null) return `${dashboardData.completedTasks} entregadas`;
        return 'tareas entregadas';
      default: return '';
    }
  };

  const buildSemestreDetalle = () => {
    const detalle = {};
    semestresData.forEach((s, i) => {
      detalle[i + 1] = {
        promedio: s.nota,
        materias: s.materias || [],
      };
    });
    return detalle;
  };
  const semestreDetalle = buildSemestreDetalle();

  const MINI_CARDS_CONFIG = [
    {
      icon: (dark) => <CalendarIcon color={dark ? '#FF5B2E' : '#FF8430'} />,
      label: 'Semestres Cursados',
      accent: null,
    },
    {
      icon: () => <StarIcon color="#EAB308" />,
      label: 'Mejor Semestre',
      accent: '#EAB308',
    },
    {
      icon: (dark) => <AwardIcon color={dark ? '#FF5B2E' : '#FF8430'} />,
      label: 'Créditos Aprobados',
      accent: null,
    },
    {
      icon: (dark) => <BookOpenIcon color={dark ? '#FF5B2E' : '#FF8430'} />,
      label: 'Materias Aprobadas',
      accent: null,
    },
    {
      icon: (dark) => <ClockIcon color={dark ? '#FF5B2E' : '#FF8430'} />,
      label: 'Horas / Semana',
      accent: null,
    },
    {
      icon: () => <CheckCircleIcon color="#22C55E" />,
      label: 'Tareas Completadas',
      accent: '#22C55E',
    },
  ];

  if (loading) {
    return (
      <AppLayout>
        <div style={{ padding: 60, textAlign: 'center', fontFamily: "'Poppins',sans-serif", color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', fontSize: 14 }}>
          Cargando estadísticas...
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>

      <div style={s.pageHeader}>
        <div style={s.carreraLabel}>
          {academicSummary?.career || dashboardData?.career || 'ESTADÍSTICAS ACADÉMICAS'}
        </div>
        <h1 style={s.pageTitle}>Estadísticas</h1>
        <div style={s.promedioInline}>
          <TrendUpIcon color={isDark ? '#FF5B2E' : '#FF8430'} size={13} />
          <span style={s.promedioInlineLabel}>Promedio general</span>
          <span style={s.promedioInlineVal}>{promedioGeneral}</span>
          {hasPromedio && <span style={s.promedioInlineLabel}>/ 5.0</span>}
          {hasPromedio && <div style={s.promedioInlineDivider} />}
          {hasPromedio && (
            <>
              <div style={s.promedioInlineDot} />
              <span style={s.promedioInlineStatus}>
                {parseFloat(promedioGeneral) >= 4.0 ? 'RENDIMIENTO SOBRESALIENTE' :
                 parseFloat(promedioGeneral) >= 3.5 ? 'BUEN RENDIMIENTO' : 'RENDIMIENTO MODERADO'}
              </span>
            </>
          )}
        </div>
      </div>

      <div style={s.miniCardsGrid}>
        {MINI_CARDS_CONFIG.map((card, idx) => {
          const value = getMiniCardValue(idx);
          const sub = getMiniCardSub(idx);
          const accent = card.accent || (isDark ? '#FF5B2E' : '#FF8430');
          return (
            <div key={card.label} style={s.miniCard}>
              <div style={s.miniCardTop}>
                {card.icon(isDark)}
                <span style={s.miniCardLabel}>{card.label}</span>
              </div>
              <div style={{ ...s.miniCardValue, color: value === '—' ? t.textMuted : accent }}>{value}</div>
              <div style={s.miniCardSub}>{sub}</div>
            </div>
          );
        })}
      </div>

      <div style={s.chartCard}>
        <div style={s.chartHeader}>
          <span style={s.chartTitle}>Evolución de Calificaciones</span>
          <div style={s.toggleGroup}>
            {['semestre', 'semana'].map((v) => (
              <button
                key={v}
                style={{ ...s.toggleBtn, ...(vistaChart === v ? s.toggleBtnActive : {}) }}
                onClick={() => setVistaChart(v)}
              >
                {v === 'semestre' ? 'Por Semestre' : 'Por Semana'}
              </button>
            ))}
          </div>
        </div>

        <div style={s.promedioHeaderCard}>
          <div style={s.promedioHeaderLabel}>Promedio Actual</div>
          <div style={s.promedioHeaderVal}>{hasPromedio ? `${promedioGeneral} / 5.0` : 'No disponible'}</div>
          {hasPromedio && parseFloat(promedioGeneral) < 3.5 && (
            <div style={s.riesgoModerado}>
              <AlertTriangle color="#EAB308" />
              <span>RIESGO MODERADO</span>
            </div>
          )}
        </div>

        {hasChartData ? (
          <>
            <div style={{ position: 'relative', height: CHART_H, padding: '0 4px', marginBottom: 8 }}>
              <div style={{
                position: 'absolute',
                left: 4,
                right: 4,
                top: refLineTop,
                height: 0,
                borderTop: `1px dashed ${isDark ? 'rgba(234,179,8,0.65)' : 'rgba(234,179,8,0.85)'}`,
                zIndex: 2,
                pointerEvents: 'none',
              }}>
                <span style={{
                  position: 'absolute',
                  right: 0,
                  top: -13,
                  fontSize: 9,
                  color: '#EAB308',
                  fontWeight: 700,
                  fontFamily: t.fontSecondary,
                  background: isDark ? '#171717' : '#FEFAF9',
                  paddingLeft: 4,
                  letterSpacing: '0.02em',
                }}>Meta 4.0</span>
              </div>

              <div style={{ display: 'flex', gap: 8, height: '100%', alignItems: 'flex-end' }}>
                {chartData.map((d, i) => {
                  const barH = (d.nota / 5.0) * CHART_H;
                  const isBest = d.nota === maxNota;
                  return (
                    <div
                      key={d.sem + i}
                      style={{
                        flex: 1,
                        height: '100%',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'flex-end',
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        bottom: barH + 5,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: 10,
                        fontWeight: 700,
                        color: isBest
                          ? (isDark ? '#FF5B2E' : '#FF8430')
                          : (isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.35)'),
                        fontFamily: t.fontSecondary,
                        whiteSpace: 'nowrap',
                        zIndex: 3,
                      }}>
                        {d.nota.toFixed(1)}
                      </div>
                      <div style={{
                        width: '100%',
                        height: barH,
                        background: isBest
                          ? (isDark
                              ? 'linear-gradient(180deg, #FF5B2E, #C4107A)'
                              : 'linear-gradient(180deg, #FF8430, #F7306D)')
                          : (isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)'),
                        borderRadius: '6px 6px 0 0',
                        transition: 'height 0.4s ease',
                        position: 'relative',
                        zIndex: 1,
                      }} />
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, padding: '0 4px' }}>
              {chartData.map((d, i) => (
                <span key={d.sem + i} style={{
                  flex: 1,
                  textAlign: 'center',
                  fontSize: 9,
                  fontFamily: t.fontSecondary,
                  fontWeight: d.nota === maxNota ? 700 : 500,
                  color: d.nota === maxNota
                    ? (isDark ? '#FF5B2E' : '#FF8430')
                    : t.textMuted,
                }}>{d.sem}</span>
              ))}
            </div>
          </>
        ) : (
          <div style={{ padding: 40, textAlign: 'center', fontSize: 12, color: t.textMuted, fontFamily: t.fontSecondary }}>
            No hay datos de rendimiento disponibles
          </div>
        )}
      </div>

      <div style={s.seccion3Row}>
        <div style={{ ...s.card, flex: 1 }}>
          <div style={s.cardTitle}>Historial de Sesiones</div>
          <div style={{ marginTop: 14 }}>
            {sesionesDia.length > 0 ? sesionesDia.map((d) => (
              <div key={d.dia} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={s.sesionDia}>{d.dia}</span>
                <div style={s.sesionTrack}>
                  <div style={{
                    ...s.sesionFill,
                    width: `${maxHorasDia > 0 ? (d.horas / maxHorasDia) * 100 : 0}%`,
                  }} />
                </div>
                <span style={s.sesionHoras}>{d.horas}h</span>
                <span style={s.sesionCount}>
                  {d.sesiones} {d.sesiones === 1 ? 'sesión' : 'sesiones'}
                </span>
              </div>
            )) : (
              <div style={{ padding: 20, textAlign: 'center', fontSize: 12, color: t.textMuted }}>
                No hay datos de sesiones de estudio
              </div>
            )}
          </div>
        </div>

        <div style={{ ...s.card, flex: 1 }}>
          <div style={s.cardTitle}>Rendimiento por Materia</div>
          <div style={{ marginTop: 14 }}>
            {materiasRendimiento.length > 0 ? materiasRendimiento.map((m, i) => (
              <div key={m.nombre + i} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.color, flexShrink: 0 }} />
                    <span style={s.materiaName}>{m.nombre}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ ...s.materiaNota, color: m.color }}>{m.nota.toFixed(1)}</span>
                    <span style={s.materiaCreditos}>{m.creditos} cr</span>
                  </div>
                </div>
                <div style={s.materiaTrack}>
                  <div style={{
                    ...s.materiaFill,
                    width: `${(m.nota / 5.0) * 100}%`,
                    background: m.color,
                  }} />
                </div>
              </div>
            )) : (
              <div style={{ padding: 20, textAlign: 'center', fontSize: 12, color: t.textMuted }}>
                No hay datos de materias
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={s.bottomRow}>

        <div style={{ ...s.card, flex: 1 }}>
          <div style={s.cardTitle}>Promedio por Semestre</div>
          <div style={s.semFiltroRow}>
            {semestresData.length > 0 ? semestresData.map((d, i) => {
              const semNum = i + 1;
              const isSelected = selectedSemestre === semNum;
              return (
                <button
                  key={d.sem}
                  style={{
                    ...s.semFiltroBtn,
                    ...(isSelected ? s.semFiltroBtnActivo : {}),
                  }}
                  onClick={() => setSelectedSemestre((prev) => prev === semNum ? null : semNum)}
                >
                  {d.sem}
                </button>
              );
            }) : (
              <span style={{ fontSize: 12, color: t.textMuted, fontFamily: t.fontSecondary }}>
                No hay datos de semestres
              </span>
            )}
          </div>

          {selectedSemestre !== null && semestreDetalle[selectedSemestre] && (() => {
            const detalle = semestreDetalle[selectedSemestre];
            return (
              <div style={s.semDetallePanel}>
                <div style={s.semDetalleTitulo}>
                  Semestre {selectedSemestre} — Promedio {detalle.promedio.toFixed(1)}
                </div>
                <div style={{ maxHeight: 180, overflowY: 'auto' }}>
                  {detalle.materias && detalle.materias.length > 0 ? detalle.materias.map((mat, idx) => (
                    <div key={mat.nombre + idx} style={{
                      ...s.semDetalleRow,
                      borderBottom: idx < detalle.materias.length - 1 ? `1px solid ${t.cardBorder}` : 'none',
                    }}>
                      <span style={{ fontSize: 12, color: t.textPrimary, fontFamily: t.fontSecondary }}>{mat.nombre}</span>
                      <span style={{
                        fontSize: 13, fontWeight: 700, fontFamily: t.fontPrimary,
                        color: mat.nota >= 3.5 ? '#22C55E' : mat.nota >= 3.0 ? '#EAB308' : '#F00707',
                      }}>
                        {mat.nota.toFixed(1)}
                      </span>
                    </div>
                  )) : (
                    <div style={{ padding: 10, textAlign: 'center', fontSize: 11, color: t.textMuted }}>
                      Sin detalles de materias
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>

         <div style={{ ...s.card, flex: 1.2 }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
             <BrainIcon color={isDark ? '#FF5B2E' : '#FF8430'} />
             <span style={s.cardTitle}>Recomendaciones de AI.BERT</span>
           </div>
          <div style={{ marginTop: 14 }}>
            {recomendaciones.length > 0 ? recomendaciones.map((r) => (
              <div key={r.id} style={s.recomItem}>
                <div style={{
                  ...s.recomItemIcon,
                  background: r.tipo === 'ALERTA'
                    ? 'rgba(234,179,8,0.15)'
                    : (isDark ? 'rgba(255,91,46,0.12)' : 'rgba(255,132,48,0.10)'),
                }}>
                  {r.tipo === 'ALERTA'
                    ? <AlertTriangle color="#EAB308" />
                    : <BrainIcon color={isDark ? '#FF5B2E' : '#FF8430'} />
                  }
                </div>
                <div style={{ flex: 1 }}>
                  <div style={s.recomItemTitle}>{r.titulo}</div>
                  <div style={s.recomItemDesc}>{r.descripcion}</div>
                </div>
                <button style={s.recomArrow}>
                  <ArrowRightIcon color={isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.35)'} />
                </button>
              </div>
            )) : (
              <div style={{ padding: 20, textAlign: 'center', fontSize: 12, color: t.textMuted }}>
                No hay recomendaciones en este momento
              </div>
            )}
          </div>
        </div>

        <div style={s.aibertCard}>
          <div style={s.aibertCircleWrap}>
            <div style={s.aibertCircle1} />
            <div style={s.aibertCircle2} />
            <div style={s.aibertCircle3} />
            <div style={s.aibertLabel}>AI.BERT</div>
          </div>
          <p style={s.aibertQuote}>
            &ldquo;{hasPromedio && parseFloat(promedioGeneral) >= 4.0
              ? '¡Vas en camino a terminar el semestre con promedio sobresaliente!'
              : hasPromedio && parseFloat(promedioGeneral) >= 3.5
                ? '¡Buen progreso! Sigue manteniendo este ritmo de estudio.'
                : 'Puedes mejorar. Inicia una sesión de estudio para avanzar.'}
            &rdquo;
          </p>
          <button style={s.aibertBtn} onClick={() => navigate('/sesion/crear')}>
            INICIAR SESIÓN DE ESTUDIO
          </button>
        </div>

      </div>
    </AppLayout>
  );
};

const getStyles = (isDark) => {
  const t = createStyles(isDark);
  return {
    pageHeader: {
      marginBottom: 20,
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
      margin: '0 0 10px 0',
    },
    promedioInline: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
    },
    promedioInlineLabel: {
      fontSize: 11,
      color: isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.75)',
      fontFamily: t.fontSecondary,
      fontWeight: 600,
    },
    promedioInlineVal: {
      fontSize: 20,
      fontWeight: 800,
      fontFamily: t.fontPrimary,
      color: isDark ? '#FF5B2E' : '#FF8430',
      lineHeight: 1,
    },
    promedioInlineDivider: {
      width: 1,
      height: 14,
      background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
      marginLeft: 2,
      marginRight: 2,
      flexShrink: 0,
    },
    promedioInlineDot: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: '#22C55E',
      flexShrink: 0,
    },
    promedioInlineStatus: {
      fontSize: 10,
      fontWeight: 700,
      color: '#22C55E',
      fontFamily: t.fontSecondary,
      letterSpacing: '0.04em',
    },
    miniCardsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gap: 12,
      marginBottom: 16,
    },
    miniCard: {
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 14,
      padding: '14px 16px',
      boxShadow: t.cardShadow,
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
    },
    miniCardTop: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginBottom: 4,
    },
    miniCardLabel: {
      fontSize: 10,
      fontFamily: t.fontSecondary,
      color: t.textMuted,
      fontWeight: 600,
      letterSpacing: '0.02em',
      lineHeight: 1.25,
    },
    miniCardValue: {
      fontFamily: t.fontPrimary,
      fontSize: 22,
      fontWeight: 800,
      lineHeight: 1,
    },
    miniCardSub: {
      fontSize: 10,
      color: t.textSecondary,
      fontFamily: t.fontSecondary,
    },
    chartCard: {
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 16,
      padding: '20px 24px',
      boxShadow: t.cardShadow,
      marginBottom: 16,
    },
    chartHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    chartTitle: {
      fontFamily: t.fontPrimary,
      fontSize: 15,
      fontWeight: 700,
      color: t.textPrimary,
    },
    toggleGroup: {
      display: 'flex',
      background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
      borderRadius: 20,
      padding: 2,
      gap: 2,
    },
    toggleBtn: {
      padding: '5px 14px',
      borderRadius: 18,
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      fontFamily: t.fontSecondary,
      fontSize: 11,
      fontWeight: 600,
      color: t.textSecondary,
      transition: 'all 0.2s ease',
    },
    toggleBtnActive: {
      background: isDark ? 'rgba(255,91,46,0.20)' : 'rgba(255,132,48,0.15)',
      color: isDark ? '#FF5B2E' : '#FF8430',
    },
    card: {
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 16,
      padding: '18px 20px',
      boxShadow: t.cardShadow,
    },
    cardTitle: {
      fontFamily: t.fontPrimary,
      fontSize: 14,
      fontWeight: 700,
      color: t.textPrimary,
    },
    seccion3Row: {
      display: 'flex',
      gap: 16,
      marginBottom: 16,
    },
    sesionDia: {
      fontSize: 10,
      color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.40)',
      width: 28,
      fontWeight: 600,
      fontFamily: t.fontSecondary,
      flexShrink: 0,
    },
    sesionTrack: {
      flex: 1,
      height: 7,
      borderRadius: 4,
      background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
      overflow: 'hidden',
    },
    sesionFill: {
      height: '100%',
      borderRadius: 4,
      background: isDark
        ? 'linear-gradient(90deg, #FF5B2E, #C4107A)'
        : 'linear-gradient(90deg, #FF8430, #F7306D)',
    },
    sesionHoras: {
      fontSize: 10,
      fontWeight: 700,
      color: isDark ? '#FF5B2E' : '#FF8430',
      minWidth: 28,
      fontFamily: t.fontSecondary,
    },
    sesionCount: {
      fontSize: 9,
      color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
      minWidth: 60,
      fontFamily: t.fontSecondary,
    },
    materiaName: {
      fontSize: 11,
      color: t.textSecondary,
      fontFamily: t.fontSecondary,
    },
    materiaNota: {
      fontSize: 12,
      fontWeight: 700,
      fontFamily: t.fontPrimary,
    },
    materiaCreditos: {
      fontSize: 10,
      color: t.textMuted,
      fontFamily: t.fontSecondary,
    },
    materiaTrack: {
      height: 5,
      borderRadius: 3,
      background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
      overflow: 'hidden',
    },
    materiaFill: {
      height: '100%',
      borderRadius: 3,
      opacity: isDark ? 0.80 : 0.88,
      transition: 'width 0.4s ease',
    },
    bottomRow: {
      display: 'flex',
      gap: 16,
      alignItems: 'stretch',
    },
    semFiltroRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6,
      marginTop: 12,
      marginBottom: 4,
    },
    semFiltroBtn: {
      background: t.inputBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 20,
      padding: '5px 14px',
      cursor: 'pointer',
      fontFamily: t.fontSecondary,
      fontSize: 11,
      fontWeight: 500,
      color: t.textSecondary,
      transition: 'all 0.15s ease',
    },
    semFiltroBtnActivo: {
      background: isDark ? 'rgba(255,91,46,0.15)' : 'rgba(255,132,48,0.12)',
      border: `1px solid ${isDark ? '#FF5B2E' : '#FF8430'}`,
      color: isDark ? '#FF5B2E' : '#FF8430',
      fontWeight: 700,
    },
    semDetallePanel: {
      borderTop: `1px solid ${t.cardBorder}`,
      marginTop: 14,
      paddingTop: 14,
    },
    semDetalleTitulo: {
      fontSize: 12,
      fontWeight: 700,
      color: isDark ? '#FF5B2E' : '#FF8430',
      fontFamily: t.fontSecondary,
      marginBottom: 10,
    },
    semDetalleRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '6px 0',
    },
    promedioHeaderCard: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 20,
      padding: '12px 16px',
      borderRadius: 12,
      background: isDark ? 'rgba(255,91,46,0.08)' : 'rgba(255,132,48,0.06)',
    },
    promedioHeaderLabel: {
      fontSize: 10,
      fontFamily: t.fontSecondary,
      fontWeight: 600,
      color: t.textMuted,
      letterSpacing: '0.04em',
    },
    promedioHeaderVal: {
      fontFamily: t.fontPrimary,
      fontSize: 18,
      fontWeight: 800,
      color: isDark ? '#FF5B2E' : '#FF8430',
    },
    riesgoModerado: {
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      marginLeft: 'auto',
      padding: '4px 10px',
      borderRadius: 8,
      background: 'rgba(234,179,8,0.10)',
    },
    recomItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
      background: t.inputBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 10,
      padding: '11px 12px',
      marginBottom: 10,
    },
    recomItemIcon: {
      width: 30,
      height: 30,
      borderRadius: 8,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    recomItemTitle: {
      fontFamily: t.fontSecondary,
      fontSize: 12,
      fontWeight: 600,
      color: t.textPrimary,
      marginBottom: 3,
    },
    recomItemDesc: {
      fontSize: 11,
      color: t.textSecondary,
      lineHeight: 1.45,
    },
    recomArrow: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      padding: 4,
      flexShrink: 0,
      marginTop: 2,
    },
    aibertCard: {
      width: 210,
      flexShrink: 0,
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 16,
      padding: '20px 18px',
      boxShadow: t.cardShadow,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 14,
    },
    aibertCircleWrap: {
      position: 'relative',
      width: 90,
      height: 90,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    aibertCircle1: {
      position: 'absolute',
      width: 90,
      height: 90,
      borderRadius: '50%',
      border: `2px solid ${isDark ? 'rgba(255,91,46,0.22)' : 'rgba(255,132,48,0.18)'}`,
    },
    aibertCircle2: {
      position: 'absolute',
      width: 68,
      height: 68,
      borderRadius: '50%',
      border: `2px solid ${isDark ? 'rgba(255,91,46,0.38)' : 'rgba(255,132,48,0.32)'}`,
    },
    aibertCircle3: {
      position: 'absolute',
      width: 48,
      height: 48,
      borderRadius: '50%',
      background: isDark
        ? 'radial-gradient(circle, rgba(255,91,46,0.22), rgba(196,16,122,0.14))'
        : 'radial-gradient(circle, rgba(255,132,48,0.18), rgba(247,48,109,0.09))',
      border: `1px solid ${isDark ? 'rgba(255,91,46,0.48)' : 'rgba(255,132,48,0.42)'}`,
    },
    aibertLabel: {
      position: 'relative',
      fontFamily: t.fontPrimary,
      fontSize: 11,
      fontWeight: 800,
      backgroundImage: t.primaryGradient,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      zIndex: 1,
    },
    aibertQuote: {
      fontSize: 11,
      color: t.textSecondary,
      textAlign: 'center',
      lineHeight: 1.55,
      margin: 0,
    },
    aibertBtn: {
      width: '100%',
      padding: '10px 8px',
      border: 'none',
      borderRadius: 10,
      background: isDark
        ? 'linear-gradient(90deg, #C4107A, #FF5B2E)'
        : 'linear-gradient(90deg, #FF8430, #F7306D)',
      color: '#fff',
      fontFamily: t.fontPrimary,
      fontSize: 10,
      fontWeight: 700,
      cursor: 'pointer',
      letterSpacing: '0.04em',
    },
  };
};

export default Statistics;
