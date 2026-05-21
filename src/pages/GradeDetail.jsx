import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppLayout from '../components/Layout/AppLayout';
import { useTheme } from '../context/ThemeContext';
import { createStyles } from '../theme/createStyles';

// ── ICONOS ─────────────────────────────────────────────────────────────────────

const IconSearch = ({ color }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconDownload = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
const IconEdit = ({ color }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const IconTrash = ({ color }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
  </svg>
);
const IconClipboard = ({ color }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);
const IconBook = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

// ── DATOS ──────────────────────────────────────────────────────────────────────

const MATERIAS = [
  {
    id: 'mat4',
    nombre: 'Matemáticas IV',
    codigo: 'MAT-401',
    profesor: 'Dr. Alejandro Ramírez',
    creditos: 4,
    color: '#FF8430',
    notaActual: 8.5,
    avance: 67,
    evaluacionesPend: 5,
    evaluacionesTotal: 5,
    estado: 'Aprobando',
    faltas: 2,
    porcentajeEvaluado: 40,
    cortes: [
      { id: 1, nombre: 'CORTE 1',     porcentaje: 30, nota: 8.7 },
      { id: 2, nombre: 'CORTE 2',     porcentaje: 30, nota: 7.2 },
      { id: 3, nombre: 'CORTE FINAL', porcentaje: 40, nota: null },
    ],
    historial: {
      1: [
        { id: 'h1', actividad: 'Taller Integrales Definidas', fecha: '12 Mar 2024', peso: '15%', nota: 9.0 },
        { id: 'h2', actividad: 'Quiz Unidad 4 – Integración',  fecha: '15 Mar 2024', peso: '15%', nota: 8.4 },
      ],
      2: [
        { id: 'h3', actividad: 'Examen Parcial Cálculo',           fecha: '10 Abr 2024', peso: '20%', nota: 7.5 },
        { id: 'h4', actividad: 'Taller Ecuaciones Diferenciales', fecha: '25 Abr 2024', peso: '10%', nota: 6.9 },
      ],
      3: [],
    },
  },
  {
    id: 'hist',
    nombre: 'Historia',
    codigo: 'HIS-301',
    profesor: 'Dra. Patricia Mora',
    creditos: 3,
    color: '#A855F7',
    notaActual: 7.9,
    avance: 55,
    evaluacionesPend: 3,
    evaluacionesTotal: 6,
    estado: 'Aprobando',
    faltas: 1,
    porcentajeEvaluado: 60,
    cortes: [
      { id: 1, nombre: 'CORTE 1',     porcentaje: 30, nota: 8.2 },
      { id: 2, nombre: 'CORTE 2',     porcentaje: 30, nota: 7.6 },
      { id: 3, nombre: 'CORTE FINAL', porcentaje: 40, nota: null },
    ],
    historial: {
      1: [
        { id: 'h5', actividad: 'Ensayo Edad Media', fecha: '05 Mar 2024', peso: '15%', nota: 8.5 },
        { id: 'h6', actividad: 'Examen Semana 4',   fecha: '20 Mar 2024', peso: '15%', nota: 7.9 },
      ],
      2: [
        { id: 'h7', actividad: 'Presentación Renacimiento',   fecha: '08 Abr 2024', peso: '20%', nota: 7.2 },
        { id: 'h8', actividad: 'Quiz Revolución Industrial', fecha: '22 Abr 2024', peso: '10%', nota: 8.0 },
      ],
      3: [],
    },
  },
  {
    id: 'fis',
    nombre: 'Física Moderna',
    codigo: 'FIS-401',
    profesor: 'Dr. Carlos Vega',
    creditos: 4,
    color: '#00CFFF',
    notaActual: 6.8,
    avance: 45,
    evaluacionesPend: 7,
    evaluacionesTotal: 8,
    estado: 'En Riesgo',
    faltas: 4,
    porcentajeEvaluado: 30,
    cortes: [
      { id: 1, nombre: 'CORTE 1',     porcentaje: 30, nota: 6.5 },
      { id: 2, nombre: 'CORTE 2',     porcentaje: 30, nota: null },
      { id: 3, nombre: 'CORTE FINAL', porcentaje: 40, nota: null },
    ],
    historial: {
      1: [
        { id: 'h9',  actividad: 'Lab Óptica Cuántica',       fecha: '02 Mar 2024', peso: '20%', nota: 6.8 },
        { id: 'h10', actividad: 'Quiz Mecánica Relativista', fecha: '18 Mar 2024', peso: '10%', nota: 6.2 },
      ],
      2: [],
      3: [],
    },
  },
  {
    id: 'comp',
    nombre: 'Comprensión Lectora',
    codigo: 'COM-101',
    profesor: 'Mg. Laura Rincón',
    creditos: 2,
    color: '#22C55E',
    notaActual: 9.1,
    avance: 80,
    evaluacionesPend: 2,
    evaluacionesTotal: 4,
    estado: 'Aprobando',
    faltas: 0,
    porcentajeEvaluado: 70,
    cortes: [
      { id: 1, nombre: 'CORTE 1',     porcentaje: 30, nota: 9.4 },
      { id: 2, nombre: 'CORTE 2',     porcentaje: 30, nota: 8.8 },
      { id: 3, nombre: 'CORTE FINAL', porcentaje: 40, nota: null },
    ],
    historial: {
      1: [
        { id: 'h11', actividad: 'Análisis Texto Narrativo', fecha: '07 Mar 2024', peso: '15%', nota: 9.5 },
        { id: 'h12', actividad: 'Taller Inferencias',       fecha: '21 Mar 2024', peso: '15%', nota: 9.3 },
      ],
      2: [
        { id: 'h13', actividad: 'Síntesis Ensayo Académico', fecha: '11 Abr 2024', peso: '20%', nota: 8.7 },
        { id: 'h14', actividad: 'Quiz Comprensión Crítica',  fecha: '28 Abr 2024', peso: '10%', nota: 8.9 },
      ],
      3: [],
    },
  },
  {
    id: 'sis',
    nombre: 'Sistemas I',
    codigo: 'SIS-201',
    profesor: 'Ing. Pedro Salcedo',
    creditos: 3,
    color: '#F7306D',
    notaActual: 7.4,
    avance: 50,
    evaluacionesPend: 4,
    evaluacionesTotal: 6,
    estado: 'Aprobando',
    faltas: 2,
    porcentajeEvaluado: 50,
    cortes: [
      { id: 1, nombre: 'CORTE 1',     porcentaje: 30, nota: 7.8 },
      { id: 2, nombre: 'CORTE 2',     porcentaje: 30, nota: 7.0 },
      { id: 3, nombre: 'CORTE FINAL', porcentaje: 40, nota: null },
    ],
    historial: {
      1: [
        { id: 'h15', actividad: 'Taller Diagramas ER',  fecha: '04 Mar 2024', peso: '15%', nota: 8.0 },
        { id: 'h16', actividad: 'Quiz Normalización',   fecha: '19 Mar 2024', peso: '15%', nota: 7.6 },
      ],
      2: [
        { id: 'h17', actividad: 'Examen SQL Avanzado',  fecha: '09 Abr 2024', peso: '20%', nota: 7.2 },
        { id: 'h18', actividad: 'Proyecto Modelado BD', fecha: '26 Abr 2024', peso: '10%', nota: 6.8 },
      ],
      3: [],
    },
  },
];

// ── COMPONENTE PRINCIPAL ───────────────────────────────────────────────────────

const GradeDetail = () => {
  const { isDark } = useTheme();
  const { id }     = useParams();
  const navigate   = useNavigate();
  const t          = createStyles(isDark);
  const s          = getStyles(isDark);
  const accent     = isDark ? '#FF5B2E' : '#FF8430';

  const [materiaIdx, setMateriaIdx] = useState(0);
  const [corteIdx,   setCorteIdx]   = useState(0);
  const [busqueda,   setBusqueda]   = useState('');

  const materia       = MATERIAS[materiaIdx];
  const corteActual   = materia.cortes[corteIdx];
  const todosRegistros = materia.historial[corteActual.id] || [];
  const registros     = busqueda
    ? todosRegistros.filter((r) => r.actividad.toLowerCase().includes(busqueda.toLowerCase()))
    : todosRegistros;

  const estadoStyle = ({
    'Aprobando': { bg: isDark ? 'rgba(34,197,94,0.15)'  : 'rgba(34,197,94,0.12)',  color: '#22C55E' },
    'En Riesgo': { bg: isDark ? 'rgba(240,7,7,0.15)'    : 'rgba(240,7,7,0.10)',    color: '#F00707' },
    'Excelente': { bg: isDark ? 'rgba(34,197,94,0.15)'  : 'rgba(34,197,94,0.12)',  color: '#22C55E' },
  })[materia.estado] || { bg: 'rgba(234,179,8,0.15)', color: '#EAB308' };

  const notaColor = (nota) => {
    if (nota >= 7) return { color: '#22C55E', bg: isDark ? 'rgba(34,197,94,0.18)' : 'rgba(34,197,94,0.14)' };
    if (nota >= 5) return { color: '#EAB308', bg: isDark ? 'rgba(234,179,8,0.18)' : 'rgba(234,179,8,0.14)' };
    return { color: '#F00707', bg: isDark ? 'rgba(240,7,7,0.18)' : 'rgba(240,7,7,0.12)' };
  };

  return (
    <AppLayout>

      {/* ── TÍTULO ── */}
      <div style={s.pageHeader}>
        <h1 style={s.pageTitle}>Detalle por nota</h1>
        <p style={s.pageDesc}>Información completa, recursos y progreso de cada asignatura.</p>
      </div>

      {/* ── TABS DE MATERIAS ── */}
      <div style={s.tabsRow}>
        {MATERIAS.map((m, i) => (
          <button
            key={m.id}
            style={i === materiaIdx ? s.tabActive : s.tab}
            onClick={() => { setMateriaIdx(i); setCorteIdx(0); setBusqueda(''); }}
          >
            {m.nombre}
          </button>
        ))}
      </div>

      {/* ── HEADER MATERIA ── */}
      <div style={s.materiaHeader}>
        <div style={s.materiaHeaderLeft}>
          <div style={{ ...s.materiaIconWrap, background: materia.color + '22', border: `1.5px solid ${materia.color}55` }}>
            <IconBook color={materia.color} />
          </div>
          <div>
            <div style={s.materiaNombreRow}>
              <span style={s.materiaNombre}>{materia.nombre}</span>
              <span style={s.materiaCodigo}>{materia.codigo}</span>
            </div>
            <div style={s.materiaSubinfo}>
              Docente: {materia.profesor} · {materia.creditos} Créditos
            </div>
          </div>
        </div>
        <button style={s.registrarBtn}>
          <IconClipboard color="#fff" />
          <span>REGISTRAR CALIFICACIÓN</span>
        </button>
      </div>

      {/* ── DOS COLUMNAS ── */}
      <div style={s.twoCol}>

        {/* ── IZQUIERDA: CORTES + ESTADO ADMIN ── */}
        <div style={s.leftCol}>
          <div style={s.colLabel}>RESUMEN POR CORTE</div>

          <div style={s.cortesList}>
            {materia.cortes.map((c, i) => {
              const activo = i === corteIdx;
              return (
                <div
                  key={c.id}
                  style={{
                    ...s.corteCard,
                    ...(activo ? {
                      background: isDark
                        ? 'linear-gradient(135deg, rgba(255,91,46,0.28), rgba(196,16,122,0.20))'
                        : 'linear-gradient(135deg, rgba(255,132,48,0.20), rgba(247,48,109,0.14))',
                      borderColor: isDark ? 'rgba(255,91,46,0.45)' : 'rgba(255,132,48,0.45)',
                    } : {}),
                  }}
                  onClick={() => { setCorteIdx(i); setBusqueda(''); }}
                >
                  <div style={s.corteRow}>
                    <span style={{
                      ...s.corteNombre,
                      color: activo
                        ? (isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)')
                        : t.textPrimary,
                      fontWeight: activo ? 700 : 600,
                    }}>
                      {c.nombre} ({c.porcentaje}%)
                    </span>
                    <span style={{
                      ...s.corteNota,
                      color: c.nota !== null
                        ? (activo ? (isDark ? '#FFFFFF' : 'rgba(0,0,0,0.80)') : accent)
                        : t.textMuted,
                    }}>
                      {c.nota !== null ? `${c.nota}/10` : '—'}
                    </span>
                  </div>
                  {activo && c.nota !== null && (
                    <div style={s.corteBarTrack}>
                      <div style={{ ...s.corteBarFill, width: `${(c.nota / 10) * 100}%` }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ESTADO ADMINISTRATIVO */}
          <div style={s.adminCard}>
            <div style={s.adminLabel}>ESTADO ADMINISTRATIVO</div>
            <div style={s.adminRow}>
              <span style={s.adminKey}>Porcentaje Evaluado</span>
              <span style={s.adminVal}>{materia.porcentajeEvaluado}% del total</span>
            </div>
            <div style={{ ...s.adminRow, borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>
              <span style={s.adminKey}>Faltas registradas</span>
              <span style={{
                ...s.adminVal,
                color: materia.faltas > 0 ? '#F00707' : '#22C55E',
              }}>
                {materia.faltas} sesiones
              </span>
            </div>
          </div>
        </div>

        {/* ── DERECHA: HISTORIAL DE CALIFICACIONES ── */}
        <div style={s.rightCol}>

          <div style={s.histHeader}>
            <div style={s.histTitle}>
              Historial de Calificaciones:
              <span style={{ color: accent }}> {corteActual.nombre.replace('CORTE ', 'Corte ')}</span>
            </div>
            <div style={s.histActions}>
              <div style={s.searchBox}>
                <span style={s.searchIconPos}>
                  <IconSearch color={isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.30)'} />
                </span>
                <input
                  style={s.searchInput}
                  placeholder="Filtrar"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
              <button style={s.downloadBtn}>
                <IconDownload color={isDark ? 'rgba(255,255,255,0.60)' : 'rgba(0,0,0,0.50)'} />
              </button>
            </div>
          </div>

          {/* Cabecera de tabla */}
          <div style={s.tableHead}>
            <span style={{ ...s.th, flex: 2.5 }}>ACTIVIDAD</span>
            <span style={s.th}>FECHA</span>
            <span style={s.th}>PESO</span>
            <span style={s.th}>NOTA</span>
            <span style={s.th}>ACCIONES</span>
          </div>

          {/* Filas */}
          {registros.length === 0 ? (
            <div style={s.emptyRow}>
              {busqueda ? 'Sin resultados para la búsqueda.' : 'FIN DE REGISTROS PARA ESTE PERÍODO'}
            </div>
          ) : (
            registros.map((r) => {
              const nc = notaColor(r.nota);
              return (
                <div key={r.id} style={s.tableRow}>
                  <span style={{ ...s.td, flex: 2.5, color: t.textPrimary, fontWeight: 500 }}>
                    {r.actividad}
                  </span>
                  <span style={s.td}>{r.fecha}</span>
                  <span style={s.td}>{r.peso}</span>
                  <span style={s.td}>
                    <span style={{ ...s.notaBadge, background: nc.bg, color: nc.color }}>
                      {r.nota}
                    </span>
                  </span>
                  <span style={{ ...s.td, display: 'flex', gap: 6, alignItems: 'center' }}>
                    <button style={s.iconBtn}>
                      <IconEdit color={isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.40)'} />
                    </button>
                    <button style={s.iconBtn}>
                      <IconTrash color="#F00707" />
                    </button>
                  </span>
                </div>
              );
            })
          )}

          <div style={s.tableFooter}>
            Mostrando {registros.length} evaluaciones de {todosRegistros.length} programadas para este corte.
          </div>
        </div>
      </div>

      {/* ── BARRA INFERIOR ── */}
      <div style={s.bottomBar}>
        <div style={s.bottomItem}>
          <div style={s.bottomLabel}>NOTA ACTUAL</div>
          <div style={s.bottomVal}>
            <span style={{ color: accent }}>{materia.notaActual}</span>
            <span style={s.bottomValSub}>/10</span>
          </div>
          <div style={s.bottomDesc}>Promedio por corte</div>
        </div>
        <div style={s.bottomDivider} />
        <div style={s.bottomItem}>
          <div style={s.bottomLabel}>CRÉDITOS</div>
          <div style={{ ...s.bottomVal, color: accent }}>{materia.creditos} Créditos</div>
          <div style={s.bottomDesc}>Materia categoría</div>
        </div>
        <div style={s.bottomDivider} />
        <div style={s.bottomItem}>
          <div style={s.bottomLabel}>AVANCE CURSO</div>
          <div style={{ ...s.bottomVal, color: accent }}>{materia.avance}%</div>
          <div style={s.bottomDesc}>Actividades completadas</div>
        </div>
        <div style={s.bottomDivider} />
        <div style={s.bottomItem}>
          <div style={s.bottomLabel}>EVALUACIONES</div>
          <div style={{ ...s.bottomVal, color: isDark ? '#FF5B2E' : '#F7306D' }}>
            {materia.evaluacionesPend} pend.
          </div>
          <div style={s.bottomDesc}>{materia.evaluacionesTotal} en total</div>
        </div>
        <div style={s.bottomDivider} />
        <div style={s.bottomItem}>
          <div style={s.bottomLabel}>ESTADO</div>
          <div style={s.estadoRow}>
            <span style={{ ...s.estadoBadge, background: estadoStyle.bg, color: estadoStyle.color }}>
              {materia.estado}
            </span>
            <button style={s.recursosBtn}>Recursos</button>
            <button style={s.verBtn}>Ver Resultado</button>
          </div>
        </div>
      </div>

    </AppLayout>
  );
};

// ── ESTILOS ───────────────────────────────────────────────────────────────────

const getStyles = (isDark) => {
  const t      = createStyles(isDark);
  const accent = isDark ? '#FF5B2E' : '#FF8430';

  return {
    pageHeader: { marginBottom: 6 },
    pageTitle: {
      fontFamily: t.fontPrimary,
      fontSize: 32,
      fontWeight: 800,
      backgroundImage: t.primaryGradient,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      width: 'fit-content',
      margin: '0 0 4px 0',
    },
    pageDesc: { fontSize: 13, color: t.textSecondary, margin: '0 0 18px 0' },

    // Tabs
    tabsRow: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 },
    tab: {
      padding: '6px 14px',
      borderRadius: 20,
      border: `1px solid ${t.cardBorder}`,
      background: 'transparent',
      color: t.textSecondary,
      fontFamily: t.fontSecondary,
      fontSize: 12,
      fontWeight: 500,
      cursor: 'pointer',
      transition: t.appleTransition,
    },
    tabActive: {
      padding: '6px 14px',
      borderRadius: 20,
      border: 'none',
      background: t.primaryGradient,
      color: '#fff',
      fontFamily: t.fontSecondary,
      fontSize: 12,
      fontWeight: 600,
      cursor: 'pointer',
    },

    // Header de materia
    materiaHeader: {
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 14,
      padding: '14px 18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14,
      boxShadow: t.cardShadow,
      gap: 16,
    },
    materiaHeaderLeft: { display: 'flex', alignItems: 'center', gap: 14 },
    materiaIconWrap: {
      width: 44,
      height: 44,
      borderRadius: 12,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    materiaNombreRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' },
    materiaNombre: {
      fontFamily: t.fontPrimary,
      fontSize: 15,
      fontWeight: 700,
      color: t.textPrimary,
    },
    materiaCodigo: {
      fontSize: 10,
      fontWeight: 600,
      padding: '2px 8px',
      borderRadius: 8,
      background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
      color: t.textMuted,
      fontFamily: t.fontSecondary,
      letterSpacing: '0.04em',
    },
    materiaSubinfo: { fontSize: 12, color: t.textSecondary, fontFamily: t.fontSecondary },
    registrarBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      background: t.primaryGradient,
      border: 'none',
      borderRadius: 9,
      padding: '9px 16px',
      color: '#fff',
      fontFamily: t.fontSecondary,
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.04em',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      flexShrink: 0,
    },

    // Layout
    twoCol: {
      display: 'flex',
      gap: 14,
      alignItems: 'flex-start',
      marginBottom: 14,
    },

    // Columna izquierda
    leftCol: {
      width: 252,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    },
    colLabel: {
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: '0.10em',
      color: t.textMuted,
      fontFamily: t.fontSecondary,
    },
    cortesList: { display: 'flex', flexDirection: 'column', gap: 8 },
    corteCard: {
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 10,
      padding: '12px 14px',
      cursor: 'pointer',
      transition: t.appleTransition,
      boxShadow: t.cardShadow,
    },
    corteRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    corteNombre: { fontFamily: t.fontSecondary, fontSize: 12, fontWeight: 600, color: t.textPrimary },
    corteNota:   { fontFamily: t.fontPrimary,   fontSize: 14, fontWeight: 800, color: accent },
    corteBarTrack: {
      height: 3,
      borderRadius: 2,
      background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.10)',
      overflow: 'hidden',
      marginTop: 10,
    },
    corteBarFill: {
      height: '100%',
      borderRadius: 2,
      background: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.28)',
    },

    // Estado administrativo
    adminCard: {
      background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.025)',
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 10,
      padding: '12px 14px',
      marginTop: 2,
    },
    adminLabel: {
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: '0.10em',
      color: t.textMuted,
      fontFamily: t.fontSecondary,
      marginBottom: 10,
    },
    adminRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 8,
      marginBottom: 8,
      borderBottom: `1px solid ${t.cardBorder}`,
    },
    adminKey: { fontSize: 11, color: t.textSecondary, fontFamily: t.fontSecondary },
    adminVal: { fontSize: 11, fontWeight: 600, color: t.textPrimary, fontFamily: t.fontSecondary },

    // Columna derecha
    rightCol: {
      flex: 1,
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 14,
      padding: '16px 18px',
      boxShadow: t.cardShadow,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      minWidth: 0,
    },
    histHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 10,
    },
    histTitle: {
      fontFamily: t.fontPrimary,
      fontSize: 14,
      fontWeight: 700,
      color: t.textPrimary,
    },
    histActions: { display: 'flex', gap: 8, alignItems: 'center' },
    searchBox: { position: 'relative', display: 'flex', alignItems: 'center' },
    searchIconPos: {
      position: 'absolute',
      left: 9,
      display: 'flex',
      alignItems: 'center',
      pointerEvents: 'none',
    },
    searchInput: {
      background: t.inputBg,
      border: `1px solid ${t.inputBorder}`,
      borderRadius: 8,
      padding: '6px 10px 6px 28px',
      fontFamily: t.fontSecondary,
      fontSize: 12,
      color: t.textPrimary,
      outline: 'none',
      width: 130,
    },
    downloadBtn: {
      width: 32,
      height: 32,
      borderRadius: 8,
      border: `1px solid ${t.cardBorder}`,
      background: 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
    },

    // Tabla
    tableHead: {
      display: 'flex',
      alignItems: 'center',
      paddingBottom: 8,
      borderBottom: `1px solid ${t.cardBorder}`,
      gap: 8,
    },
    th: {
      flex: 1,
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: '0.08em',
      color: t.textMuted,
      fontFamily: t.fontSecondary,
    },
    tableRow: {
      display: 'flex',
      alignItems: 'center',
      padding: '10px 0',
      borderBottom: `1px solid ${t.cardBorder}`,
      gap: 8,
    },
    td: { flex: 1, fontSize: 12, color: t.textSecondary, fontFamily: t.fontSecondary },
    notaBadge: {
      display: 'inline-block',
      fontSize: 12,
      fontWeight: 700,
      padding: '2px 10px',
      borderRadius: 8,
      fontFamily: t.fontPrimary,
    },
    iconBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '3px 5px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5,
    },
    emptyRow: {
      padding: '28px 0',
      textAlign: 'center',
      fontSize: 11,
      color: t.textMuted,
      fontFamily: t.fontSecondary,
      letterSpacing: '0.04em',
    },
    tableFooter: {
      fontSize: 10,
      color: t.textMuted,
      fontFamily: t.fontSecondary,
      textAlign: 'center',
      paddingTop: 4,
    },

    // Barra inferior
    bottomBar: {
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 14,
      padding: '14px 20px',
      boxShadow: t.cardShadow,
      display: 'flex',
      alignItems: 'center',
    },
    bottomItem: { flex: 1 },
    bottomDivider: {
      width: 1,
      height: 44,
      background: t.cardBorder,
      margin: '0 16px',
      flexShrink: 0,
    },
    bottomLabel: {
      fontSize: 9,
      letterSpacing: '0.08em',
      fontWeight: 700,
      color: t.textMuted,
      fontFamily: t.fontSecondary,
      marginBottom: 3,
    },
    bottomVal: {
      fontFamily: t.fontPrimary,
      fontSize: 18,
      fontWeight: 800,
      color: t.textPrimary,
      lineHeight: 1.2,
    },
    bottomValSub: {
      fontSize: 12,
      color: t.textMuted,
      fontWeight: 500,
      fontFamily: t.fontPrimary,
    },
    bottomDesc: {
      fontSize: 10,
      color: t.textMuted,
      marginTop: 2,
      fontFamily: t.fontSecondary,
    },
    estadoRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginTop: 4,
      flexWrap: 'wrap',
    },
    estadoBadge: {
      fontSize: 10,
      fontWeight: 600,
      padding: '3px 10px',
      borderRadius: 20,
      fontFamily: t.fontSecondary,
    },
    recursosBtn: {
      padding: '4px 10px',
      borderRadius: 6,
      border: `1px solid ${t.cardBorder}`,
      background: 'transparent',
      cursor: 'pointer',
      fontFamily: t.fontSecondary,
      fontSize: 10,
      fontWeight: 600,
      color: t.textSecondary,
    },
    verBtn: {
      padding: '4px 10px',
      borderRadius: 6,
      border: 'none',
      background: t.primaryGradient,
      cursor: 'pointer',
      fontFamily: t.fontSecondary,
      fontSize: 10,
      fontWeight: 700,
      color: '#fff',
    },
  };
};

export default GradeDetail;
