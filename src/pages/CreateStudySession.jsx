import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/Layout/AppLayout';
import { useTheme } from '../context/ThemeContext';
import { createStyles } from '../theme/createStyles';

// ── DATOS ─────────────────────────────────────────────────────────────────────

const DURACIONES = [60, 90, 120];

const PARTICIPANTES = [
  { id: 1, nombre: 'Dra. Elena Vance', iniciales: 'EV', disponible: true  },
  { id: 2, nombre: 'Julian Richter',   iniciales: 'JR', disponible: true  },
  { id: 3, nombre: 'Sarah Kang',       iniciales: 'SK', disponible: true  },
  { id: 4, nombre: 'Marcus Thorne',    iniciales: 'MT', disponible: false },
  { id: 5, nombre: 'Lina Rossi',       iniciales: 'LR', disponible: false },
];

const SUGERENCIA_IA = {
  fecha: 'el Miércoles 15 de Noviembre',
  hora: '4:30 PM',
  participantes: 8,
  compatibilidad: 100,
};

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────

const CreateStudySession = () => {
  const { isDark } = useTheme();
  const navigate   = useNavigate();
  const s = getStyles(isDark);

  const [tema,       setTema]       = useState('');
  const [fecha,      setFecha]      = useState('2025-11-15');
  const [hora,       setHora]       = useState('14:30');
  const [duracion,   setDuracion]   = useState(90);
  const [seleccionados, setSeleccionados] = useState(new Set([2]));

  const toggleParticipante = (id, disponible) => {
    if (!disponible) return;
    setSeleccionados((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const usarSugerencia = () => {
    setFecha('2025-11-15');
    setHora('16:30');
  };

  const totalSeleccionados = seleccionados.size;

  return (
    <AppLayout>
      {/* ENCABEZADO */}
      <h1 style={s.pageTitle}>Crear sesion de estudio</h1>
      <p style={s.subtitle}>Encuentra automáticamente quién puede unirse.</p>

      {/* LAYOUT DOS COLUMNAS */}
      <div style={s.layout}>

        {/* ── IZQUIERDA: FORMULARIO ─────────────────────────── */}
        <div style={s.formPanel}>

          {/* Campo tema */}
          <div style={s.fieldGroup}>
            <label style={s.fieldLabel}>TEMA DE ESTUDIO</label>
            <input
              style={s.input}
              type="text"
              placeholder="Ej. Mecánica Cuántica Avanzada"
              value={tema}
              onChange={(e) => setTema(e.target.value)}
            />
          </div>

          {/* Fecha + Hora lado a lado */}
          <div style={s.row2}>
            <div style={s.fieldGroup}>
              <label style={s.fieldLabel}>FECHA</label>
              <input
                style={s.input}
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.fieldLabel}>HORA DE INICIO</label>
              <input
                style={s.input}
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
              />
            </div>
          </div>

          {/* Duración */}
          <div style={s.fieldGroup}>
            <label style={s.fieldLabel}>DURACIÓN ESTIMADA</label>
            <div style={s.duracionRow}>
              {DURACIONES.map((d) => (
                <button
                  key={d}
                  style={{ ...s.duracionPill, ...(duracion === d ? s.duracionPillActive : {}) }}
                  onClick={() => setDuracion(d)}
                >
                  {d} min
                </button>
              ))}
            </div>
          </div>

          {/* Tarjeta sugerencia IA */}
          <div style={s.iaCard}>
            <div style={s.iaCardTop}>
              <div style={s.iaIconRow}>
                <div style={s.iaIcon}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.5 2a2.5 2.5 0 0 1 5 0v.5"/>
                    <path d="M14.5 2.5c1.5.5 2.5 2 2.5 3.5v1a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4v-1c0-1.5 1-3 2.5-3.5"/>
                    <path d="M12 11v4"/><path d="M9 15h6"/>
                    <path d="M7 15a5 5 0 0 0 10 0"/>
                  </svg>
                </div>
                <span style={s.iaTitle}>Horario óptimo encontrado</span>
              </div>
              <span style={s.iaBadge}>RECOMENDADO</span>
            </div>

            <p style={s.iaDesc}>
              Todos los participantes están disponibles{' '}
              {SUGERENCIA_IA.fecha} a las {SUGERENCIA_IA.hora}.
            </p>

            <div style={s.iaStats}>
              <span style={s.iaStat}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                {SUGERENCIA_IA.participantes} Participantes disponibles
              </span>
              <span style={s.iaStat}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {SUGERENCIA_IA.compatibilidad}% Compatibilidad
              </span>
              <span style={s.iaStat}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                Disponibilidad completa
              </span>
            </div>

            <button style={s.iaBtn} onClick={usarSugerencia}>
              USAR ESTE HORARIO →
            </button>
          </div>
        </div>

        {/* ── DERECHA: SELECTOR DE PARTICIPANTES ────────────── */}
        <div style={s.rightPanel}>

          {/* Encabezado del panel */}
          <div style={s.panelHeader}>
            <div style={s.panelTitleRow}>
              <span style={s.panelTitle}>Selector de Participantes</span>
              <span style={s.badgeGrupo}>INTELIGENCIA DE GRUPO</span>
            </div>
            <div style={s.panelSubRow}>
              <span style={s.perfilesLabel}>
                {PARTICIPANTES.length} PERFILES COMPATIBLES ENCONTRADOS
              </span>
              <span style={s.badgeActiva}>MÍO ACTIVA</span>
            </div>
          </div>

          <div style={s.panelDivider} />

          {/* Lista de participantes */}
          <div style={s.participantesList}>
            {PARTICIPANTES.map((p) => {
              const seleccionado = seleccionados.has(p.id);
              return (
                <div
                  key={p.id}
                  style={{
                    ...s.participanteRow,
                    ...(seleccionado ? s.participanteRowSelected : {}),
                    ...(!p.disponible ? s.participanteRowDisabled : {}),
                  }}
                  onClick={() => toggleParticipante(p.id, p.disponible)}
                >
                  {/* Avatar */}
                  <div style={s.participanteAvatarWrap}>
                    <div style={s.participanteAvatar}>{p.iniciales}</div>
                    <span style={{
                      ...s.disponibilidadDot,
                      background: p.disponible ? '#22C55E' : '#F7306D',
                    }} />
                  </div>

                  {/* Info */}
                  <div style={s.participanteInfo}>
                    <div style={{
                      ...s.participanteNombre,
                      ...(!p.disponible ? s.participanteNombreDisabled : {}),
                    }}>
                      {p.nombre}
                    </div>
                    <div style={{
                      ...s.participanteEstado,
                      color: p.disponible ? '#22C55E' : isDark ? '#FF5B2E' : '#F7306D',
                    }}>
                      {p.disponible ? 'Disponible ahora' : 'OCUPADO EN ESTE HORARIO'}
                    </div>
                  </div>

                  {/* Checkbox */}
                  {p.disponible && (
                    <div style={{ ...s.checkbox, ...(seleccionado ? s.checkboxSelected : {}) }}>
                      {seleccionado && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                          stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Botón continuar */}
          <button
            style={{ ...s.continuarBtn, ...(totalSeleccionados === 0 ? s.continuarBtnDisabled : {}) }}
            onClick={() => totalSeleccionados > 0 && navigate('/sesion')}
          >
            Continuar con {totalSeleccionados} participante{totalSeleccionados !== 1 ? 's' : ''} →
          </button>
        </div>

      </div>
    </AppLayout>
  );
};

// ── ESTILOS ───────────────────────────────────────────────────────────────────

const getStyles = (isDark) => {
  const t = createStyles(isDark);
  const accent = isDark ? '#FF5B2E' : '#FF8430';

  return {
    // Encabezado
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
      margin: '0 0 24px 0',
    },

    // Layout
    layout: {
      display: 'flex',
      gap: 20,
      alignItems: 'flex-start',
    },

    // ── FORMULARIO ────────────────────────────────────────────
    formPanel: {
      flex: 1,
      minWidth: 0,
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 16,
      padding: '24px',
      boxShadow: t.cardShadow,
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
    },
    fieldGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
    },
    fieldLabel: {
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.08em',
      color: t.textMuted,
      fontFamily: t.fontSecondary,
    },
    input: {
      width: '100%',
      background: t.inputBg,
      border: `1px solid ${t.inputBorder}`,
      borderRadius: 10,
      padding: '11px 14px',
      fontFamily: t.fontSecondary,
      fontSize: 13,
      color: t.textPrimary,
      outline: 'none',
      boxSizing: 'border-box',
      transition: 'border-color 0.2s',
      colorScheme: isDark ? 'dark' : 'light',
    },
    row2: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12,
    },

    // Pills de duración
    duracionRow: {
      display: 'flex',
      gap: 8,
    },
    duracionPill: {
      flex: 1,
      padding: '10px 0',
      borderRadius: 10,
      border: `1px solid ${t.cardBorder}`,
      background: 'transparent',
      color: t.textSecondary,
      fontFamily: t.fontSecondary,
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.15s',
      textAlign: 'center',
    },
    duracionPillActive: {
      background: t.primaryGradient,
      border: 'none',
      color: '#fff',
    },

    // Tarjeta sugerencia IA
    iaCard: {
      background: isDark ? 'rgba(255,91,46,0.07)' : 'rgba(255,132,48,0.06)',
      border: `1px solid ${isDark ? 'rgba(255,91,46,0.25)' : 'rgba(255,132,48,0.22)'}`,
      borderLeft: `3px solid ${accent}`,
      borderRadius: 12,
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    },
    iaCardTop: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    iaIconRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    },
    iaIcon: {
      width: 28,
      height: 28,
      borderRadius: 8,
      background: isDark
        ? 'linear-gradient(135deg, #FF5B2E, #C4107A)'
        : 'linear-gradient(135deg, #FF8430, #F7306D)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    iaTitle: {
      fontSize: 13,
      fontWeight: 700,
      color: t.textPrimary,
      fontFamily: t.fontPrimary,
    },
    iaBadge: {
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: '0.06em',
      padding: '3px 8px',
      borderRadius: 20,
      background: isDark ? 'rgba(255,91,46,0.20)' : 'rgba(255,132,48,0.15)',
      color: accent,
      fontFamily: t.fontSecondary,
      flexShrink: 0,
    },
    iaDesc: {
      fontSize: 12,
      color: t.textSecondary,
      lineHeight: 1.5,
      margin: 0,
      fontFamily: t.fontSecondary,
    },
    iaStats: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    },
    iaStat: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 11,
      color: t.textSecondary,
      fontFamily: t.fontSecondary,
    },
    iaBtn: {
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
      marginTop: 4,
    },

    // ── PANEL DERECHO ─────────────────────────────────────────
    rightPanel: {
      width: 320,
      flexShrink: 0,
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 16,
      padding: '20px 18px',
      boxShadow: t.cardShadow,
      display: 'flex',
      flexDirection: 'column',
    },
    panelHeader: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      marginBottom: 4,
    },
    panelTitleRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
    },
    panelTitle: {
      fontFamily: t.fontPrimary,
      fontSize: 14,
      fontWeight: 700,
      color: t.textPrimary,
    },
    badgeGrupo: {
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: '0.05em',
      padding: '3px 8px',
      borderRadius: 20,
      background: isDark ? 'rgba(255,91,46,0.18)' : 'rgba(255,132,48,0.13)',
      color: accent,
      fontFamily: t.fontSecondary,
      flexShrink: 0,
    },
    panelSubRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
    },
    perfilesLabel: {
      fontSize: 9,
      fontWeight: 600,
      letterSpacing: '0.06em',
      color: t.textMuted,
      fontFamily: t.fontSecondary,
    },
    badgeActiva: {
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: '0.05em',
      padding: '3px 8px',
      borderRadius: 20,
      background: 'rgba(34,197,94,0.14)',
      color: '#22C55E',
      fontFamily: t.fontSecondary,
      flexShrink: 0,
    },
    panelDivider: {
      height: 1,
      background: t.cardBorder,
      margin: '12px 0',
    },

    // Lista participantes
    participantesList: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      flex: 1,
      marginBottom: 16,
    },
    participanteRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 10px',
      borderRadius: 10,
      cursor: 'pointer',
      transition: 'background 0.15s',
      border: '1px solid transparent',
    },
    participanteRowSelected: {
      background: isDark ? 'rgba(196,16,122,0.12)' : 'rgba(255,132,48,0.08)',
      border: `1px solid ${isDark ? 'rgba(196,16,122,0.30)' : 'rgba(255,132,48,0.28)'}`,
    },
    participanteRowDisabled: {
      opacity: 0.50,
      cursor: 'default',
    },
    participanteAvatarWrap: {
      position: 'relative',
      flexShrink: 0,
    },
    participanteAvatar: {
      width: 34,
      height: 34,
      borderRadius: '50%',
      background: isDark
        ? 'linear-gradient(135deg, #C4107A, #FF5B2E)'
        : 'linear-gradient(135deg, #FF8430, #F7306D)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: 11,
      fontWeight: 700,
      fontFamily: t.fontPrimary,
    },
    disponibilidadDot: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 9,
      height: 9,
      borderRadius: '50%',
      border: `2px solid ${t.cardBg}`,
    },
    participanteInfo: {
      flex: 1,
      minWidth: 0,
    },
    participanteNombre: {
      fontSize: 13,
      fontWeight: 600,
      color: t.textPrimary,
      fontFamily: t.fontSecondary,
    },
    participanteNombreDisabled: {
      color: t.textMuted,
    },
    participanteEstado: {
      fontSize: 10,
      fontFamily: t.fontSecondary,
      marginTop: 1,
    },

    // Checkbox
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 6,
      border: `2px solid ${t.inputBorder}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      transition: 'all 0.15s',
    },
    checkboxSelected: {
      background: isDark
        ? 'linear-gradient(135deg, #C4107A, #FF5B2E)'
        : 'linear-gradient(135deg, #FF8430, #F7306D)',
      border: 'none',
    },

    // Botón continuar
    continuarBtn: {
      width: '100%',
      padding: '13px 0',
      border: 'none',
      borderRadius: 12,
      background: t.primaryGradient,
      color: '#fff',
      fontFamily: t.fontPrimary,
      fontSize: 14,
      fontWeight: 700,
      letterSpacing: '0.04em',
      cursor: 'pointer',
    },
    continuarBtnDisabled: {
      opacity: 0.45,
      cursor: 'not-allowed',
    },
  };
};

export default CreateStudySession;
