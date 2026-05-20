import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/Layout/AppLayout';
import CircleProgress from '../components/CircleProgress';
import ProgressBar from '../components/ProgressBar';
import MascotaGif from '../assets/aibert-logo-sin-negro-corregido.gif';
import { useTheme } from '../context/ThemeContext';
import { createStyles } from '../theme/createStyles';

const AlertIcon = ({ isDark }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <defs>
      <linearGradient id="alertGradDash" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={isDark ? '#FF5B2E' : '#FF8430'} />
        <stop offset="100%" stopColor={isDark ? '#C4107A' : '#F7306D'} />
      </linearGradient>
    </defs>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="url(#alertGradDash)" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="url(#alertGradDash)" />
  </svg>
);

const Dashboard = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const s = getStyles(isDark);

  const tasksData = [
    {
      id: 1,
      text: 'Resolver ejercicios de cálculo integral',
      tag: 'Matemáticas',
      tagColor: isDark ? '#C4107A' : '#FF8430',
      time: '10:00 AM',
    },
    {
      id: 2,
      text: 'Leer capítulo 4 de Historia',
      tag: 'Historia',
      tagColor: isDark ? '#2563EB' : '#3B82F6',
      time: '',
    },
  ];

  const [tasksDone, setTasksDone] = useState({ 1: false, 2: true });

  return (
    <AppLayout>
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
          <button style={s.linkBtn} onClick={() => navigate('/alertas')}>
            Ver detalle »
          </button>
        </div>
      </div>

      <div style={s.row}>
        <div style={{ ...s.card, flex: 1, marginBottom: 0 }}>
          <div style={s.cardTitle}>Resumen Diario</div>
          <div style={s.cardSubtitle}>Tu ritmo de estudio esta semana</div>
          <div style={s.progressBlock}>
            <div style={s.progressLabelRow}>
              <span style={s.progressLabel}>Matemáticas</span>
              <span style={s.progressLabel}>80%</span>
            </div>
            <ProgressBar value={80} isDark={isDark} />
          </div>
          <div style={s.progressBlock}>
            <div style={s.progressLabelRow}>
              <span style={s.progressLabel}>Historia Moderna</span>
              <span style={s.progressLabel}>46%</span>
            </div>
            <ProgressBar
              value={46}
              isDark={isDark}
              color={isDark ? '#C4107A' : '#F7306D'}
            />
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
            <button style={s.linkBtn} onClick={() => navigate('/tareas')}>
              + Nueva tarea
            </button>
          </div>
          {tasksData.map((task) => (
            <div key={task.id} style={s.taskItem}>
              <div
                style={{
                  ...s.checkbox,
                  background: tasksDone[task.id]
                    ? isDark
                      ? 'linear-gradient(135deg,#C4107A,#FF5B2E)'
                      : 'linear-gradient(135deg,#FF8430,#F7306D)'
                    : 'transparent',
                  borderColor: tasksDone[task.id]
                    ? 'transparent'
                    : isDark
                      ? 'rgba(255,255,255,0.25)'
                      : 'rgba(0,0,0,0.25)',
                }}
                onClick={() => setTasksDone((p) => ({ ...p, [task.id]: !p[task.id] }))}
              >
                {tasksDone[task.id] && <span style={{ color: '#fff', fontSize: 11 }}>✓</span>}
              </div>
              <div style={s.taskContent}>
                <div
                  style={{
                    ...s.taskText,
                    textDecoration: tasksDone[task.id] ? 'line-through' : 'none',
                    opacity: tasksDone[task.id] ? 0.5 : 1,
                  }}
                >
                  {task.text}
                </div>
                <div style={s.taskMeta}>
                  <span
                    style={{
                      ...s.tag,
                      background: task.tagColor + '30',
                      color: task.tagColor,
                    }}
                  >
                    {task.tag}
                  </span>
                  {task.time && <span style={s.taskTime}>🕑 {task.time}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ ...s.card, ...s.aiCard, marginBottom: 0 }}>
          <div style={s.aiLabel}>AI ASSISTANT</div>
          <div style={s.aiBody}>
            <div style={s.mascotWrap}>
              <img
                src={MascotaGif}
                alt="AI.BERT"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <p style={s.aiText}>
              "Te sugiero priorizar Matemáticas hoy. Tienes un examen en 3 días y esta sesión
              te dará la ventaja necesaria."
            </p>
          </div>
          <button style={s.aiBtn} onClick={() => navigate('/priorizacion')}>
            Ver plan detallado →
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

const getStyles = (isDark) => {
  const t = createStyles(isDark);
  return {
    greeting: {
      fontFamily: t.fontPrimary,
      fontSize: 36,
      fontWeight: 800,
      margin: '0 0 24px 0',
      padding: 0,
      color: isDark ? '#FF5B2E' : '#FF8430',
    },
    card: {
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 16,
      padding: '18px 22px',
      marginBottom: 16,
      boxShadow: t.cardShadow,
    },
    cardTitle: {
      fontSize: 14,
      fontWeight: 700,
      color: t.textPrimary,
      fontFamily: t.fontSecondary,
      marginBottom: 2,
    },
    cardSubtitle: {
      fontSize: 11,
      color: t.textSecondary,
      marginBottom: 16,
    },
    alertHeader: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 },
    alertItem: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      background: isDark ? 'rgba(196,16,122,0.08)' : 'rgba(255,132,48,0.07)',
      borderRadius: 8,
      padding: '10px 14px',
    },
    alertBar: {
      width: 3,
      height: 22,
      borderRadius: 2,
      background: t.primaryGradient,
      flexShrink: 0,
    },
    alertText: { fontSize: 13, color: t.textPrimary },
    alertFooter: { textAlign: 'right', marginTop: 12 },
    linkBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontFamily: t.fontSecondary,
      fontSize: 12,
      fontWeight: 600,
      color: isDark ? '#FF5B2E' : '#F7306D',
      padding: 0,
    },
    row: { display: 'flex', gap: 16, alignItems: 'stretch' },
    progressBlock: { marginBottom: 14 },
    progressLabelRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 5 },
    progressLabel: { fontSize: 12, color: t.textSecondary },
    focusBlock: { marginTop: 16, display: 'flex', flexDirection: 'column', gap: 2 },
    focusTime: {
      fontFamily: t.fontPrimary,
      fontWeight: 800,
      fontSize: 28,
      color: isDark ? '#FF5B2E' : '#FF8430',
      display: 'block',
    },
    focusLabel: {
      fontSize: 10,
      letterSpacing: '0.10em',
      color: t.textMuted,
      textTransform: 'uppercase',
      display: 'block',
    },
    circleCard: {
      width: 210,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 14,
    },
    circleText: {
      fontSize: 12,
      textAlign: 'center',
      color: t.textSecondary,
      lineHeight: 1.5,
      margin: 0,
    },
    taskHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    taskItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      paddingBottom: 14,
      borderBottom: `1px solid ${t.cardBorder}`,
      marginBottom: 14,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 5,
      border: '2px solid',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      marginTop: 1,
      transition: 'all 0.2s',
    },
    taskContent: { flex: 1 },
    taskText: {
      fontSize: 13,
      color: t.textPrimary,
      marginBottom: 6,
      lineHeight: 1.4,
    },
    taskMeta: { display: 'flex', alignItems: 'center', gap: 8 },
    tag: { fontSize: 10, fontWeight: 600, padding: '2px 10px', borderRadius: 10 },
    taskTime: { fontSize: 10, color: t.textMuted },
    aiCard: { width: 210, flexShrink: 0 },
    aiLabel: {
      fontSize: 9,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: isDark ? '#FF5B2E' : '#FF8430',
      fontWeight: 700,
      marginBottom: 12,
    },
    aiBody: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 },
    mascotWrap: { width: 80, height: 80 },
    aiText: {
      fontSize: 12,
      color: t.textSecondary,
      lineHeight: 1.5,
      fontStyle: 'italic',
      textAlign: 'center',
      margin: 0,
    },
    aiBtn: {
      marginTop: 14,
      background: 'none',
      border: `1px solid ${isDark ? 'rgba(196,16,122,0.40)' : 'rgba(247,48,109,0.30)'}`,
      borderRadius: 8,
      padding: '7px 12px',
      width: '100%',
      fontFamily: t.fontSecondary,
      fontSize: 11,
      fontWeight: 600,
      color: isDark ? '#FF5B2E' : '#F7306D',
      cursor: 'pointer',
      boxSizing: 'border-box',
    },
  };
};

export default Dashboard;
