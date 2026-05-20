import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import LogoImg from '../assets/LOGO.png';
import {
  Home,
  Calendar,
  BookOpen,
  Zap,
  Trophy,
  GraduationCap,
  CheckSquare,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';

const NAV_ACADEMIC = [
  { label: 'Inicio', IconComp: Home, path: '/dashboard' },
  { label: 'Gestión Académica', IconComp: GraduationCap, path: '/gestion' },
  { label: 'Materias', IconComp: BookOpen, path: '/materias' },
  { label: 'Tareas', IconComp: CheckSquare, path: '/tareas' },
];

const NAV_PERSONAL = [
  { label: 'Calendario', IconComp: Calendar, path: '/calendario' },
  { label: 'Estadísticas', IconComp: BarChart3, path: '/estadisticas' },
  { label: 'Motor de Priorización', IconComp: Zap, path: '/priorizacion' },
  { label: 'Gamificación', IconComp: Trophy, path: '/gamificacion' },
  { label: 'Sesión de Estudio', IconComp: BookOpen, path: '/sesion' },
];

const Sidebar = ({ collapsed, onToggle }) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const s = getStyles(isDark, collapsed);

  const iconColor = (active) => {
    if (active) return '#FFFFFF';
    return isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.55)';
  };

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
      {NAV_ACADEMIC.map((item) => {
        const active = location.pathname === item.path;
        return (
          <div
            key={item.path}
            style={{ ...s.navItem, ...(active ? s.navItemActive : {}) }}
            onClick={() => navigate(item.path)}
          >
            <item.IconComp color={iconColor(active)} />
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
      {NAV_PERSONAL.map((item) => {
        const active = location.pathname === item.path;
        return (
          <div
            key={item.path}
            style={{ ...s.navItem, ...(active ? s.navItemActive : {}) }}
            onClick={() => navigate(item.path)}
          >
            <item.IconComp color={iconColor(active)} />
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
          style={{
            ...s.navItem,
            ...(location.pathname === '/configuracion' ? s.navItemActive : {}),
          }}
          onClick={() => navigate('/configuracion')}
        >
          <Settings size={17} color={iconColor(location.pathname === '/configuracion')} />
          {!collapsed && <span style={s.navLabel}>Configuración</span>}
        </div>
        <div style={s.navItem} onClick={() => navigate('/login')}>
          <LogOut size={17} color={isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.55)'} />
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
    gap: 14,
    padding: collapsed ? '0 12px 24px' : '0 16px 24px',
    cursor: 'pointer',
    justifyContent: collapsed ? 'center' : 'flex-start',
    marginTop: 12,
  },
  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
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
    fontSize: 22,
    backgroundImage: isDark
      ? 'linear-gradient(90deg, #FF5B2E, #C4107A)'
      : 'linear-gradient(90deg, #FF8430, #F7306D)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    width: 'fit-content',
    letterSpacing: '-0.03em',
  },
  userBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '16px 16px 20px',
    cursor: 'pointer',
    borderRadius: 8,
    margin: '0 8px',
    transition: 'background 0.15s',
  },
  avatarCollapsed: {
    width: 42,
    height: 42,
    borderRadius: '50%',
    background: isDark
      ? 'linear-gradient(135deg, #C4107A, #FF5B2E)'
      : 'linear-gradient(135deg, #FF8430, #F7306D)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    margin: '0 auto 16px',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: '50%',
    background: isDark
      ? 'linear-gradient(135deg, #C4107A, #FF5B2E)'
      : 'linear-gradient(135deg, #FF8430, #F7306D)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: 14,
    fontWeight: 700,
    flexShrink: 0,
  },
  userName: {
    fontSize: 13,
    fontWeight: 600,
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
    fontFamily: "'Poppins', sans-serif",
    lineHeight: 1.3,
  },
  userRole: {
    fontSize: 10.5,
    color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.45)',
    fontFamily: "'Poppins', sans-serif",
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    lineHeight: 1.3,
  },
  divider: {
    height: 1,
    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    margin: '12px 16px',
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
