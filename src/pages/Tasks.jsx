import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/Layout/AppLayout';
import { useTheme } from '../context/ThemeContext';
import { createStyles } from '../theme/createStyles';
import { formatDate } from '../utils/dateUtils';
import taskService from '../services/taskService';
import academicService from '../services/academicService';

import { 
  Search, Edit2, Trash2, Clock, ChevronDown, 
  Zap, ClipboardList 
} from 'lucide-react';

const SearchIcon = ({ color }) => (
  <Search size={14} color={color} strokeWidth={2} />
);

const EditIcon = ({ color }) => (
  <Edit2 size={13} color={color} strokeWidth={2} />
);

const TrashIcon = ({ color }) => (
  <Trash2 size={13} color={color} strokeWidth={2} />
);

const ClockIcon = ({ color }) => (
  <Clock size={11} color={color} strokeWidth={2} />
);

const LocalChevronDown = ({ color }) => (
  <ChevronDown 
    size={11} 
    color={color || 'currentColor'} 
    strokeWidth={2}
    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
  />
);

const LightningIcon = ({ color }) => (
  <Zap size={14} color={color} strokeWidth={2} />
);

// Backend taskType enums → visual config
const ESTADO_CONFIG = {
  'TAREA':    { bg: 'rgba(59,130,246,0.18)', color: '#3B82F6' },
  'EXAMEN':   { bg: 'rgba(240,7,7,0.18)', color: '#F00707' },
  'PROYECTO': { bg: 'rgba(234,179,8,0.18)', color: '#EAB308' },
  'OTRO':     { bg: 'rgba(34,197,94,0.18)', color: '#22C55E' },
};

const parseHoras = (val) => {
  if (!val) return 60;
  const s = String(val);
  if (s.includes(':')) {
    const [h, m] = s.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  }
  return Math.round(parseFloat(s) * 60) || 60;
};

const Spinner = () => (
  <>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    <svg style={{ animation: 'spin 0.8s linear infinite', flexShrink: 0 }} width="13" height="13" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  </>
);

const Tasks = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]); // [{id, name}]
  const [fetchLoading, setFetchLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroMateria, setFiltroMateria] = useState('Todos los materias');
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detailTask, setDetailTask] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [form, setForm] = useState({
    nombre: '', materiaId: '', tipo: 'TAREA',
    descripcion: '', fecha: '', horas: '', estimado: '',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksData, subjectsData] = await Promise.all([
          taskService.getTasks(),
          academicService.getSubjects(),
        ]);
        const subs = subjectsData.subjects || subjectsData || [];
        const subjectMap = {};
        subs.forEach(s => { subjectMap[String(s.id)] = s.name || s.nombre || String(s.id); });
        const subjectObjects = subs.map(s => ({ id: String(s.id), name: s.name || s.nombre || String(s.id) }));
        setSubjects(subjectObjects);

        const items = tasksData.tasks || tasksData || [];
        setTasks(items.map((t) => ({
          id: t.id || Date.now(),
          nombre: t.title || t.name || t.nombre || '',
          descripcion: t.description || t.descripcion || '',
          materia: subjectMap[String(t.subjectId)] || String(t.subjectId || 'General'),
          materiaId: String(t.subjectId || ''),
          tipo: t.taskType || t.type || t.tipo || 'TAREA',
          fecha: t.deadline || t.dueDate || t.fecha || '',
          horasEstudio: t.estimatedDurationMinutes
            ? `${(t.estimatedDurationMinutes / 60).toFixed(1)}h`
            : '1h',
          status: t.status || 'TODO',
        })));

        if (subjectObjects.length > 0) {
          setForm(f => ({ ...f, materiaId: subjectObjects[0].id }));
        }
      } catch {
        // fallback vacío
      } finally {
        setFetchLoading(false);
      }
    };
    fetchData();
  }, []);

  const s = getStyles(isDark);
  const t = createStyles(isDark);

  const tareasFiltradas = tasks.filter(t => {
    const matchBusqueda = (t.nombre || '').toLowerCase().includes(busqueda.toLowerCase());
    const matchMateria = filtroMateria === 'Todos los materias' || t.materia === filtroMateria;
    return matchBusqueda && matchMateria;
  });

  const completadas = tasks.length > 0
    ? Math.round((tasks.filter(t => t.status === 'COMPLETED').length / tasks.length) * 100)
    : 0;
  const totalHoras = tasks.reduce((acc, t) => acc + (parseFloat(t.horasEstudio) || 0), 0).toFixed(1);

  const validateForm = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido';
    if (!form.fecha) e.fecha = 'La fecha es requerida';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCrear = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const taskData = {
        title: form.nombre,
        description: form.descripcion,
        subjectId: form.materiaId ? Number(form.materiaId) : undefined,
        taskType: form.tipo,
        deadline: form.fecha,
        estimatedDurationMinutes: parseHoras(form.horas),
      };
      const res = await taskService.createTask(taskData);
      const subjectName = subjects.find(s => s.id === form.materiaId)?.name || 'General';
      setTasks(p => [...p, {
        id: res.id || Date.now(),
        nombre: form.nombre,
        descripcion: form.descripcion,
        materia: subjectName,
        materiaId: form.materiaId,
        tipo: form.tipo,
        fecha: form.fecha,
        horasEstudio: form.horas ? `${(parseHoras(form.horas) / 60).toFixed(1)}h` : '1h',
        status: 'TODO',
      }]);
      setForm({ nombre: '', materiaId: subjects[0]?.id || '', tipo: 'TAREA', descripcion: '', fecha: '', horas: '', estimado: '' });
      setFormErrors({});
      setShowModal(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 6000);
    } catch {
      // error silencioso
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await taskService.deleteTask(id);
      setTasks(p => p.filter(t => t.id !== id));
    } catch {
      setTasks(p => p.filter(t => t.id !== id));
    }
  };

  const handleEditSave = async (updated) => {
    try {
      await taskService.updateTask(updated.id, {
        title: updated.nombre,
        description: updated.descripcion,
        subjectId: updated.materiaId ? Number(updated.materiaId) : undefined,
        taskType: updated.tipo,
        deadline: updated.fecha,
        estimatedDurationMinutes: parseHoras(updated.horasEstudio),
      });
      setTasks(p => p.map(t => t.id === updated.id ? updated : t));
    } catch {
      setTasks(p => p.map(t => t.id === updated.id ? updated : t));
    }
    setEditTask(null);
  };

  return (
    <AppLayout>
      {/* ── TOAST ÉXITO ── */}
      {showSuccess && (
        <div style={s.toast}>
          <div style={s.toastLeft}>
            <div style={s.toastIconWrap}>
              <LightningIcon color="#fff" />
            </div>
            <div>
              <div style={s.toastTitle}>¡Tarea agregada correctamente!</div>
              <div style={s.toastDesc}>
                El motor de priorización ha analizado tu carga y reorganizó tus tareas para la semana.
              </div>
            </div>
          </div>
          <button style={s.toastBtn} onClick={() => { setShowSuccess(false); navigate('/priorizacion'); }}>
            Ver priorización →
          </button>
        </div>
      )}

      {/* ── PAGE HEADER ── */}
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.pageTitle}>Mis Tareas</h1>
          <p style={s.pageDesc}>Gestiona tus actividades académicas en un solo lugar.</p>
        </div>
        <button style={s.newBtn} onClick={() => setShowModal(true)}>
          + Nueva Tarea
        </button>
      </div>

      {/* ── BARRA BÚSQUEDA + FILTROS ── */}
      <div style={s.filterRow}>
        <div style={s.searchWrap}>
          <SearchIcon color={isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)'} />
          <input
            style={s.searchInput}
            placeholder="Buscar por nombre de tarea..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>
        <div style={s.filterRight}>
          <span style={s.filterLabel}>FILTRAR POR</span>
          <div style={{ position: 'relative' }}>
             <select
               style={s.filterSelect}
               value={filtroMateria}
               onChange={e => setFiltroMateria(e.target.value)}
             >
               <option value="Todos los materias">Todos los materias</option>
               {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
             </select>
            <LocalChevronDown color={isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.40)'} />
          </div>
        </div>
      </div>

      {/* ── GRID TAREAS ── */}
      <div style={s.tasksGrid}>
        {fetchLoading && (
          <div style={s.emptyState}>
            <p style={s.emptyText}>Cargando tareas...</p>
          </div>
        )}
        {!fetchLoading && tareasFiltradas.length === 0 && (
          <div style={s.emptyState}>
            <ClipboardList size={42} color={isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.10)'} />
            <p style={s.emptyText}>No hay tareas. ¡Crea tu primera tarea!</p>
          </div>
        )}
        {tareasFiltradas.map(t => {
          const ec = ESTADO_CONFIG[t.tipo] || { bg: 'rgba(255,255,255,0.08)', color: '#fff' };
          return (
            <div key={t.id} style={{ ...s.taskCard, cursor: 'pointer' }} onClick={() => setDetailTask(t)}>
              <div style={s.cardTop}>
                <span style={{ ...s.tipoBadge, background: ec.bg, color: ec.color }}>
                  {t.tipo}
                </span>
                <div style={s.cardActions}>
                  <button style={s.actionBtn} title="Editar" onClick={(e) => { e.stopPropagation(); setEditTask({ ...t }); }}>
                    <EditIcon color={isDark ? 'rgba(255,255,255,0.60)' : 'rgba(0,0,0,0.55)'} />
                  </button>
                  <button style={s.actionBtn} title="Eliminar" onClick={(e) => { e.stopPropagation(); handleEliminar(t.id); }}>
                    <TrashIcon color="#F00707" />
                  </button>
                </div>
              </div>

              <div style={s.taskNombre}>{t.nombre}</div>
              <div style={s.taskDesc}>{t.descripcion}</div>

              <div style={s.taskFooter}>
                <div style={s.footerItem}>
                  <ClockIcon color={isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.35)'} />
                  <span style={s.footerText}>TIEMPO: {t.horasEstudio}</span>
                </div>
                <div style={s.footerItem}>
                  <span style={s.entregaLabel}>FECHA:</span>
                  <span style={{ ...s.entregaVal, color: ec.color }}>{formatDate(t.fecha)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── BARRA RESUMEN ── */}
      <div style={s.resumenBar}>
        <div style={s.resumenItem}>
          <span style={s.resumenLabel}>COMPLETADAS</span>
          <div style={s.resumenProgressWrap}>
            <div style={s.resumenProgressTrack}>
              <div style={{ ...s.resumenProgressFill, width: `${completadas}%` }} />
            </div>
            <span style={s.resumenPct}>{completadas}%</span>
          </div>
        </div>

        <div style={s.resumenDivider} />

        <div style={s.resumenItem}>
          <span style={s.resumenLabel}>HORAS DIARIAS</span>
          <div style={s.horasDots}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{
                ...s.horaDot,
                background: i < Math.round(totalHoras / 2)
                  ? isDark ? '#FF5B2E' : '#FF8430'
                  : isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)',
                height: 8 + (i % 3) * 4,
              }} />
            ))}
          </div>
        </div>

        <div style={s.resumenDivider} />

        <div style={s.resumenItem}>
          <span style={s.resumenLabel}>TOTAL ESTIMADO</span>
          <span style={s.resumenTotal}>{totalHoras} Horas</span>
        </div>
      </div>

      {/* ── MODAL DETALLE ── */}
      {detailTask && (
        <div style={s.modalOverlay} onClick={() => setDetailTask(null)}>
          <div style={s.modalCard} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <span style={s.modalTitle}>Detalle de Tarea</span>
              <button style={s.modalClose} onClick={() => setDetailTask(null)}>✕</button>
            </div>
            <div style={{ ...s.modalBody, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {(() => {
                const ec = ESTADO_CONFIG[detailTask.tipo] || { bg: 'rgba(255,255,255,0.08)', color: '#fff' };
                return (
                  <>
                    <span style={{ ...s.tipoBadge, background: ec.bg, color: ec.color, alignSelf: 'flex-start' }}>
                      {detailTask.tipo}
                    </span>
                    <div style={{ fontFamily: t.fontPrimary, fontSize: 16, fontWeight: 700, color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.87)' }}>
                      {detailTask.nombre}
                    </div>
                    {detailTask.descripcion && (
                      <p style={{ fontSize: 13, color: t.textSecondary, lineHeight: 1.6, margin: 0 }}>
                        {detailTask.descripcion}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', color: t.textMuted, marginBottom: 3 }}>MATERIA</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.87)' }}>{detailTask.materia}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', color: t.textMuted, marginBottom: 3 }}>FECHA</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: ec.color }}>{formatDate(detailTask.fecha)}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', color: t.textMuted, marginBottom: 3 }}>HORAS</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.87)' }}>{detailTask.horasEstudio}</div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
            <div style={s.modalFooter}>
              <button style={s.mCancelBtn} onClick={() => setDetailTask(null)}>Cerrar</button>
              <button style={s.mCreateBtn} onClick={() => { setEditTask({ ...detailTask }); setDetailTask(null); }}>Editar</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL EDITAR TAREA ── */}
      {editTask && (
        <div style={s.modalOverlay} onClick={() => setEditTask(null)}>
          <div style={s.modalCard} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <span style={s.modalTitle}>Editar Tarea</span>
              <button style={s.modalClose} onClick={() => setEditTask(null)}>✕</button>
            </div>
            <div style={s.modalBody}>
              <div style={s.mField}>
                <label style={s.mLabel}>NOMBRE DE LA TAREA</label>
                <input style={s.mInput} value={editTask.nombre}
                  onChange={e => setEditTask(p => ({ ...p, nombre: e.target.value }))} />
              </div>
              <div style={s.mRow}>
                <div style={{ ...s.mField, flex: 1 }}>
                  <label style={s.mLabel}>MATERIA</label>
                  <div style={{ position: 'relative' }}>
                     <select style={{ ...s.mInput, ...s.mSelect }} value={editTask.materiaId}
                       onChange={e => setEditTask(p => ({ ...p, materiaId: e.target.value }))}>
                       {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                     </select>
                    <ChevronDown color={isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.40)'} />
                  </div>
                </div>
                <div style={{ ...s.mField, flex: 1 }}>
                  <label style={s.mLabel}>TIPO</label>
                  <div style={{ position: 'relative' }}>
                    <select style={{ ...s.mInput, ...s.mSelect }} value={editTask.tipo}
                      onChange={e => setEditTask(p => ({ ...p, tipo: e.target.value }))}>
                      {Object.keys(ESTADO_CONFIG).map(k => <option key={k}>{k}</option>)}
                    </select>
                    <ChevronDown color={isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.40)'} />
                  </div>
                </div>
              </div>
              <div style={s.mField}>
                <label style={s.mLabel}>DESCRIPCIÓN</label>
                <textarea style={{ ...s.mInput, height: 72, resize: 'none', paddingTop: 10 }}
                  value={editTask.descripcion}
                  onChange={e => setEditTask(p => ({ ...p, descripcion: e.target.value }))} />
              </div>
              <div style={s.mRow}>
                <div style={{ ...s.mField, flex: 1 }}>
                  <label style={s.mLabel}>FECHA</label>
                  <input type="date" style={s.mInput} value={editTask.fecha}
                    onChange={e => setEditTask(p => ({ ...p, fecha: e.target.value }))} />
                </div>
                <div style={{ ...s.mField, flex: 1 }}>
                  <label style={s.mLabel}>HORAS</label>
                  <input type="text" style={s.mInput} value={editTask.horasEstudio}
                    onChange={e => setEditTask(p => ({ ...p, horasEstudio: e.target.value }))} />
                </div>
              </div>
            </div>
            <div style={s.modalFooter}>
              <button style={s.mCancelBtn} onClick={() => setEditTask(null)}>Cancelar</button>
              <button style={s.mCreateBtn} onClick={() => handleEditSave(editTask)}>Guardar cambios</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL NUEVA TAREA ── */}
      {showModal && (
        <div style={s.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={s.modalCard} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <span style={s.modalTitle}>Nueva Tarea</span>
              <button style={s.modalClose} onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div style={s.modalBody}>
              {/* Nombre */}
              <div style={s.mField}>
                <label style={s.mLabel}>NOMBRE DE LA TAREA</label>
                <input
                  style={{ ...s.mInput, ...(formErrors.nombre ? s.inputError : {}) }}
                  placeholder="Proyecto de búsqueda dimensional"
                  value={form.nombre}
                  onChange={e => { setForm(p => ({ ...p, nombre: e.target.value })); if (formErrors.nombre) setFormErrors(p => ({ ...p, nombre: '' })); }}
                />
                {formErrors.nombre && <span style={s.errorText}>{formErrors.nombre}</span>}
              </div>

              {/* Materia + Tipo */}
              <div style={s.mRow}>
                <div style={{ ...s.mField, flex: 1 }}>
                  <label style={s.mLabel}>MATERIA</label>
                  <div style={{ position: 'relative' }}>
                     <select style={{ ...s.mInput, ...s.mSelect }}
                       value={form.materiaId}
                       onChange={e => setForm(p => ({ ...p, materiaId: e.target.value }))}>
                       {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                     </select>
                    <LocalChevronDown color={isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.40)'} />
                  </div>
                </div>
                <div style={{ ...s.mField, flex: 1 }}>
                  <label style={s.mLabel}>TIPO DE TAREA</label>
                  <div style={{ position: 'relative' }}>
                    <select style={{ ...s.mInput, ...s.mSelect }}
                      value={form.tipo}
                      onChange={e => setForm(p => ({ ...p, tipo: e.target.value }))}>
                      {Object.keys(ESTADO_CONFIG).map(k => <option key={k}>{k}</option>)}
                    </select>
                    <LocalChevronDown color={isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.40)'} />
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div style={s.mField}>
                <label style={s.mLabel}>DESCRIPCIÓN</label>
                <textarea
                  style={{ ...s.mInput, height: 72, resize: 'none', paddingTop: 10 }}
                  placeholder="Detalles importantes de la entrega..."
                  value={form.descripcion}
                  onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))}
                />
              </div>

              {/* Fecha + Horas + Estimado */}
              <div style={s.mRow}>
                <div style={{ ...s.mField, flex: 1 }}>
                  <label style={s.mLabel}>FECHA</label>
                  <input type="date" style={{ ...s.mInput, ...(formErrors.fecha ? s.inputError : {}) }}
                    value={form.fecha}
                    onChange={e => { setForm(p => ({ ...p, fecha: e.target.value })); if (formErrors.fecha) setFormErrors(p => ({ ...p, fecha: '' })); }} />
                  {formErrors.fecha && <span style={s.errorText}>{formErrors.fecha}</span>}
                </div>
                <div style={{ ...s.mField, flex: 1 }}>
                  <label style={s.mLabel}>HORAS</label>
                  <input type="text" style={s.mInput} placeholder="--:--:--"
                    value={form.horas}
                    onChange={e => setForm(p => ({ ...p, horas: e.target.value }))} />
                </div>
                <div style={{ ...s.mField, flex: 1 }}>
                  <label style={s.mLabel}>ESTIMADO (MIN)</label>
                  <input type="number" style={s.mInput} placeholder="30"
                    value={form.estimado}
                    onChange={e => setForm(p => ({ ...p, estimado: e.target.value }))} />
                </div>
              </div>
            </div>

            <div style={s.modalFooter}>
              <button style={s.mCancelBtn} onClick={() => setShowModal(false)} disabled={loading}>Cancelar</button>
              <button style={{ ...s.mCreateBtn, ...(loading ? { opacity: 0.7, cursor: 'not-allowed' } : {}) }} onClick={handleCrear} disabled={loading}>
                {loading ? <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Spinner /> Guardando...</span> : 'Registrar Tarea'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

const getStyles = (isDark) => {
  const t = createStyles(isDark);
  return {
    toast: {
      position: 'fixed',
      top: 20,
      right: 24,
      zIndex: 300,
      background: isDark ? '#1E1E1E' : '#FFFFFF',
      border: `1px solid ${isDark ? 'rgba(255,91,46,0.35)' : 'rgba(255,132,48,0.35)'}`,
      borderRadius: 14,
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      maxWidth: 380,
      boxShadow: isDark
        ? '0 8px 32px rgba(196,16,122,0.25), 0 2px 8px rgba(0,0,0,0.50)'
        : '0 8px 32px rgba(255,132,48,0.20), 0 2px 8px rgba(0,0,0,0.10)',
      animation: 'slideIn 0.3s ease',
    },
    toastLeft: { display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1 },
    toastIconWrap: {
      width: 32,
      height: 32,
      borderRadius: 8,
      background: isDark
        ? 'linear-gradient(135deg, #FF5B2E, #C4107A)'
        : 'linear-gradient(135deg, #FF8430, #F7306D)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    toastTitle: {
      fontFamily: t.fontPrimary,
      fontSize: 13,
      fontWeight: 700,
      color: t.textPrimary,
      marginBottom: 3,
    },
    toastDesc: {
      fontSize: 11,
      color: t.textSecondary,
      lineHeight: 1.45,
      maxWidth: 240,
    },
    toastBtn: {
      background: 'transparent',
      border: `1px solid ${isDark ? 'rgba(255,91,46,0.40)' : 'rgba(255,132,48,0.40)'}`,
      borderRadius: 8,
      padding: '6px 12px',
      cursor: 'pointer',
      fontFamily: t.fontSecondary,
      fontSize: 11,
      fontWeight: 600,
      color: isDark ? '#FF5B2E' : '#FF8430',
      whiteSpace: 'nowrap',
      flexShrink: 0,
    },

    pageHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    pageTitle: {
      fontFamily: t.fontPrimary,
      fontSize: 32,
      fontWeight: 800,
      color: isDark ? '#FF5B2E' : '#FF8430',
      margin: '0 0 4px 0',
    },
    pageDesc: { fontSize: 13, color: t.textSecondary, margin: 0 },
    newBtn: {
      background: t.primaryGradient,
      border: 'none',
      borderRadius: 10,
      padding: '10px 20px',
      color: '#fff',
      fontFamily: t.fontPrimary,
      fontSize: 13,
      fontWeight: 700,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      flexShrink: 0,
    },

    filterRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      marginBottom: 20,
    },
    searchWrap: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: t.inputBg,
      border: `1px solid ${t.inputBorder}`,
      borderRadius: 10,
      padding: '9px 14px',
    },
    searchInput: {
      flex: 1,
      background: 'transparent',
      border: 'none',
      outline: 'none',
      fontFamily: t.fontSecondary,
      fontSize: 13,
      color: t.textPrimary,
    },
    filterRight: { display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 },
    filterLabel: {
      fontSize: 10,
      letterSpacing: '0.08em',
      fontWeight: 600,
      color: t.textMuted,
      fontFamily: t.fontSecondary,
    },
    filterSelect: {
      background: t.inputBg,
      border: `1px solid ${t.inputBorder}`,
      borderRadius: 8,
      padding: '8px 28px 8px 12px',
      fontFamily: t.fontSecondary,
      fontSize: 12,
      color: t.textPrimary,
      outline: 'none',
      appearance: 'none',
      WebkitAppearance: 'none',
      cursor: 'pointer',
    },

    tasksGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 14,
      marginBottom: 16,
    },
    emptyState: {
      gridColumn: '1 / -1',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
      padding: '48px 0',
      background: t.cardBg,
      borderRadius: 16,
      border: `1px dashed ${t.cardBorder}`,
    },
    emptyText: { fontSize: 13, color: t.textMuted, margin: 0 },

    taskCard: {
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 14,
      padding: '16px 18px',
      boxShadow: t.cardShadow,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    },
    cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    tipoBadge: {
      fontSize: 9,
      fontWeight: 700,
      padding: '3px 10px',
      borderRadius: 20,
      letterSpacing: '0.05em',
      fontFamily: t.fontSecondary,
    },
    cardActions: { display: 'flex', gap: 6 },
    actionBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '3px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    taskNombre: {
      fontFamily: t.fontPrimary,
      fontSize: 14,
      fontWeight: 700,
      color: isDark ? '#FFFFFF' : 'rgba(0,0,0,0.87)',
      lineHeight: 1.3,
    },
    taskDesc: {
      fontSize: 12,
      color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.58)',
      lineHeight: 1.5,
    },
    taskFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 10,
      borderTop: `1px solid ${t.cardBorder}`,
      marginTop: 'auto',
    },
    footerItem: { display: 'flex', alignItems: 'center', gap: 5 },
    footerText: { fontSize: 10, color: t.textMuted, fontWeight: 600, letterSpacing: '0.04em', fontFamily: t.fontSecondary },
    entregaLabel: { fontSize: 10, color: t.textMuted, fontWeight: 600, letterSpacing: '0.04em', fontFamily: t.fontSecondary },
    entregaVal: { fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', fontFamily: t.fontSecondary },

    resumenBar: {
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 14,
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      boxShadow: t.cardShadow,
    },
    resumenItem: { display: 'flex', flexDirection: 'column', gap: 8 },
    resumenLabel: {
      fontSize: 9,
      letterSpacing: '0.10em',
      fontWeight: 700,
      color: t.textMuted,
      fontFamily: t.fontSecondary,
    },
    resumenProgressWrap: { display: 'flex', alignItems: 'center', gap: 10 },
    resumenProgressTrack: {
      width: 120,
      height: 6,
      borderRadius: 3,
      background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
      overflow: 'hidden',
    },
    resumenProgressFill: {
      height: '100%',
      borderRadius: 3,
      background: isDark ? 'linear-gradient(90deg,#FF5B2E,#C4107A)' : 'linear-gradient(90deg,#FF8430,#F7306D)',
    },
    resumenPct: {
      fontFamily: t.fontPrimary,
      fontSize: 13,
      fontWeight: 700,
      color: isDark ? '#FF5B2E' : '#FF8430',
    },
    resumenDivider: {
      width: 1,
      height: 36,
      background: t.cardBorder,
      flexShrink: 0,
    },
    horasDots: { display: 'flex', alignItems: 'flex-end', gap: 4 },
    horaDot: {
      width: 8,
      borderRadius: 2,
      transition: 'background 0.2s',
    },
    resumenTotal: {
      fontFamily: t.fontPrimary,
      fontSize: 18,
      fontWeight: 800,
      color: isDark ? '#FF5B2E' : '#FF8430',
    },

    modalOverlay: {
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 200, backdropFilter: 'blur(2px)',
    },
    modalCard: {
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 16,
      width: '100%',
      maxWidth: 480,
      margin: '0 20px',
      boxShadow: t.modalShadow,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      maxHeight: '90vh',
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 24px 0',
      flexShrink: 0,
    },
    modalTitle: {
      fontFamily: t.fontPrimary,
      fontSize: 18,
      fontWeight: 700,
      backgroundImage: t.primaryGradient,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      width: 'fit-content',
    },
    modalClose: {
      background: 'none', border: 'none', cursor: 'pointer',
      fontSize: 14, color: t.textSecondary, padding: 4, lineHeight: 1,
    },
    modalBody: { padding: '16px 24px', overflowY: 'auto', flex: 1 },
    modalFooter: {
      display: 'flex', justifyContent: 'flex-end', gap: 12,
      padding: '12px 24px 20px',
      borderTop: `1px solid ${t.cardBorder}`,
      flexShrink: 0,
    },
    mField: { marginBottom: 14 },
    mRow: { display: 'flex', gap: 10, marginBottom: 14 },
    mLabel: {
      display: 'block', fontSize: 10, fontWeight: 600,
      letterSpacing: '0.08em', color: t.textSecondary,
      fontFamily: t.fontSecondary, marginBottom: 6,
    },
    mInput: {
      width: '100%', background: t.inputBg,
      border: `1px solid ${t.inputBorder}`,
      borderRadius: 10, padding: '10px 12px',
      fontFamily: t.fontSecondary, fontSize: 12,
      color: t.textPrimary, outline: 'none',
      boxSizing: 'border-box', transition: 'border-color 0.2s',
    },
    mSelect: { appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer', paddingRight: 28 },
    inputError: { borderColor: t.error, boxShadow: `0 0 0 2px ${t.error}1a` },
    errorText: { fontSize: 11, color: t.error, marginTop: 4, display: 'block' },
    mCancelBtn: {
      padding: '9px 20px', borderRadius: 8,
      border: `1px solid ${t.inputBorder}`,
      background: 'transparent', cursor: 'pointer',
      fontFamily: t.fontSecondary, fontSize: 13,
      fontWeight: 500, color: t.textSecondary,
    },
    mCreateBtn: {
      padding: '9px 20px', borderRadius: 8, border: 'none',
      background: t.primaryGradient, cursor: 'pointer',
      fontFamily: t.fontPrimary, fontSize: 13,
      fontWeight: 700, color: '#fff', letterSpacing: '0.03em',
    },
  };
};

export default Tasks;
