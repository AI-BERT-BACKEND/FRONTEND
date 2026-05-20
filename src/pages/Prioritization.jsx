import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/Layout/AppLayout';
import { useTheme } from '../context/ThemeContext';
import { createStyles } from '../theme/createStyles';

const AlertIcon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const CheckIcon = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const ClockIcon = ({ color }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
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

const LightningIcon = ({ color }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const BookIcon = ({ color }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);

const BalanceIcon = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="22"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const TAREAS_CRITICAS = [
  { id: 1, materia: 'CÁLCULO DIFERENCIAL', nombre: 'Taller de Derivadas', tipo: 'CRITICO', entrega: 'En 2 horas', estimado: '3h necesarias', urgencia: 'high', accion: 'EMPEZAR AHORA' },
  { id: 2, materia: 'ESTRUCTURA DE DATOS', nombre: 'Proyecto Final Grafos', tipo: 'CRITICO', entrega: 'Mañana 8:00 AM', estimado: '8h necesarias', urgencia: 'medium', accion: 'REVISAR AVANCE' },
  { id: 3, materia: 'FÍSICA MECÁNICA', nombre: 'Laboratorio Péndulo', tipo: 'CRITICO', entrega: 'En 5 horas', estimado: '2h necesarias', urgencia: 'high', accion: 'REVISAR GUÍA' },
];

const TAREAS_PRIORIZADAS = [
  { id: 1, nombre: 'Proyecto Final Estructuras', materia: 'Arquitectura de Datos', prioridad: 'ALTO', tiempoEstudio: '4h necesarios hoy', nota: 'Entrega en 2 días', diasDisponibles: 2, horasEstimadas: 4 },
  { id: 2, nombre: 'Quiz de Algoritmos', materia: 'Programación', prioridad: 'ALTO', tiempoEstudio: '1.5h de estudio', nota: 'Mañana a las 10h', diasDisponibles: 1, horasEstimadas: 1.5 },
  { id: 3, nombre: 'Taller de Derivadas', materia: 'Cálculo Diferencial', prioridad: 'ALTO', tiempoEstudio: '2h de práctica', nota: 'Hoy', diasDisponibles: 0.5, horasEstimadas: 2 },
  { id: 4, nombre: 'Informe Laboratorio', materia: 'Física Mecánica', prioridad: 'BAJO', tiempoEstudio: '1h redacción', nota: 'Esta semana', diasDisponibles: 6, horasEstimadas: 1 },
  { id: 5, nombre: 'Lectura de Ética', materia: 'Contexto Contemporáneo', prioridad: 'BAJO', tiempoEstudio: '45m lectura', nota: 'Flexible', diasDisponibles: 7, horasEstimadas: 0.75 },
  { id: 6, nombre: 'Glosario Inglés', materia: 'Inglés', prioridad: 'BAJO', tiempoEstudio: '20m repaso', nota: 'Antes del martes', diasDisponibles: 5, horasEstimadas: 0.33 },
];

const BALANCE_TIEMPO = [
  { label: 'Estudio', pct: 75, color: '#FF5B2E' },
  { label: 'Descanso', pct: 15, color: '#3B82F6' },
  { label: 'Personal', pct: 10, color: '#22C55E' },
];

const calcularRiesgo = (diasDisponibles, horasEstimadas) => {
  const horasDisponibles = diasDisponibles * 3;
  const ratio = horasDisponibles / horasEstimadas;
  if (ratio < 0.70) return 'ALTO';
  if (ratio < 0.85) return 'MEDIO';
  return null;
};

const RIESGO_ACADEMICO = [
  { id: 1, nombre: 'Proyecto Estructuras', detalle: 'Solo 6h disponibles para 8h estimadas de trabajo', deadline: 'Hoy (20%)', diasDisponibles: 2, horasEstimadas: 8 },
  { id: 2, nombre: 'Laboratorio Físico', detalle: 'Tiempo disponible: 1h · Estimado: 1.5h', deadline: 'Hoy (4 hrs)', diasDisponibles: 0.5, horasEstimadas: 1.5 },
];

const Prioritization = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [tareasCompletadas, setTareasCompletadas] = useState({});
  const [notificacionVista, setNotificacionVista] = useState({});
  const s = getStyles(isDark);

  const handleCompletar = (id) => {
    setTareasCompletadas(p => ({ ...p, [id]: !p[id] }));
    if (!tareasCompletadas[id]) {
      setNotificacionVista(p => ({ ...p, [id]: true }));
      setTimeout(() => setNotificacionVista(p => ({ ...p, [id]: false })), 4000);
    }
  };

  return (
    <AppLayout>
      {Object.entries(notificacionVista).map(([id, visible]) => visible && (
        <div key={id} style={s.toast}>
          <div style={s.toastIcon}><CheckIcon color="#fff" /></div>
          <div>
            <div style={s.toastTitle}>¡Revisión completada!</div>
            <div style={s.toastDesc}>La tarea fue marcada como revisada y el sistema recalculó tus prioridades.</div>
          </div>
        </div>
      ))}

      <div style={s.secHeader}>
        <div style={s.secTitleRow}>
          <AlertIcon color="#F00707" />
          <span style={s.secTitle}>TAREAS CRÍTICAS</span>
        </div>
      </div>

      <div style={s.criticasGrid}>
        {TAREAS_CRITICAS.map(tc => (
          <div key={tc.id} style={{
            ...s.criticaCard,
            borderTop: `3px solid ${tc.urgencia === 'high' ? '#F00707' : isDark ? '#FF5B2E' : '#FF8430'}`,
          }}>
            <div style={s.criticaTop}>
              <span style={s.criticaMateria}>{tc.materia}</span>
              <span style={{ ...s.criticaBadge, background: 'rgba(240,7,7,0.18)', color: '#F00707' }}>{tc.tipo}</span>
            </div>
            <div style={s.criticaNombre}>{tc.nombre}</div>
            <div style={s.criticaInfoRow}>
              <div style={s.criticaInfo}>
                <span style={s.criticaInfoLabel}>Entrega</span>
                <span style={{ ...s.criticaInfoVal, color: tc.urgencia === 'high' ? '#F00707' : isDark ? '#FF5B2E' : '#FF8430' }}>
                  {tc.entrega}
                </span>
              </div>
              <div style={s.criticaInfo}>
                <span style={s.criticaInfoLabel}>Estimado</span>
                <span style={s.criticaInfoVal}>{tc.estimado}</span>
              </div>
            </div>
            <button
              style={{
                ...s.criticaBtn,
                background: tc.urgencia === 'high'
                  ? 'linear-gradient(90deg, #F00707, #FF5B2E)'
                  : isDark ? 'linear-gradient(90deg,#C4107A,#FF5B2E)' : 'linear-gradient(90deg,#FF8430,#F7306D)',
              }}
              onClick={() => handleCompletar(tc.id)}
            >
              {tareasCompletadas[tc.id] ? '✓ REVISADA' : tc.accion}
            </button>
          </div>
        ))}
      </div>

      <div style={s.mainRow}>
        <div style={s.priorizacionCol}>
          <div style={s.cardHeader}>
            <span style={s.cardTitle}>Priorización de Tareas</span>
            <span style={s.cardSubtitle}>Ordenado por IA basado en fechas de entrega y complejidad.</span>
            <button style={s.iaBtn} onClick={() => navigate('/horario-inteligente')}>
              <BrainIcon color="#fff" />
              <span>Reordenar Inteligente</span>
            </button>
          </div>
          <div style={s.tareasLista}>
            {TAREAS_PRIORIZADAS.map((tarea, idx) => {
              const completada = tareasCompletadas[`p_${tarea.id}`];
              const prioColor = tarea.prioridad === 'ALTO'
                ? { bg: 'rgba(240,7,7,0.18)', color: '#F00707' }
                : { bg: isDark ? 'rgba(34,197,94,0.15)' : 'rgba(34,197,94,0.12)', color: '#22C55E' };
              return (
                <div key={tarea.id} style={{
                  ...s.tareaItem,
                  opacity: completada ? 0.55 : 1,
                  borderLeft: `3px solid ${tarea.prioridad === 'ALTO' ? '#F00707' : isDark ? 'rgba(34,197,94,0.50)' : 'rgba(34,197,94,0.60)'}`,
                }}>
                  <div style={s.tareaLeft}>
                    <span style={s.tareaNum}>{idx + 1}</span>
                    <div style={s.tareaIconWrap}>
                      {tarea.prioridad === 'ALTO'
                        ? <LightningIcon color={isDark ? '#FF5B2E' : '#FF8430'} />
                        : <BookIcon color={isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.40)'} />
                      }
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={s.tareaNombre}>{tarea.nombre}</span>
                        <span style={{ ...s.prioridadBadge, background: prioColor.bg, color: prioColor.color }}>
                          {tarea.prioridad}
                        </span>
                      </div>
                      <span style={s.tareaMateria}>{tarea.materia}</span>
                    </div>
                  </div>
                  <div style={s.tareaRight}>
                    <div style={s.tareaTime}>
                      <ClockIcon color={isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.35)'} />
                      <span style={s.tareaTimeText}>{tarea.tiempoEstudio}</span>
                    </div>
                    <span style={s.tareaNota}>{tarea.nota}</span>
                    <button
                      style={{ ...s.completarBtn, ...(completada ? s.completarBtnDone : {}) }}
                      onClick={() => handleCompletar(`p_${tarea.id}`)}
                    >
                      {completada && <CheckIcon color="#22C55E" />}
                      {completada ? 'Listo' : 'Marcar'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={s.rightCol}>
          <div style={s.sideCard}>
            <div style={s.sideCardHeader}>
              <BalanceIcon color={isDark ? '#FF5B2E' : '#FF8430'} />
              <span style={s.sideCardTitle}>Balance de Tiempo</span>
            </div>
            {BALANCE_TIEMPO.map(b => (
              <div key={b.label} style={s.balanceItem}>
                <div style={s.balanceLabelRow}>
                  <span style={s.balanceLabel}>{b.label}</span>
                  <span style={{ ...s.balancePct, color: b.color }}>{b.pct}%</span>
                </div>
                <div style={s.balanceTrack}>
                  <div style={{ ...s.balanceFill, width: `${b.pct}%`, background: b.color + (isDark ? 'CC' : 'AA') }} />
                </div>
              </div>
            ))}
            <button style={s.rebalancearBtn}>Rebalancear Horario</button>
          </div>

          <div style={s.sideCard}>
            <div style={s.sideCardHeader}>
              <AlertIcon color="#F00707" />
              <span style={s.sideCardTitle}>Riesgo Académico</span>
            </div>
            {RIESGO_ACADEMICO.map(r => {
              const riesgo = calcularRiesgo(r.diasDisponibles, r.horasEstimadas);
              const rColor = riesgo === 'ALTO' ? '#F00707' : '#EAB308';
              const rBg = riesgo === 'ALTO' ? 'rgba(240,7,7,0.15)' : 'rgba(234,179,8,0.15)';
              return (
                <div key={r.id} style={s.riesgoItem}>
                  <div style={s.riesgoTop}>
                    <span style={s.riesgoNombre}>{r.nombre}</span>
                    <span style={{ ...s.riesgoBadge, background: rBg, color: rColor }}>RIESGO {riesgo}</span>
                  </div>
                  <div style={s.riesgoDetalle}>{r.detalle}</div>
                  <div style={s.riesgoDeadline}>
                    <ClockIcon color={rColor} />
                    <span style={{ ...s.riesgoDeadlineText, color: rColor }}>{r.deadline}</span>
                  </div>
                </div>
              );
            })}
            <div style={s.riesgoInfo}>
              <span style={s.riesgoInfoText}>
                El motor de IA te sugiere priorizar el bloque de hoy para mitigar el riesgo en tus entregas.
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={s.bottomRow}>
        <div style={{ ...s.bottomCard, borderColor: isDark ? 'rgba(196,16,122,0.30)' : 'rgba(255,132,48,0.30)' }}>
          <div style={s.bottomCardLabel}>FLASHCARDS PENDIENTES</div>
          <div style={s.bottomCardBig}>12 Tarjetas</div>
          <button style={s.flashBtn}>Repasar ahora (5 min)</button>
        </div>
        <div style={{ ...s.bottomCard, borderColor: isDark ? 'rgba(59,130,246,0.30)' : 'rgba(59,130,246,0.25)' }}>
          <div style={s.bottomCardLabel}>PRÓXIMO BREAK EN</div>
          <div style={{ ...s.bottomCardBig, color: '#3B82F6' }}>En 45 min</div>
          <div style={s.bottomCardSub}>Sugerencia: Refrescamiento guiado de 5 min.</div>
        </div>
        <div style={{ ...s.bottomCard, borderColor: isDark ? 'rgba(234,179,8,0.30)' : 'rgba(234,179,8,0.25)' }}>
          <div style={s.bottomCardLabel}>ESTADO DE CONCENTRACIÓN</div>
          <div style={{ ...s.bottomCardBig, color: '#EAB308' }}>Foco Óptimo</div>
          <div style={s.bottomCardSub}>Alta concentración detectada.</div>
        </div>
      </div>
    </AppLayout>
  );
};

const getStyles = (isDark) => {
  const t = createStyles(isDark);
  return {
    toast: {
      position: 'fixed', top: 20, right: 24, zIndex: 300,
      background: isDark ? '#1E1E1E' : '#FFFFFF',
      border: '1px solid rgba(34,197,94,0.35)',
      borderRadius: 14, padding: '14px 18px',
      display: 'flex', alignItems: 'flex-start', gap: 12,
      maxWidth: 360,
      boxShadow: '0 8px 32px rgba(34,197,94,0.15), 0 2px 8px rgba(0,0,0,0.15)',
    },
    toastIcon: {
      width: 30, height: 30, borderRadius: 8, flexShrink: 0,
      background: 'linear-gradient(135deg, #22C55E, #16A34A)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    toastTitle: { fontFamily: t.fontPrimary, fontSize: 13, fontWeight: 700, color: t.textPrimary, marginBottom: 3 },
    toastDesc: { fontSize: 11, color: t.textSecondary, lineHeight: 1.45 },
    secHeader: { marginBottom: 12 },
    secTitleRow: { display: 'flex', alignItems: 'center', gap: 8 },
    secTitle: { fontFamily: t.fontPrimary, fontSize: 14, fontWeight: 800, color: '#F00707', letterSpacing: '0.06em' },
    criticasGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 },
    criticaCard: {
      background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: 14,
      padding: '16px 18px', boxShadow: t.cardShadow,
      display: 'flex', flexDirection: 'column', gap: 10,
    },
    criticaTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    criticaMateria: { fontSize: 9, letterSpacing: '0.08em', fontWeight: 700, color: t.textMuted, fontFamily: t.fontSecondary },
    criticaBadge: { fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 20, letterSpacing: '0.05em' },
    criticaNombre: { fontFamily: t.fontPrimary, fontSize: 15, fontWeight: 700, color: t.textPrimary, lineHeight: 1.3 },
    criticaInfoRow: { display: 'flex', gap: 16 },
    criticaInfo: { display: 'flex', flexDirection: 'column', gap: 2 },
    criticaInfoLabel: { fontSize: 9, color: t.textMuted, fontFamily: t.fontSecondary },
    criticaInfoVal: { fontSize: 12, fontWeight: 600, fontFamily: t.fontSecondary, color: t.textPrimary },
    criticaBtn: {
      border: 'none', borderRadius: 8, padding: '9px',
      color: '#fff', fontFamily: t.fontPrimary, fontSize: 11,
      fontWeight: 700, cursor: 'pointer', letterSpacing: '0.04em', marginTop: 'auto',
    },
    mainRow: { display: 'flex', gap: 16, marginBottom: 16, alignItems: 'stretch' },
    priorizacionCol: {
      flex: 1, minWidth: 0,
      background: t.cardBg, border: `1px solid ${t.cardBorder}`,
      borderRadius: 16, padding: '18px 20px', boxShadow: t.cardShadow,
      display: 'flex', flexDirection: 'column',
    },
    cardHeader: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' },
    cardTitle: { fontFamily: t.fontPrimary, fontSize: 15, fontWeight: 700, color: t.textPrimary },
    cardSubtitle: { fontSize: 11, color: t.textMuted, flex: 1 },
    iaBtn: {
      display: 'flex', alignItems: 'center', gap: 6,
      background: isDark ? 'linear-gradient(90deg,#C4107A,#FF5B2E)' : 'linear-gradient(90deg,#FF8430,#F7306D)',
      border: 'none', borderRadius: 8, padding: '7px 14px',
      color: '#fff', fontFamily: t.fontSecondary, fontSize: 11, fontWeight: 600, cursor: 'pointer',
    },
    tareasLista: { display: 'flex', flexDirection: 'column', gap: 10, flex: 1 },
    tareaItem: {
      background: t.inputBg, border: `1px solid ${t.cardBorder}`,
      borderRadius: 10, padding: '12px 14px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      gap: 12, transition: 'opacity 0.3s',
    },
    tareaLeft: { display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 },
    tareaNum: { fontFamily: t.fontPrimary, fontSize: 18, fontWeight: 800, color: t.textMuted, minWidth: 20, flexShrink: 0 },
    tareaIconWrap: {
      width: 28, height: 28, borderRadius: 7,
      background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    },
    tareaNombre: { fontFamily: t.fontSecondary, fontSize: 13, fontWeight: 600, color: t.textPrimary },
    tareaMateria: { fontSize: 10, color: t.textMuted, fontFamily: t.fontSecondary, display: 'block', marginTop: 2 },
    prioridadBadge: { fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 20, letterSpacing: '0.04em', flexShrink: 0 },
    tareaRight: { display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 },
    tareaTime: { display: 'flex', alignItems: 'center', gap: 5 },
    tareaTimeText: { fontSize: 11, color: t.textSecondary, fontFamily: t.fontSecondary, whiteSpace: 'nowrap' },
    tareaNota: { fontSize: 10, color: t.textMuted, whiteSpace: 'nowrap' },
    completarBtn: {
      display: 'flex', alignItems: 'center', gap: 5,
      background: 'transparent', border: `1px solid ${t.cardBorder}`,
      borderRadius: 7, padding: '5px 12px', cursor: 'pointer',
      fontFamily: t.fontSecondary, fontSize: 11, fontWeight: 600, color: t.textSecondary,
    },
    completarBtnDone: { borderColor: '#22C55E', color: '#22C55E' },
    rightCol: { width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14 },
    sideCard: {
      background: t.cardBg, border: `1px solid ${t.cardBorder}`,
      borderRadius: 14, padding: '16px 18px', boxShadow: t.cardShadow,
    },
    sideCardHeader: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 },
    sideCardTitle: { fontFamily: t.fontPrimary, fontSize: 13, fontWeight: 700, color: t.textPrimary },
    balanceItem: { marginBottom: 12 },
    balanceLabelRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 5 },
    balanceLabel: { fontSize: 11, color: t.textSecondary, fontFamily: t.fontSecondary },
    balancePct: { fontSize: 11, fontWeight: 700, fontFamily: t.fontSecondary },
    balanceTrack: {
      height: 5, borderRadius: 3,
      background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', overflow: 'hidden',
    },
    balanceFill: { height: '100%', borderRadius: 3 },
    rebalancearBtn: {
      width: '100%', marginTop: 8, padding: '8px',
      background: 'transparent', border: `1px solid ${t.cardBorder}`,
      borderRadius: 8, cursor: 'pointer',
      fontFamily: t.fontSecondary, fontSize: 11, fontWeight: 600, color: t.textSecondary,
    },
    riesgoItem: {
      background: t.inputBg, border: `1px solid ${t.cardBorder}`,
      borderRadius: 10, padding: '10px 12px', marginBottom: 10,
    },
    riesgoTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5, gap: 6 },
    riesgoNombre: { fontFamily: t.fontSecondary, fontSize: 12, fontWeight: 600, color: t.textPrimary },
    riesgoBadge: { fontSize: 8, fontWeight: 700, padding: '2px 7px', borderRadius: 20, letterSpacing: '0.04em', whiteSpace: 'nowrap', flexShrink: 0 },
    riesgoDetalle: { fontSize: 10, color: t.textSecondary, lineHeight: 1.4, marginBottom: 6 },
    riesgoDeadline: { display: 'flex', alignItems: 'center', gap: 5 },
    riesgoDeadlineText: { fontSize: 10, fontWeight: 600 },
    riesgoInfo: {
      background: isDark ? 'rgba(255,91,46,0.08)' : 'rgba(255,132,48,0.07)',
      borderRadius: 8, padding: '8px 10px', marginTop: 4,
    },
    riesgoInfoText: { fontSize: 10, color: t.textSecondary, lineHeight: 1.45 },
    bottomRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 },
    bottomCard: {
      background: t.cardBg, border: '1px solid', borderRadius: 14,
      padding: '16px 18px', boxShadow: t.cardShadow,
      display: 'flex', flexDirection: 'column', gap: 8,
    },
    bottomCardLabel: { fontSize: 9, letterSpacing: '0.08em', fontWeight: 700, color: t.textMuted, fontFamily: t.fontSecondary },
    bottomCardBig: { fontFamily: t.fontPrimary, fontSize: 20, fontWeight: 800, color: isDark ? '#FF5B2E' : '#FF8430' },
    bottomCardSub: { fontSize: 11, color: t.textSecondary },
    flashBtn: {
      background: isDark ? 'linear-gradient(90deg,#C4107A,#FF5B2E)' : 'linear-gradient(90deg,#FF8430,#F7306D)',
      border: 'none', borderRadius: 8, padding: '8px 14px',
      color: '#fff', fontFamily: t.fontSecondary, fontSize: 11, fontWeight: 600, cursor: 'pointer',
      width: 'fit-content',
    },
  };
};

export default Prioritization;