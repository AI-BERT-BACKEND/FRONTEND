import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/Layout/AppLayout';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { createStyles } from '../theme/createStyles';
import CircleProgress from '../components/CircleProgress';
import ProgressBar from '../components/ProgressBar';
import AibertGif from '../assets/aibert-logo-sin-negro-corregido.gif';
import AibertRojo from '../assets/aibert-rojo.gif';
import AibertAmarillo from '../assets/aibert-amarillo.gif';
import AibertVerde from '../assets/aibert-verde.gif';
import { ArrowRight, Plus, Clock, AlertTriangle, TrendingDown, X, Bell } from 'lucide-react';

const NIVEL_COLOR = { rojo: '#F00707', amarillo: '#EAB308', verde: '#22C55E' };
import taskService from '../services/taskService';
import notificationService from '../services/notificationService';
import academicService from '../services/academicService';
import statsService from '../services/statsService';

const Dashboard = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const t = createStyles(isDark);

  const getGreetingName = () => {
    if (!user) return 'Usuario';
    if (user.name) return user.name;
    if (user.firstName) return user.firstName;
    if (user.email) return user.email.split('@')[0];
    return 'Usuario';
  };

  const [alertas, setAlertas] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [stats, setStats] = useState({ focusHours: 0 });
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [loadingAlertas, setLoadingAlertas] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTask, setNewTask]       = useState('');
  const [pulseBorder, setPulseBorder] = useState(false);

  const tareasTotales = tareas.length;
  const tareasCompletadas = tareas.filter((t) => t.done).length;
  const progresoPorcentaje = tareasTotales > 0 ? Math.round((tareasCompletadas / tareasTotales) * 100) : 0;

   useEffect(() => {
     const fetchData = async () => {
       try {
         const [alertasRes, summaryRes, tasksRes, statsRes, aiSugRes] = await Promise.allSettled([
           notificationService.getAlertNotifications(),
           academicService.getSummary(),
           taskService.getTasks(),
           statsService.getDashboard(),
           notificationService.getTopStudySuggestion().catch(() => null),
         ]);

         if (alertasRes.status === 'fulfilled') {
           const data = alertasRes.value;
           setAlertas((data.alerts || data || []).map((a, i) => ({
             id: a.id || i + 1,
             tipo: a.type === 'danger' ? 'danger' : 'warning',
             texto: a.title || a.message || a.texto,
             detalle: a.description || a.detail || a.detalle,
           })));
         }
         setLoadingAlertas(false);

         if (summaryRes.status === 'fulfilled') {
           const data = summaryRes.value;
           const subjects = data.subjects || data || [];
           setMaterias(subjects.map((s) => ({
             nombre: s.name || s.nombre,
             pct: s.percentage || s.pct || s.progress || 0,
             color: s.color || '#FF8430',
           })));
         }
         setLoadingSummary(false);

         if (tasksRes.status === 'fulfilled') {
           const data = tasksRes.value;
           const tasks = data.tasks || data || [];
           setTareas(tasks.slice(0, 5).map((t) => ({
             id: t.id || Date.now(),
             texto: t.title || t.name || t.nombre || t.texto,
             materia: t.subject || t.materia || 'General',
             color: t.color || '#00CFFF',
             hora: t.time || t.hora || t.schedule || '',
             done: t.completed || t.done || false,
           })));
         }
         setLoadingTasks(false);

         if (statsRes.status === 'fulfilled') {
           const data = statsRes.value;
           setStats({
             focusHours: data.focusHours || data.focus_hours || data.studyHours || 0,
           });
         }
         setLoadingStats(false);

         if (aiSugRes.status === 'fulfilled' && aiSugRes.value) {
           const data = aiSugRes.value;
           const text = data.suggestion || data.text || data.message || data.title || data.advice || '';
           if (text) setAiSuggestion(text);
         }
       } catch {
         setLoadingAlertas(false);
         setLoadingSummary(false);
         setLoadingTasks(false);
         setLoadingStats(false);
       }
     };
     fetchData();
   }, []);

  const dismissAlerta = (id) => setAlertas((prev) => prev.filter((a) => a.id !== id));

  const toggleTarea = (id) =>
    setTareas((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const addTarea = () => {
    const txt = newTask.trim();
    if (!txt) return;
    setTareas((prev) => [
      ...prev,
      { id: Date.now(), texto: txt, materia: 'General', color: '#00CFFF', hora: '', done: false },
    ]);
    setNewTask('');
    setShowNewTask(false);
  };

  const tareasPendientes = tareas.filter((t) => !t.done).length;

  const getAlertNivel = () => {
    const hasDanger = alertas.some(
      (a) => a.tipo === 'danger' || a.texto.toLowerCase().includes('sobrecarga')
    );
    if (hasDanger || tareasPendientes > 5) return 'rojo';
    const hasWarning = alertas.some((a) => a.tipo === 'warning');
    if (hasWarning || (tareasPendientes >= 3 && tareasPendientes <= 5)) return 'amarillo';
    return 'verde';
  };

  const alertNivel = getAlertNivel();

  useEffect(() => {
    if (alertNivel !== 'rojo') return;
    const id = setInterval(() => setPulseBorder((p) => !p), 700);
    return () => clearInterval(id);
  }, [alertNivel]);

  const s = styles(isDark, t);

  return (
    <AppLayout>

       {/* ── SALUDO ── */}
       <h1 style={s.greeting}>Hola, {getGreetingName()}</h1>

      {/* ── GIF DE ESTADO ── */}
      <section style={{ ...s.card, border: alertNivel === 'rojo' ? `1px solid ${pulseBorder ? 'rgba(240,7,7,0.60)' : 'rgba(240,7,7,0.18)'}` : alertNivel === 'amarillo' ? '1px solid rgba(234,179,8,0.35)' : '1px solid rgba(34,197,94,0.35)', transition: 'border-color 0.35s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <img
            src={alertNivel === 'rojo' ? AibertRojo : alertNivel === 'amarillo' ? AibertAmarillo : AibertVerde}
            alt="AI.BERT"
            style={{ width: 90, height: 90, borderRadius: 12, objectFit: 'contain', flexShrink: 0 }}
          />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
            <span style={s.alertNivelBadge(alertNivel)}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: NIVEL_COLOR[alertNivel], flexShrink: 0 }} />
              {alertNivel === 'rojo' ? 'CARGA ALTA' : alertNivel === 'amarillo' ? 'CARGA MEDIA' : 'CARGA BAJA'}
            </span>
            <div style={s.alertNivelTitle}>
              {alertNivel === 'rojo' ? '¡Sobrecarga detectada!' : alertNivel === 'amarillo' ? 'Atención moderada' : '¡Todo bajo control!'}
            </div>
            <div style={s.alertNivelSub(isDark)}>
              {alertNivel === 'rojo'
                ? 'Tienes demasiadas tareas críticas. Revisa el motor de priorización ahora.'
                : alertNivel === 'amarillo'
                  ? 'Tienes entregas próximas. Organiza tu tiempo para no acumularte.'
                  : 'No tienes entregas urgentes. Buen momento para adelantar material.'}
            </div>
            {alertNivel !== 'verde' && (
              <button style={s.alertNivelBtn(alertNivel)} onClick={() => navigate('/priorizacion')}>
                Ver priorización →
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── CENTRO DE ALERTAS ── */}
      <section style={s.card} aria-label="Centro de Alertas">
        <div style={s.cardHeader}>
          <div style={s.cardTitleRow}>
            <Bell size={18} color={isDark ? '#FF5B2E' : '#FF8430'} />
            <span style={s.cardTitle}>Centro de Alertas</span>
            {alertas.length > 0 && (
              <span style={s.alertBadge(isDark)}>{alertas.length}</span>
            )}
          </div>
        </div>

        <div style={s.alertList}>
          {loadingAlertas && (
            <span style={{ fontSize: 12, color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.40)', fontStyle: 'italic' }}>Cargando alertas...</span>
          )}
          {!loadingAlertas && alertas.length === 0 && (
            <span style={{ fontSize: 12, color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.40)', fontStyle: 'italic' }}>No hay alertas pendientes</span>
          )}
          {alertas.map((a) => (
            <div key={a.id} style={s.alertItem(a.tipo, isDark)}>
              <div style={s.alertIcon(a.tipo)}>
                {a.tipo === 'warning'
                  ? <AlertTriangle size={14} color="#EAB308" />
                  : <TrendingDown size={14} color="#F7306D" />}
              </div>
              <div style={s.alertBody}>
                <span style={s.alertText(isDark)}>{a.texto}</span>
                <span style={s.alertDetail(isDark)}>{a.detalle}</span>
              </div>
              <button
                style={s.alertDismiss}
                onClick={() => dismissAlerta(a.id)}
                aria-label="Descartar alerta"
              >
                <X size={13} color={isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.30)'} />
              </button>
            </div>
          ))}
        </div>

        <button style={s.linkBtn} onClick={() => navigate('/estadisticas')}>
          Ver detalle <ArrowRight size={13} style={{ marginLeft: 4 }} />
        </button>
      </section>

      {/* ── FILA CENTRAL: Resumen + Progreso ── */}
      <div style={s.row2}>

        <section style={{ ...s.card, flex: '1 1 340px' }} aria-label="Resumen Diario">
          <div style={s.cardHeader}>
            <div>
              <div style={s.cardTitle}>Resumen Diario</div>
              <div style={s.cardSubtitle(isDark)}>Tu ritmo de estudio esta semana</div>
            </div>
             <div style={s.focusBlock}>
               <span style={s.focusTime(isDark)}>{stats.focusHours || 0}h</span>
               <span style={s.focusLabel(isDark)}>ENFOCADO HOY</span>
             </div>
          </div>
          <div style={s.materiasList}>
            {materias.length === 0 && loadingSummary && (
              <span style={{ fontSize: 12, color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.40)', fontStyle: 'italic' }}>Cargando...</span>
            )}
            {materias.length === 0 && !loadingSummary && (
              <span style={{ fontSize: 12, color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.40)', fontStyle: 'italic' }}>Sin datos disponibles</span>
            )}
            {materias.map((m) => (
              <div key={m.nombre} style={s.materiaRow}>
                <div style={s.materiaRowHeader}>
                  <span style={s.materiaRowName(isDark)}>{m.nombre}</span>
                  <span style={{ ...s.materiaRowPct, color: m.color }}>{m.pct}%</span>
                </div>
                <ProgressBar value={m.pct} isDark={isDark} color={m.color} />
              </div>
            ))}
          </div>
        </section>

         <section style={{ ...s.card, flex: '0 1 240px', alignItems: 'center', textAlign: 'center' }} aria-label="Progreso semanal">
           <CircleProgress pct={progresoPorcentaje} isDark={isDark} size={130} label="Completado" />
          <p style={s.progressText(isDark)}>
            Vas por buen camino para cumplir tus metas de la semana.
          </p>
          <button style={s.linkBtn} onClick={() => navigate('/gestion/metas')}>
            Ver metas <ArrowRight size={13} style={{ marginLeft: 4 }} />
          </button>
        </section>

      </div>

      {/* ── FILA INFERIOR: Tareas + AI Assistant ── */}
      <div style={s.row2}>

        <section style={{ ...s.card, flex: '1 1 340px' }} aria-label="Lista de Tareas">
          <div style={s.cardHeader}>
            <div>
              <div style={s.cardTitle}>Lista de Tareas</div>
              <div style={s.cardSubtitle(isDark)}>
                {tareasPendientes} pendiente{tareasPendientes !== 1 ? 's' : ''}
              </div>
            </div>
            <button style={s.newTaskBtn(isDark)} onClick={() => setShowNewTask((p) => !p)}>
              <Plus size={13} /> Nueva tarea
            </button>
          </div>

          {showNewTask && (
            <div style={s.newTaskRow}>
              <input
                autoFocus
                style={s.newTaskInput(isDark, t)}
                placeholder="Nombre de la tarea…"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addTarea();
                  if (e.key === 'Escape') setShowNewTask(false);
                }}
              />
              <button style={s.addBtn(isDark)} onClick={addTarea}>Agregar</button>
            </div>
          )}

          <ul style={s.taskList}>
            {loadingTasks && (
              <span style={{ fontSize: 12, color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.40)', fontStyle: 'italic' }}>Cargando tareas...</span>
            )}
            {!loadingTasks && tareas.length === 0 && (
              <span style={{ fontSize: 12, color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.40)', fontStyle: 'italic' }}>No hay tareas pendientes</span>
            )}
            {tareas.map((tarea) => (
              <li key={tarea.id} style={s.taskItem(isDark, tarea.done)}>
                <button style={s.checkbox(tarea.done, tarea.color)} onClick={() => toggleTarea(tarea.id)}>
                  {tarea.done && (
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                      <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
                <div style={s.taskBody}>
                  <span style={s.taskText(isDark, tarea.done)}>{tarea.texto}</span>
                  <div style={s.taskMeta}>
                    <span style={s.taskTag(tarea.color)}>{tarea.materia}</span>
                    {tarea.hora && (
                      <span style={s.taskHora(isDark)}>
                        <Clock size={10} style={{ marginRight: 3 }} />{tarea.hora}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <button style={s.linkBtn} onClick={() => navigate('/tareas')}>
            Ver todas las tareas <ArrowRight size={13} style={{ marginLeft: 4 }} />
          </button>
        </section>

        <section style={{ ...s.card, flex: '0 1 240px', alignItems: 'center', textAlign: 'center' }} aria-label="AI Assistant">
          <span style={s.aiLabel(isDark)}>AI ASSISTANT</span>
          <div style={s.aiImgWrap(isDark)}>
            <img src={AibertGif} alt="AI.BERT" style={s.aiImg} />
          </div>
           <blockquote style={s.aiQuote(isDark)}>
             &ldquo;{aiSuggestion
               ? aiSuggestion.replace(/["']/g, '')
               : 'Sigue con tu plan de estudio. Organiza tus prioridades y mantén la constancia para alcanzar tus metas académicas.'}
             &rdquo;
           </blockquote>
          <button style={s.aiBtn(isDark)} onClick={() => navigate('/horario-inteligente')}>Ver recomendación</button>
          <button style={s.aiBtn(isDark)} onClick={() => navigate('/sesion/iniciar')}>Iniciar Sesión de Estudio</button>
        </section>

      </div>

    </AppLayout>
  );
};

const styles = (isDark, t) => ({
  greeting: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800,
    color: isDark ? '#FF5B2E' : '#FF8430',
    margin: '0 0 20px', letterSpacing: '-0.02em',
  },
  card: {
    background: t.cardBg, border: `1px solid ${t.cardBorder}`,
    borderRadius: 18, padding: 'clamp(16px, 2.5vw, 24px)',
    boxShadow: t.cardShadow, display: 'flex', flexDirection: 'column',
    gap: 14, marginBottom: 16,
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' },
  cardTitleRow: { display: 'flex', alignItems: 'center', gap: 8 },
  cardTitle: {
    fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 700,
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
  },
  cardSubtitle: (isDark) => ({
    fontSize: 12, color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.45)',
    fontFamily: "'Poppins', sans-serif", marginTop: 2,
  }),
  alertNivelBadge: (nivel) => ({
    display: 'inline-flex', alignItems: 'center', gap: 5,
    fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
    color: NIVEL_COLOR[nivel], fontFamily: "'Poppins', sans-serif",
    background: nivel === 'rojo' ? 'rgba(240,7,7,0.10)' : nivel === 'amarillo' ? 'rgba(234,179,8,0.12)' : 'rgba(34,197,94,0.12)',
    border: `1px solid ${nivel === 'rojo' ? 'rgba(240,7,7,0.25)' : nivel === 'amarillo' ? 'rgba(234,179,8,0.30)' : 'rgba(34,197,94,0.30)'}`,
    borderRadius: 99, padding: '2px 9px', width: 'fit-content',
  }),
  alertNivelTitle: {
    fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 800,
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
  },
  alertNivelSub: (isDark) => ({
    fontFamily: "'Poppins', sans-serif", fontSize: 12,
    color: isDark ? 'rgba(255,255,255,0.60)' : 'rgba(0,0,0,0.55)', lineHeight: 1.5,
  }),
  alertNivelBtn: (nivel) => ({
    background: 'none', border: 'none', cursor: 'pointer',
    color: nivel === 'rojo' ? '#F00707' : '#EAB308',
    fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 600,
    display: 'flex', alignItems: 'center', gap: 4, padding: 0, alignSelf: 'flex-start',
  }),
  alertBadge: (isDark) => ({
    background: isDark ? '#C4107A' : '#F7306D', color: '#fff',
    fontSize: 10, fontWeight: 700, borderRadius: 99, padding: '1px 7px',
    fontFamily: "'Poppins', sans-serif",
  }),
  alertList: { display: 'flex', flexDirection: 'column', gap: 8 },
  alertItem: (tipo, isDark) => ({
    display: 'flex', alignItems: 'flex-start', gap: 10,
    padding: '10px 14px', borderRadius: 12,
    borderLeft: `3px solid ${tipo === 'warning' ? '#EAB308' : '#F7306D'}`,
    background: tipo === 'warning'
      ? (isDark ? 'rgba(234,179,8,0.07)' : 'rgba(234,179,8,0.06)')
      : (isDark ? 'rgba(247,48,109,0.07)' : 'rgba(247,48,109,0.05)'),
  }),
  alertIcon: (tipo) => ({
    flexShrink: 0, marginTop: 2, width: 26, height: 26, borderRadius: 8,
    background: tipo === 'warning' ? 'rgba(234,179,8,0.15)' : 'rgba(247,48,109,0.15)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }),
  alertBody: { flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 },
  alertText: (isDark) => ({
    fontSize: 13, fontWeight: 600,
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
    fontFamily: "'Poppins', sans-serif", lineHeight: 1.3,
  }),
  alertDetail: (isDark) => ({
    fontSize: 11, color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.45)',
    fontFamily: "'Poppins', sans-serif",
  }),
  alertDismiss: {
    background: 'none', border: 'none', cursor: 'pointer', padding: 4,
    borderRadius: 6, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  linkBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: isDark ? '#FF5B2E' : '#F7306D', fontFamily: "'Poppins', sans-serif",
    fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center',
    padding: 0, letterSpacing: '0.01em', alignSelf: 'flex-end',
  },
  row2: { display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'stretch' },
  focusBlock: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0 },
  focusTime: (isDark) => ({
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 900,
    color: isDark ? '#FF5B2E' : '#FF8430', lineHeight: 1,
  }),
  focusLabel: (isDark) => ({
    fontSize: 9, letterSpacing: '0.10em', textTransform: 'uppercase',
    color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.45)',
    fontFamily: "'Poppins', sans-serif", marginTop: 3,
  }),
  materiasList: { display: 'flex', flexDirection: 'column', gap: 12 },
  materiaRow: { display: 'flex', flexDirection: 'column', gap: 5 },
  materiaRowHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  materiaRowName: (isDark) => ({
    fontSize: 12, fontWeight: 500,
    color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.70)',
    fontFamily: "'Poppins', sans-serif",
  }),
  materiaRowPct: { fontSize: 12, fontWeight: 700, fontFamily: "'Poppins', sans-serif" },
  progressText: (isDark) => ({
    fontSize: 13, color: isDark ? 'rgba(255,255,255,0.60)' : 'rgba(0,0,0,0.55)',
    fontFamily: "'Poppins', sans-serif", lineHeight: 1.55,
    margin: '4px 0 0', textAlign: 'center',
  }),
  newTaskBtn: (isDark) => ({
    background: 'transparent',
    border: `1px solid ${isDark ? 'rgba(255,91,46,0.40)' : 'rgba(247,48,109,0.35)'}`,
    borderRadius: 8, padding: '6px 12px',
    color: isDark ? '#FF5B2E' : '#F7306D', fontFamily: "'Poppins', sans-serif",
    fontSize: 12, fontWeight: 600, cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap', flexShrink: 0,
  }),
  newTaskRow: { display: 'flex', gap: 8 },
  newTaskInput: (isDark, t) => ({
    flex: 1, background: t.inputBg, border: `1px solid ${t.inputBorder}`,
    borderRadius: 10, padding: '9px 12px', fontFamily: "'Poppins', sans-serif",
    fontSize: 12, color: isDark ? '#fff' : 'rgba(0,0,0,0.85)', outline: 'none',
  }),
  addBtn: (isDark) => ({
    background: isDark ? 'linear-gradient(90deg, #FF5B2E, #C4107A)' : 'linear-gradient(90deg, #FF8430, #F7306D)',
    border: 'none', borderRadius: 10, padding: '9px 14px', color: '#fff',
    fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 600,
    cursor: 'pointer', whiteSpace: 'nowrap',
  }),
  taskList: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 },
  taskItem: (isDark, done) => ({
    display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 12px', borderRadius: 12,
    background: done ? (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)') : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'),
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
    transition: 'background 0.15s',
  }),
  checkbox: (done, color) => ({
    width: 20, height: 20, borderRadius: 6,
    border: done ? 'none' : `2px solid ${color}`,
    background: done ? color : 'transparent',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, marginTop: 1, transition: 'all 0.15s',
  }),
  taskBody: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 5 },
  taskText: (isDark, done) => ({
    fontSize: 13, fontWeight: done ? 400 : 600,
    color: done ? (isDark ? 'rgba(255,255,255,0.30)' : 'rgba(0,0,0,0.30)') : (isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)'),
    fontFamily: "'Poppins', sans-serif",
    textDecoration: done ? 'line-through' : 'none', lineHeight: 1.35,
  }),
  taskMeta: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  taskTag: (color) => ({
    fontSize: 10, fontWeight: 600, color,
    background: color + '1A', padding: '2px 8px',
    borderRadius: 99, fontFamily: "'Poppins', sans-serif",
  }),
  taskHora: (isDark) => ({
    fontSize: 10, color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
    fontFamily: "'Poppins', sans-serif", display: 'flex', alignItems: 'center',
  }),
  aiLabel: (isDark) => ({
    fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
    fontWeight: 700, fontFamily: "'Poppins', sans-serif",
    color: isDark ? '#FF5B2E' : '#F7306D', alignSelf: 'center',
  }),
  aiImgWrap: (isDark) => ({
    width: 90, height: 90, borderRadius: '50%', overflow: 'hidden',
    background: isDark
      ? 'radial-gradient(circle, rgba(196,16,122,0.20) 0%, rgba(255,91,46,0.10) 100%)'
      : 'radial-gradient(circle, rgba(255,132,48,0.18) 0%, rgba(247,48,109,0.10) 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: isDark ? '0 0 32px rgba(196,16,122,0.35)' : '0 0 32px rgba(255,132,48,0.25)',
    flexShrink: 0, alignSelf: 'center',
  }),
  aiImg: { width: '80%', height: '80%', objectFit: 'contain' },
  aiQuote: (isDark) => ({
    fontSize: 12, fontStyle: 'italic',
    color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.60)',
    fontFamily: "'Poppins', sans-serif", lineHeight: 1.6,
    margin: '4px 0 0', borderLeft: 'none', padding: 0, textAlign: 'center',
  }),
  aiBtn: (isDark) => ({
    background: isDark ? 'linear-gradient(90deg, #FF5B2E, #C4107A)' : 'linear-gradient(90deg, #FF8430, #F7306D)',
    border: 'none', borderRadius: 10, padding: '9px 18px', color: '#fff',
    fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 600,
    cursor: 'pointer', alignSelf: 'center', marginTop: 4,
  }),
});

export default Dashboard;