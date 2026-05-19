import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoImg from '../assets/LOGO.png';

const Icon = ({ children, size = 17, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color || 'currentColor'} strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {children}
  </svg>
);

const HomeIcon         = (p) => <Icon {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></Icon>;
const GestionIcon      = (p) => <Icon {...p}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></Icon>;
const MateriasIcon     = (p) => <Icon {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></Icon>;
const TareasIcon       = (p) => <Icon {...p}><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></Icon>;
const CalendarioIcon   = (p) => <Icon {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></Icon>;
const EstadisticasIcon = (p) => <Icon {...p}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></Icon>;
const PriorizacionIcon = (p) => <Icon {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></Icon>;
const GamificacionIcon = (p) => <Icon {...p}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></Icon>;
const SesionIcon       = (p) => <Icon {...p}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></Icon>;
const ConfigIcon       = (p) => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></Icon>;
const LogoutIcon       = (p) => <Icon {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></Icon>;

const NAV_ACADEMIC = [
  { label: 'Inicio',              IconComp: HomeIcon,         path: '/dashboard'   },
  { label: 'Gestión Académica',   IconComp: GestionIcon,      path: '/gestion'     },
  { label: 'Materias',            IconComp: MateriasIcon,     path: '/materias'    },
  { label: 'Tareas',              IconComp: TareasIcon,       path: '/tareas'      },
];

const NAV_PERSONAL = [
  { label: 'Calendario',          IconComp: CalendarioIcon,   path: '/calendario'  },
  { label: 'Estadísticas',        IconComp: EstadisticasIcon, path: '/estadisticas'},
  { label: 'Motor de Priorización', IconComp: PriorizacionIcon, path: '/priorizacion'},
  { label: 'Gamificación',        IconComp: GamificacionIcon, path: '/gamificacion'},
  { label: 'Sesión de Estudio',   IconComp: SesionIcon,       path: '/sesion'      },
];

const Sidebar = ({ theme, collapsed, onToggle }) => {
  const isDark = theme === 'dark';
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
      {NAV_ACADEMIC.map(item => {
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
      {NAV_PERSONAL.map(item => {
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
          style={{ ...s.navItem, ...(location.pathname === '/configuracion' ? s.navItemActive : {}) }}
          onClick={() => navigate('/configuracion')}
        >
          <ConfigIcon color={iconColor(location.pathname === '/configuracion')} />
          {!collapsed && <span style={s.navLabel}>Configuración</span>}
        </div>
        <div style={s.navItem} onClick={() => navigate('/login')}>
          <LogoutIcon color={isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.55)'} />
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