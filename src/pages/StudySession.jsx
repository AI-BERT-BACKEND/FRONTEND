import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/Layout/AppLayout';
import { useTheme } from '../context/ThemeContext';
import { createStyles } from '../theme/createStyles';

// ── DATOS ─────────────────────────────────────────────────────────────────────

const SESIONES = [
  {
    id: 1,
    estado: 'EN CURSO',
    titulo: 'Optimización de Grafos',
    materia: 'Algoritmos Avanzados',
    materiaKey: 'ALGORITMOS',
    anfitrion: 'David Kovac',
    iniciales: 'DK',
    lugar: 'Virtual (Discord)',
    duracion: '90 min',
    tags: ['GRAFOS', 'FINALES', 'PYTHON'],
    participantes: '12/20',
    accion: 'UNIRSE AHORA',
  },
  {
    id: 2,
    estado: 'PRÓXIMA',
    hora: '14:00',
    titulo: 'Bioética y Transhumanismo',
    materia: 'Filosofía de la Ciencia',
    materiaKey: 'FILOSOFÍA',
    anfitrion: 'Elena Rossi',
    iniciales: 'ER',
    lugar: 'Bibl. Central L4',
    fecha: 'Hoy, 20 Oct',
    tags: ['ETICA', 'FUTURISMO'],
    participantes: '5/8',
    accion: 'RESERVAR CUPO',
  },
  {
    id: 3,
    estado: 'EN CURSO',
    titulo: 'Termodinámica Estadística',
    materia: 'Física Química II',
    materiaKey: 'FÍSICA',
    anfitrion: 'Marc Thorne',
    iniciales: 'MT',
    lugar: 'Google Meet',
    restante: '45m',
    tags: ['FISICA', 'QUIMICA'],
    participantes: '7/8',
    accion: 'UNIRSE AHORA',
  },
  {
    id: 4,
    estado: 'FINALIZADA',
    titulo: 'Taller de UX Research',
    materia: 'Diseño Industrial',
    materiaKey: 'DISEÑO',
    anfitrion: 'Sara Miller',
    iniciales: 'SM',
    descripcion: 'Excelente sesión, compartimos las grabaciones en el canal de recursos.',
    tags: [],
    accion: 'VER GRABACIÓN',
  },
];

const MATERIAS = ['TODAS', 'ALGORITMOS', 'FILOSOFÍA', 'FÍSICA', 'DISEÑO'];
const ESTADOS  = ['TODAS', 'EN CURSO', 'PRÓXIMA', 'FINALIZADA'];

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────

const StudySession = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const s = getStyles(isDark);

  const [filtroMateria, setFiltroMateria] = useState('TODAS');
  const [filtroEstado,  setFiltroEstado]  = useState('TODAS');

  const ciclar = (actual, opciones, setter) => {
    const idx = opciones.indexOf(actual);
    setter(opciones[(idx + 1) % opciones.length]);
  };

  const resetFiltros = () => {
    setFiltroMateria('TODAS');
    setFiltroEstado('TODAS');
  };

  const sesionesVisibles = SESIONES.filter((ses) => {
    const okEstado  = filtroEstado  === 'TODAS' || ses.estado      === filtroEstado;
    const okMateria = filtroMateria === 'TODAS' || ses.materiaKey  === filtroMateria;
    return okEstado && okMateria;
  });

  return (
    <AppLayout>
      {/* ENCABEZADO */}
      <div style={s.topRow}>
        <div>
          <h1 style={s.pageTitle}>Sesion de estudio</h1>
          <p style={s.subtitle}>Únete y aprende con otros estudiantes.</p>
        </div>
        <button style={s.crearBtn} onClick={() => navigate('/sesion/crear')}>
          <span>+</span> CREAR SESIÓN
        </button>
      </div>

      {/* FILTROS */}
      <div style={s.filtersBar}>
        <div style={s.filtersLeft}>
          <button
            style={s.filterChip}
            onClick={() => ciclar(filtroMateria, MATERIAS, setFiltroMateria)}
          >
            MATERIA: {filtroMateria}
          </button>
          <button
            style={s.filterChip}
            onClick={() => ciclar(filtroEstado, ESTADOS, setFiltroEstado)}
          >
            ESTADO: {filtroEstado}
          </button>
        </div>
        <button style={s.resetBtn} onClick={resetFiltros}>
          ↺ RESETEAR FILTROS
        </button>
      </div>

      {/* GRID DE SESIONES */}
      <div style={s.grid}>
        {sesionesVisibles.map((ses) => (
          <SesionCard key={ses.id} ses={ses} isDark={isDark} s={s} />
        ))}
        {sesionesVisibles.length === 0 && (
          <p style={s.emptyMsg}>No hay sesiones que coincidan con los filtros.</p>
        )}
      </div>
    </AppLayout>
  );
};

// ── TARJETA DE SESIÓN ─────────────────────────────────────────────────────────

const SesionCard = ({ ses, isDark, s }) => {
  const badgeStyle = getBadgeStyle(ses.estado, isDark);
  const btnStyle   = ses.accion === 'VER GRABACIÓN' ? s.accionBtnSecundario : s.accionBtnPrimario;

  return (
    <div style={{ ...s.card, ...(ses.estado === 'FINALIZADA' ? s.cardFinalizada : {}) }}>

      {/* Fila superior: badge + iconos */}
      <div style={s.cardTop}>
        <div style={{ ...s.badge, background: badgeStyle.bg, color: badgeStyle.color }}>
          {ses.estado === 'EN CURSO' && (
            <span style={{ ...s.badgeDot, background: badgeStyle.color }} />
          )}
          {ses.estado === 'PRÓXIMA' ? `PRÓXIMA (${ses.hora})` : ses.estado}
        </div>
        <div style={s.cardIconsRow}>
          {ses.participantes && (
            <span style={s.participantesLabel}>{ses.participantes}</span>
          )}
          <IconShare isDark={isDark} />
          <IconBookmark isDark={isDark} />
        </div>
      </div>

      {/* Título */}
      <h3 style={s.cardTitle}>{ses.titulo}</h3>

      {/* Materia */}
      <p style={s.cardMateria}>Materia: {ses.materia}</p>

      {/* Anfitrión */}
      <div style={s.anfitrionRow}>
        <div style={s.avatar}>{ses.iniciales}</div>
        <div>
          <div style={s.anfitrionLabel}>ANFITRIÓN</div>
          <div style={s.anfitrionNombre}>{ses.anfitrion}</div>
        </div>
      </div>

      {/* Info lugar / tiempo */}
      {(ses.lugar || ses.duracion || ses.fecha || ses.restante) && (
        <div style={s.infoRow}>
          {ses.lugar && (
            <span style={s.infoItem}>
              <IconPin /> {ses.lugar}
            </span>
          )}
          {ses.duracion && (
            <span style={s.infoItem}>
              <IconClock /> Dur: {ses.duracion}
            </span>
          )}
          {ses.fecha && (
            <span style={s.infoItem}>
              <IconCalendar /> {ses.fecha}
            </span>
          )}
          {ses.restante && (
            <span style={s.infoItem}>
              <IconClock /> Restan: {ses.restante}
            </span>
          )}
        </div>
      )}

      {/* Descripción (sesiones finalizadas) */}
      {ses.descripcion && (
        <p style={s.cardDesc}>{ses.descripcion}</p>
      )}

      {/* Tags */}
      {ses.tags.length > 0 && (
        <div style={s.tagsRow}>
          {ses.tags.map((tag) => (
            <span key={tag} style={s.tag}>#{tag}</span>
          ))}
        </div>
      )}

      {/* Botón acción */}
      <button style={btnStyle}>{ses.accion}</button>
    </div>
  );
};

// ── ÍCONOS INLINE ─────────────────────────────────────────────────────────────

const IconShare = ({ isDark }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke={isDark ? 'rgba(255,255,255,0.30)' : 'rgba(0,0,0,0.25)'}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer' }}>
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const IconBookmark = ({ isDark }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke={isDark ? 'rgba(255,255,255,0.30)' : 'rgba(0,0,0,0.25)'}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer' }}>
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const IconPin = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconClock = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconCalendar = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

// ── HELPERS DE ESTILO ─────────────────────────────────────────────────────────

const getBadgeStyle = (estado, isDark) => {
  if (estado === 'EN CURSO') return {
    bg: 'rgba(34,197,94,0.14)',
    color: '#22C55E',
  };
  if (estado === 'PRÓXIMA') return {
    bg: isDark ? 'rgba(255,91,46,0.18)' : 'rgba(255,132,48,0.14)',
    color: isDark ? '#FF5B2E' : '#FF8430',
  };
  return {
    bg: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
    color: isDark ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.38)',
  };
};

// ── ESTILOS ───────────────────────────────────────────────────────────────────

const getStyles = (isDark) => {
  const t = createStyles(isDark);
  const accent = isDark ? '#FF5B2E' : '#FF8430';

  return {
    // Encabezado
    topRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 20,
      gap: 16,
    },
    pageTitle: {
      fontFamily: t.fontPrimary,
      fontSize: 32,
      fontWeight: 800,
      backgroundImage: isDark
        ? 'linear-gradient(90deg, #FF5B2E, #C4107A)'
        : 'linear-gradient(90deg, #FF8430, #F7306D)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      width: 'fit-content',
      margin: '0 0 6px 0',
    },
    subtitle: {
      fontSize: 13,
      color: t.textSecondary,
      fontFamily: t.fontSecondary,
      margin: 0,
    },
    crearBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      background: t.primaryGradient,
      border: 'none',
      borderRadius: 10,
      padding: '10px 18px',
      color: '#fff',
      fontFamily: t.fontPrimary,
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '0.05em',
      cursor: 'pointer',
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },

    // Filtros
    filtersBar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      marginBottom: 20,
      flexWrap: 'wrap',
    },
    filtersLeft: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
    },
    filterChip: {
      padding: '6px 14px',
      borderRadius: 20,
      border: `1px solid ${t.cardBorder}`,
      background: t.cardBg,
      color: t.textPrimary,
      fontFamily: t.fontSecondary,
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.05em',
      cursor: 'pointer',
      transition: 'border-color 0.15s',
      whiteSpace: 'nowrap',
    },
    resetBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontFamily: t.fontSecondary,
      fontSize: 10,
      fontWeight: 600,
      color: t.textMuted,
      letterSpacing: '0.04em',
      padding: 0,
      whiteSpace: 'nowrap',
      flexShrink: 0,
    },

    // Grid
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: 16,
      alignItems: 'start',
    },
    emptyMsg: {
      gridColumn: '1 / -1',
      textAlign: 'center',
      color: t.textMuted,
      fontFamily: t.fontSecondary,
      fontSize: 13,
      padding: '48px 0',
      margin: 0,
    },

    // Card
    card: {
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 16,
      padding: '18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      boxShadow: t.cardShadow,
    },
    cardFinalizada: {
      opacity: isDark ? 0.75 : 0.80,
    },
    cardTop: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },

    // Badge de estado
    badge: {
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: '0.07em',
      padding: '4px 10px',
      borderRadius: 20,
      fontFamily: t.fontSecondary,
    },
    badgeDot: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      flexShrink: 0,
    },

    // Íconos de tarjeta
    cardIconsRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    },
    participantesLabel: {
      fontSize: 10,
      fontWeight: 600,
      color: t.textMuted,
      fontFamily: t.fontSecondary,
    },

    // Contenido
    cardTitle: {
      fontFamily: t.fontPrimary,
      fontSize: 17,
      fontWeight: 800,
      color: t.textPrimary,
      margin: '0 0 4px 0',
      lineHeight: 1.25,
    },
    cardMateria: {
      fontSize: 11,
      fontWeight: 600,
      color: accent,
      fontFamily: t.fontSecondary,
      margin: '0 0 12px 0',
    },

    // Anfitrión
    anfitrionRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12,
    },
    avatar: {
      width: 30,
      height: 30,
      borderRadius: '50%',
      background: isDark
        ? 'linear-gradient(135deg, #C4107A, #FF5B2E)'
        : 'linear-gradient(135deg, #FF8430, #F7306D)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: 10,
      fontWeight: 700,
      flexShrink: 0,
      fontFamily: t.fontPrimary,
    },
    anfitrionLabel: {
      fontSize: 8,
      letterSpacing: '0.10em',
      color: t.textMuted,
      fontFamily: t.fontSecondary,
    },
    anfitrionNombre: {
      fontSize: 12,
      fontWeight: 600,
      color: t.textPrimary,
      fontFamily: t.fontSecondary,
    },

    // Info
    infoRow: {
      display: 'flex',
      gap: 12,
      marginBottom: 12,
      flexWrap: 'wrap',
    },
    infoItem: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 11,
      color: t.textSecondary,
      fontFamily: t.fontSecondary,
    },

    // Descripción
    cardDesc: {
      fontSize: 12,
      color: t.textSecondary,
      lineHeight: 1.55,
      margin: '0 0 12px 0',
      fontFamily: t.fontSecondary,
      fontStyle: 'italic',
    },

    // Tags
    tagsRow: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap',
      marginBottom: 14,
    },
    tag: {
      fontSize: 9,
      fontWeight: 600,
      letterSpacing: '0.04em',
      padding: '3px 8px',
      borderRadius: 20,
      background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
      color: t.textMuted,
      fontFamily: t.fontSecondary,
    },

    // Botones acción
    accionBtnPrimario: {
      width: '100%',
      padding: '11px 0',
      border: 'none',
      borderRadius: 10,
      background: t.primaryGradient,
      color: '#fff',
      fontFamily: t.fontPrimary,
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '0.06em',
      cursor: 'pointer',
      marginTop: 'auto',
    },
    accionBtnSecundario: {
      width: '100%',
      padding: '11px 0',
      border: `1px solid ${t.inputBorder}`,
      borderRadius: 10,
      background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
      color: t.textSecondary,
      fontFamily: t.fontPrimary,
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '0.06em',
      cursor: 'pointer',
      marginTop: 'auto',
    },
  };
};

export default StudySession;
