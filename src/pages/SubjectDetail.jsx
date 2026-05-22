import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppLayout from '../components/Layout/AppLayout';
import ProgressBar from '../components/ProgressBar';
import { useTheme } from '../context/ThemeContext';
import { createStyles } from '../theme/createStyles';

const IconUser = ({ color }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const IconExport = ({ color }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);
const IconEdit = ({ color }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const IconPin = ({ color }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
  </svg>
);

const MATERIA_DATA = {
  nombre: 'Estructuras Avanzadas II',
  profesor: 'Prof. Roberto Méndez',
  promedio: 3.8,
  promedioMax: 5.0,
  progresoSemestre: 76,
  notaParaAprobar: 3.2,
  estadoDesempeno: 'Aprobado Parcial',
  mejorNota: 4.5,
  menorNota: 3.2,
  inasistencias: '2/4',
  recomendacion:
    'Para asegurar una nota final de 4.0, debes obtener al menos 4.3 en el Proyecto Final. Hemos analizado tus talleres previos y te sugerimos enfocarte en los cálculos de carga sísmica.',
  cortes: [
    {
      id: 1,
      nombre: 'Corte 1',
      porcentaje: 30,
      estado: 'completado',
      fecha: 'Completado el 15 de Sep',
      puntaje: 4.2,
      actividades: [
        { nombre: 'Examen Parcial', peso: 60, nota: 4.5 },
        { nombre: 'Taller de Maquetas', peso: 40, nota: 3.8 },
      ],
    },
    {
      id: 2,
      nombre: 'Corte 2',
      porcentaje: 30,
      estado: 'completado',
      fecha: 'Completado el 28 de Oct',
      puntaje: 3.4,
      actividades: [
        { nombre: 'Análisis Estructural', peso: 50, nota: 3.5 },
        { nombre: 'Informe de Campo', peso: 50, nota: 3.3 },
      ],
    },
    {
      id: 3,
      nombre: 'Corte 3',
      porcentaje: 40,
      estado: 'en_progreso',
      fecha: 'En progreso · Cierra el 12 de Dic',
      puntaje: null,
      actividades: [
        { nombre: 'Proyecto Final de Estructura', peso: 70, nota: null },
        { nombre: 'Sustentación Oral', peso: 30, nota: null },
      ],
    },
  ],
};

const SimuladorModal = ({ corte, promedio, isDark, onClose }) => {
  const t = createStyles(isDark);
  const [notaObjetivo, setNotaObjetivo] = useState('4.0');

  const notaNum = parseFloat(notaObjetivo) || 0;
  const pesoRestante = corte.porcentaje / 100;
  const pesoActual = 1 - pesoRestante;
  const necesita = pesoActual > 0
    ? ((notaNum - promedio * pesoActual) / pesoRestante).toFixed(1)
    : '—';
  const necesitaNum = parseFloat(necesita);
  const alcanzable = necesitaNum <= 5.0 && necesitaNum >= 0;

  const s = getModalStyles(isDark, t);

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.card} onClick={(e) => e.stopPropagation()}>
        <div style={s.header}>
          <div style={s.headerIcon}>
            <IconPin color={isDark ? '#FF5B2E' : '#FF8430'} />
          </div>
          <div>
            <div style={s.title}>Simulador Académico</div>
            <div style={s.titleBrand}>AI.BERT</div>
            <div style={s.subtitle}>Proyección inteligente de resultados</div>
          </div>
        </div>

        <div style={s.statsRow}>
          <div style={s.statBox}>
            <div style={s.statLabel}>PROMEDIO ACTUAL</div>
            <div style={s.statVal}>{promedio}</div>
          </div>
          <div style={{ ...s.statBox, background: isDark ? 'rgba(196,16,122,0.15)' : 'rgba(255,132,48,0.10)', border: `1px solid ${isDark ? 'rgba(196,16,122,0.30)' : 'rgba(255,132,48,0.30)'}` }}>
            <div style={s.statLabel}>CORTE PENDIENTE</div>
            <div style={{ ...s.statVal, color: isDark ? '#FF5B2E' : '#FF8430' }}>
              {corte.nombre} ({corte.porcentaje}%)
            </div>
          </div>
        </div>

        <div style={s.fieldWrap}>
          <label style={s.fieldLabel}>Define tu Nota Objetivo</label>
          <div style={s.inputWrap}>
            <input
              type="number" min="0" max="5" step="0.1"
              value={notaObjetivo}
              onChange={(e) => setNotaObjetivo(e.target.value)}
              style={s.input}
            />
          </div>
        </div>

        <div style={{
          ...s.resultBox,
          background: alcanzable
            ? isDark ? 'rgba(196,16,122,0.12)' : 'rgba(255,132,48,0.08)'
            : isDark ? 'rgba(240,7,7,0.10)' : 'rgba(240,7,7,0.06)',
          border: `1px solid ${alcanzable
            ? isDark ? 'rgba(196,16,122,0.25)' : 'rgba(255,132,48,0.25)'
            : 'rgba(240,7,7,0.25)'}`,
        }}>
          <div style={s.resultLabel}>Para alcanzar el objetivo, necesitas sacar:</div>
          <div style={{ ...s.resultNum, color: alcanzable ? isDark ? '#FF5B2E' : '#FF8430' : '#F00707' }}>
            {necesita}
          </div>
          <div style={{
            ...s.badge,
            background: alcanzable ? isDark ? 'rgba(34,197,94,0.20)' : 'rgba(34,197,94,0.15)' : 'rgba(240,7,7,0.15)',
            color: alcanzable ? '#22C55E' : '#F00707',
          }}>
            {alcanzable ? '● ALCANZABLE' : '● DIFÍCIL'}
          </div>
        </div>

        <div style={s.footer}>
          <button style={s.cancelBtn} onClick={onClose}>Cerrar</button>
          <button style={s.simBtn}>Simular escenario</button>
        </div>
      </div>
    </div>
  );
};

const SubjectDetail = () => {
  const { isDark } = useTheme();           // ✅ ESTE ERA EL QUE FALTABA
  const { id } = useParams();
  const navigate = useNavigate();
  const [simuladorCorte, setSimuladorCorte] = useState(null);
  const s = getStyles(isDark);
  const m = MATERIA_DATA;

  const estadoColor = {
    'Aprobado Parcial': { bg: isDark ? 'rgba(34,197,94,0.15)' : 'rgba(34,197,94,0.12)', color: '#22C55E' },
    'En Riesgo':        { bg: isDark ? 'rgba(240,7,7,0.15)'   : 'rgba(240,7,7,0.10)',   color: '#F00707' },
    'Excelente':        { bg: isDark ? 'rgba(34,197,94,0.15)' : 'rgba(34,197,94,0.12)', color: '#22C55E' },
  }[m.estadoDesempeno] || { bg: 'rgba(234,179,8,0.15)', color: '#EAB308' };

  return (
    <AppLayout>
      <div style={s.pageHeader}>
        <div style={{ flex: 1 }}>
          <h1 style={s.pageTitle}>{m.nombre}</h1>
          <div style={s.profRow}>
            <IconUser color={isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.45)'} />
            <span style={s.profText}>{m.profesor}</span>
          </div>
        </div>
        <div style={s.headerBtns}>
          <button style={s.exportBtn}>
            <IconExport color={isDark ? 'rgba(255,255,255,0.70)' : 'rgba(0,0,0,0.55)'} />
            <span>Exportar</span>
          </button>
          <button style={s.detalleBtn} onClick={() => navigate(`/materias/${id}/notas`)}>Detalle notas</button>
        </div>
      </div>

      <div style={s.topRow}>
        <div style={s.promedioCard}>
          <div style={s.promedioLabel}>PROMEDIO ACTUAL</div>
          <div style={s.promedioNum}>
            <span style={s.promedioBig}>{m.promedio}</span>
            <span style={s.promedioMax}> /{m.promedioMax}</span>
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={s.progLabelRow}>
              <span style={s.progLabel}>Progreso del Semestre</span>
              <span style={{ ...s.progLabel, color: isDark ? '#FF5B2E' : '#FF8430' }}>{m.progresoSemestre}%</span>
            </div>
            <ProgressBar value={m.progresoSemestre} isDark={isDark} />
          </div>
          <div style={s.notaHint}>
            <span style={s.notaHintDot}>↗</span>
            <span style={s.notaHintText}>
              Necesitas {m.notaParaAprobar} para aprobar con el 40% restante.
            </span>
          </div>
        </div>

        <div style={s.desempenoCard}>
          <div style={s.desempenoTop}>
            <div>
              <div style={s.desempenoTitle}>Estado de Desempeño</div>
              <div style={s.desempenoSubtitle}>Tu trayectoria actual muestra un crecimiento constante.</div>
            </div>
            <div style={{ ...s.estadoBadge, background: estadoColor.bg, color: estadoColor.color }}>
              {m.estadoDesempeno}
            </div>
          </div>
          <div style={s.statsRow}>
            <div style={s.statItem}>
              <div style={s.statLabel}>Mejor Nota</div>
              <div style={s.statVal}>{m.mejorNota}</div>
            </div>
            <div style={s.statDivider} />
            <div style={s.statItem}>
              <div style={s.statLabel}>Menor Nota</div>
              <div style={s.statVal}>{m.menorNota}</div>
            </div>
            <div style={s.statDivider} />
            <div style={s.statItem}>
              <div style={s.statLabel}>Inasistencias</div>
              <div style={{ ...s.statVal, color: '#F00707' }}>{m.inasistencias}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={s.sectionTitle}>Gestión de Cortes</div>

      <div style={s.cortesWrap}>
        {m.cortes.map((corte) => {
          const completado = corte.estado === 'completado';
          const enProgreso = corte.estado === 'en_progreso';
          return (
            <div key={corte.id} style={{
              ...s.corteCard,
              borderLeft: `3px solid ${completado
                ? isDark ? '#FF5B2E' : '#FF8430'
                : enProgreso
                  ? isDark ? 'rgba(255,91,46,0.40)' : 'rgba(255,132,48,0.40)'
                  : isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)'}`,
              opacity: enProgreso ? 0.85 : 1,
            }}>
              <div style={s.corteHeader}>
                <div style={s.corteLeft}>
                  <div style={{ ...s.corteNum, color: completado ? isDark ? '#FF5B2E' : '#FF8430' : s.corteNum.color }}>
                    {corte.id}
                  </div>
                  <div>
                    <div style={s.corteNombre}>{corte.nombre} ({corte.porcentaje}%)</div>
                    <div style={s.corteFecha}>{corte.fecha}</div>
                  </div>
                </div>
                <div style={s.corteRight}>
                  {corte.puntaje !== null ? (
                    <>
                      <div style={s.puntajeWrap}>
                        <div style={s.puntajeLabel}>PUNTAJE</div>
                        <div style={{ ...s.puntajeVal, color: corte.puntaje >= 3.0 ? isDark ? '#FF5B2E' : '#FF8430' : '#F00707' }}>
                          {corte.puntaje}
                        </div>
                      </div>
                      <button style={s.editBtn} title="Editar" onClick={() => navigate(`/materias/${id}/cortes`)}>
                        <IconEdit color={isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.40)'} />
                      </button>
                      <button style={s.simularBtn} onClick={() => setSimuladorCorte(corte)}>
                        Simular
                      </button>
                    </>
                  ) : (
                    <>
                      <div style={s.puntajeWrap}>
                        <div style={s.puntajeLabel}>ESTIMADO</div>
                        <div style={{ ...s.puntajeVal, color: isDark ? 'rgba(255,255,255,0.30)' : 'rgba(0,0,0,0.25)' }}>—</div>
                      </div>
                      <button style={{ ...s.simularBtn, opacity: 0.6 }} onClick={() => setSimuladorCorte(corte)}>
                        Simular Notas
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div style={s.actividadesRow}>
                {corte.actividades.map((act, i) => (
                  <div key={i} style={s.actividadItem}>
                    <span style={s.actividadNombre}>{act.nombre} ({act.peso}%)</span>
                    {act.nota !== null ? (
                      <span style={{
                        ...s.actividadNota,
                        color: act.nota >= 3.0 ? isDark ? '#FF5B2E' : '#FF8430' : '#F00707',
                        background: act.nota >= 3.0 ? isDark ? 'rgba(255,91,46,0.12)' : 'rgba(255,132,48,0.10)' : 'rgba(240,7,7,0.10)',
                      }}>
                        {act.nota}
                      </span>
                    ) : (
                      <span style={s.actividadPendiente}>Pendiente</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div style={s.recomendacionCard}>
        <div style={s.recomendacionIcon}>
          <IconPin color={isDark ? '#FF5B2E' : '#FF8430'} />
        </div>
        <div style={s.recomendacionBody}>
          <div style={s.recomendacionTitle}>Recomendación de AI.BERT</div>
          <p style={s.recomendacionText}>{m.recomendacion}</p>
        </div>
        <button style={s.guiaBtn}>Ver Guía de Estudio</button>
      </div>

      {simuladorCorte && (
        <SimuladorModal
          corte={simuladorCorte}
          promedio={m.promedio}
          isDark={isDark}
          onClose={() => setSimuladorCorte(null)}
        />
      )}
    </AppLayout>
  );
};

const getModalStyles = (isDark, t) => ({
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.70)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 200, backdropFilter: 'blur(2px)',
  },
  card: {
    background: t.cardBg, border: `1px solid ${t.cardBorder}`,
    borderRadius: 16, width: '100%', maxWidth: 420, margin: '0 20px',
    boxShadow: t.modalShadow, padding: '24px',
    display: 'flex', flexDirection: 'column', gap: 16,
  },
  header: { display: 'flex', alignItems: 'flex-start', gap: 12 },
  headerIcon: {
    width: 36, height: 36, borderRadius: 10,
    background: isDark ? 'rgba(255,91,46,0.15)' : 'rgba(255,132,48,0.12)',
    border: `1px solid ${isDark ? 'rgba(255,91,46,0.30)' : 'rgba(255,132,48,0.30)'}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  title: {
    fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 800,
    backgroundImage: isDark ? 'linear-gradient(90deg, #FF5B2E, #C4107A)' : 'linear-gradient(90deg, #FF8430, #F7306D)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
    width: 'fit-content', lineHeight: 1.2,
  },
  titleBrand: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 700, color: t.textPrimary, lineHeight: 1.2 },
  subtitle: { fontSize: 11, color: t.textMuted, fontFamily: "'Poppins', sans-serif" },
  statsRow: { display: 'flex', gap: 10 },
  statBox: { flex: 1, background: t.inputBg, border: `1px solid ${t.inputBorder}`, borderRadius: 10, padding: '10px 14px' },
  statLabel: { fontSize: 9, letterSpacing: '0.08em', color: t.textMuted, fontWeight: 600, fontFamily: "'Poppins', sans-serif", marginBottom: 4 },
  statVal: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 800, color: isDark ? '#FF5B2E' : '#FF8430' },
  fieldWrap: {},
  fieldLabel: { display: 'block', fontSize: 12, fontWeight: 600, color: t.textPrimary, fontFamily: "'Poppins', sans-serif", marginBottom: 8 },
  inputWrap: { position: 'relative' },
  input: {
    width: '100%', background: t.inputBg, border: `1px solid ${t.inputBorder}`,
    borderRadius: 10, padding: '12px 16px',
    fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 700,
    color: t.textPrimary, outline: 'none', boxSizing: 'border-box', textAlign: 'center',
  },
  resultBox: { borderRadius: 12, padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 },
  resultLabel: { fontSize: 11, color: isDark ? 'rgba(255,255,255,0.60)' : 'rgba(0,0,0,0.50)', fontFamily: "'Poppins', sans-serif" },
  resultNum: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 40, fontWeight: 800 },
  badge: { fontSize: 10, fontWeight: 700, padding: '3px 12px', borderRadius: 20, letterSpacing: '0.05em', fontFamily: "'Poppins', sans-serif" },
  footer: { display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 4 },
  cancelBtn: {
    padding: '9px 20px', borderRadius: 8, border: `1px solid ${t.inputBorder}`,
    background: 'transparent', cursor: 'pointer', fontFamily: "'Poppins', sans-serif",
    fontSize: 13, fontWeight: 500, color: t.textSecondary,
  },
  simBtn: {
    padding: '9px 20px', borderRadius: 8, border: 'none',
    background: isDark ? 'linear-gradient(90deg, #FF5B2E, #C4107A)' : 'linear-gradient(90deg, #FF8430, #F7306D)',
    cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 700, color: '#fff',
  },
});

const getStyles = (isDark) => {
  const t = createStyles(isDark);
  return {
    pageHeader: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 16 },
    pageTitle: {
      fontFamily: t.fontPrimary, fontSize: 28, fontWeight: 800,
      backgroundImage: t.primaryGradient, WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      width: 'fit-content', margin: '0 0 6px 0',
    },
    profRow: { display: 'flex', alignItems: 'center', gap: 6 },
    profText: { fontSize: 12, color: t.textSecondary, fontFamily: t.fontSecondary },
    headerBtns: { display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 },
    exportBtn: {
      display: 'flex', alignItems: 'center', gap: 6, background: 'transparent',
      border: `1px solid ${t.cardBorder}`, borderRadius: 8, padding: '8px 14px',
      cursor: 'pointer', fontFamily: t.fontSecondary, fontSize: 12, fontWeight: 500, color: t.textSecondary,
    },
    detalleBtn: {
      background: t.primaryGradient, border: 'none', borderRadius: 8, padding: '8px 16px',
      color: '#fff', fontFamily: t.fontPrimary, fontSize: 12, fontWeight: 700, cursor: 'pointer',
    },
    topRow: { display: 'flex', gap: 16, marginBottom: 28, alignItems: 'stretch' },
    promedioCard: {
      background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: 16,
      padding: '20px 22px', boxShadow: t.cardShadow, width: 280, flexShrink: 0,
      display: 'flex', flexDirection: 'column', gap: 10,
    },
    promedioLabel: { fontSize: 10, letterSpacing: '0.08em', fontWeight: 700, color: t.textSecondary, fontFamily: t.fontSecondary },
    promedioNum: { lineHeight: 1 },
    promedioBig: { fontFamily: t.fontPrimary, fontSize: 48, fontWeight: 800, color: isDark ? '#FF5B2E' : '#FF8430' },
    promedioMax: { fontSize: 20, color: t.textMuted, fontWeight: 500 },
    progLabelRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 6 },
    progLabel: { fontSize: 11, color: t.textSecondary },
    notaHint: {
      display: 'flex', alignItems: 'flex-start', gap: 6,
      background: isDark ? 'rgba(255,91,46,0.08)' : 'rgba(255,132,48,0.07)',
      borderRadius: 8, padding: '8px 12px', marginTop: 4,
    },
    notaHintDot: { fontSize: 13, color: isDark ? '#FF5B2E' : '#FF8430', flexShrink: 0 },
    notaHintText: { fontSize: 11, color: t.textSecondary, lineHeight: 1.4 },
    desempenoCard: {
      background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: 16,
      padding: '20px 22px', boxShadow: t.cardShadow, flex: 1,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    },
    desempenoTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
    desempenoTitle: { fontFamily: t.fontPrimary, fontSize: 16, fontWeight: 700, color: t.textPrimary, marginBottom: 4 },
    desempenoSubtitle: { fontSize: 12, color: t.textSecondary },
    estadoBadge: { fontSize: 10, fontWeight: 600, padding: '4px 10px', borderRadius: 20, fontFamily: t.fontSecondary, whiteSpace: 'nowrap', flexShrink: 0, marginLeft: 12 },
    statsRow: { display: 'flex', gap: 0, alignItems: 'center' },
    statItem: { flex: 1 },
    statLabel: { fontSize: 10, color: t.textMuted, fontFamily: t.fontSecondary, marginBottom: 4 },
    statVal: { fontFamily: t.fontPrimary, fontSize: 26, fontWeight: 800, color: isDark ? '#FF5B2E' : '#FF8430' },
    statDivider: { width: 1, height: 40, background: t.cardBorder, margin: '0 20px', flexShrink: 0 },
    sectionTitle: { fontFamily: t.fontPrimary, fontSize: 18, fontWeight: 700, color: t.textPrimary, marginBottom: 14 },
    cortesWrap: { display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 },
    corteCard: {
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 12,
      padding: '16px 18px',
      boxShadow: t.cardShadow,
    },
    corteHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
    corteLeft: { display: 'flex', alignItems: 'center', gap: 14 },
    corteNum: { fontFamily: t.fontPrimary, fontSize: 28, fontWeight: 800, color: t.textMuted, lineHeight: 1, minWidth: 24 },
    corteNombre: { fontFamily: t.fontSecondary, fontSize: 13, fontWeight: 600, color: t.textPrimary },
    corteFecha: { fontSize: 11, color: t.textMuted, marginTop: 2 },
    corteRight: { display: 'flex', alignItems: 'center', gap: 10 },
    puntajeWrap: { textAlign: 'right' },
    puntajeLabel: { fontSize: 9, letterSpacing: '0.08em', color: t.textMuted, fontWeight: 600, fontFamily: t.fontSecondary },
    puntajeVal: { fontFamily: t.fontPrimary, fontSize: 22, fontWeight: 800 },
    editBtn: {
      background: 'transparent', border: `1px solid ${t.cardBorder}`, borderRadius: 6,
      width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
    },
    simularBtn: {
      background: t.primaryGradient, border: 'none', borderRadius: 8,
      padding: '7px 16px', color: '#fff', fontFamily: t.fontSecondary,
      fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
    },
    actividadesRow: { display: 'flex', gap: 10, paddingTop: 12, borderTop: `1px solid ${t.cardBorder}` },
    actividadItem: {
      flex: 1, background: t.inputBg, border: `1px solid ${t.cardBorder}`,
      borderRadius: 8, padding: '8px 12px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8,
    },
    actividadNombre: { fontSize: 12, color: t.textSecondary, fontFamily: t.fontSecondary },
    actividadNota: { fontSize: 13, fontWeight: 700, fontFamily: t.fontPrimary, padding: '2px 10px', borderRadius: 8 },
    actividadPendiente: { fontSize: 11, color: t.textMuted, fontFamily: t.fontSecondary },
    recomendacionCard: {
      background: isDark
        ? 'linear-gradient(135deg, rgba(196,16,122,0.15), rgba(255,91,46,0.10))'
        : 'linear-gradient(135deg, rgba(255,132,48,0.10), rgba(247,48,109,0.07))',
      border: `1px solid ${isDark ? 'rgba(196,16,122,0.25)' : 'rgba(255,132,48,0.25)'}`,
      borderRadius: 14, padding: '18px 20px',
      display: 'flex', alignItems: 'center', gap: 16, boxShadow: t.cardShadow,
    },
    recomendacionIcon: {
      width: 38, height: 38, borderRadius: 10,
      background: isDark ? 'rgba(255,91,46,0.20)' : 'rgba(255,132,48,0.15)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    },
    recomendacionBody: { flex: 1 },
    recomendacionTitle: { fontFamily: t.fontPrimary, fontSize: 13, fontWeight: 700, color: isDark ? '#FF5B2E' : '#FF8430', marginBottom: 4 },
    recomendacionText: { fontSize: 12, color: t.textSecondary, lineHeight: 1.5, margin: 0 },
    guiaBtn: {
      background: t.primaryGradient, border: 'none', borderRadius: 8,
      padding: '9px 18px', color: '#fff', fontFamily: t.fontPrimary,
      fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
    },
  };
};

export default SubjectDetail;