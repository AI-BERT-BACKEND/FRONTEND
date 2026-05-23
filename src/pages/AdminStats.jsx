import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppLayout from '../components/Layout/AppLayout';
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

const normalizeUser = (u) => ({
  id: u.id ?? u.userId ?? '',
  role: (u.userRole ?? u.role ?? 'ESTUDIANTE').toUpperCase(),
  status: (u.userStatus ?? u.status ?? 'ACTIVE').toUpperCase(),
});

const AdminStats = () => {
  const { isDark } = useTheme();
  const t = createStyles(isDark);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    profileService.getAdminUsers({})
      .then((data) => {
        const raw = Array.isArray(data) ? data : (data?.users ?? data?.content ?? []);
        setUsers(raw.map(normalizeUser));
      })
      .catch(() => setError('No se pudieron cargar las estadísticas.'))
      .finally(() => setLoading(false));
  }, []);

  const total    = users.length;
  const activos  = users.filter((u) => u.status === 'ACTIVE' || u.status === 'ACTIVO').length;
  const inactivos = total - activos;
  const admins   = users.filter((u) => u.role === 'ADMIN').length;
  const estudiantes = users.filter((u) => u.role === 'ESTUDIANTE' || u.role === 'STUDENT').length;

  const s = st(isDark, t);

  if (loading) return (
    <AppLayout>
      <div style={{ padding: 40, textAlign: 'center', fontFamily: "'Poppins',sans-serif", color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
        Cargando estadísticas...
      </div>
    </AppLayout>
  );

  return (
    <AppLayout>
      <div style={s.pageWrapper}>
        <AdminNav isDark={isDark} t={t} />

        <div style={s.pageHeader}>
          <h1 style={s.pageTitle}>Estadísticas</h1>
          <p style={s.pageDesc}>Resumen general de los usuarios registrados en la plataforma.</p>
        </div>

        {error && <div style={s.errorBanner}>{error}</div>}

        {/* ── MÉTRICAS ── */}
        <div style={s.metricsGrid}>
          {[
            { label: 'Total usuarios',      value: total,       color: '#FF8430', icon: '👥' },
            { label: 'Usuarios activos',    value: activos,     color: '#22C55E', icon: '✅' },
            { label: 'Usuarios inactivos',  value: inactivos,   color: '#F7306D', icon: '⏸️' },
            { label: 'Administradores',     value: admins,      color: '#A855F7', icon: '🛡️' },
          ].map(({ label, value, color, icon }) => (
            <div key={label} style={s.metricCard(isDark)}>
              <div style={s.metricIcon(color)}>{icon}</div>
              <div style={s.metricNum(isDark, color)}>{value}</div>
              <div style={s.metricLabel(isDark)}>{label}</div>
            </div>
          ))}
        </div>

        {/* ── DISTRIBUCIÓN ── */}
        {total > 0 && (
          <div style={s.section}>
            <h2 style={s.sectionTitle(isDark)}>Distribución por rol</h2>
            <div style={s.distRow}>

              <div style={s.distCard(isDark)}>
                <div style={s.distLabel(isDark)}>Estudiantes</div>
                <div style={s.distBar}>
                  <div style={s.distFill(isDark, '#FF8430', total > 0 ? (estudiantes / total) * 100 : 0)} />
                </div>
                <div style={s.distValues(isDark)}>
                  <span>{estudiantes} usuarios</span>
                  <span>{total > 0 ? Math.round((estudiantes / total) * 100) : 0}%</span>
                </div>
              </div>

              <div style={s.distCard(isDark)}>
                <div style={s.distLabel(isDark)}>Administradores</div>
                <div style={s.distBar}>
                  <div style={s.distFill(isDark, '#A855F7', total > 0 ? (admins / total) * 100 : 0)} />
                </div>
                <div style={s.distValues(isDark)}>
                  <span>{admins} usuarios</span>
                  <span>{total > 0 ? Math.round((admins / total) * 100) : 0}%</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── ESTADO ── */}
        {total > 0 && (
          <div style={s.section}>
            <h2 style={s.sectionTitle(isDark)}>Distribución por estado</h2>
            <div style={s.distRow}>

              <div style={s.distCard(isDark)}>
                <div style={s.distLabel(isDark)}>Activos</div>
                <div style={s.distBar}>
                  <div style={s.distFill(isDark, '#22C55E', total > 0 ? (activos / total) * 100 : 0)} />
                </div>
                <div style={s.distValues(isDark)}>
                  <span>{activos} usuarios</span>
                  <span>{total > 0 ? Math.round((activos / total) * 100) : 0}%</span>
                </div>
              </div>

              <div style={s.distCard(isDark)}>
                <div style={s.distLabel(isDark)}>Inactivos</div>
                <div style={s.distBar}>
                  <div style={s.distFill(isDark, '#F7306D', total > 0 ? (inactivos / total) * 100 : 0)} />
                </div>
                <div style={s.distValues(isDark)}>
                  <span>{inactivos} usuarios</span>
                  <span>{total > 0 ? Math.round((inactivos / total) * 100) : 0}%</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {total === 0 && !error && (
          <div style={s.emptyState(isDark)}>
            <span style={{ fontSize: 36 }}>📊</span>
            <span style={s.emptyText(isDark)}>No hay datos de usuarios disponibles</span>
          </div>
        )}

      </div>
    </AppLayout>
  );
};

const navSt = (isDark, t) => ({
  nav: {
    display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 28, padding: '6px',
    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
    borderRadius: 14,
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'}`,
    width: 'fit-content',
  },
  navItem: (isDark, active) => ({
    padding: '8px 18px', borderRadius: 10, border: 'none',
    background: active ? (isDark ? 'linear-gradient(90deg,#FF5B2E,#C4107A)' : 'linear-gradient(90deg,#FF8430,#F7306D)') : 'transparent',
    color: active ? '#fff' : (isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.50)'),
    fontSize: 13, fontWeight: active ? 700 : 500, fontFamily: "'Poppins',sans-serif",
    cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
  }),
});

const st = (isDark, t) => ({
  pageWrapper: { width: '100%' },
  pageHeader: { marginBottom: 28 },
  pageTitle: {
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    fontSize: 'clamp(24px,4vw,34px)', fontWeight: 800,
    color: isDark ? '#FF5B2E' : '#FF8430', margin: '0 0 4px', letterSpacing: '-0.02em',
  },
  pageDesc: {
    fontSize: 13, color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.50)',
    fontFamily: "'Poppins',sans-serif", margin: 0,
  },
  errorBanner: {
    padding: '12px 18px', background: 'rgba(240,7,7,0.08)',
    border: '1px solid rgba(240,7,7,0.25)', borderRadius: 12,
    color: '#F00707', fontFamily: "'Poppins',sans-serif", fontSize: 13, marginBottom: 20,
  },
  metricsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))',
    gap: 16, marginBottom: 32,
  },
  metricCard: (isDark) => ({
    background: t.cardBg, border: `1px solid ${t.cardBorder}`,
    borderRadius: 18, padding: '24px 20px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
    boxShadow: t.cardShadow,
  }),
  metricIcon: (color) => ({
    fontSize: 28, lineHeight: 1,
  }),
  metricNum: (isDark, color) => ({
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    fontSize: 'clamp(28px,4vw,40px)', fontWeight: 900,
    color, lineHeight: 1,
  }),
  metricLabel: (isDark) => ({
    fontSize: 11, fontWeight: 600, textAlign: 'center',
    color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)',
    fontFamily: "'Poppins',sans-serif",
  }),
  section: { marginBottom: 32 },
  sectionTitle: (isDark) => ({
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    fontSize: 'clamp(17px,2.5vw,20px)', fontWeight: 700,
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.85)', margin: '0 0 16px',
  }),
  distRow: { display: 'flex', gap: 16, flexWrap: 'wrap' },
  distCard: (isDark) => ({
    flex: '1 1 260px', background: t.cardBg,
    border: `1px solid ${t.cardBorder}`, borderRadius: 16,
    padding: '20px 24px', boxShadow: t.cardShadow,
    display: 'flex', flexDirection: 'column', gap: 10,
  }),
  distLabel: (isDark) => ({
    fontSize: 13, fontWeight: 700,
    color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.70)',
    fontFamily: "'Plus Jakarta Sans',sans-serif",
  }),
  distBar: {
    width: '100%', height: 8,
    background: 'rgba(128,128,128,0.15)', borderRadius: 99, overflow: 'hidden',
  },
  distFill: (isDark, color, pct) => ({
    height: '100%', width: `${pct}%`,
    background: color, borderRadius: 99, transition: 'width 0.4s',
  }),
  distValues: (isDark) => ({
    display: 'flex', justifyContent: 'space-between',
    fontSize: 12, color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)',
    fontFamily: "'Poppins',sans-serif",
  }),
  emptyState: (isDark) => ({
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: 12, padding: '60px 20px', textAlign: 'center',
  }),
  emptyText: (isDark) => ({
    fontSize: 15, fontWeight: 600,
    color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.35)',
    fontFamily: "'Plus Jakarta Sans',sans-serif",
  }),
});

export default AdminStats;
