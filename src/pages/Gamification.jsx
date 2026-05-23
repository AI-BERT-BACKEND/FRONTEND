import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gamificationService from '../services/gamificationService';
import AppLayout from '../components/Layout/AppLayout';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { createStyles } from '../theme/createStyles';
import ProgressBar from '../components/ProgressBar';
import { ChevronRight, Lock, X } from 'lucide-react';
import aibertGif from '../assets/aibert-logo-sin-negro-corregido.gif';

const FILTROS = ['TODOS', 'DESBLOQUEADOS', 'PENDIENTES'];

const DEFAULT_INSIGNIAS = [
  { id: 1, tipo: 'TASK_STREAK',         nombre: 'TASK STREAK',         icon: '⚡', desc: 'Completa tareas sin interrupciones', desbloqueado: false, color: '#FF8430' },
  { id: 2, tipo: 'PERFECT_SCORE',       nombre: 'PERFECT SCORE',       icon: '⭐', desc: 'Obtén 5.0 en una evaluación',        desbloqueado: false, color: '#F7306D' },
  { id: 3, tipo: 'GOAL_COMPLETED',      nombre: 'GOAL COMPLETED',      icon: '🎯', desc: 'Cumple tu meta semanal',             desbloqueado: false, color: '#A855F7' },
  { id: 4, tipo: 'SUBJECT_MASTERY',     nombre: 'SUBJECT MASTERY',     icon: '🏆', desc: 'Domina una materia completa',        desbloqueado: false, color: '#00CFFF' },
  { id: 5, tipo: 'PRODUCTIVITY_STREAK', nombre: 'PRODUCTIVITY STREAK', icon: '🔥', desc: 'Mantén racha de productividad',      desbloqueado: false, color: '#22C55E' },
];

/* ── componente ── */
const Gamification = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const t = createStyles(isDark);
  const [filtro, setFiltro] = useState('TODOS');
  const [showXpModal, setShowXpModal] = useState(false);
  const [hoverAibert, setHoverAibert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    if (!user?.id) return;
    const fetchData = async () => {
      try {
        const [prog, pts, ach, subs] = await Promise.all([
          gamificationService.getProgress(user.id),
          gamificationService.getPoints(user.id),
          gamificationService.getAchievements(user.id),
          gamificationService.getSubjectsProgress(user.id),
        ]);
        setProgress(prog);
        setTotalPoints(pts?.totalPoints ?? pts?.points ?? 0);
        const raw = ach?.achievements ?? ach ?? [];
        const mapped = raw.map((a) => ({
          id: a.id, tipo: a.tipo ?? a.type ?? '', nombre: a.nombre ?? a.name ?? '',
          icon: a.icon ?? '🏅', desc: a.desc ?? a.description ?? '',
          desbloqueado: a.desbloqueado ?? a.unlocked ?? false, color: a.color ?? '#FF8430',
        }));
        setAchievements(mapped.length > 0 ? mapped : DEFAULT_INSIGNIAS);
        const rawSubs = subs?.subjects ?? subs ?? [];
        setCursos(rawSubs.map((c) => ({
          id: c.id, nombre: c.nombre ?? c.name ?? '', sub: c.sub ?? c.subtitle ?? '',
          icon: c.icon ?? '📘', iconColor: c.iconColor ?? c.color ?? '#FF8430',
          pct: c.pct ?? c.progress ?? 0, barColor: c.barColor ?? c.color ?? '#FF8430',
          nivel: c.nivel ?? c.level ?? 1, rango: c.rango ?? c.rank ?? '',
          xp: c.xp ?? c.xpPoints ?? [],
        })));
      } catch {
        setProgress(null); setTotalPoints(0); setAchievements([]); setCursos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);

  const logrosRecientes = progress?.recentAchievements?.map((l) => ({
    id: l.id, icon: l.icon ?? '🏅', iconBg: l.iconBg ?? (l.color ? l.color + '30' : 'rgba(255,132,48,0.18)'),
    titulo: l.titulo ?? l.title ?? l.name ?? '', sub: l.sub ?? l.description ?? '',
  })) ?? [];

  const nivel = progress?.level ?? 0;
  const xpActual = progress?.currentXp ?? 0;
  const xpParaSiguiente = progress?.xpToNextLevel ?? 2500;
  const pctProgreso = progress?.progressPercent ?? 0;

  const insigniasFiltradas = achievements.filter((i) => {
    if (filtro === 'DESBLOQUEADOS') return i.desbloqueado;
    if (filtro === 'PENDIENTES')    return !i.desbloqueado;
    return true;
  });

  const xpActividadesInfo = [
    { icon: '✅', label: 'Completar una tarea',             xp: '+10 XP'  },
    { icon: '⏰', label: 'Completar una tarea a tiempo',    xp: '+15 XP'  },
    { icon: '🔥', label: 'Cumplir una racha',               xp: '+20 XP'  },
    { icon: '🎯', label: 'Cumplir una meta semanal',        xp: '+25 XP'  },
    { icon: '📈', label: 'Avance en una materia',           xp: '+8 XP'   },
  ];

  if (loading) return <AppLayout><div style={{ padding: 40, textAlign: 'center', fontFamily: "'Poppins',sans-serif", color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>Cargando...</div></AppLayout>;

  const s = st(isDark, t);

  return (
    <AppLayout>
      <div style={s.pageWrapper}>

        <div style={s.pageHeader}>
          <h1 style={s.pageTitle}>Mi progreso</h1>
          <p style={s.pageDesc}>Visualiza tu evolución académica y logros alcanzados este semestre.</p>
        </div>

        {/* ── FILA SUPERIOR: Hero + Logros recientes ── */}
        <div style={s.topRow}>
          <div style={s.heroCard}>
            <div style={s.levelWrap}>
              <LevelCircle isDark={isDark} level={nivel} />
            </div>
            <div style={s.heroInfo}>
              <div style={s.heroRangoRow}>
                <span style={s.heroRango(isDark)}>{progress?.rank ?? 'Estudiante Experto'}</span>
                <span style={s.proBadge}>PRO</span>
              </div>
              <div style={s.xpBar}>
                <ProgressBar value={pctProgreso} isDark={isDark} color="linear-gradient(90deg,#FF5B2E,#C4107A)" />
              </div>
              <div style={s.xpLabels(isDark)}>
                <span>{xpActual.toLocaleString()} XP</span>
                <span>{xpParaSiguiente.toLocaleString()} XP para Nivel {nivel + 1}</span>
              </div>
            </div>
            <div style={s.totalPuntosWrap}>
              <span style={s.totalLabel(isDark)}>TOTAL PUNTOS</span>
              <span style={s.totalNum(isDark)}>{totalPoints.toLocaleString()}</span>
            </div>
          </div>

          <div style={s.logrosPanel}>
            <div style={s.logrosPanelTitle(isDark)}>LOGROS RECIENTES</div>
            {logrosRecientes.length > 0 ? logrosRecientes.map((l) => (
              <div key={l.id} style={s.logroItem(isDark)}>
                <div style={{ ...s.logroIcon, background: l.iconBg }}>
                  <span style={{ fontSize: 16 }}>{l.icon}</span>
                </div>
                <div style={s.logroBody}>
                  <div style={s.logroTitulo(isDark)}>{l.titulo}</div>
                  <div style={s.logroSub(isDark)}>{l.sub}</div>
                </div>
                <ChevronRight size={15} color={isDark ? 'rgba(255,255,255,0.30)' : 'rgba(0,0,0,0.25)'} />
              </div>
            )) : <div style={{ ...s.logroItem(isDark), justifyContent: 'center', cursor: 'default', color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', fontSize: 12 }}>Sin logros recientes</div>}
          </div>
        </div>

        {/* ── GALERÍA DE LOGROS ── */}
        <section style={s.section}>
          <div style={s.sectionHeaderRow}>
            <div>
              <h2 style={s.sectionTitle(isDark)}>Galería de Logros</h2>
              <p style={s.sectionDesc(isDark)}>Tus insignias ganadas y desafíos pendientes.</p>
            </div>
            <div style={s.filtroTabs}>
              {FILTROS.map((f) => (
                <button key={f} style={s.filtroTab(isDark, filtro === f)} onClick={() => setFiltro(f)}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {insigniasFiltradas.length > 0 ? (
            <div style={s.insigniasGrid}>
              {insigniasFiltradas.map((ins) => (
                <div
                  key={ins.id}
                  style={s.insigniaCard(isDark, ins.desbloqueado)}
                  title={ins.desbloqueado ? ins.nombre : 'Insignia bloqueada'}
                >
                  <div style={s.insigniaCircle(ins.desbloqueado, ins.color, isDark)}>
                    {ins.desbloqueado
                      ? <span style={{ fontSize: 24 }}>{ins.icon}</span>
                      : <Lock size={18} color={isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.20)'} />}
                  </div>
                  <div style={s.insigniaTextGroup}>
                    <span style={s.insigniaNombre(isDark, ins.desbloqueado)}>{ins.nombre}</span>
                    <span style={s.insigniaDesc(isDark, ins.desbloqueado)}>{ins.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={s.insigniasEmpty(isDark)}>
              <span style={{ fontSize: 32 }}>🏅</span>
              <span style={s.insigniasEmptyText(isDark)}>
                {filtro === 'DESBLOQUEADOS'
                  ? 'Aún no has desbloqueado ninguna insignia'
                  : filtro === 'PENDIENTES'
                  ? 'No tienes insignias pendientes'
                  : 'Aún no hay insignias disponibles'}
              </span>
              <span style={s.insigniasEmptySubText(isDark)}>
                {filtro === 'DESBLOQUEADOS'
                  ? 'Completa tareas y cumple metas para ganar tu primera insignia.'
                  : 'Sigue así, vas por buen camino.'}
              </span>
            </div>
          )}
        </section>

        {/* ── CURSOS ── */}
        <div style={{ ...s.cursosCol, marginBottom: 24 }}>
          <h2 style={{ ...s.sectionTitle(isDark), marginBottom: 16 }}>Cursos en progreso</h2>
          {cursos.length > 0 ? (
            <div style={s.cursosGrid}>
              {cursos.map((c) => (
                <div key={c.id} style={s.cursoCard(isDark, t)}>
                  <div style={s.cursoTop}>
                    <div>
                      <div style={s.cursoNombre(isDark)}>{c.nombre}</div>
                      <div style={s.cursoSub(isDark)}>{c.sub}</div>
                    </div>
                    <div style={s.cursoIconWrap(c.iconColor)}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: c.iconColor, fontFamily: 'monospace' }}>
                        {c.icon}
                      </span>
                    </div>
                  </div>
                  <div style={{ marginTop: 'auto' }}>
                    <div style={s.cursoPctRow(isDark, c.barColor)}>
                      <span style={{ fontSize: 11, color: isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.45)', fontFamily: "'Poppins',sans-serif" }}>{c.pct}%</span>
                    </div>
                    <ProgressBar value={c.pct} isDark={isDark} color={c.barColor} />
                    <div style={s.cursoFooter}>
                      <div style={s.xpPillRow}>
                        {c.xp.map((x, i) => (
                          <span key={i} style={s.xpPill(c.barColor)}>{x} XP</span>
                        ))}
                      </div>
                      <span style={s.nivelBadge(c.barColor)}>LVL {c.nivel} {c.rango}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={s.cursosEmpty(isDark)}>
              <span style={{ fontSize: 32 }}>📚</span>
              <span style={s.cursosEmptyText(isDark)}>
                Aún no tienes cursos en progreso
              </span>
              <span style={s.cursosEmptySubText(isDark)}>
                Tus materias aparecerán aquí una vez que comiences el semestre.
              </span>
            </div>
          )}
        </div>

        {/* ── AIBERT WIDGET ── */}
        <div style={{ width: '100%', marginBottom: 32 }}>
          <div
            style={{ ...s.aibertWidget(isDark), ...(hoverAibert ? s.aibertWidgetHover(isDark) : {}) }}
            onMouseEnter={() => setHoverAibert(true)}
            onMouseLeave={() => setHoverAibert(false)}
          >
            <img src={aibertGif} alt="Aibert" style={s.aibertWidgetGif} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
              <span style={s.aibertWidgetLabel(isDark)}>ASISTENTE ACADÉMICO</span>
              <p style={s.aibertWidgetText(isDark)}>
                Gana puntos XP completando tus tareas, manteniendo rachas y cumpliendo metas. Cada actividad cuenta para subir de nivel y desbloquear nuevos logros.
              </p>
              <button
                style={s.aibertWidgetBtn(isDark)}
                onClick={() => setShowXpModal(true)}
              >
                ¿Cómo funciona el XP?
              </button>
            </div>
          </div>
        </div>

        {/* ── CTA BANNER ── */}
        <div style={s.ctaBanner(isDark)}>
          <div>
            <div style={s.ctaTitulo(isDark)}>¡Casi llegas al siguiente nivel!</div>
            <p style={s.ctaDesc(isDark)}>
              Completa una tarea de &apos;Sistemas Digitales&apos; para obtener +500 XP y
              desbloquear la insignia de Hardware Master.
            </p>
          </div>
          <button style={s.ctaBtn(isDark)} onClick={() => navigate('/tareas')}>
            COMPLETAR TAREA
          </button>
        </div>

      </div>

      {/* ── MODAL XP ── */}
      {showXpModal && (
        <div style={s.modalOverlay} onClick={() => setShowXpModal(false)}>
          <div style={s.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <div>
                <div style={s.modalLabel(isDark)}>SISTEMA DE PUNTOS</div>
                <h3 style={s.modalTitle(isDark)}>¿Cómo funciona el XP?</h3>
              </div>
              <button style={s.modalClose(isDark)} onClick={() => setShowXpModal(false)} aria-label="Cerrar">
                <X size={16} />
              </button>
            </div>

            <p style={s.modalIntro(isDark)}>
              Los puntos XP se acumulan cuando realizas actividades académicas. Con ellos subes de nivel y desbloqueas logros.
            </p>

            <div style={s.modalSection}>
              <div style={s.modalSectionTitle(isDark)}>Actividades válidas</div>
              <div style={s.actividadesList}>
                {xpActividadesInfo.map((a, i) => (
                  <div key={i} style={s.actividadItem(isDark)}>
                    <span style={s.actividadIcon}>{a.icon}</span>
                    <span style={s.actividadLabel(isDark)}>{a.label}</span>
                    <span style={s.actividadXp(isDark)}>{a.xp}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={s.modalSection}>
              <div style={s.modalSectionTitle(isDark)}>Reglas de control</div>
              <div style={s.reglasWrap(isDark)}>
                <div style={s.reglaItem}>
                  <span style={s.reglaNum}>1</span>
                  <span style={s.reglaText(isDark)}>
                    Si registras la misma actividad dos veces, <strong>no</strong> se vuelven a otorgar puntos.
                  </span>
                </div>
                <div style={s.reglaItem}>
                  <span style={s.reglaNum}>2</span>
                  <span style={s.reglaText(isDark)}>
                    Si la información del evento no es válida, <strong>no</strong> se asignan puntos.
                  </span>
                </div>
              </div>
            </div>

            <div style={s.modalFooterNote(isDark)}>
              💡 Cada XP acumulado aumenta tu progreso general, sube tu nivel y puede desbloquear nuevos logros.
            </div>
          </div>
        </div>
      )}

    </AppLayout>
  );
};

const LevelCircle = ({ isDark, level }) => {
  const size = 80, r = 32, circ = 2 * Math.PI * r, dash = circ * 0.74, id = 'lvl-grad';
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={isDark ? '#FF5B2E' : '#FF8430'} />
            <stop offset="100%" stopColor={isDark ? '#C4107A' : '#F7306D'} />
          </linearGradient>
        </defs>
        <circle cx={40} cy={40} r={r} fill="none" stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} strokeWidth={7} />
        <circle cx={40} cy={40} r={r} fill="none" stroke={`url(#${id})`} strokeWidth={7}
          strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={circ / 4} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, fontWeight: 900, color: isDark ? '#FF5B2E' : '#FF8430', lineHeight: 1 }}>{level}</span>
        <span style={{ fontSize: 8, letterSpacing: '0.08em', color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.40)', fontFamily: "'Poppins',sans-serif", fontWeight: 600 }}>LEVEL</span>
      </div>
    </div>
  );
};

const st = (isDark, t) => ({
  pageWrapper: { width: '100%' },
  pageHeader: { marginBottom: 28 },
  pageTitle: {
    fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 'clamp(26px,4vw,36px)',
    fontWeight: 800, color: isDark ? '#FF5B2E' : '#FF8430',
    margin: '0 0 4px', letterSpacing: '-0.02em',
  },
  pageDesc: { fontSize: 13, color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.50)', fontFamily: "'Poppins',sans-serif", margin: 0 },
  topRow: { display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap', alignItems: 'stretch' },
  heroCard: {
    flex: '1 1 380px',
    background: isDark ? 'linear-gradient(135deg,#1A0A0A 0%,#1F0F1A 100%)' : 'linear-gradient(135deg,#FFF5F0 0%,#FFF0F5 100%)',
    border: `1px solid ${isDark ? 'rgba(196,16,122,0.25)' : 'rgba(255,132,48,0.25)'}`,
    borderRadius: 18, padding: '24px 28px',
    display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap',
    boxShadow: isDark ? '0 0 0 1px rgba(196,16,122,0.15), 0 8px 32px rgba(0,0,0,0.40)' : '0 8px 32px rgba(255,132,48,0.15)',
  },
  levelWrap: { flexShrink: 0 },
  heroInfo: { flex: '1 1 160px', minWidth: 0 },
  heroRangoRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' },
  heroRango: (isDark) => ({ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 18, fontWeight: 800, color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)' }),
  proBadge: { fontSize: 9, fontWeight: 800, letterSpacing: '0.08em', color: '#fff', background: 'linear-gradient(90deg,#FF5B2E,#C4107A)', padding: '2px 7px', borderRadius: 99, fontFamily: "'Poppins',sans-serif" },
  xpBar: { marginBottom: 6 },
  xpLabels: (isDark) => ({ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.40)', fontFamily: "'Poppins',sans-serif" }),
  totalPuntosWrap: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0 },
  totalLabel: (isDark) => ({ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.40)', fontFamily: "'Poppins',sans-serif", marginBottom: 2 }),
  totalNum: (isDark) => ({ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 'clamp(28px,4vw,40px)', fontWeight: 900, color: isDark ? '#FF5B2E' : '#FF8430', lineHeight: 1 }),
  logrosPanel: { flex: '0 1 260px', background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: 18, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10, boxShadow: t.cardShadow },
  logrosPanelTitle: (isDark) => ({ fontSize: 10, letterSpacing: '0.12em', fontWeight: 700, color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.40)', fontFamily: "'Poppins',sans-serif", marginBottom: 4 }),
  logroItem: (isDark) => ({ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`, borderRadius: 12, cursor: 'pointer' }),
  logroIcon: { width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  logroBody: { flex: 1, minWidth: 0 },

  logroTitulo: (isDark) => ({
    fontSize: 13,
    fontWeight: 600,
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
    fontFamily: "'Poppins',sans-serif",
    lineHeight: 1.3,
  }),

  logroSub: (isDark) => ({
    fontSize: 11,
    color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.40)',
    fontFamily: "'Poppins',sans-serif",
  }),

  /* Columna de cursos */
  cursosCol: { flex: '1 1 360px', minWidth: 0 },

  /* Secciones */
  section: { marginBottom: 32 },
  sectionHeaderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16, flexWrap: 'wrap', gap: 12 },
  sectionTitle: (isDark) => ({ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 'clamp(18px,2.5vw,22px)', fontWeight: 700, color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)', margin: '0 0 2px' }),
  sectionDesc: (isDark) => ({ fontSize: 12, color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.45)', fontFamily: "'Poppins',sans-serif", margin: 0 }),
  filtroTabs: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  filtroTab: (isDark, active) => ({
    padding: '6px 14px', borderRadius: 99,
    border: active ? 'none' : `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)'}`,
    background: active ? (isDark ? 'linear-gradient(90deg,#FF5B2E,#C4107A)' : 'linear-gradient(90deg,#FF8430,#F7306D)') : 'transparent',
    color: active ? '#fff' : (isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.50)'),
    fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', fontFamily: "'Poppins',sans-serif", cursor: 'pointer', transition: 'all 0.15s',
  }),

  /* Galería */
  insigniasEmpty: (isDark) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
    border: `1px dashed ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)'}`,
    borderRadius: 16,
    gap: 10,
    textAlign: 'center',
  }),

  insigniasEmptyText: (isDark) => ({
    fontSize: 15,
    fontWeight: 600,
    color: isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.45)',
    fontFamily: "'Plus Jakarta Sans',sans-serif",
  }),

  insigniasEmptySubText: (isDark) => ({
    fontSize: 12,
    color: isDark ? 'rgba(255,255,255,0.30)' : 'rgba(0,0,0,0.30)',
    fontFamily: "'Poppins',sans-serif",
    maxWidth: 320,
    lineHeight: 1.5,
  }),

  insigniasGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 140px)',
    justifyContent: 'center',
    gap: 14,
  },

  insigniaCard: (isDark, desbloqueado) => ({
    background: t.cardBg,
    border: `1px solid ${desbloqueado ? (isDark ? 'rgba(196,16,122,0.25)' : 'rgba(255,132,48,0.25)') : t.cardBorder}`,
    borderRadius: 16, padding: '20px 14px 16px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
    boxShadow: t.cardShadow, opacity: desbloqueado ? 1 : 0.55,
    cursor: desbloqueado ? 'default' : 'not-allowed',
  }),
  insigniaCircle: (desbloqueado, color, isDark) => ({
    width: 54, height: 54, borderRadius: '50%',
    background: desbloqueado ? color + '1A' : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
    border: `2px solid ${desbloqueado ? color + '50' : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)')}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: desbloqueado ? `0 0 16px ${color}30` : 'none',
  }),

  insigniaTextGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },

  insigniaNombre: (isDark, desbloqueado) => ({
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    fontFamily: "'Poppins',sans-serif",
    color: desbloqueado
      ? (isDark ? '#FFFFFF' : 'rgba(0,0,0,0.80)')
      : (isDark ? 'rgba(255,255,255,0.30)' : 'rgba(0,0,0,0.30)'),
    textAlign: 'center',
  }),

  insigniaDesc: (isDark, desbloqueado) => ({
    fontSize: 9,
    fontFamily: "'Poppins',sans-serif",
    color: desbloqueado
      ? (isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)')
      : (isDark ? 'rgba(255,255,255,0.20)' : 'rgba(0,0,0,0.20)'),
    textAlign: 'center',
    lineHeight: 1.4,
  }),

  /* Cursos */
  cursosEmpty: (isDark) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
    border: `1px dashed ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)'}`,
    borderRadius: 16,
    gap: 10,
    textAlign: 'center',
  }),

  cursosEmptyText: (isDark) => ({
    fontSize: 15,
    fontWeight: 600,
    color: isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.45)',
    fontFamily: "'Plus Jakarta Sans',sans-serif",
  }),

  cursosEmptySubText: (isDark) => ({
    fontSize: 12,
    color: isDark ? 'rgba(255,255,255,0.30)' : 'rgba(0,0,0,0.30)',
    fontFamily: "'Poppins',sans-serif",
    maxWidth: 320,
    lineHeight: 1.5,
  }),

  cursosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 14,
  },

  cursoCard: (isDark) => ({
    background: isDark
      ? 'linear-gradient(160deg,#1A0A0A 0%,#1F0F1A 100%)'
      : t.cardBg,
    border: `1px solid ${isDark ? 'rgba(196,16,122,0.18)' : t.cardBorder}`,
    borderRadius: 16,
    padding: '16px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    boxShadow: t.cardShadow,
    minHeight: 160,
  }),

  cursoTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },

  cursoNombre: (isDark) => ({
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    fontSize: 15,
    fontWeight: 700,
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
    lineHeight: 1.25,
    marginBottom: 3,
  }),

  cursoSub: (isDark) => ({
    fontSize: 9,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
    fontFamily: "'Poppins',sans-serif",
    fontWeight: 600,
  }),

  cursoIconWrap: (color) => ({
    width: 34,
    height: 34,
    borderRadius: 10,
    background: color + '18',
    border: `1px solid ${color}30`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }),

  cursoPctRow: (isDark, color) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: 4,
    color,
    fontFamily: "'Poppins',sans-serif",
    fontWeight: 700,
    fontSize: 11,
  }),

  cursoFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    flexWrap: 'wrap',
    gap: 6,
  },

  xpPillRow: { display: 'flex', gap: 4 },

  xpPill: (color) => ({
    fontSize: 9,
    fontWeight: 600,
    fontFamily: "'Poppins',sans-serif",
    color,
    background: color + '15',
    border: `1px solid ${color}30`,
    padding: '2px 7px',
    borderRadius: 99,
  }),

  nivelBadge: (color) => ({
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: '0.06em',
    color,
    fontFamily: "'Poppins',sans-serif",
  }),

  /* Aibert widget banner */
  aibertWidget: (isDark) => ({
    background: isDark ? '#1A0614' : '#FFF0E8',
    border: `1px solid ${isDark ? 'rgba(196,16,122,0.22)' : 'rgba(255,132,48,0.22)'}`,
    borderRadius: 16,
    padding: '28px 36px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
    cursor: 'default',
    transition: 'box-shadow 0.2s, transform 0.2s',
    userSelect: 'none',
  }),

  aibertWidgetHover: (isDark) => ({
    boxShadow: isDark
      ? '0 6px 24px rgba(196,16,122,0.25)'
      : '0 6px 24px rgba(255,132,48,0.20)',
    transform: 'translateY(-2px)',
  }),

  aibertWidgetGif: {
    width: 90,
    height: 90,
    objectFit: 'contain',
    borderRadius: '50%',
  },

  aibertWidgetLabel: (isDark) => ({
    fontSize: 13,
    letterSpacing: '0.08em',
    fontWeight: 800,
    textTransform: 'uppercase',
    color: isDark ? 'rgba(255,255,255,0.70)' : 'rgba(0,0,0,0.55)',
    fontFamily: "'Poppins',sans-serif",
  }),

  aibertWidgetText: (isDark) => ({
    fontSize: 11,
    color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)',
    fontFamily: "'Poppins',sans-serif",
    lineHeight: 1.55,
    textAlign: 'left',
    margin: 0,
  }),

  aibertWidgetBtn: (isDark) => ({
    background: isDark
      ? 'linear-gradient(90deg,#FF5B2E,#C4107A)'
      : 'linear-gradient(90deg,#FF8430,#F7306D)',
    border: 'none',
    borderRadius: 10,
    padding: '10px 22px',
    color: '#fff',
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: isDark
      ? '0 4px 16px rgba(196,16,122,0.35)'
      : '0 4px 16px rgba(247,48,109,0.25)',
    marginTop: 4,
  }),

  /* CTA Banner */
  ctaBanner: (isDark) => ({
    background: isDark
      ? 'linear-gradient(135deg,#1F0A12 0%,#1A0F08 100%)'
      : 'linear-gradient(135deg,#FFF5F0 0%,#FFF0F5 100%)',
    border: `1px solid ${isDark ? 'rgba(196,16,122,0.30)' : 'rgba(255,132,48,0.30)'}`,
    borderRadius: 18,
    padding: 'clamp(16px,2.5vw,24px) clamp(20px,3vw,32px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
    flexWrap: 'wrap',
    boxShadow: isDark
      ? '0 0 0 1px rgba(196,16,122,0.15), 0 8px 32px rgba(0,0,0,0.30)'
      : '0 8px 32px rgba(255,132,48,0.12)',
    marginBottom: 4,
  }),

  ctaTitulo: (isDark) => ({
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    fontSize: 'clamp(16px,2vw,20px)',
    fontWeight: 800,
    color: isDark ? '#FF5B2E' : '#FF8430',
    marginBottom: 6,
  }),

  ctaDesc: (isDark) => ({
    fontSize: 13,
    color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)',
    fontFamily: "'Poppins',sans-serif",
    lineHeight: 1.55,
    margin: 0,
    maxWidth: 520,
  }),

  ctaBtn: (isDark) => ({
    background: isDark
      ? 'linear-gradient(90deg,#FF5B2E,#C4107A)'
      : 'linear-gradient(90deg,#FF8430,#F7306D)',
    border: 'none',
    borderRadius: 12,
    padding: '13px 28px',
    color: '#fff',
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: '0.06em',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    boxShadow: isDark
      ? '0 4px 20px rgba(196,16,122,0.40)'
      : '0 4px 20px rgba(247,48,109,0.30)',
  }),

  /* Modal XP */
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.65)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
    backdropFilter: 'blur(2px)',
    padding: '0 16px',
  },

  modalCard: {
    background: t.cardBg,
    border: `1px solid ${t.cardBorder}`,
    borderRadius: 20,
    width: '100%',
    maxWidth: 460,
    padding: '28px 28px 24px',
    boxShadow: t.modalShadow,
    maxHeight: '85vh',
    overflowY: 'auto',
  },

  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },

  modalLabel: (isDark) => ({
    fontSize: 9,
    letterSpacing: '0.14em',
    fontWeight: 700,
    textTransform: 'uppercase',
    color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.40)',
    fontFamily: "'Poppins',sans-serif",
    marginBottom: 4,
  }),

  modalTitle: (isDark) => ({
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    fontSize: 20,
    fontWeight: 800,
    backgroundImage: isDark
      ? 'linear-gradient(90deg,#FF5B2E,#C4107A)'
      : 'linear-gradient(90deg,#FF8430,#F7306D)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: 0,
  }),

  modalClose: (isDark) => ({
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.40)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    flexShrink: 0,
  }),

  modalIntro: (isDark) => ({
    fontSize: 13,
    color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)',
    fontFamily: "'Poppins',sans-serif",
    lineHeight: 1.6,
    margin: '0 0 20px',
  }),

  modalSection: { marginBottom: 20 },
  modalSectionTitle: (isDark) => ({ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.40)', fontFamily: "'Poppins',sans-serif", marginBottom: 10 }),
  actividadesList: { display: 'flex', flexDirection: 'column', gap: 8 },
  actividadItem: (isDark) => ({ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`, borderRadius: 10 }),
  actividadIcon: { fontSize: 16, flexShrink: 0, width: 24, textAlign: 'center' },
  actividadLabel: (isDark) => ({ flex: 1, fontSize: 12, color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.70)', fontFamily: "'Poppins',sans-serif" }),
  actividadXp: (isDark) => ({ fontSize: 11, fontWeight: 700, color: isDark ? '#FF5B2E' : '#FF8430', fontFamily: "'Poppins',sans-serif", flexShrink: 0 }),
  reglasWrap: (isDark) => ({ display: 'flex', flexDirection: 'column', gap: 10, background: isDark ? 'rgba(240,7,7,0.05)' : 'rgba(240,7,7,0.04)', border: `1px solid ${isDark ? 'rgba(240,7,7,0.20)' : 'rgba(240,7,7,0.15)'}`, borderRadius: 10, padding: '12px 14px' }),
  reglaItem: { display: 'flex', alignItems: 'flex-start', gap: 10 },
  reglaNum: { width: 20, height: 20, borderRadius: '50%', background: 'rgba(240,7,7,0.15)', color: '#F00707', fontSize: 10, fontWeight: 800, fontFamily: "'Poppins',sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  reglaText: (isDark) => ({ fontSize: 12, color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.60)', fontFamily: "'Poppins',sans-serif", lineHeight: 1.55 }),
  modalFooterNote: (isDark) => ({ fontSize: 12, color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)', fontFamily: "'Poppins',sans-serif", lineHeight: 1.5, padding: '12px 14px', background: isDark ? 'rgba(255,132,48,0.06)' : 'rgba(255,132,48,0.06)', border: `1px solid ${isDark ? 'rgba(255,132,48,0.15)' : 'rgba(255,132,48,0.20)'}`, borderRadius: 10 }),
});

export default Gamification;