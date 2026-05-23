import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppLayout from '../components/Layout/AppLayout';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { createStyles } from '../theme/createStyles';
import profileService from '../services/profileService';

const ADMIN_SECTIONS = [
  { label: 'Inicio',              path: '/admin/perfil' },
  { label: 'Gestión de usuarios', path: '/admin/usuarios' },
  { label: 'Estadísticas',        path: '/admin/estadisticas' },
  { label: 'Configuración',       path: '/admin/configuracion' },
];

const AdminNav = ({ isDark, t }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const s = navSt(isDark, t);
  return (
    <nav style={s.nav}>
      {ADMIN_SECTIONS.map((sec) => {
        const active = location.pathname === sec.path;
        return (
          <button key={sec.path} style={s.navItem(isDark, active)} onClick={() => navigate(sec.path)}>
            {sec.label}
          </button>
        );
      })}
    </nav>
  );
};

const AdminProfile = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const t = createStyles(isDark);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.id) return;
    profileService.getAdminUserById(user.id)
      .then((data) => setProfile(data))
      .catch(() => setError('No se pudo cargar el perfil.'))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const s = st(isDark, t);

  const fullName    = profile?.fullName ?? user?.fullName ?? user?.name ?? '—';
  const email       = profile?.institutionalEmail ?? profile?.email ?? user?.email ?? '—';
  const role        = profile?.userRole ?? profile?.role ?? user?.role ?? 'ADMIN';
  const status      = profile?.userStatus ?? profile?.status ?? 'ACTIVO';
  const adminId     = profile?.id ?? user?.id ?? '—';
  const createdAt   = profile?.registrationDate ?? profile?.createdAt ?? '—';
  const lastLogin   = profile?.lastLogin ?? profile?.lastAccess ?? '—';
  const department  = profile?.department ?? profile?.academicProfile?.department ?? '—';
  const phone       = profile?.phone ?? '—';
  const position    = profile?.position ?? profile?.cargo ?? '—';
  const permissions = profile?.permissions ?? [];

  const nameParts = fullName.split(' ');
  const initials  = nameParts.length >= 2
    ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
    : fullName.slice(0, 2).toUpperCase();

  const formatDate = (val) => {
    if (!val || val === '—') return '—';
    try { return new Date(val).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }); }
    catch { return val; }
  };

  if (loading) return (
    <AppLayout>
      <div style={{ padding: 40, textAlign: 'center', fontFamily: "'Poppins',sans-serif", color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
        Cargando perfil...
      </div>
    </AppLayout>
  );

  return (
    <AppLayout>
      <div style={s.pageWrapper}>
        <AdminNav isDark={isDark} t={t} />

        <div style={s.pageHeader}>
          <h1 style={s.pageTitle}>Perfil de administrador</h1>
          <p style={s.pageDesc}>Información de tu cuenta y permisos administrativos.</p>
        </div>

        {error && <div style={s.errorBanner(isDark)}>{error}</div>}

        {/* ── TOP ROW ── */}
        <div style={s.topRow}>

          {/* Avatar card */}
          <div style={s.avatarCard}>
            <div style={s.avatarCircle(isDark)}>
              <span style={s.avatarInitials}>{initials}</span>
            </div>
            <div style={s.avatarInfo}>
              <div style={s.avatarName(isDark)}>{fullName}</div>
              <div style={s.avatarEmail(isDark)}>{email}</div>
              <div style={s.badgeRow}>
                <span style={s.adminBadge}>ADMIN</span>
                <span style={s.idBadge(isDark)}>ID: {adminId}</span>
              </div>
            </div>
            <button style={s.editBtn(isDark)} onClick={() => navigate('/profile')}>
              Editar perfil
            </button>
          </div>

          {/* Session card */}
          <div style={s.sessionCard}>
            <div style={s.sessionTitle(isDark)}>ESTADO DE SESIÓN</div>
            <div style={s.sessionRow}>
              <span style={s.sessionLabel(isDark)}>Estado actual</span>
              <span style={s.statusPill(isDark, status)}>{status}</span>
            </div>
            <div style={s.sessionRow}>
              <span style={s.sessionLabel(isDark)}>Último acceso</span>
              <span style={s.sessionValue(isDark)}>{formatDate(lastLogin)}</span>
            </div>
            <div style={s.sessionRow}>
              <span style={s.sessionLabel(isDark)}>Fecha de creación</span>
              <span style={s.sessionValue(isDark)}>{formatDate(createdAt)}</span>
            </div>
          </div>

        </div>

        {/* ── INFO GRID ── */}
        <div style={s.section}>
          <h2 style={s.sectionTitle(isDark)}>Información personal</h2>
          <div style={s.infoGrid}>
            {[
              { label: 'Nombre',                value: fullName.split(' ')[0] ?? '—' },
              { label: 'Apellido',              value: fullName.split(' ').slice(1).join(' ') || '—' },
              { label: 'Correo institucional',  value: email },
              { label: 'Cargo administrativo',  value: position },
              { label: 'Departamento',          value: department },
              { label: 'Teléfono',              value: phone },
            ].map(({ label, value }) => (
              <div key={label} style={s.infoCell(isDark)}>
                <div style={s.infoCellLabel(isDark)}>{label}</div>
                <div style={s.infoCellValue(isDark)}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PERMISOS ── */}
        {permissions.length > 0 && (
          <div style={s.section}>
            <h2 style={s.sectionTitle(isDark)}>Permisos</h2>
            <div style={s.permisosGrid}>
              {permissions.map((p, i) => (
                <div key={i} style={s.permisoCard(isDark)}>
                  <span style={s.permisoIcon}>🔑</span>
                  <span style={s.permisoLabel(isDark)}>{p?.name ?? p?.label ?? p}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
};

/* ── nav styles ── */
const navSt = (isDark, t) => ({
  nav: {
    display: 'flex',
    gap: 6,
    flexWrap: 'wrap',
    marginBottom: 28,
    padding: '6px',
    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
    borderRadius: 14,
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'}`,
    width: 'fit-content',
  },
  navItem: (isDark, active) => ({
    padding: '8px 18px',
    borderRadius: 10,
    border: 'none',
    background: active
      ? (isDark ? 'linear-gradient(90deg,#FF5B2E,#C4107A)' : 'linear-gradient(90deg,#FF8430,#F7306D)')
      : 'transparent',
    color: active ? '#fff' : (isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.50)'),
    fontSize: 13,
    fontWeight: active ? 700 : 500,
    fontFamily: "'Poppins',sans-serif",
    cursor: 'pointer',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
  }),
});

/* ── estilos ── */
const st = (isDark, t) => ({

  pageWrapper: { width: '100%' },

  pageHeader: { marginBottom: 28 },

  pageTitle: {
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    fontSize: 'clamp(24px,4vw,34px)',
    fontWeight: 800,
    color: isDark ? '#FF5B2E' : '#FF8430',
    margin: '0 0 4px',
    letterSpacing: '-0.02em',
  },

  pageDesc: {
    fontSize: 13,
    color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.50)',
    fontFamily: "'Poppins',sans-serif",
    margin: 0,
  },

  errorBanner: (isDark) => ({
    padding: '12px 18px',
    background: 'rgba(240,7,7,0.08)',
    border: '1px solid rgba(240,7,7,0.25)',
    borderRadius: 12,
    color: '#F00707',
    fontFamily: "'Poppins',sans-serif",
    fontSize: 13,
    marginBottom: 20,
  }),

  topRow: {
    display: 'flex',
    gap: 20,
    flexWrap: 'wrap',
    marginBottom: 32,
    alignItems: 'stretch',
  },

  avatarCard: {
    flex: '1 1 380px',
    background: isDark
      ? 'linear-gradient(135deg,#1A0A0A 0%,#1F0F1A 100%)'
      : 'linear-gradient(135deg,#FFF5F0 0%,#FFF0F5 100%)',
    border: `1px solid ${isDark ? 'rgba(196,16,122,0.25)' : 'rgba(255,132,48,0.25)'}`,
    borderRadius: 20,
    padding: '28px 32px',
    display: 'flex',
    alignItems: 'center',
    gap: 24,
    flexWrap: 'wrap',
    boxShadow: isDark
      ? '0 0 0 1px rgba(196,16,122,0.15), 0 8px 32px rgba(0,0,0,0.40)'
      : '0 8px 32px rgba(255,132,48,0.12)',
  },

  avatarCircle: (isDark) => ({
    width: 72,
    height: 72,
    borderRadius: '50%',
    background: isDark
      ? 'linear-gradient(135deg,#FF5B2E,#C4107A)'
      : 'linear-gradient(135deg,#FF8430,#F7306D)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: isDark ? '0 4px 16px rgba(196,16,122,0.40)' : '0 4px 16px rgba(247,48,109,0.25)',
  }),

  avatarInitials: {
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    fontSize: 26,
    fontWeight: 900,
    color: '#fff',
    letterSpacing: '-0.02em',
  },

  avatarInfo: { flex: 1, minWidth: 0 },

  avatarName: (isDark) => ({
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    fontSize: 20,
    fontWeight: 800,
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.87)',
    marginBottom: 4,
    lineHeight: 1.2,
  }),

  avatarEmail: (isDark) => ({
    fontFamily: "'Poppins',sans-serif",
    fontSize: 13,
    color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.50)',
    marginBottom: 10,
  }),

  badgeRow: { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' },

  adminBadge: {
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: '0.10em',
    color: '#fff',
    background: 'linear-gradient(90deg,#FF5B2E,#C4107A)',
    padding: '3px 10px',
    borderRadius: 99,
    fontFamily: "'Poppins',sans-serif",
  },

  idBadge: (isDark) => ({
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.04em',
    color: isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.45)',
    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    padding: '3px 10px',
    borderRadius: 99,
    fontFamily: "'Poppins',sans-serif",
  }),

  editBtn: (isDark) => ({
    background: isDark
      ? 'linear-gradient(90deg,#FF5B2E,#C4107A)'
      : 'linear-gradient(90deg,#FF8430,#F7306D)',
    border: 'none',
    borderRadius: 12,
    padding: '10px 22px',
    color: '#fff',
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    alignSelf: 'center',
    boxShadow: isDark ? '0 4px 16px rgba(196,16,122,0.35)' : '0 4px 16px rgba(247,48,109,0.25)',
  }),

  sessionCard: {
    flex: '0 1 280px',
    background: t.cardBg,
    border: `1px solid ${t.cardBorder}`,
    borderRadius: 20,
    padding: '22px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    boxShadow: t.cardShadow,
  },

  sessionTitle: (isDark) => ({
    fontSize: 10,
    letterSpacing: '0.12em',
    fontWeight: 700,
    color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.40)',
    fontFamily: "'Poppins',sans-serif",
  }),

  sessionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },

  sessionLabel: (isDark) => ({
    fontSize: 12,
    color: isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.45)',
    fontFamily: "'Poppins',sans-serif",
  }),

  sessionValue: (isDark) => ({
    fontSize: 12,
    fontWeight: 600,
    color: isDark ? 'rgba(255,255,255,0.80)' : 'rgba(0,0,0,0.75)',
    fontFamily: "'Poppins',sans-serif",
    textAlign: 'right',
  }),

  statusPill: (isDark, status) => {
    const active = status === 'ACTIVO' || status === 'ACTIVE';
    return {
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.06em',
      color: active ? '#22C55E' : 'rgba(200,200,200,0.7)',
      background: active ? 'rgba(34,197,94,0.12)' : 'rgba(150,150,150,0.10)',
      border: `1px solid ${active ? 'rgba(34,197,94,0.30)' : 'rgba(150,150,150,0.20)'}`,
      padding: '3px 10px',
      borderRadius: 99,
      fontFamily: "'Poppins',sans-serif",
    };
  },

  section: { marginBottom: 32 },

  sectionTitle: (isDark) => ({
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    fontSize: 'clamp(17px,2.5vw,20px)',
    fontWeight: 700,
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
    margin: '0 0 16px',
  }),

  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))',
    gap: 14,
  },

  infoCell: (isDark) => ({
    background: t.cardBg,
    border: `1px solid ${t.cardBorder}`,
    borderRadius: 14,
    padding: '16px 20px',
    boxShadow: t.cardShadow,
  }),

  infoCellLabel: (isDark) => ({
    fontSize: 10,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    fontWeight: 700,
    color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
    fontFamily: "'Poppins',sans-serif",
    marginBottom: 6,
  }),

  infoCellValue: (isDark) => ({
    fontSize: 14,
    fontWeight: 600,
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)',
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    wordBreak: 'break-all',
  }),

  permisosGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
  },

  permisoCard: (isDark) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 16px',
    background: isDark ? 'rgba(255,132,48,0.06)' : 'rgba(255,132,48,0.06)',
    border: `1px solid ${isDark ? 'rgba(255,132,48,0.18)' : 'rgba(255,132,48,0.22)'}`,
    borderRadius: 10,
  }),

  permisoIcon: { fontSize: 14 },

  permisoLabel: (isDark) => ({
    fontSize: 12,
    fontWeight: 600,
    color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.70)',
    fontFamily: "'Poppins',sans-serif",
  }),
});

export default AdminProfile;
