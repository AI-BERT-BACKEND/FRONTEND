import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/Layout/AppLayout';
import ProgressBar from '../components/ProgressBar';
import StatusBadge from '../components/StatusBadge';
import { useTheme } from '../context/ThemeContext';
import { createStyles } from '../theme/createStyles';

import { Star, ClipboardList, ListTodo, CheckCircle2 } from 'lucide-react';

const IconPlus = ({ color }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
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
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
  </svg>
);

const INITIAL_DATA = {
  materia: 'Detalles por Corte',
  subtitulo: 'Seguimiento detallado de evaluaciones por período académico.',
  stats: {
    promedioGlobal: 8.4,
    cortes: '2/3',
    tareasPendientes: 18,
    asistencia: 94,
  },
  cortes: [
    {
      id: 1,
      nombre: 'Primer Corte',
      color: '#FF8430',
      estado: 'Completado',
      estadoColor: '#22C55E',
      estadoBg: 'rgba(34,197,94,0.15)',
      peso: '30%',
      puntaje: 9.2,
      puntajeMax: 10.0,
      progreso: 92,
      actividades: [
        { id: 'a1', nombre: 'Participación',    nota: 9.5, peso: '40%', color: '#22C55E' },
        { id: 'a2', nombre: 'Taller Grupal',    nota: 9.0, peso: '30%', color: '#22C55E' },
        { id: 'a3', nombre: 'Quiz Semana 2',    nota: 8.8, peso: '15%', color: '#22C55E' },
        { id: 'a4', nombre: 'Participación',    nota: 9.5, peso: '15%', color: '#22C55E' },
      ],
    },
    {
      id: 2,
      nombre: 'Segundo Corte',
      color: '#A855F7',
      estado: 'Completado',
      estadoColor: '#22C55E',
      estadoBg: 'rgba(34,197,94,0.15)',
      peso: '30%',
      puntaje: 7.8,
      puntajeMax: 10.0,
      progreso: 78,
      actividades: [
        { id: 'b1', nombre: 'Examen Midterm',   nota: 7.5, peso: '40%', color: '#EAB308' },
        { id: 'b2', nombre: 'Examen Parcial',   nota: 8.0, peso: '30%', color: '#22C55E' },
        { id: 'b3', nombre: 'Quiz Semana 7',    nota: 8.2, peso: '15%', color: '#22C55E' },
        { id: 'b4', nombre: 'Asistencia',       nota: 8.0, peso: '15%', color: '#22C55E' },
      ],
    },
    {
      id: 3,
      nombre: 'Tercer Corte',
      color: '#F7306D',
      estado: 'Sin registrar',
      estadoColor: 'rgba(255,255,255,0.40)',
      estadoBg: 'rgba(255,255,255,0.07)',
      peso: '40%',
      puntaje: null,
      puntajeMax: 10.0,
      progreso: 0,
      actividades: [
        { id: 'c1', nombre: 'Examen Final',     nota: null, peso: '50%', color: null },
        { id: 'c2', nombre: 'Proyecto Práctico',nota: null, peso: '30%', color: null },
        { id: 'c3', nombre: 'Tec',              nota: null, peso: '10%', color: null },
        { id: 'c4', nombre: 'Exposición Oral',  nota: null, peso: '10%', color: null },
      ],
    },
  ],
  bottomStats: {
    promedioFinal: 8.47,
    proyeccion: '8.1 – 9.0',
    fallasPorMaterias: 'Ninguno',
    coloresMaterias: ['#FF8430', '#A855F7', '#F7306D'],
    restantes: 4,
  },
};

const ActividadModal = ({ corteNombre, actividad, isDark, onSave, onClose }) => {
  const t = createStyles(isDark);
  const [nombre, setNombre]   = useState(actividad?.nombre || '');
  const [nota,   setNota]     = useState(actividad?.nota   != null ? String(actividad.nota) : '');
  const [peso,   setPeso]     = useState(actividad?.peso   || '');
  const isEdit = !!actividad;

  const s = {
    overlay: {
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.70)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 200, backdropFilter: 'blur(2px)',
    },
    card: {
      background: t.cardBg, border: `1px solid ${t.cardBorder}`,
      borderRadius: 16, width: '100%', maxWidth: 400, margin: '0 20px',
      boxShadow: t.modalShadow, padding: '24px', display: 'flex',
      flexDirection: 'column', gap: 16,
    },
    title: {
      fontFamily: t.fontPrimary, fontSize: 16, fontWeight: 800,
      backgroundImage: t.primaryGradient,
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      backgroundClip: 'text', width: 'fit-content', marginBottom: 2,
    },
    sub:   { fontSize: 12, color: t.textMuted, fontFamily: t.fontSecondary },
    label: { display: 'block', fontSize: 12, fontWeight: 600, color: t.textPrimary, marginBottom: 6, fontFamily: t.fontSecondary },
    input: {
      width: '100%', background: t.inputBg, border: `1px solid ${t.inputBorder}`,
      borderRadius: 10, padding: '10px 12px', fontFamily: t.fontSecondary,
      fontSize: 12, color: t.textPrimary, outline: 'none', boxSizing: 'border-box',
    },
    row:    { display: 'flex', gap: 12 },
    footer: { display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4 },
    cancel: {
      padding: '9px 20px', borderRadius: 8, border: `1px solid ${t.inputBorder}`,
      background: 'transparent', cursor: 'pointer', fontFamily: t.fontSecondary,
      fontSize: 13, fontWeight: 500, color: t.textSecondary,
    },
    save: {
      padding: '9px 20px', borderRadius: 8, border: 'none',
      background: t.primaryGradient, cursor: 'pointer', fontFamily: t.fontPrimary,
      fontSize: 13, fontWeight: 700, color: '#fff',
    },
  };

  const handleSave = () => {
    if (!nombre.trim()) return;
    const notaNum = parseFloat(nota);
    const notaColor = isNaN(notaNum) ? null : notaNum >= 6 ? '#22C55E' : notaNum >= 4 ? '#EAB308' : '#F00707';
    onSave({ nombre: nombre.trim(), nota: isNaN(notaNum) ? null : notaNum, peso: peso || '—', color: notaColor });
  };

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.card} onClick={e => e.stopPropagation()}>
        <div>
          <div style={s.title}>{isEdit ? 'Editar Actividad' : 'Nueva Actividad'}</div>
          <div style={s.sub}>{corteNombre}</div>
        </div>
        <div><label style={s.label}>Nombre de la actividad</label>
          <input style={s.input} placeholder="Ej: Examen Parcial" value={nombre} onChange={e => setNombre(e.target.value)} />
        </div>
        <div style={s.row}>
          <div style={{ flex: 1 }}><label style={s.label}>Nota (0–10)</label>
            <input style={s.input} type="number" min="0" max="10" step="0.1" placeholder="8.5" value={nota} onChange={e => setNota(e.target.value)} />
          </div>
          <div style={{ flex: 1 }}><label style={s.label}>Peso (%)</label>
            <input style={s.input} placeholder="30%" value={peso} onChange={e => setPeso(e.target.value)} />
          </div>
        </div>
        <div style={s.footer}>
          <button style={s.cancel} onClick={onClose}>Cancelar</button>
          <button style={s.save} onClick={handleSave}>{isEdit ? 'Guardar cambios' : 'Agregar'}</button>
        </div>
      </div>
    </div>
  );
};

const CorteCard = ({ corte, isDark, onAddActividad, onEditActividad, onDeleteActividad }) => {
  const t  = createStyles(isDark);
  const s  = getCorteStyles(isDark, t, corte.color);
  const completado = corte.estado === 'Completado';

  return (
    <div style={s.card}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerLeft}>
          <div style={s.numCircle}>
            <span style={s.numText}>
              {String(corte.id).padStart(2, '0')}
            </span>
          </div>
          <div>
            <div style={s.nombre}>{corte.nombre}</div>
            <div style={s.peso}>Peso: {corte.peso}</div>
          </div>
        </div>
        <StatusBadge
          label={corte.estado}
          color={corte.estadoColor}
          bgColor={corte.estadoBg}
        />
      </div>

      {/* Puntaje */}
      <div style={s.puntajeRow}>
        {corte.puntaje !== null ? (
          <>
            <span style={s.puntajeBig}>{corte.puntaje}</span>
            <span style={s.puntajeMax}>/{corte.puntajeMax}</span>
          </>
        ) : (
          <span style={s.puntajePending}>— / {corte.puntajeMax}</span>
        )}
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 14 }}>
        <div style={s.progRow}>
          <span style={s.progLabel}>Progreso</span>
          <span style={{ ...s.progLabel, color: corte.color }}>{corte.progreso}%</span>
        </div>
        <ProgressBar value={corte.progreso} isDark={isDark} color={corte.color} />
      </div>

      {/* Actividades */}
      <div style={s.actHeader}>
        <span style={s.actTitle}>Actividades</span>
        <span style={s.actTitleRight}>
          <span style={s.actCol}>Nota</span>
          <span style={s.actCol}>Peso</span>
        </span>
      </div>
      <div style={s.actList}>
        {corte.actividades.map((act) => (
          <div key={act.id} style={s.actRow}>
            <span style={s.actNombre}>{act.nombre}</span>
            <div style={s.actRight}>
              {act.nota !== null ? (
                <span style={{
                  ...s.notaBadge,
                  background: act.color + (isDark ? '25' : '18'),
                  color: act.color,
                }}>
                  {act.nota}
                </span>
              ) : (
                <span style={s.notaPending}>—</span>
              )}
              <span style={s.actPeso}>{act.peso}</span>
              <button style={s.iconBtn} title="Editar" onClick={() => onEditActividad(corte.id, act)}>
                <IconEdit color={isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.35)'} />
              </button>
              <button style={{ ...s.iconBtn, marginLeft: 2 }} title="Eliminar" onClick={() => onDeleteActividad(corte.id, act.id)}>
                <IconTrash color="#F00707" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Botón */}
      <button style={s.verBtn} onClick={() => onAddActividad(corte.id)}>
        <IconPlus color="#fff" />
        <span>{completado ? 'Ver Detalle Completo' : 'Registrar Nota'}</span>
      </button>
    </div>
  );
};

const getCorteStyles = (isDark, t, accentColor) => ({
  card: {
    background: t.cardBg,
    border: `1px solid ${t.cardBorder}`,
    borderTop: `3px solid ${accentColor}`,
    borderRadius: 14,
    padding: '18px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    boxShadow: t.cardShadow,
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 10 },
  numCircle: {
    width: 38,
    height: 38,
    borderRadius: 10,
    background: accentColor + '22',
    border: `1.5px solid ${accentColor}55`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  numText: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 800, color: accentColor },
  nombre: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 700, color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)', lineHeight: 1.3 },
  peso: { fontSize: 10, color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)', marginTop: 2 },
  puntajeRow: { display: 'flex', alignItems: 'baseline', gap: 3 },
  puntajeBig: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 38, fontWeight: 800, color: accentColor, lineHeight: 1 },
  puntajeMax: { fontSize: 16, color: isDark ? 'rgba(255,255,255,0.30)' : 'rgba(0,0,0,0.30)', fontWeight: 500 },
  puntajePending: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 28, fontWeight: 700, color: isDark ? 'rgba(255,255,255,0.20)' : 'rgba(0,0,0,0.20)' },
  progRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 6 },
  progLabel: { fontSize: 10, color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.40)' },
  actHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  actTitle: { fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.40)', fontFamily: "'Poppins', sans-serif" },
  actTitleRight: { display: 'flex', gap: 28 },
  actCol: { fontSize: 10, fontWeight: 700, color: isDark ? 'rgba(255,255,255,0.30)' : 'rgba(0,0,0,0.30)', fontFamily: "'Poppins', sans-serif" },
  actList: { display: 'flex', flexDirection: 'column', gap: 6 },
  actRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '6px 8px', borderRadius: 8,
    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
  },
  actNombre: { fontSize: 11, color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.70)', fontFamily: "'Poppins', sans-serif", flex: 1 },
  actRight: { display: 'flex', alignItems: 'center', gap: 8 },
  notaBadge: { fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" },
  notaPending: { fontSize: 11, color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)', width: 32, textAlign: 'center' },
  actPeso: { fontSize: 10, color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)', width: 32, textAlign: 'right', fontFamily: "'Poppins', sans-serif" },
  iconBtn: {
    background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4,
  },
  verBtn: {
    marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 6, background: accentColor, border: 'none', borderRadius: 9,
    padding: '10px', width: '100%', color: '#fff',
    fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, fontWeight: 700,
    cursor: 'pointer',
  },
});

const CourseGrades = () => {
  const { isDark } = useTheme();
  const navigate   = useNavigate();
  const [data, setData]             = useState(INITIAL_DATA);
  const [modal, setModal]           = useState(null); // { corteId, actividad? }
  const s = getStyles(isDark);
  const t = createStyles(isDark);

  const handleAddActividad = (corteId) => setModal({ corteId, actividad: null });
  const handleEditActividad = (corteId, actividad) => setModal({ corteId, actividad });

  const handleDeleteActividad = (corteId, actId) => {
    setData(prev => ({
      ...prev,
      cortes: prev.cortes.map(c =>
        c.id === corteId
          ? { ...c, actividades: c.actividades.filter(a => a.id !== actId) }
          : c
      ),
    }));
  };

  const handleSaveActividad = ({ nombre, nota, peso, color }) => {
    setData(prev => ({
      ...prev,
      cortes: prev.cortes.map(c => {
        if (c.id !== modal.corteId) return c;
        let acts;
        if (modal.actividad) {
          acts = c.actividades.map(a =>
            a.id === modal.actividad.id ? { ...a, nombre, nota, peso, color } : a
          );
        } else {
          acts = [...c.actividades, { id: `new-${Date.now()}`, nombre, nota, peso, color }];
        }
        const notasValidas = acts.filter(a => a.nota !== null);
        const nuevoPuntaje = notasValidas.length
          ? parseFloat((notasValidas.reduce((s, a) => s + a.nota, 0) / notasValidas.length).toFixed(1))
          : null;
        return { ...c, actividades: acts, puntaje: nuevoPuntaje, progreso: nuevoPuntaje ? Math.round(nuevoPuntaje * 10) : 0 };
      }),
    }));
    setModal(null);
  };

  const { stats, cortes, bottomStats } = data;

  return (
    <AppLayout>
      {/* ── HEADER ── */}
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.pageTitle}>{data.materia}</h1>
          <p style={s.pageDesc}>{data.subtitulo}</p>
        </div>
      </div>

      {/* ── TOP STATS ── */}
      <div style={s.statsRow}>
        {[
          { label: 'Promedio Global',     val: stats.promedioGlobal, icon: Star, accent: isDark ? '#FF5B2E' : '#FF8430' },
          { label: 'Cortes',              val: stats.cortes,         icon: ClipboardList,         accent: isDark ? '#A855F7' : '#A855F7' },
          { label: 'Tareas Pendientes',   val: stats.tareasPendientes, icon: ListTodo, accent: isDark ? '#FF5B2E' : '#FF8430' },
          { label: 'Asistencia',          val: `${stats.asistencia}%`, icon: CheckCircle2, accent: '#22C55E' },
        ].map((item, i) => (
          <div key={i} style={s.statCard}>
            <div style={s.statIconWrap}>
              <item.icon size={18} color={item.accent} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={s.statLabel}>{item.label}</div>
              <div style={{ ...s.statVal, color: item.accent }}>{item.val}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── CORTES GRID ── */}
      <div style={s.cortesGrid}>
        {cortes.map(corte => (
          <CorteCard
            key={corte.id}
            corte={corte}
            isDark={isDark}
            onAddActividad={handleAddActividad}
            onEditActividad={handleEditActividad}
            onDeleteActividad={handleDeleteActividad}
          />
        ))}
      </div>

      {/* ── BOTTOM STATS BAR ── */}
      <div style={s.bottomBar}>
        <div style={s.bottomItem}>
          <div style={s.bottomLabel}>PROMEDIO FINAL</div>
          <div style={s.bottomVal}>{bottomStats.promedioFinal}</div>
          <div style={s.bottomSub}>promedio ponderado</div>
        </div>
        <div style={s.bottomDivider} />
        <div style={s.bottomItem}>
          <div style={s.bottomLabel}>PROYECCIÓN</div>
          <div style={s.bottomVal}>{bottomStats.proyeccion}</div>
          <div style={s.bottomSub}>rango esperado final</div>
        </div>
        <div style={s.bottomDivider} />
        <div style={s.bottomItem}>
          <div style={s.bottomLabel}>FALLAS POR MATERIAS</div>
          <div style={{ ...s.bottomVal, color: '#22C55E' }}>{bottomStats.fallasPorMaterias}</div>
          <div style={s.bottomSub}>sin materias en riesgo</div>
        </div>
        <div style={s.bottomDivider} />
        <div style={s.bottomItem}>
          <div style={s.bottomLabel}>MATERIAS</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            {bottomStats.coloresMaterias.map((c, i) => (
              <div key={i} style={{ width: 18, height: 18, borderRadius: 5, background: c }} />
            ))}
          </div>
          <div style={s.bottomSub}>activas este semestre</div>
        </div>
        <div style={s.bottomDivider} />
        <div style={s.bottomItem}>
          <div style={s.bottomLabel}>EVALUACIONES RESTANTES</div>
          <div style={{ ...s.bottomVal, color: isDark ? '#FF5B2E' : '#FF8430' }}>
            {bottomStats.restantes} restantes
          </div>
          <div style={s.bottomSub}>por completar</div>
        </div>
      </div>

      {/* ── MODAL ── */}
      {modal && (
        <ActividadModal
          corteNombre={cortes.find(c => c.id === modal.corteId)?.nombre}
          actividad={modal.actividad}
          isDark={isDark}
          onSave={handleSaveActividad}
          onClose={() => setModal(null)}
        />
      )}
    </AppLayout>
  );
};

const getStyles = (isDark) => {
  const t = createStyles(isDark);
  return {
    pageHeader: {
      display: 'flex', alignItems: 'flex-start',
      justifyContent: 'space-between', marginBottom: 20,
    },
    pageTitle: {
      fontFamily: t.fontPrimary, fontSize: 30, fontWeight: 800,
      backgroundImage: t.primaryGradient,
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      backgroundClip: 'text', width: 'fit-content', margin: '0 0 4px 0',
    },
    pageDesc: { fontSize: 13, color: t.textSecondary, margin: 0 },
    statsRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 12,
      marginBottom: 20,
    },
    statCard: {
      background: t.cardBg, border: `1px solid ${t.cardBorder}`,
      borderRadius: 14, padding: '14px 16px', boxShadow: t.cardShadow,
      display: 'flex', alignItems: 'center', gap: 12,
    },
    statIconWrap: {
      width: 40, height: 40, borderRadius: 10,
      background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    },
    statLabel: { fontSize: 10, color: t.textMuted, fontFamily: t.fontSecondary, marginBottom: 2 },
    statVal: {
      fontFamily: t.fontPrimary, fontSize: 22, fontWeight: 800,
      color: isDark ? '#FF5B2E' : '#FF8430',
    },
    cortesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 16,
      marginBottom: 20,
    },
    bottomBar: {
      background: t.cardBg, border: `1px solid ${t.cardBorder}`,
      borderRadius: 14, padding: '16px 24px', boxShadow: t.cardShadow,
      display: 'flex', alignItems: 'center', gap: 0,
    },
    bottomItem: { flex: 1, paddingRight: 8 },
    bottomDivider: {
      width: 1, height: 44,
      background: t.cardBorder,
      margin: '0 20px', flexShrink: 0,
    },
    bottomLabel: {
      fontSize: 9, letterSpacing: '0.08em', fontWeight: 700,
      color: t.textMuted, fontFamily: t.fontSecondary, marginBottom: 4,
    },
    bottomVal: {
      fontFamily: t.fontPrimary, fontSize: 18, fontWeight: 800,
      color: t.textPrimary,
    },
    bottomSub: { fontSize: 10, color: t.textMuted, marginTop: 2, fontFamily: t.fontSecondary },
  };
};

export default CourseGrades;