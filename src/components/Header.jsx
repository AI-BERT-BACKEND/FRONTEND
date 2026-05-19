import React, { useState, useRef, useEffect } from 'react';

/* ── Icons ── */
const BellIcon = ({ isDark }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <linearGradient id="bellGradHeader" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={isDark ? '#FF5B2E' : '#FF8430'} />
        <stop offset="100%" stopColor={isDark ? '#C4107A' : '#F7306D'} />
      </linearGradient>
    </defs>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="url(#bellGradHeader)" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="url(#bellGradHeader)" />
  </svg>
);

const SocialIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

/* ── Notificaciones data ── */
const NOTIFICACIONES = [
  {
    id: 1,
    icon: '📋',
    iconBg: 'rgba(255,132,48,0.15)',
    titulo: 'Resolver ejercicios de cálculo integral',
    tiempo: 'Hace 5 min',
    tag: null,
  },
  {
    id: 2,
    icon: '📅',
    iconBg: 'rgba(247,48,109,0.15)',
    titulo: 'Mañana vence el taller de Matemáticas',
    tiempo: 'Hace 1h',
    tag: 'Prioridad Alta',
    tagColor: '#F7306D',
  },
  {
    id: 3,
    icon: null,
    isLogo: true,
    titulo: 'ALBERT recomienda tu sesión de estudio',
    tiempo: 'Hace 2h',
    tag: null,
  },
  {
    id: 4,
    icon: '📉',
    iconBg: 'rgba(196,16,122,0.15)',
    titulo: 'Rendimiento bajo en Historia Moderna',
    tiempo: 'Hace 4h',
    tag: null,
  },
  {
    id: 5,
    icon: '🏆',
    iconBg: 'rgba(255,91,46,0.15)',
    titulo: 'Llevas 5 días consecutivos estudiando',
    tiempo: 'Hace 6h',
    tag: '¡Sigue así!',
    tagColor: '#FF8430',
  },
];

const Header = ({ theme, onToggleTheme }) => {
  const isDark = theme === 'dark';
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const s = getStyles(isDark);

  return (
    <div style={s.topbar}>
      <div />
      <div style={s.topbarRight}>
        {/* THEME TOGGLE */}
        <button style={s.themeBtn} onClick={onToggleTheme}>
          <span style={{ fontSize: 15 }}>{isDark ? '☀️' : '🌙'}</span>
          <span style={{ fontSize: 12 }}>{isDark ? 'Modo claro' : 'Modo oscuro'}</span>
        </button>

        {/* BELL + POPUP */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button style={s.iconBtn} onClick={() => setShowNotif(p => !p)}>
            <BellIcon isDark={isDark} />
            <span style={s.badge}>5</span>
          </button>

          {showNotif && (
            <div style={s.notifPopup}>
              {/* HEADER DEL POPUP */}
              <div style={s.notifHeader}>
                <div style={s.notifTitleRow}>
                  <BellIcon isDark={isDark} />
                  <span style={s.notifTitle}>Notificaciones</span>
                </div>
                <span style={s.notifCount}>5</span>
              </div>

              {/* LISTA */}
              <div style={s.notifList}>
                {NOTIFICACIONES.map(n => (
                  <div key={n.id} style={s.notifItem}>
                    {/* ICONO */}
                    <div style={{ ...s.notifIconWrap, background: n.iconBg || 'rgba(255,132,48,0.12)' }}>
                      {n.isLogo ? (
                        <span style={{ fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, color: isDark ? '#FF5B2E' : '#FF8430', fontSize: 10 }}>AI</span>
                      ) : (
                        <span style={{ fontSize: 14 }}>{n.icon}</span>
                      )}
                    </div>
                    {/* CONTENIDO */}
                    <div style={s.notifContent}>
                      <div style={s.notifTexto}>{n.titulo}</div>
                      <div style={s.notifMeta}>
                        {n.tag && <span style={{ ...s.notifTag, color: n.tagColor }}>{n.tag} • </span>}
                        <span style={s.notifTiempo}>{n.tiempo}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* FOOTER */}
              <div style={s.notifFooter}>
                <button style={s.verTodasBtn}>VER TODAS</button>
              </div>
            </div>
          )}
        </div>

        {/* SOCIAL */}
        <button style={s.socialBtn}>
          <SocialIcon />
          Social
        </button>
      </div>
    </div>
  );
};

const getStyles = (isDark) => ({
  topbar: {
    height: 56,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 28px',
    borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
    backgroundColor: isDark ? '#0F0E0F' : '#FEFBF9',
    position: 'sticky',
    top: 0,
    zIndex: 5,
  },
  topbarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  themeBtn: {
    background: isDark ? '#171717' : '#FEFAF9',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(220,193,181,0.30)'}`,
    borderRadius: 50,
    padding: '5px 14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontFamily: "'Poppins', sans-serif",
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
    fontSize: 12,
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px 6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: '50%',
    background: isDark ? '#C4107A' : '#F7306D',
    color: '#fff',
    fontSize: 8,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Poppins', sans-serif",
  },
  socialBtn: {
    background: isDark
      ? 'linear-gradient(90deg, #C4107A, #FF5B2E)'
      : 'linear-gradient(90deg, #FF8430, #F7306D)',
    border: 'none',
    borderRadius: 20,
    padding: '7px 16px',
    color: '#fff',
    fontFamily: "'Poppins', sans-serif",
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },

  /* ── POPUP ── */
  notifPopup: {
    position: 'absolute',
    top: 'calc(100% + 10px)',
    right: 0,
    width: 320,
    background: isDark ? '#171717' : '#FFFFFF',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(220,193,181,0.40)'}`,
    borderRadius: 16,
    boxShadow: isDark
      ? '0 0 0 1px rgba(196,16,122,0.20), 0 16px 48px rgba(0,0,0,0.70)'
      : '0 16px 48px rgba(0,0,0,0.12)',
    zIndex: 100,
    overflow: 'hidden',
  },
  notifHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 18px 12px',
    borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
  },
  notifTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  notifTitle: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 15,
    fontWeight: 700,
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
  },
  notifCount: {
    background: isDark ? '#C4107A' : '#F7306D',
    color: '#fff',
    fontSize: 10,
    fontWeight: 700,
    borderRadius: '50%',
    width: 20,
    height: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Poppins', sans-serif",
  },
  notifList: {
    maxHeight: 320,
    overflowY: 'auto',
    padding: '6px 0',
  },
  notifItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '10px 18px',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  notifIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  notifContent: {
    flex: 1,
    minWidth: 0,
  },
  notifTexto: {
    fontSize: 12,
    fontWeight: 600,
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
    lineHeight: 1.4,
    marginBottom: 3,
    fontFamily: "'Poppins', sans-serif",
  },
  notifMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  },
  notifTag: {
    fontSize: 10,
    fontWeight: 600,
    fontFamily: "'Poppins', sans-serif",
  },
  notifTiempo: {
    fontSize: 10,
    color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.40)',
    fontFamily: "'Poppins', sans-serif",
  },
  notifFooter: {
    borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
    padding: '10px 18px',
    textAlign: 'center',
  },
  verTodasBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: isDark ? '#FF5B2E' : '#F7306D',
    fontFamily: "'Poppins', sans-serif",
  },
});

export default Header;