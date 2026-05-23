import React, { useState, useEffect, useMemo } from 'react';
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

const EMAIL_RE = /^[^@]+@mail\.escuelaing\.edu\.co$/i;

const normalizeUser = (u) => ({
  id:        u.id ?? u.userId ?? '',
  fullName:  u.fullName ?? u.name ?? (`${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || '—'),
  email:     u.institutionalEmail ?? u.email ?? '—',
  role:      (u.userRole ?? u.role ?? 'ESTUDIANTE').toUpperCase(),
  status:    (u.userStatus ?? u.status ?? 'ACTIVE').toUpperCase(),
  createdAt: u.registrationDate ?? u.createdAt ?? u.createdDate ?? '',
  lastLogin: u.lastLogin ?? u.lastAccess ?? '',
  academicProfile: u.academicProfile ?? {},
  raw: u,
});

const initials = (name) => {
  const parts = name.trim().split(' ').filter(Boolean);
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
};

const fmtDate = (val) => {
  if (!val) return '—';
  try { return new Date(val).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' }); }
  catch { return val; }
};

/* ── AdminNav ── */
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

/* ── MODAL DETALLE ── */
const ModalDetalle = ({ user, isDark, t, onClose }) => {
  const s = modalSt(isDark, t);
  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.card} onClick={(e) => e.stopPropagation()}>
        <div style={s.header}>
          <h3 style={s.title(isDark)}>Detalle de usuario</h3>
          <button style={s.closeBtn(isDark)} onClick={onClose}>✕</button>
        </div>
        <div style={s.avatarRow}>
          <div style={s.avatarCircle(isDark)}>{initials(user.fullName)}</div>
          <div>
            <div style={s.userName(isDark)}>{user.fullName}</div>
            <div style={s.userEmail(isDark)}>{user.email}</div>
          </div>
        </div>
        <div style={s.fieldGrid}>
          {[
            { label: 'ID de usuario', value: user.id },
            { label: 'Rol',           value: user.role },
            { label: 'Estado',        value: user.status },
            { label: 'Registro',      value: fmtDate(user.createdAt) },
            { label: 'Último acceso', value: fmtDate(user.lastLogin) },
          ].map(({ label, value }) => (
            <div key={label} style={s.field(isDark)}>
              <div style={s.fieldLabel(isDark)}>{label}</div>
              <div style={s.fieldValue(isDark)}>{value || '—'}</div>
            </div>
          ))}
        </div>
        <div style={s.footer}>
          <button style={s.cancelBtn(isDark)} onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

/* ── MODAL EDITAR ── */
const ModalEditar = ({ user, isDark, t, onClose, onSave }) => {
  const s = modalSt(isDark, t);
  const [form, setForm]       = useState({ fullName: user.fullName, institutionalEmail: user.email });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const nameErr  = form.fullName.trim().length < 3 || form.fullName.trim().length > 100;
  const emailErr = !EMAIL_RE.test(form.email ?? form.institutionalEmail ?? '');

  const validate = () => {
    if (form.fullName.trim().length < 3)   return 'El nombre debe tener al menos 3 caracteres.';
    if (form.fullName.trim().length > 100) return 'El nombre no puede superar 100 caracteres.';
    if (!EMAIL_RE.test(form.institutionalEmail)) return 'El correo debe ser @mail.escuelaing.edu.co';
    return '';
  };

  const handleSave = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true); setError('');
    try {
      await onSave(user.id, { fullName: form.fullName.trim(), institutionalEmail: form.institutionalEmail.trim() });
      onClose();
    } catch (e) {
      setError(e?.response?.data?.message ?? 'No se pudo guardar los cambios.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.card} onClick={(e) => e.stopPropagation()}>
        <div style={s.header}>
          <h3 style={s.title(isDark)}>Editar usuario</h3>
          <button style={s.closeBtn(isDark)} onClick={onClose}>✕</button>
        </div>

        {error && <div style={s.errorBanner}>{error}</div>}

        {/* readonly fields */}
        <div style={s.fieldGrid}>
          {[
            { label: 'ID de usuario', value: user.id },
            { label: 'Rol',           value: user.role },
            { label: 'Estado',        value: user.status },
          ].map(({ label, value }) => (
            <div key={label} style={s.field(isDark)}>
              <div style={s.fieldLabel(isDark)}>{label}</div>
              <div style={{ ...s.fieldValue(isDark), opacity: 0.6 }}>{value || '—'}</div>
            </div>
          ))}
        </div>
        <div style={s.roNote(isDark)}>El rol y el estado se gestionan por separado desde las acciones de la tabla.</div>

        {/* editable fields */}
        <div style={s.editFieldGroup}>
          <label style={s.editLabel(isDark)}>Nombre completo</label>
          <input
            style={{ ...s.editInput(isDark), borderColor: form.fullName.trim().length > 0 && nameErr ? '#F00707' : undefined }}
            value={form.fullName}
            onChange={(e) => { setForm((f) => ({ ...f, fullName: e.target.value })); setError(''); }}
            maxLength={100}
          />
          {form.fullName.trim().length > 0 && nameErr && (
            <span style={s.inputHint}>Entre 3 y 100 caracteres</span>
          )}
        </div>

        <div style={s.editFieldGroup}>
          <label style={s.editLabel(isDark)}>Correo institucional</label>
          <input
            style={{ ...s.editInput(isDark), borderColor: form.institutionalEmail.length > 0 && !EMAIL_RE.test(form.institutionalEmail) ? '#F00707' : undefined }}
            value={form.institutionalEmail}
            onChange={(e) => { setForm((f) => ({ ...f, institutionalEmail: e.target.value })); setError(''); }}
            type="email"
          />
          {form.institutionalEmail.length > 0 && !EMAIL_RE.test(form.institutionalEmail) && (
            <span style={s.inputHint}>Debe terminar en @mail.escuelaing.edu.co</span>
          )}
        </div>

        <div style={s.footer}>
          <button style={s.cancelBtn(isDark)} onClick={onClose} disabled={loading}>Cancelar</button>
          <button style={s.saveBtn(isDark)} onClick={handleSave} disabled={loading}>
            {loading ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── MODAL ELIMINAR ── */
const ModalEliminar = ({ user, isDark, t, onClose, onConfirm }) => {
  const s = modalSt(isDark, t);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleConfirm = async () => {
    setLoading(true); setError('');
    try {
      await onConfirm(user.id);
      onClose();
    } catch (e) {
      setError(e?.response?.data?.message ?? 'No se pudo eliminar el usuario.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.card} onClick={(e) => e.stopPropagation()}>
        <div style={s.header}>
          <h3 style={{ ...s.title(isDark), color: '#F00707' }}>Eliminar usuario</h3>
          <button style={s.closeBtn(isDark)} onClick={onClose}>✕</button>
        </div>

        <div style={s.warnBox}>
          <span style={{ fontSize: 28 }}>⚠️</span>
          <div>
            <div style={s.warnTitle}>Esta acción es irreversible</div>
            <div style={s.warnDesc}>
              Se eliminará permanentemente la cuenta de <strong>{user.fullName}</strong> ({user.email}).
              No podrá recuperarse.
            </div>
          </div>
        </div>

        {error && <div style={s.errorBanner}>{error}</div>}

        <div style={s.footer}>
          <button style={s.cancelBtn(isDark)} onClick={onClose} disabled={loading}>Cancelar</button>
          <button style={s.dangerBtn} onClick={handleConfirm} disabled={loading}>
            {loading ? 'Eliminando…' : 'Confirmar eliminación'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── COMPONENTE PRINCIPAL ── */
const AdminUsers = () => {
  const { isDark } = useTheme();
  const { user: authUser } = useAuth();
  const t = createStyles(isDark);

  const [loading, setLoading]         = useState(true);
  const [users, setUsers]             = useState([]);
  const [error, setError]             = useState('');
  const [search, setSearch]           = useState('');
  const [roleFilter, setRoleFilter]   = useState('TODOS');
  const [statusFilter, setStatusFilter] = useState('TODOS');
  const [page, setPage]               = useState(1);
  const PER_PAGE = 10;

  const [detailModal, setDetailModal] = useState(null);
  const [editModal, setEditModal]     = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  const loadUsers = () => {
    setLoading(true);
    profileService.getAdminUsers({})
      .then((data) => {
        const raw = Array.isArray(data) ? data : (data?.users ?? data?.content ?? []);
        setUsers(raw.map(normalizeUser));
      })
      .catch(() => setError('No se pudo cargar el listado de usuarios.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadUsers(); }, []); // eslint-disable-line react-hooks/set-state-in-effect

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      const matchSearch = !q || u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchRole   = roleFilter === 'TODOS' || u.role === roleFilter;
      const matchStatus = statusFilter === 'TODOS'
        || (statusFilter === 'ACTIVO'   && (u.status === 'ACTIVE' || u.status === 'ACTIVO'))
        || (statusFilter === 'INACTIVO' && (u.status === 'INACTIVE' || u.status === 'INACTIVO'));
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalPages   = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage     = Math.min(page, totalPages);
  const paginated    = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const total   = users.length;
  const activos = users.filter((u) => u.status === 'ACTIVE' || u.status === 'ACTIVO').length;
  const admins  = users.filter((u) => u.role === 'ADMIN').length;

  const setActionBusy = (id, val) => setActionLoading((prev) => ({ ...prev, [id]: val }));

  const handleStatusToggle = async (u) => {
    const newStatus = (u.status === 'ACTIVE' || u.status === 'ACTIVO') ? 'INACTIVE' : 'ACTIVE';
    setActionBusy(u.id, true);
    try {
      await profileService.updateAdminUserStatus(u.id, newStatus);
      setUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, status: newStatus } : x));
    } catch { setError('No se pudo cambiar el estado del usuario.'); }
    finally { setActionBusy(u.id, false); }
  };

  const handleRoleChange = async (u, newRole) => {
    setActionBusy(u.id, true);
    try {
      await profileService.updateAdminUserRole(u.id, { role: newRole });
      setUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, role: newRole.toUpperCase() } : x));
    } catch { setError('No se pudo cambiar el rol del usuario.'); }
    finally { setActionBusy(u.id, false); }
  };

  const handleEdit = async (userId, payload) => {
    await profileService.updateAdminUser(userId, payload);
    setUsers((prev) => prev.map((x) => x.id === userId
      ? { ...x, fullName: payload.fullName ?? x.fullName, email: payload.institutionalEmail ?? x.email }
      : x
    ));
  };

  const handleDelete = async (userId) => {
    await profileService.deleteAdminUser(userId);
    setUsers((prev) => prev.filter((x) => x.id !== userId));
  };

  const s = st(isDark, t);
  const isSelf = (u) => u.id === authUser?.id;

  if (loading) return (
    <AppLayout>
      <div style={{ padding: 40, textAlign: 'center', fontFamily: "'Poppins',sans-serif", color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
        Cargando usuarios...
      </div>
    </AppLayout>
  );

  return (
    <AppLayout>
      <div style={s.pageWrapper}>
        <AdminNav isDark={isDark} t={t} />

        <div style={s.pageHeader}>
          <h1 style={s.pageTitle}>Gestión de usuarios</h1>
          <p style={s.pageDesc}>Administra los usuarios registrados en la plataforma.</p>
        </div>

        {error && (
          <div style={s.errorBanner}>
            {error}
            <button style={s.errorClose} onClick={() => setError('')}>✕</button>
          </div>
        )}

        {/* ── MÉTRICAS ── */}
        <div style={s.metricsRow}>
          {[
            { label: 'Total usuarios',   value: total,             color: '#FF8430' },
            { label: 'Activos',          value: activos,           color: '#22C55E' },
            { label: 'Inactivos',        value: total - activos,   color: '#F7306D' },
            { label: 'Administradores',  value: admins,            color: '#A855F7' },
          ].map(({ label, value, color }) => (
            <div key={label} style={s.metricCard(isDark)}>
              <div style={s.metricNum(color)}>{value}</div>
              <div style={s.metricLabel(isDark)}>{label}</div>
            </div>
          ))}
        </div>

        {/* ── FILTROS ── */}
        <div style={s.filtersRow}>
          <input
            style={s.searchInput(isDark)}
            placeholder="Buscar por nombre o correo…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <div style={s.filterGroup}>
            {['TODOS', 'ESTUDIANTE', 'ADMIN'].map((r) => (
              <button key={r} style={s.filterBtn(isDark, roleFilter === r)} onClick={() => { setRoleFilter(r); setPage(1); }}>
                {r}
              </button>
            ))}
          </div>
          <div style={s.filterGroup}>
            {['TODOS', 'ACTIVO', 'INACTIVO'].map((st) => (
              <button key={st} style={s.filterBtn(isDark, statusFilter === st)} onClick={() => { setStatusFilter(st); setPage(1); }}>
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* ── TABLA ── */}
        {paginated.length === 0 ? (
          <div style={s.emptyState(isDark)}>
            <span style={{ fontSize: 36 }}>👥</span>
            <span style={s.emptyText(isDark)}>
              {search || roleFilter !== 'TODOS' || statusFilter !== 'TODOS'
                ? 'No hay resultados para este filtro'
                : 'No hay usuarios registrados'}
            </span>
          </div>
        ) : (
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr>
                  {['Usuario', 'Correo', 'Rol', 'Estado', 'Acciones'].map((col) => (
                    <th key={col} style={s.th(isDark)}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((u) => {
                  const busy    = actionLoading[u.id];
                  const isActive = u.status === 'ACTIVE' || u.status === 'ACTIVO';
                  const isAdmin  = u.role === 'ADMIN';
                  return (
                    <tr key={u.id} style={s.tr(isDark)}>
                      {/* usuario */}
                      <td style={s.td(isDark)}>
                        <div style={s.userCell}>
                          <div style={s.miniAvatar(isDark)}>{initials(u.fullName)}</div>
                          <span style={s.userName2(isDark)}>{u.fullName}</span>
                        </div>
                      </td>
                      {/* correo */}
                      <td style={s.td(isDark)}>
                        <span style={s.emailCell(isDark)}>{u.email}</span>
                      </td>
                      {/* rol */}
                      <td style={s.td(isDark)}>
                        <span style={s.rolePill(isDark, isAdmin)}>{u.role}</span>
                      </td>
                      {/* estado */}
                      <td style={s.td(isDark)}>
                        <span style={s.statusPill(isActive)}>{isActive ? 'ACTIVO' : 'INACTIVO'}</span>
                      </td>
                      {/* acciones */}
                      <td style={s.td(isDark)}>
                        <div style={s.actionsCell}>
                          <button style={s.actionBtn(isDark)} onClick={() => setDetailModal(u)} title="Ver detalle">👁</button>
                          <button style={s.actionBtn(isDark)} onClick={() => setEditModal(u)} title="Editar">✏️</button>
                          {!isSelf(u) && (
                            <button
                              style={s.actionBtn(isDark, busy)}
                              disabled={busy}
                              onClick={() => handleStatusToggle(u)}
                              title={isActive ? 'Desactivar' : 'Activar'}
                            >
                              {isActive ? '⏸' : '▶'}
                            </button>
                          )}
                          {!isAdmin && (
                            <button
                              style={s.actionBtn(isDark, busy)}
                              disabled={busy}
                              onClick={() => handleRoleChange(u, 'ADMIN')}
                              title="Asignar rol ADMIN"
                            >
                              🛡
                            </button>
                          )}
                          {isAdmin && !isSelf(u) && (
                            <button
                              style={s.actionBtn(isDark, busy)}
                              disabled={busy}
                              onClick={() => handleRoleChange(u, 'ESTUDIANTE')}
                              title="Revocar rol ADMIN"
                            >
                              ↩
                            </button>
                          )}
                          {!isSelf(u) && (
                            <button
                              style={{ ...s.actionBtn(isDark), color: '#F00707' }}
                              onClick={() => setDeleteModal(u)}
                              title="Eliminar"
                            >
                              🗑
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── PAGINACIÓN ── */}
        {totalPages > 1 && (
          <div style={s.paginationRow}>
            <button style={s.pageBtn(isDark, safePage === 1)} disabled={safePage === 1} onClick={() => setPage((p) => p - 1)}>
              ← Anterior
            </button>
            <span style={s.pageInfo(isDark)}>Página {safePage} de {totalPages}</span>
            <button style={s.pageBtn(isDark, safePage === totalPages)} disabled={safePage === totalPages} onClick={() => setPage((p) => p + 1)}>
              Siguiente →
            </button>
          </div>
        )}

      </div>

      {/* ── MODALES ── */}
      {detailModal && <ModalDetalle user={detailModal} isDark={isDark} t={t} onClose={() => setDetailModal(null)} />}
      {editModal   && <ModalEditar  user={editModal}   isDark={isDark} t={t} onClose={() => setEditModal(null)}   onSave={handleEdit} />}
      {deleteModal && <ModalEliminar user={deleteModal} isDark={isDark} t={t} onClose={() => setDeleteModal(null)} onConfirm={handleDelete} />}

    </AppLayout>
  );
};

/* ── nav styles ── */
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

/* ── modal styles ── */
const modalSt = (isDark, t) => ({
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 300, backdropFilter: 'blur(2px)', padding: '0 16px',
  },
  card: {
    background: t.cardBg, border: `1px solid ${t.cardBorder}`,
    borderRadius: 20, width: '100%', maxWidth: 480,
    padding: '28px 28px 24px', boxShadow: t.modalShadow,
    maxHeight: '90vh', overflowY: 'auto',
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: (isDark) => ({
    fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 18, fontWeight: 800,
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.87)', margin: 0,
  }),
  closeBtn: (isDark) => ({
    background: 'none', border: 'none', cursor: 'pointer', fontSize: 16,
    color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.40)', padding: 4,
  }),
  avatarRow: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 },
  avatarCircle: (isDark) => ({
    width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
    background: isDark ? 'linear-gradient(135deg,#FF5B2E,#C4107A)' : 'linear-gradient(135deg,#FF8430,#F7306D)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 18, fontWeight: 900, color: '#fff',
  }),
  userName: (isDark) => ({
    fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 16, fontWeight: 700,
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.87)', marginBottom: 2,
  }),
  userEmail: (isDark) => ({
    fontFamily: "'Poppins',sans-serif", fontSize: 12,
    color: isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.45)',
  }),
  fieldGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 },
  field: (isDark) => ({
    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'}`,
    borderRadius: 10, padding: '10px 12px',
  }),
  fieldLabel: (isDark) => ({
    fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700,
    color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
    fontFamily: "'Poppins',sans-serif", marginBottom: 4,
  }),
  fieldValue: (isDark) => ({
    fontSize: 13, fontWeight: 600,
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.87)',
    fontFamily: "'Plus Jakarta Sans',sans-serif", wordBreak: 'break-all',
  }),
  roNote: (isDark) => ({
    fontSize: 11, fontFamily: "'Poppins',sans-serif",
    color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
    marginBottom: 16, fontStyle: 'italic',
  }),
  editFieldGroup: { marginBottom: 14 },
  editLabel: (isDark) => ({
    display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6,
    color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.60)',
    fontFamily: "'Poppins',sans-serif",
  }),
  editInput: (isDark) => ({
    width: '100%', boxSizing: 'border-box', padding: '10px 13px', borderRadius: 10,
    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.87)',
    fontFamily: "'Poppins',sans-serif", fontSize: 13, outline: 'none',
  }),
  inputHint: {
    display: 'block', marginTop: 4, fontSize: 11, color: '#F00707',
    fontFamily: "'Poppins',sans-serif",
  },
  warnBox: {
    display: 'flex', alignItems: 'flex-start', gap: 16,
    background: 'rgba(240,7,7,0.06)', border: '1px solid rgba(240,7,7,0.20)',
    borderRadius: 12, padding: '16px', marginBottom: 16,
  },
  warnTitle: {
    fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 14, fontWeight: 700,
    color: '#F00707', marginBottom: 6,
  },
  warnDesc: {
    fontFamily: "'Poppins',sans-serif", fontSize: 13,
    color: 'rgba(200,50,50,0.85)', lineHeight: 1.5,
  },
  errorBanner: {
    padding: '10px 14px', background: 'rgba(240,7,7,0.08)',
    border: '1px solid rgba(240,7,7,0.25)', borderRadius: 10,
    color: '#F00707', fontFamily: "'Poppins',sans-serif",
    fontSize: 13, marginBottom: 14,
  },
  footer: { display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22 },
  cancelBtn: (isDark) => ({
    padding: '9px 20px', borderRadius: 10,
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`,
    background: 'transparent',
    color: isDark ? 'rgba(255,255,255,0.60)' : 'rgba(0,0,0,0.55)',
    fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, fontWeight: 600,
    cursor: 'pointer',
  }),
  saveBtn: (isDark) => ({
    padding: '9px 20px', borderRadius: 10, border: 'none',
    background: isDark ? 'linear-gradient(90deg,#FF5B2E,#C4107A)' : 'linear-gradient(90deg,#FF8430,#F7306D)',
    color: '#fff', fontFamily: "'Plus Jakarta Sans',sans-serif",
    fontSize: 13, fontWeight: 700, cursor: 'pointer',
  }),
  dangerBtn: {
    padding: '9px 20px', borderRadius: 10, border: 'none',
    background: 'linear-gradient(90deg,#F00707,#C4107A)',
    color: '#fff', fontFamily: "'Plus Jakarta Sans',sans-serif",
    fontSize: 13, fontWeight: 700, cursor: 'pointer',
  },
});

/* ── page styles ── */
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
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 18px', background: 'rgba(240,7,7,0.08)',
    border: '1px solid rgba(240,7,7,0.25)', borderRadius: 12,
    color: '#F00707', fontFamily: "'Poppins',sans-serif",
    fontSize: 13, marginBottom: 20, gap: 12,
  },
  errorClose: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: '#F00707', fontSize: 14, padding: 0,
  },
  metricsRow: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))',
    gap: 14, marginBottom: 24,
  },
  metricCard: (isDark) => ({
    background: t.cardBg, border: `1px solid ${t.cardBorder}`,
    borderRadius: 16, padding: '18px 16px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    boxShadow: t.cardShadow,
  }),
  metricNum: (color) => ({
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    fontSize: 'clamp(24px,3vw,34px)', fontWeight: 900, color, lineHeight: 1,
  }),
  metricLabel: (isDark) => ({
    fontSize: 11, fontWeight: 600, textAlign: 'center',
    color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)',
    fontFamily: "'Poppins',sans-serif",
  }),
  filtersRow: {
    display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20,
  },
  searchInput: (isDark) => ({
    flex: '1 1 220px', padding: '10px 14px', borderRadius: 10,
    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.87)',
    fontFamily: "'Poppins',sans-serif", fontSize: 13, outline: 'none',
  }),
  filterGroup: { display: 'flex', gap: 4 },
  filterBtn: (isDark, active) => ({
    padding: '8px 14px', borderRadius: 99, cursor: 'pointer',
    border: active ? 'none' : `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)'}`,
    background: active
      ? (isDark ? 'linear-gradient(90deg,#FF5B2E,#C4107A)' : 'linear-gradient(90deg,#FF8430,#F7306D)')
      : 'transparent',
    color: active ? '#fff' : (isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.50)'),
    fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
    fontFamily: "'Poppins',sans-serif", transition: 'all 0.15s', whiteSpace: 'nowrap',
  }),
  tableWrap: {
    width: '100%', overflowX: 'auto',
    borderRadius: 16, border: `1px solid ${t.cardBorder}`,
    boxShadow: t.cardShadow, marginBottom: 16,
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: (isDark) => ({
    padding: '12px 16px', textAlign: 'left',
    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
    fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.40)',
    fontFamily: "'Poppins',sans-serif",
    borderBottom: `1px solid ${t.cardBorder}`,
    whiteSpace: 'nowrap',
  }),
  tr: (isDark) => ({
    borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
  }),
  td: (isDark) => ({
    padding: '12px 16px', verticalAlign: 'middle',
    background: isDark ? 'rgba(15,5,20,0.60)' : '#FFFFFF',
    fontSize: 13, color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.87)',
  }),
  userCell: { display: 'flex', alignItems: 'center', gap: 10 },
  miniAvatar: (isDark) => ({
    width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
    background: isDark ? 'linear-gradient(135deg,#FF5B2E,#C4107A)' : 'linear-gradient(135deg,#FF8430,#F7306D)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 12, fontWeight: 800, color: '#fff',
  }),
  userName2: (isDark) => ({
    fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, fontWeight: 600,
    color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.87)',
  }),
  emailCell: (isDark) => ({
    fontFamily: "'Poppins',sans-serif", fontSize: 12,
    color: isDark ? 'rgba(255,255,255,0.60)' : 'rgba(0,0,0,0.55)',
  }),
  rolePill: (isDark, isAdmin) => ({
    fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
    color: isAdmin ? '#A855F7' : (isDark ? '#FF8430' : '#FF5B2E'),
    background: isAdmin ? 'rgba(168,85,247,0.12)' : 'rgba(255,132,48,0.12)',
    border: `1px solid ${isAdmin ? 'rgba(168,85,247,0.30)' : 'rgba(255,132,48,0.30)'}`,
    padding: '3px 10px', borderRadius: 99,
    fontFamily: "'Poppins',sans-serif",
  }),
  statusPill: (isActive) => ({
    fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
    color: isActive ? '#22C55E' : 'rgba(180,180,180,0.7)',
    background: isActive ? 'rgba(34,197,94,0.12)' : 'rgba(150,150,150,0.10)',
    border: `1px solid ${isActive ? 'rgba(34,197,94,0.30)' : 'rgba(150,150,150,0.20)'}`,
    padding: '3px 10px', borderRadius: 99,
    fontFamily: "'Poppins',sans-serif",
  }),
  actionsCell: { display: 'flex', gap: 4, flexWrap: 'nowrap' },
  actionBtn: (isDark, disabled) => ({
    padding: '5px 8px', borderRadius: 8, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
    fontSize: 14, opacity: disabled ? 0.4 : 1, transition: 'opacity 0.15s',
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
  paginationRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 12,
  },
  pageBtn: (isDark, disabled) => ({
    padding: '8px 16px', borderRadius: 10, cursor: disabled ? 'not-allowed' : 'pointer',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
    background: 'transparent',
    color: disabled
      ? (isDark ? 'rgba(255,255,255,0.20)' : 'rgba(0,0,0,0.20)')
      : (isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.60)'),
    fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 600,
  }),
  pageInfo: (isDark) => ({
    fontSize: 12, color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)',
    fontFamily: "'Poppins',sans-serif",
  }),
});

export default AdminUsers;
