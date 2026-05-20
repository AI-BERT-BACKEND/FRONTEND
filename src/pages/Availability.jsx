import React, { useState } from 'react';
import AppLayout from '../components/Layout/AppLayout';
import { useTheme } from '../context/ThemeContext';
import { createStyles } from '../theme/createStyles';

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const HORAS = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
  '19:00', '20:00', '21:00', '22:00',
];

const CATEGORIAS_INIT = [
  { id: 'libre',    label: 'Tiempo libre',       desc: 'Actividades de ocio y disfrute personal', horas: 2.0, color: '#FF8430' },
  { id: 'descanso', label: 'Descanso',            desc: 'Sueño y recuperación',                    horas: 8.0, color: '#A855F7' },
  { id: 'personal', label: 'Tiempo personal',     desc: 'Actividades personales e higiene',        horas: 2.0, color: '#F7306D' },
  { id: 'social',   label: 'Tiempo social',       desc: 'Tiempo con amigos y familia',             horas: 2.0, color: '#FF8430' },
  { id: 'estudio',  label: 'Máx. estudio por día',desc: 'Límite máximo de horas de estudio',       horas: 8.0, color: '#00CFFF' },
];

const ICONOS = {
  libre:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>,
  descanso: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  personal: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  social:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  estudio:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
};

const getWeekStart = (date) => {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
};

const formatMes = (date) =>
  date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
    .replace(/^\w/, (c) => c.toUpperCase());

const Availability = () => {
  const { isDark } = useTheme();
  const s = getStyles(isDark);

  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [selected, setSelected]   = useState(new Set());
  const [categorias, setCategorias] = useState(CATEGORIAS_INIT);
  const [saved, setSaved] = useState(false);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const toggleCell = (dayIdx, hora) => {
    const key = `${dayIdx}-${hora}`;
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const prevWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
  };

  const nextWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
  };

  const adjustHoras = (id, delta) => {
    setCategorias((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, horas: Math.max(0, Math.min(24, +(c.horas + delta).toFixed(1))) }
          : c
      )
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AppLayout>
      <div style={s.layout}>

        {/* ── IZQUIERDA: CALENDARIO SEMANAL ─────────────────── */}
        <div style={s.calSection}>

          {/* Navegación de semana */}
          <div style={s.monthNav}>
            <button style={s.navBtn} onClick={prevWeek}>← Prev</button>
            <span style={s.monthLabel}>{formatMes(weekDays[0])}</span>
            <button style={s.navBtn} onClick={nextWeek}>Sig →</button>
          </div>

          {/* Grid */}
          <div style={s.gridCard}>
            {/* Cabecera de días */}
            <div style={s.headerRow}>
              <div style={s.cornerCell} />
              {weekDays.map((d, i) => (
                <div key={i} style={s.dayHeader}>
                  <span style={s.dayName}>{DIAS[i]}</span>
                  <span style={s.dayNum}>{d.getDate()}</span>
                </div>
              ))}
            </div>

            {/* Filas de horas */}
            <div style={s.gridBody}>
              {HORAS.map((hora) => (
                <div key={hora} style={s.gridRow}>
                  <div style={s.timeLabel}>{hora}</div>
                  {weekDays.map((_, di) => {
                    const isOn = selected.has(`${di}-${hora}`);
                    return (
                      <div
                        key={di}
                        style={{ ...s.cell, ...(isOn ? s.cellOn : {}) }}
                        onClick={() => toggleCell(di, hora)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── DERECHA: PANEL DE CONFIGURACIÓN ───────────────── */}
        <div style={s.panel}>

          {/* Encabezado del panel */}
          <div style={s.panelHeader}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke={isDark ? '#FF5B2E' : '#FF8430'} strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span style={s.panelTitle}>Configura tus horas diarias</span>
          </div>
          <p style={s.panelDesc}>
            Ingresa las horas promedio que tienes disponibles por categoría.
          </p>

          {/* Lista de categorías */}
          <div style={s.catList}>
            {categorias.map((cat) => (
              <div key={cat.id} style={s.catRow}>
                <div style={{ ...s.catIcon, background: `${cat.color}22`, color: cat.color }}>
                  {ICONOS[cat.id]}
                </div>
                <div style={s.catInfo}>
                  <div style={s.catLabel}>{cat.label}</div>
                  <div style={s.catDesc}>{cat.desc}</div>
                </div>
                <div style={s.horasRow}>
                  <button style={s.horasBtn} onClick={() => adjustHoras(cat.id, -0.5)}>−</button>
                  <span style={s.horasVal}>{cat.horas.toFixed(1)}</span>
                  <button style={s.horasBtn} onClick={() => adjustHoras(cat.id, +0.5)}>+</button>
                  <span style={s.horasUnit}>horas</span>
                </div>
              </div>
            ))}
          </div>

          {/* Mensaje de guardado */}
          {saved && (
            <div style={s.successMsg}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="#22C55E" strokeWidth="1.3"/>
                <path d="M4.5 7l2 2 3-3" stroke="#22C55E" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Configuración guardada correctamente
            </div>
          )}

          {/* Botón guardar */}
          <div style={s.saveRow}>
            <button style={s.saveBtn} onClick={handleSave}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              Guardar configuración
            </button>
          </div>
        </div>

      </div>
    </AppLayout>
  );
};

const getStyles = (isDark) => {
  const t = createStyles(isDark);
  const accent = isDark ? '#FF5B2E' : '#FF8430';
  const cellBorder = isDark ? 'rgba(255,91,46,0.14)' : 'rgba(255,132,48,0.12)';

  return {
    layout: {
      display: 'flex',
      gap: 20,
      alignItems: 'flex-start',
    },

    // ── CALENDARIO ────────────────────────────────────────────
    calSection: {
      flex: 1,
      minWidth: 0,
    },
    monthNav: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    navBtn: {
      background: t.primaryGradient,
      border: 'none',
      borderRadius: 20,
      padding: '6px 16px',
      color: '#fff',
      fontFamily: t.fontPrimary,
      fontSize: 12,
      fontWeight: 700,
      cursor: 'pointer',
      letterSpacing: '0.02em',
    },
    monthLabel: {
      fontFamily: t.fontPrimary,
      fontSize: 22,
      fontWeight: 800,
      color: t.textPrimary,
    },
    gridCard: {
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: t.cardShadow,
    },
    headerRow: {
      display: 'grid',
      gridTemplateColumns: '60px repeat(7, 1fr)',
      borderBottom: `1px solid ${t.cardBorder}`,
    },
    cornerCell: {
      borderRight: `1px solid ${t.cardBorder}`,
    },
    dayHeader: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '10px 0',
      borderLeft: `1px solid ${t.cardBorder}`,
    },
    dayName: {
      fontSize: 11,
      fontWeight: 600,
      color: t.textSecondary,
      fontFamily: t.fontSecondary,
      marginBottom: 2,
    },
    dayNum: {
      fontSize: 13,
      fontWeight: 700,
      color: t.textPrimary,
      fontFamily: t.fontSecondary,
    },
    gridBody: {
      overflowY: 'auto',
      maxHeight: 440,
    },
    gridRow: {
      display: 'grid',
      gridTemplateColumns: '60px repeat(7, 1fr)',
      borderBottom: `1px solid ${cellBorder}`,
    },
    timeLabel: {
      fontSize: 10,
      color: t.textMuted,
      fontFamily: t.fontSecondary,
      padding: '12px 8px',
      borderRight: `1px solid ${t.cardBorder}`,
      display: 'flex',
      alignItems: 'flex-start',
    },
    cell: {
      height: 50,
      borderLeft: `1px solid ${cellBorder}`,
      cursor: 'pointer',
      transition: 'background 0.15s',
    },
    cellOn: {
      background: isDark ? 'rgba(196,16,122,0.22)' : 'rgba(255,132,48,0.16)',
      borderLeft: `1px solid ${isDark ? 'rgba(255,91,46,0.45)' : 'rgba(255,132,48,0.45)'}`,
    },

    // ── PANEL DERECHO ─────────────────────────────────────────
    panel: {
      width: 300,
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
      alignItems: 'center',
      gap: 8,
      paddingBottom: 14,
      borderBottom: `1px solid ${t.cardBorder}`,
      marginBottom: 0,
    },
    panelTitle: {
      fontFamily: t.fontPrimary,
      fontSize: 14,
      fontWeight: 700,
      color: t.textPrimary,
    },
    panelDesc: {
      fontSize: 11,
      color: t.textSecondary,
      lineHeight: 1.5,
      margin: '12px 0 16px',
    },
    catList: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
    },
    catRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 0',
      borderBottom: `1px solid ${t.cardBorder}`,
    },
    catIcon: {
      width: 32,
      height: 32,
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    catInfo: {
      flex: 1,
      minWidth: 0,
    },
    catLabel: {
      fontSize: 12,
      fontWeight: 600,
      color: t.textPrimary,
      fontFamily: t.fontSecondary,
    },
    catDesc: {
      fontSize: 10,
      color: t.textMuted,
      lineHeight: 1.3,
      marginTop: 2,
    },
    horasRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      flexShrink: 0,
    },
    horasBtn: {
      width: 20,
      height: 20,
      borderRadius: 4,
      border: `1px solid ${t.inputBorder}`,
      background: 'transparent',
      color: t.textSecondary,
      fontSize: 14,
      lineHeight: 1,
      cursor: 'pointer',
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    horasVal: {
      fontSize: 13,
      fontWeight: 700,
      color: accent,
      fontFamily: t.fontPrimary,
      minWidth: 28,
      textAlign: 'center',
    },
    horasUnit: {
      fontSize: 10,
      color: t.textMuted,
      fontFamily: t.fontSecondary,
    },
    successMsg: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 11,
      color: '#22C55E',
      background: 'rgba(34,197,94,0.10)',
      border: '1px solid rgba(34,197,94,0.25)',
      borderRadius: 8,
      padding: '8px 10px',
      marginTop: 14,
    },
    saveRow: {
      marginTop: 16,
      display: 'flex',
      justifyContent: 'flex-end',
    },
    saveBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      background: t.primaryGradient,
      border: 'none',
      borderRadius: 10,
      padding: '10px 18px',
      color: '#fff',
      fontFamily: t.fontPrimary,
      fontSize: 13,
      fontWeight: 700,
      cursor: 'pointer',
      letterSpacing: '0.03em',
    },
  };
};

export default Availability;
