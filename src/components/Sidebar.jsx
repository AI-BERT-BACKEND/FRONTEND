import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoImg from '../assets/LOGO.png';

const NAV_ACADEMIC = [
  { label: 'Inicio', icon: '🏠', path: '/dashboard' },
  { label: 'Gestión Académica', icon: '🎓', path: '/gestion' },
  { label: 'Materias', icon: '📚', path: '/materias' },
  { label: 'Tareas', icon: '✅', path: '/tareas' },
];

const NAV_PERSONAL = [
  { label: 'Calendario', icon: '📅', path: '/calendario' },
  { label: 'Estadísticas', icon: '📊', path: '/estadisticas' },
  { label: 'Motor de Priorización', icon: '⚙️', path: '/priorizacion' },
  { label: 'Gamificación', icon: '🏆', path: '/gamificacion' },
  { label: 'Sesión de Estudio', icon: '📖', path: '/sesion' },
];

const Sidebar = ({ theme, collapsed, onToggle }) => {
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const location = useLocation();
  const s = getStyles(isDark, collapsed);

  return (
    <aside style={s.sidebar}>

      {/* LOGO */}
      <div style={s.logoRow} onClick={onToggle}>
        <div style={s.logoCircle}>
          <img
            src={LogoImg}
            alt="AI.BERT"
            style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 10 }}
          />
        </div>
        {!collapsed && <span style={s.logoText}>AI.BERT</span>}
      </div>

      {/* USER BLOCK */}
      {!collapsed && (
        <div style={s.userBlock} onClick={() => navigate('/profile')}>
          <div style={s.avatar}>—</div>
          <div>
            <div style={s.userName}>—</div>
            <div style={s.userRole}>ESTUDIANTE</div>
          </div>
        </div>
      )}

      {collapsed && (
        <div style={s.avatarCollapsed} onClick={() => navigate('/profile')}>
          —
        </div>
      )}

      <div style={s.divider} />

      {/* NAV ACADÉMICO */}
      {!collapsed && <div style={s.sectionLabel}>ACADÉMICO</div>}
      {NAV_ACADEMIC.map(item => {
        const active = location.pathname === item.path;
        return (
          <div
            key={item.path}
            style={{ ...s.navItem, ...(active ? s.navItemActive : {}) }}
            onClick={() => navigate(item.path)}
          >
            <span style={s.navIcon}>{item.icon}</span>
            {!collapsed && (
              <span style={{ ...s.navLabel, ...(active ? s.navLabelActive : {}) }}>
                {item.label}
              </span>
            )}
          </div>
        );
      })}

      <div style={{ ...s.divider, marginTop: 12 }} />

      {/* NAV PERSONAL */}
      {!collapsed && <div style={s.sectionLabel}>PERSONAL</div>}
      {NAV_PERSONAL.map(item => {
        const active = location.pathname === item.path;
        return (
          <div
            key={item.path}
            style={{ ...s.navItem, ...(active ? s.navItemActive : {}) }}
            onClick={() => navigate(item.path)}
          >
            <span style={s.navIcon}>{item.icon}</span>
            {!collapsed && (
              <span style={{ ...s.navLabel, ...(active ? s.navLabelActive : {}) }}>
                {item.label}
              </span>
            )}
          </div>
        );
      })}

      {/* BOTTOM */}
      <div style={s.bottomSection}>
        <div style={s.divider} />
        <div
          style={{ ...s.navItem, ...(location.pathname === '/configuracion' ? s.navItemActive : {}) }}
          onClick={() => navigate('/configuracion')}
        >
          <span style={s.navIcon}>⚙️</span>
          {!collapsed && <span style={s.navLabel}>Configuración</span>}
        </div>
        <div style={s.navItem} onClick={() => navigate('/login')}>
          <span style={s.navIcon}>🚪</span>
          {!collapsed && <span style={s.navLabel}>Cerrar Sesión</span>}
        </div>
      </div>

    </aside>
  );
};

const getStyles = (isDark, collapsed) => ({
  sidebar: {
    width: collapsed ? 64 : 220,
    minHeight: '100vh',
    background: isDark ? '#0F0E0F' : '#FEFBF9',
    borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}`,
    display: 'flex',
    flexDirection: 'column',
    padding: '16px 0',
    transition: 'width 0.3s ease',
    flexShrink: 0,
    overflow: 'hidden',
    position: 'relative',
    zIndex: 10,
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: collapsed ? '0 12px 12px' : '0 16px 12px',
    cursor: 'pointer',
    justifyContent: collapsed ? 'center' : 'flex-start',
  },
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    overflow: 'hidden',
    flexShrink: 0,
    background: isDark ? '#1a1a1a' : '#f0e0d6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: 800,
    fontSize: 16,
    background: isDark
      ? 'linear-gradient(90deg, #FF5B2E, #C4107A)'
      : 'linear-gradient(90deg, #FF8430, #F7306D)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  userBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 16px 12px',
    cursor: 'pointer',
    borderRadius: 8,
    margin: '0 8px',
    transition: 'background 0.15s',
  },
  avatarCollapsed: {
    width: 32,
    height: 32,
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
    cursor: 'pointer',
    margin: '0 auto 8px',
  },
  avatar: {
    width: 32,
    height: 32,
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
    flexShrink: 0,
  },
  userName: {
    fontSize: 11,
    fontWeight: 600,
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
    fontFamily: "'Poppins', sans-serif",
    lineHeight: 1.3,
  },
  userRole: {
    fontSize: 9,
    color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.45)',
    fontFamily: "'Poppins', sans-serif",
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    lineHeight: 1.3,
  },
  divider: {
    height: 1,
    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    margin: '4px 16px',
  },
  sectionLabel: {
    fontSize: 9,
    letterSpacing: '0.10em',
    textTransform: 'uppercase',
    color: isDark ? 'rgba(255,255,255,0.30)' : 'rgba(0,0,0,0.30)',
    fontFamily: "'Poppins', sans-serif",
    padding: '8px 16px 4px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: collapsed ? '9px 0' : '9px 16px',
    justifyContent: collapsed ? 'center' : 'flex-start',
    cursor: 'pointer',
    borderRadius: 8,
    margin: '1px 8px',
    transition: 'background 0.15s',
  },
  navItemActive: {
    background: isDark
      ? 'linear-gradient(90deg, #C4107A, #FF5B2E)'
      : 'linear-gradient(90deg, #FF8430, #F7306D)',
  },
  navIcon: {
    fontSize: 16,
    flexShrink: 0,
  },
  navLabel: {
    fontSize: 12,
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 500,
    color: isDark ? 'rgba(255,255,255,0.80)' : 'rgba(0,0,0,0.75)',
    whiteSpace: 'nowrap',
  },
  navLabelActive: {
    color: '#FFFFFF',
    fontWeight: 600,
  },
  bottomSection: {
    marginTop: 'auto',
  },
});

export default Sidebar;