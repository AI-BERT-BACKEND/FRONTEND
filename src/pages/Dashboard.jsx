import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import GridBackground from '../components/GridBackground';
import MascotaGif from '../assets/aibert-logo-sin-negro-corregido.gif';

/* ── Icon específico de esta pantalla ── */
const AlertIcon = ({ isDark }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <linearGradient id="alertGradDash" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={isDark ? '#FF5B2E' : '#FF8430'} />
        <stop offset="100%" stopColor={isDark ? '#C4107A' : '#F7306D'} />
      </linearGradient>
    </defs>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="url(#alertGradDash)"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="url(#alertGradDash)"/>
  </svg>
);

const Dashboard = ({ theme = 'light', onToggleTheme }) => {
  const isDark = theme === 'dark';
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const s = getStyles(isDark);

  const tasks = [
    { id: 1, text: 'Resolver ejercicios de cálculo integral', tag: 'Matemáticas', tagColor: isDark ? '#C4107A' : '#FF8430', time: '10:00 AM', done: false },
    { id: 2, text: 'Leer capítulo 4 de Historia', tag: 'Historia', tagColor: isDark ? '#2563EB' : '#3B82F6', time: '', done: true },
  ];

  const [tasksDone, setTasksDone] = useState({ 1: false, 2: true });

  return (
    <div style={s.root}>
      {/* ── Componente reutilizable de fondo ── */}
      <GridBackground isDark={isDark} />

      <Sidebar theme={theme} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(p => !p)} />

      <div style={s.main}>
        {/* ── Componente reutilizable de header ── */}
        <Header theme={theme} onToggleTheme={onToggleTheme} />

        <div style={s.scrollArea}>
          <div style={s.content}>

            {/* GREETING */}
            <h1 style={s.greeting}>Hola, Juan</h1>

            {/* ALERTS */}
            <div style={s.card}>
              <div style={s.alertHeader}>
                <AlertIcon isDark={isDark} />
                <span style={s.cardTitle}>Centro de Alertas</span>
              </div>
              <div style={s.alertItem}>
                <div style={s.alertBar} />
                <span style={s.alertText}>Sobrecarga detectada para mañana</span>
              </div>
              <div style={{ ...s.alertItem, marginTop: 8 }}>
                <div style={s.alertBar} />
                <span style={s.alertText}>Bajo rendimiento en Cálculo</span>
              </div>
              <div style={s.alertFooter}>
                <button style={s.linkBtn} onClick={() => navigate('/alertas')}>Ver detalle »</button>
              </div>
            </div>

            {/* ROW: Resumen + Circular */}
            <div style={s.row}>
              <div style={{ ...s.card, flex: 1, marginBottom: 0 }}>
                <div style={s.cardTitle}>Resumen Diario</div>
                <div style={s.cardSubtitle}>Tu ritmo de estudio esta semana</div>
                <div style={s.progressBlock}>
                  <div style={s.progressLabelRow}>
                    <span style={s.progressLabel}>Matemáticas</span>
                    <span style={s.progressLabel}>80%</span>
                  </div>
                  <div style={s.progressTrack}>
                    <div style={{ ...s.progressFill, width: '80%' }} />
                  </div>
                </div>
                <div style={s.progressBlock}>
                  <div style={s.progressLabelRow}>
                    <span style={s.progressLabel}>Historia Moderna</span>
                    <span style={s.progressLabel}>46%</span>
                  </div>
                  <div style={s.progressTrack}>
                    <div style={{ ...s.progressFill, width: '46%', background: isDark ? '#C4107A' : '#F7306D' }} />
                  </div>
                </div>
                <div style={s.focusBlock}>
                  <span style={s.focusTime}>4.2h</span>
                  <span style={s.focusLabel}>ENFOCADO HOY</span>
                </div>
              </div>

              <div style={{ ...s.card, ...s.circleCard, marginBottom: 0 }}>
                <CircleProgress pct={75} isDark={isDark} />
                <p style={s.circleText}>Vas por buen camino para cumplir tus metas de la semana.</p>
              </div>
            </div>

            {/* ROW: Tareas + AI */}
            <div style={{ ...s.row, marginTop: 16 }}>
              <div style={{ ...s.card, flex: 1, marginBottom: 0 }}>
                <div style={s.taskHeader}>
                  <span style={s.cardTitle}>Lista de Tareas</span>
                  <button style={s.linkBtn} onClick={() => navigate('/tareas')}>+ Nueva tarea</button>
                </div>
                {tasks.map(task => (
                  <div key={task.id} style={s.taskItem}>
                    <div style={{
                      ...s.checkbox,
                      background: tasksDone[task.id]
                        ? (isDark ? 'linear-gradient(135deg,#C4107A,#FF5B2E)' : 'linear-gradient(135deg,#FF8430,#F7306D)')
                        : 'transparent',
                      borderColor: tasksDone[task.id] ? 'transparent' : (isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)'),
                    }}
                      onClick={() => setTasksDone(p => ({ ...p, [task.id]: !p[task.id] }))}>
                      {tasksDone[task.id] && <span style={{ color: '#fff', fontSize: 11 }}>✓</span>}
                    </div>
                    <div style={s.taskContent}>
                      <div style={{ ...s.taskText, textDecoration: tasksDone[task.id] ? 'line-through' : 'none', opacity: tasksDone[task.id] ? 0.5 : 1 }}>
                        {task.text}
                      </div>
                      <div style={s.taskMeta}>
                        <span style={{ ...s.tag, background: task.tagColor + '30', color: task.tagColor }}>{task.tag}</span>
                        {task.time && <span style={s.taskTime}>🕑 {task.time}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI ASSISTANT */}
              <div style={{ ...s.card, ...s.aiCard, marginBottom: 0 }}>
                <div style={s.aiLabel}>AI ASSISTANT</div>
                <div style={s.aiBody}>
                  <div style={s.mascotWrap}>
                    <img src={MascotaGif} alt="AI.BERT" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <p style={s.aiText}>
                    "Te sugiero priorizar Matemáticas hoy. Tienes un examen en 3 días y esta sesión te dará la ventaja necesaria."
                  </p>
                </div>
                <button style={s.aiBtn} onClick={() => navigate('/priorizacion')}>Ver plan detallado →</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const CircleProgress = ({ pct, isDark }) => {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div style={{ position: 'relative', width: 110, height: 110 }}>
      <svg width="110" height="110" viewBox="0 0 110 110">
        <defs>
          <linearGradient id="circGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={isDark ? '#FF5B2E' : '#FF8430'} />
            <stop offset="100%" stopColor={isDark ? '#C4107A' : '#F7306D'} />
          </linearGradient>
        </defs>
        <circle cx="55" cy="55" r={r} fill="none"
          stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} strokeWidth="10" />
        <circle cx="55" cy="55" r={r} fill="none"
          stroke="url(#circGrad)" strokeWidth="10"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ / 4} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 20, color: isDark ? '#FF5B2E' : '#FF8430' }}>{pct}%</span>
        <span style={{ fontSize: 9, color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.40)', fontFamily: "'Poppins',sans-serif" }}>Completado</span>
      </div>
    </div>
  );
};

const getStyles = (isDark) => ({
  root: {
    display: 'flex', minHeight: '100vh', width: '100%',
    fontFamily: "'Poppins', sans-serif", position: 'relative',
    boxSizing: 'border-box', backgroundColor: isDark ? '#050208' : '#FDF2EB',
  },
  main: { flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1, minWidth: 0 },
  scrollArea: { flex: 1, overflowY: 'auto', overflowX: 'hidden' },
  content: { padding: '28px 32px', width: '100%', boxSizing: 'border-box' },
  greeting: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 36, fontWeight: 800, margin: '0 0 24px 0', padding: 0, color: isDark ? '#FF5B2E' : '#FF8430' },
  card: { background: isDark ? '#171717' : '#FEFAF9', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(220,193,181,0.30)'}`, borderRadius: 16, padding: '18px 22px', marginBottom: 16, boxShadow: isDark ? '0 4px 24px rgba(196,16,122,0.10)' : '0 4px 24px rgba(253,214,189,0.50)' },
  cardTitle: { fontSize: 14, fontWeight: 700, color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)', fontFamily: "'Poppins', sans-serif", marginBottom: 2 },
  cardSubtitle: { fontSize: 11, color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.45)', marginBottom: 16 },
  alertHeader: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 },
  alertItem: { display: 'flex', alignItems: 'center', gap: 12, background: isDark ? 'rgba(196,16,122,0.08)' : 'rgba(255,132,48,0.07)', borderRadius: 8, padding: '10px 14px' },
  alertBar: { width: 3, height: 22, borderRadius: 2, background: isDark ? 'linear-gradient(180deg,#FF5B2E,#C4107A)' : 'linear-gradient(180deg,#FF8430,#F7306D)', flexShrink: 0 },
  alertText: { fontSize: 13, color: isDark ? 'rgba(255,255,255,0.80)' : 'rgba(0,0,0,0.75)' },
  alertFooter: { textAlign: 'right', marginTop: 12 },
  linkBtn: { background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 600, color: isDark ? '#FF5B2E' : '#F7306D', padding: 0 },
  row: { display: 'flex', gap: 16, alignItems: 'stretch' },
  progressBlock: { marginBottom: 14 },
  progressLabelRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 5 },
  progressLabel: { fontSize: 12, color: isDark ? 'rgba(255,255,255,0.60)' : 'rgba(0,0,0,0.55)' },
  progressTrack: { height: 7, borderRadius: 4, background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4, background: isDark ? 'linear-gradient(90deg,#FF5B2E,#C4107A)' : 'linear-gradient(90deg,#FF8430,#F7306D)' },
  focusBlock: { marginTop: 16, display: 'flex', flexDirection: 'column', gap: 2 },
  focusTime: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 28, color: isDark ? '#FF5B2E' : '#FF8430', display: 'block' },
  focusLabel: { fontSize: 10, letterSpacing: '0.10em', color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)', textTransform: 'uppercase', display: 'block' },
  circleCard: { width: 210, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 },
  circleText: { fontSize: 12, textAlign: 'center', color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.60)', lineHeight: 1.5, margin: 0 },
  taskHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  taskItem: { display: 'flex', alignItems: 'flex-start', gap: 12, paddingBottom: 14, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`, marginBottom: 14 },
  checkbox: { width: 20, height: 20, borderRadius: 5, border: '2px solid', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, transition: 'all 0.2s' },
  taskContent: { flex: 1 },
  taskText: { fontSize: 13, color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)', marginBottom: 6, lineHeight: 1.4 },
  taskMeta: { display: 'flex', alignItems: 'center', gap: 8 },
  tag: { fontSize: 10, fontWeight: 600, padding: '2px 10px', borderRadius: 10 },
  taskTime: { fontSize: 10, color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)' },
  aiCard: { width: 210, flexShrink: 0 },
  aiLabel: { fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: isDark ? '#FF5B2E' : '#FF8430', fontWeight: 700, marginBottom: 12 },
  aiBody: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 },
  mascotWrap: { width: 80, height: 80 },
  aiText: { fontSize: 12, color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.70)', lineHeight: 1.5, fontStyle: 'italic', textAlign: 'center', margin: 0 },
  aiBtn: { marginTop: 14, background: 'none', border: `1px solid ${isDark ? 'rgba(196,16,122,0.40)' : 'rgba(247,48,109,0.30)'}`, borderRadius: 8, padding: '7px 12px', width: '100%', fontFamily: "'Poppins', sans-serif", fontSize: 11, fontWeight: 600, color: isDark ? '#FF5B2E' : '#F7306D', cursor: 'pointer', boxSizing: 'border-box' },
});

export default Dashboard;