import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { createStyles } from '../theme/createStyles';
import LogoImg from '../assets/LOGO.png';
import {
  Home, Calendar, BookOpen, Zap, Trophy,
  GraduationCap, CheckSquare, BarChart3, Settings, LogOut, User, X,
} from 'lucide-react';

const NAV_ACADEMIC = [
  { label: 'Inicio',            IconComp: Home,          path: '/dashboard'   },
  { label: 'Gestión Académica', IconComp: GraduationCap, path: '/gestion'     },
  { label: 'Materias',          IconComp: BookOpen,       path: '/materias'    },
  { label: 'Tareas',            IconComp: CheckSquare,    path: '/tareas'      },
];

const NAV_PERSONAL = [
  { label: 'Calendario',            IconComp: Calendar,  path: '/calendario'   },
  { label: 'Estadísticas',          IconComp: BarChart3,  path: '/estadisticas' },
  { label: 'Motor de Priorización', IconComp: Zap,        path: '/priorizacion' },
  { label: 'AI.BERT Juega',         IconComp: Trophy,     path: '/gamificacion' },
  { label: 'Sesión de Estudio',     IconComp: BookOpen,   path: '/sesion'       },
];

const Sidebar = ({ collapsed, onToggle, isMobile = false, mobileOpen = false, onMobileClose }) => {
  const { isDark } = useTheme();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogout, setShowLogout] = useState(false);
  const s = getStyles(isDark, collapsed, isMobile, mobileOpen);

  const getUserName = () => {
    if (!user) return 'USUARIO';
    if (user.name) return user.name;
    if (user.firstName) return user.firstName;
    if (user.email) return user.email.split('@')[0];
    return 'USUARIO';
  };

  const getUserRole = () => {
    if (!user || !user.role) return 'ESTUDIANTE';
    return user.role.toUpperCase();
  };

  const iconColor = (active) => {
    if (active) return '#FFFFFF';
    return isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.55)';
  };

  const handleLogout = () => {
    setShowLogout(false);
    logout();
    navigate('/');
  };

  const handleNavAndClose = (path) => {
    navigate(path);
    if (isMobile && onMobileClose) onMobileClose();
  };

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <>
      <aside style={s.sidebar} aria-label="Sidebar principal">

        {/* LOGO */}
        <div style={s.logoRow}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, cursor: isMobile ? 'default' : 'pointer' }}
            onClick={isMobile ? undefined : onToggle}
            role={isMobile ? undefined : 'button'}
            tabIndex={isMobile ? undefined : 0}
            onKeyDown={isMobile ? undefined : (e) => handleKeyDown(e, onToggle)}
            aria-label={isMobile ? undefined : (collapsed ? 'Expandir sidebar' : 'Contraer sidebar')}
          >
            <div style={s.logoCircle}>
              <img
                src={LogoImg}
                alt="AI.BERT Logo"
                style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 12 }}
              />
            </div>
            {!collapsed && <span style={s.logoText}>AI.BERT</span>}
          </div>
          {isMobile && (
            <button
              style={s.mobileCloseBtn}
              onClick={onMobileClose}
              aria-label="Cerrar menú"
            >
              <X size={18} color={isDark ? 'rgba(255,255,255,0.70)' : 'rgba(0,0,0,0.55)'} />
            </button>
          )}
        </div>

        {/* USER BLOCK */}
        {!collapsed && (
          <div
            style={s.userBlock}
            onClick={() => handleNavAndClose('/profile')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => handleKeyDown(e, () => handleNavAndClose('/profile'))}
            aria-label="Ir al perfil de usuario"
          >
            <div style={s.avatar}>
              <User size={20} color="#fff" />
            </div>
            <div>
              <div style={s.userName}>{getUserName()}</div>
              <div style={s.userRole}>{getUserRole()}</div>
            </div>
          </div>
        )}

        {collapsed && (
          <div
            style={s.avatarCollapsed}
            onClick={() => handleNavAndClose('/profile')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => handleKeyDown(e, () => handleNavAndClose('/profile'))}
            aria-label="Ir al perfil de usuario"
          >
            <User size={20} color="#fff" />
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
              onClick={() => handleNavAndClose(item.path)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => handleKeyDown(e, () => handleNavAndClose(item.path))}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              <item.IconComp size={17} color={iconColor(active)} />
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
              onClick={() => handleNavAndClose(item.path)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => handleKeyDown(e, () => handleNavAndClose(item.path))}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              <item.IconComp size={17} color={iconColor(active)} />
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
            onClick={() => handleNavAndClose('/configuracion')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => handleKeyDown(e, () => handleNavAndClose('/configuracion'))}
            aria-label="Configuración"
            aria-current={location.pathname === '/configuracion' ? 'page' : undefined}
          >
            <Settings size={17} color={iconColor(location.pathname === '/configuracion')} />
            {!collapsed && <span style={s.navLabel}>Configuración</span>}
          </div>
          <div
            style={s.navItem}
            onClick={() => setShowLogout(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => handleKeyDown(e, () => setShowLogout(true))}
            aria-label="Cerrar Sesión"
          >
            <LogOut size={17} color={isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.55)'} />
            {!collapsed && <span style={s.navLabel}>Cerrar Sesión</span>}
          </div>
        </div>

      </aside>

      {/* MODAL CERRAR SESIÓN */}
      {showLogout && (
        <div 
          style={s.modalOverlay} 
          onClick={() => setShowLogout(false)}
          role="presentation"
        >
          <div 
            style={s.modalCard} 
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
          >
            <div style={s.modalIconWrap}>
              <LogOut size={22} color="#fff" />
            </div>
            <h2 id="logout-title" style={s.modalTitle}>¿Estás seguro de cerrar sesión?</h2>
            <p style={s.modalDesc}>No te preocupes, tu progreso quedará guardado.</p>
            <button style={s.modalBtnPrimary} onClick={handleLogout}>
              Cerrar sesión
            </button>
            <button style={s.modalBtnCancel} onClick={() => setShowLogout(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const getStyles = (isDark, collapsed, isMobile = false, mobileOpen = false) => {
  const t = createStyles(isDark);
  return {
    sidebar: isMobile ? {
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      width: 260,
      background: isDark ? '#0F0E0F' : '#FEFBF9',
      borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}`,
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 0',
      flexShrink: 0,
      overflowY: 'auto',
      overflowX: 'hidden',
      zIndex: 20,
      transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
      transition: 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
      boxShadow: mobileOpen ? '4px 0 32px rgba(0,0,0,0.25)' : 'none',
    } : {
      width: collapsed ? 72 : 230,
      minHeight: '100vh',
      background: isDark ? '#0F0E0F' : '#FEFBF9',
      borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}`,
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 0',
      transition: t.appleTransition,
      flexShrink: 0,
      overflow: 'hidden',
      position: 'relative',
      zIndex: 10,
    },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: collapsed ? '10px 0 20px' : '10px 16px 20px',
    justifyContent: collapsed ? 'center' : 'flex-start',
    marginTop: 8,
  },
  mobileCloseBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    flexShrink: 0,
  },
  logoCircle: {
    width: collapsed ? 56 : 64,
    height: collapsed ? 56 : 64,
    borderRadius: 12,
    overflow: 'hidden',
    flexShrink: 0,
    background: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  },
  logoText: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: 800,
    fontSize: 24,
    backgroundImage: isDark
      ? 'linear-gradient(90deg, #FF5B2E, #C4107A)'
      : 'linear-gradient(90deg, #FF8430, #F7306D)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    width: 'fit-content',
    letterSpacing: '-0.02em',
    whiteSpace: 'nowrap',
  },
  userBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 16px 18px',
    cursor: 'pointer',
    borderRadius: 8,
    margin: '0 8px',
    transition: 'background 0.15s',
  },
  avatarCollapsed: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: isDark
      ? 'linear-gradient(135deg, #C4107A, #FF5B2E)'
      : 'linear-gradient(135deg, #FF8430, #F7306D)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    margin: '0 auto 14px',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: isDark
      ? 'linear-gradient(135deg, #C4107A, #FF5B2E)'
      : 'linear-gradient(135deg, #FF8430, #F7306D)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: 13,
    fontWeight: 700,
    flexShrink: 0,
  },
  userName: {
    fontSize: 13,
    fontWeight: 600,
    color: '#FFFFFF',
    fontFamily: "'Poppins', sans-serif",
    lineHeight: 1.3,
  },
  userRole: {
    fontSize: 10,
    color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.45)',
    fontFamily: "'Poppins', sans-serif",
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    lineHeight: 1.3,
  },
  divider: {
    height: 1,
    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    margin: '10px 16px',
  },
  sectionLabel: {
    fontSize: 9,
    letterSpacing: '0.10em',
    textTransform: 'uppercase',
    color: isDark ? 'rgba(255,255,255,0.30)' : 'rgba(0,0,0,0.30)',
    fontFamily: "'Poppins', sans-serif",
    padding: '6px 16px 4px',
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
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 500,
    backdropFilter: 'blur(4px)',
  },
  modalCard: {
    background: isDark ? '#1A1A1A' : '#FFFFFF',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(220,193,181,0.40)'}`,
    borderRadius: 20,
    padding: '36px 32px 28px',
    width: '100%',
    maxWidth: 340,
    margin: '0 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    boxShadow: isDark
      ? '0 0 0 1px rgba(196,16,122,0.20), 0 24px 64px rgba(0,0,0,0.80)'
      : '0 24px 64px rgba(0,0,0,0.15)',
    gap: 0,
  },
  modalIconWrap: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #FF5B2E, #C4107A)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    boxShadow: '0 8px 24px rgba(196,16,122,0.35)',
  },
  modalTitle: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 20,
    fontWeight: 800,
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
    margin: '0 0 10px 0',
    lineHeight: 1.3,
  },
  modalDesc: {
    fontSize: 13,
    color: isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.50)',
    lineHeight: 1.6,
    margin: '0 0 28px 0',
    fontFamily: "'Poppins', sans-serif",
  },
  modalBtnPrimary: {
    width: '100%',
    padding: '13px',
    border: 'none',
    borderRadius: 12,
    background: 'linear-gradient(90deg, #FF5B2E, #C4107A)',
    color: '#fff',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    marginBottom: 12,
    letterSpacing: '0.02em',
  },
  modalBtnCancel: {
    width: '100%',
    padding: '11px',
    border: 'none',
    background: 'transparent',
    color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.40)',
    fontFamily: "'Poppins', sans-serif",
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    },
  };
};

export default Sidebar;
