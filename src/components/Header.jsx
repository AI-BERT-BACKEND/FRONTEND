import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Bell, Users, ClipboardList, Calendar, TrendingDown, Trophy } from 'lucide-react';
import SocialPopup from './SocialPopup';
import ThemeToggle from './ThemeToggle';
import { createStyles } from '../theme/createStyles';

/* ── Notificaciones data ── */
const NOTIFICACIONES = [
  {
    id: 1,
    icon: ClipboardList,
    iconBg: 'rgba(255,132,48,0.15)',
    titulo: 'Resolver ejercicios de cálculo integral',
    tiempo: 'Hace 5 min',
    tag: null,
  },
  {
    id: 2,
    icon: Calendar,
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
    iconBg: 'rgba(255,91,46,0.12)',
    titulo: 'ALBERT recomienda tu sesión de estudio',
    tiempo: 'Hace 2h',
    tag: null,
  },
  {
    id: 4,
    icon: TrendingDown,
    iconBg: 'rgba(196,16,122,0.15)',
    titulo: 'Rendimiento bajo en Historia Moderna',
    tiempo: 'Hace 4h',
    tag: null,
  },
  {
    id: 5,
    icon: Trophy,
    iconBg: 'rgba(255,91,46,0.15)',
    titulo: 'Llevas 5 días consecutivos estudiando',
    tiempo: 'Hace 6h',
    tag: '¡Sigue así!',
    tagColor: '#FF8430',
  },
];

const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const [showNotif, setShowNotif] = useState(false);
  const [showSocial, setShowSocial] = useState(false);
  const notifRef = useRef(null);
  const socialRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (socialRef.current && !socialRef.current.contains(e.target)) setShowSocial(false);
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
        <ThemeToggle isDark={isDark} onToggle={toggleTheme} variant="inline" />

        {/* BELL + NOTIF POPUP */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            style={s.iconBtn}
            onClick={() => {
              setShowNotif((p) => !p);
              setShowSocial(false);
            }}
            aria-label="Notificaciones"
            aria-expanded={showNotif}
            aria-haspopup="true"
          >
            <Bell size={20} color={isDark ? '#FF5B2E' : '#FF8430'} strokeWidth={2} />
            <span style={s.badge}>5</span>
          </button>

          {showNotif && (
            <div style={s.notifPopup}>
              <div style={s.notifHeader}>
                <div style={s.notifTitleRow}>
                  <Bell size={20} color={isDark ? '#FF5B2E' : '#FF8430'} strokeWidth={2} />
                  <span style={s.notifTitle}>Notificaciones</span>
                </div>
                <span style={s.notifCount}>5</span>
              </div>
              <div style={s.notifList}>
                {NOTIFICACIONES.map((n) => (
                  <div key={n.id} style={s.notifItem}>
                    <div style={{ ...s.notifIconWrap, background: n.iconBg }}>
                      {n.isLogo ? (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 800,
                            color: isDark ? '#FF5B2E' : '#FF8430',
                            fontFamily: "'Plus Jakarta Sans',sans-serif",
                          }}
                        >
                          AI
                        </span>
                      ) : (
                        <n.icon size={16} color={isDark ? '#FF5B2E' : '#FF8430'} strokeWidth={2.5} />
                      )}
                    </div>
                    <div style={s.notifContent}>
                      <div style={s.notifTexto}>{n.titulo}</div>
                      <div style={s.notifMeta}>
                        {n.tag && (
                          <span style={{ ...s.notifTag, color: n.tagColor }}>{n.tag} • </span>
                        )}
                        <span style={s.notifTiempo}>{n.tiempo}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SOCIAL BUTTON + POPUP */}
        <div style={{ position: 'relative' }} ref={socialRef}>
          <button
            style={s.socialBtn}
            onClick={() => {
              setShowSocial((p) => !p);
              setShowNotif(false);
            }}
            aria-label="Menú social"
            aria-expanded={showSocial}
            aria-haspopup="true"
          >
            <Users size={15} color="#fff" strokeWidth={2} /> Social
          </button>
          {showSocial && <SocialPopup onClose={() => setShowSocial(false)} />}
        </div>
      </div>
    </div>
  );
};

const getStyles = (isDark) => {
  const t = createStyles(isDark);
  return {
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
      transition: t.appleTransition,
    },
    topbarRight: { display: 'flex', alignItems: 'center', gap: 10 },
    iconBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '4px 6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      transition: t.appleTransition,
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
      transition: t.appleTransition,
    },

    /* NOTIF POPUP */
    notifPopup: {
      position: 'absolute',
      top: 'calc(100% + 10px)',
      right: 0,
      width: 350,
      background: isDark ? '#171717' : '#FFFFFF',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(220,193,181,0.40)'}`,
      borderRadius: 16,
      boxShadow: isDark
        ? '0 0 0 1px rgba(196,16,122,0.20), 0 16px 48px rgba(0,0,0,0.70)'
        : '0 16px 48px rgba(0,0,0,0.12)',
      zIndex: 100,
      overflow: 'hidden',
      animation: 'appleFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
    },
    notifHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 18px 12px',
      borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
    },
    notifTitleRow: { display: 'flex', alignItems: 'center', gap: 8 },
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
    notifList: { maxHeight: 320, overflowY: 'auto', padding: '6px 0' },
    notifItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      padding: '10px 18px',
      cursor: 'pointer',
      transition: 'background 0.2s ease',
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
    notifContent: { flex: 1, minWidth: 0 },
    notifTexto: {
      fontSize: 12,
      fontWeight: 600,
      color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
      lineHeight: 1.4,
      marginBottom: 3,
      fontFamily: "'Poppins', sans-serif",
    },
    notifMeta: { display: 'flex', alignItems: 'center', gap: 2 },
    notifTag: { fontSize: 10, fontWeight: 600, fontFamily: "'Poppins', sans-serif" },
    notifTiempo: {
      fontSize: 10,
      color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.40)',
      fontFamily: "'Poppins', sans-serif",
    },
  };
};

export default Header;
