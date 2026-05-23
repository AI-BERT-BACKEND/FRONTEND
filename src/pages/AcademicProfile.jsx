import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/Layout/AppLayout';
import ErrorMsg from '../components/ErrorMsg';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import profileService from '../services/profileService';
import { createStyles } from '../theme/createStyles';
import {
  ChevronDown, BookOpen, FileText, Target,
  GraduationCap, Scale, Trophy, Clock, Briefcase, Quote
} from 'lucide-react';

const AcademicProfile = () => {
  const { isDark } = useTheme();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const userId = user?.id || user?.userId || user?.sub || null;
  const carreraPrincipal = user?.career || user?.carrera || user?.careerName || user?.program || '';

  const [showModal, setShowModal] = useState(false);
  const [nuevaMateria, setNuevaMateria] = useState('');
  const [modalError, setModalError] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const [form, setForm] = useState({
    carreraSecundaria: '',
    semestre: '',
    promedio: '',
    materias: [],
    objetivo: 'EXCELENCIA',
    disponibilidad: 'MANANA',
    horasEstudio: 4,
    trabaja: 'NO',
  });

  const [errors, setErrors] = useState({});

   const carreras = [
    { label: 'Ing. Sistemas',    value: 'INGENIERIA_SISTEMAS' },
    { label: 'Ing. Industrial',  value: 'INGENIERIA_INDUSTRIAL' },
    { label: 'Ing. Civil',       value: 'INGENIERIA_CIVIL' },
    { label: 'Ing. Electrónica', value: 'INGENIERIA_ELECTRONICA' },
    { label: 'Ing. Biomédica',   value: 'INGENIERIA_BIOMEDICA' },
    { label: 'Ing. Eléctrica',   value: 'INGENIERIA_ELECTRICA' },
    { label: 'Ing. Mecánica',    value: 'INGENIERIA_MECANICA' },
    { label: 'Administración',   value: 'ADMINISTRACION_EMPRESAS' },
    { label: 'Matemáticas',      value: 'MATEMATICAS' },
  ];

  const semestres = Array.from({ length: 10 }, (_, i) => ({
    label: `${i + 1}° Semestre`,
    value: i + 1,
  }));

  const objetivos = [
    { id: 'PASAR',      label: 'Pasar Materias', icon: GraduationCap },
    { id: 'EQUILIBRIO', label: 'Equilibrio',     icon: Scale },
    { id: 'EXCELENCIA', label: 'Excelencia',     icon: Trophy },
  ];

  const disp = [
    { id: 'MANANA', label: 'Mañana', inicio: '07:00', fin: '12:00' },
    { id: 'TARDE',  label: 'Tarde',  inicio: '13:00', fin: '18:00' },
    { id: 'NOCHE',  label: 'Noche',  inicio: '18:00', fin: '22:00' },
  ];

  useEffect(() => {
    if (authLoading) return;
    if (!userId) {
      setInitialLoading(false);
      return;
    }
    (async () => {
      if (!userId) {
        setInitialLoading(false);
        return;
      }
      try {
        const wrapper = await profileService.getAcademicProfile(userId);
        const profile = wrapper?.data ?? wrapper;
        if (profile) {
          setForm({
            carreraSecundaria: profile.carreraSecundaria || profile.secondaryCareer || '',
            semestre:          profile.semestre          || profile.currentSemester  || '',
            promedio:          profile.promedio !== undefined
                                 ? String(profile.promedio)
                                 : profile.currentGpa !== undefined
                                   ? String(profile.currentGpa)
                                   : '',
            materias:      profile.materias  || profile.subjects      || [],
            objetivo:      profile.objetivo  || profile.academicGoal  || 'EXCELENCIA',
            disponibilidad: profile.disponibilidad || profile.studyAvailability || 'MANANA',
            horasEstudio:  profile.horasEstudio    || profile.dailyStudyHours   || 4,
            trabaja:       profile.trabaja !== undefined
                             ? profile.trabaja
                             : profile.currentlyEmployed !== undefined
                               ? (profile.currentlyEmployed ? 'SI' : 'NO')
                               : 'NO',
          });
        }
      } catch (err) {
        console.error('Error al cargar perfil académico:', err);
        // usar defaults si el perfil no existe aún (404 esperado para nuevos usuarios)
      } finally {
        setInitialLoading(false);
      }
    })();
  }, [userId, authLoading]);

  const validate = () => {
    const e = {};
    if (!form.semestre)                    e.semestre = 'Campo requerido';
    if (!form.promedio || isNaN(form.promedio)) e.promedio = 'Ingresa un número';
    if (form.materias.length === 0)        e.materias = 'Agrega al menos una materia';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    if (!userId) { setSaveError('No se pudo identificar el usuario'); return; }
    setSaving(true);
    setSaveError('');
    try {
      const payload = {
        secondaryCareer:    form.carreraSecundaria || null,
        currentSemester:    parseInt(form.semestre, 10),
        currentGpa:         parseFloat(form.promedio),
        subjects:           form.materias,
        academicGoal:       form.objetivo,
        studyAvailability:  form.disponibilidad,
        dailyStudyHours:    parseInt(form.horasEstudio, 10),
        currentlyEmployed:  form.trabaja === 'SI',
      };
      await profileService.updateAcademicProfile(userId, payload);
      navigate('/dashboard');
    } catch (err) {
      setSaveError(
        err.response?.data?.message || 'No se pudo guardar el perfil. Intenta de nuevo.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAddMateria = () => {
    if (!nuevaMateria.trim()) { setModalError('Ingresa el nombre'); return; }
    if (form.materias.includes(nuevaMateria.trim())) { setModalError('Ya existe'); return; }
    setForm((prev) => ({ ...prev, materias: [...prev.materias, nuevaMateria.trim()] }));
    setNuevaMateria('');
    setShowModal(false);
    setModalError('');
    if (errors.materias) setErrors((p) => ({ ...p, materias: '' }));
  };

  const handleRemoveMateria = (m) =>
    setForm((prev) => ({ ...prev, materias: prev.materias.filter((x) => x !== m) }));

  const s = getStyles(isDark);
  const t = createStyles(isDark);

  if (initialLoading) {
    return (
      <AppLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300, color: t.textSecondary, fontFamily: t.fontPrimary, fontSize: 14 }}>
          Cargando...
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <h1 style={s.pageTitle}>Perfil Académico</h1>
      <p style={s.pageDesc}>
        Personaliza tu experiencia. Esta información ayuda a AI.BERT a generar planes de
        estudio que realmente se adapten a tu realidad universitaria.
      </p>

      <div style={s.layout}>
        <div style={s.leftCol}>

          {/* ── CARRERA Y AVANCE ── */}
          <div style={s.card}>
            <div style={s.cardHeader}>
              <BookOpen size={18} color={isDark ? '#FF5B2E' : '#FF8430'} />
              <span style={s.cardTitle}>Carrera y Avance</span>
            </div>

            <div style={s.formRow}>
              {/* Carrera principal — solo lectura */}
              <div style={s.formGroup}>
                <label style={s.label}>Carrera principal</label>
                <input
                  style={{ ...s.input, opacity: 0.75, cursor: 'not-allowed' }}
                  type="text"
                  disabled
                  value={carreraPrincipal}
                />
                <span style={{ display: 'block', fontSize: 11, color: t.textMuted, marginTop: 5, fontStyle: 'italic' }}>
                  La carrera fue definida al momento del registro y no puede modificarse desde aquí.
                </span>
              </div>

              {/* Carrera secundaria — editable */}
              <div style={s.formGroup}>
                <label style={s.label}>Carrera secundaria (opcional)</label>
                <div style={{ position: 'relative' }}>
                  <select
                    style={{ ...s.input, ...s.select }}
                    value={form.carreraSecundaria}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, carreraSecundaria: e.target.value }))
                    }
                  >
                    <option value="" style={{ background: t.cardBg, color: t.textPrimary }}>
                      Ninguna
                    </option>
                    {carreras.map((c) => (
                      <option key={c.value} value={c.value} style={{ background: t.cardBg, color: t.textPrimary }}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    color={isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.40)'}
                    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                  />
                </div>
              </div>
            </div>

            <div style={s.formRow}>
              <div style={s.formGroup}>
                <label style={s.label}>Semestre actual</label>
                <div style={{ position: 'relative' }}>
                  <select
                    style={{ ...s.input, ...s.select, ...(errors.semestre ? s.inputError : {}) }}
                    value={form.semestre}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, semestre: e.target.value }));
                      if (errors.semestre) setErrors((p) => ({ ...p, semestre: '' }));
                    }}
                  >
                    <option value="" disabled style={{ background: t.cardBg, color: t.textSecondary }}>
                      Semestre
                    </option>
                    {semestres.map((sem) => (
                      <option key={sem.value} value={sem.value} style={{ background: t.cardBg, color: t.textPrimary }}>
                        {sem.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    color={isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.40)'}
                    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                  />
                </div>
                <ErrorMsg message={errors.semestre} />
              </div>

              <div style={s.formGroup}>
                <label style={s.label}>Promedio actual</label>
                <input
                  style={{ ...s.input, ...(errors.promedio ? s.inputError : {}) }}
                  type="text"
                  placeholder="0.0"
                  value={form.promedio}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, promedio: e.target.value }));
                    if (errors.promedio) setErrors((p) => ({ ...p, promedio: '' }));
                  }}
                />
                <ErrorMsg message={errors.promedio} />
              </div>
            </div>
          </div>

          {/* ── MATERIAS ── */}
          <div style={s.card}>
            <div style={s.cardHeader}>
              <FileText size={18} color={isDark ? '#FF5B2E' : '#FF8430'} />
              <span style={s.cardTitle}>Materias del Semestre</span>
            </div>
            <div style={s.tagRow}>
              {form.materias.length === 0 && (
                <span style={s.emptyTag}>No has añadido materias aún.</span>
              )}
              {form.materias.map((m) => (
                <div key={m} style={s.tag}>
                  <span style={s.tagText}>{m}</span>
                  <button style={s.tagClose} onClick={() => handleRemoveMateria(m)}>✕</button>
                </div>
              ))}
              <button style={s.addMateriaBtn} onClick={() => setShowModal(true)}>
                + Añadir materia
              </button>
            </div>
            <ErrorMsg message={errors.materias} />
          </div>

          {/* ── OBJETIVO ── */}
          <div style={s.card}>
            <div style={s.cardHeader}>
              <Target size={18} color={isDark ? '#FF5B2E' : '#FF8430'} />
              <span style={s.cardTitle}>Objetivo del Ciclo</span>
            </div>
            <div style={s.objetivoRow}>
              {objetivos.map((obj) => (
                <button
                  key={obj.id}
                  onClick={() => setForm((p) => ({ ...p, objetivo: obj.id }))}
                  style={{ ...s.objetivoBtn, ...(form.objetivo === obj.id ? s.objetivoBtnActive : {}) }}
                >
                  <obj.icon size={20} color={form.objetivo === obj.id ? '#fff' : (isDark ? '#FF5B2E' : '#FF8430')} />
                  <span style={s.objetivoLabel}>{obj.label}</span>
                </button>
              ))}
            </div>
            <ErrorMsg message={errors.objetivo} />
          </div>
        </div>

        {/* ── COLUMNA DERECHA ── */}
        <div style={s.rightCol}>

          <div style={s.card}>
            <div style={s.cardHeader}>
              <Clock size={18} color={isDark ? '#FF5B2E' : '#FF8430'} />
              <span style={s.cardTitle}>Disponibilidad</span>
            </div>
            {disp.map((d) => (
              <div
                key={d.id}
                style={{ ...s.dispItem, ...(form.disponibilidad === d.id ? s.dispItemActive : {}) }}
                onClick={() => setForm((p) => ({ ...p, disponibilidad: d.id }))}
              >
                <div style={s.dispRadio}>
                  {form.disponibilidad === d.id && <div style={s.dispRadioFill} />}
                </div>
                <span style={s.dispLabel}>{d.label}</span>
                <span style={s.dispHours}>{d.inicio} – {d.fin}</span>
              </div>
            ))}
            <ErrorMsg message={errors.disponibilidad} />
            <div style={s.estudioRow}>
              <span style={s.estudioLabel}>Estudio diario</span>
              <div style={s.estudioSlider}>
                <input
                  type="range" min="1" max="12"
                  style={{ flex: 1, accentColor: '#FF8430' }}
                  value={form.horasEstudio}
                  onChange={(e) => setForm((p) => ({ ...p, horasEstudio: e.target.value }))}
                />
                <span style={s.estudioVal}>{form.horasEstudio}h</span>
              </div>
            </div>
          </div>

          <div style={s.card}>
            <div style={s.cardHeader}>
              <Briefcase size={18} color={isDark ? '#FF5B2E' : '#FF8430'} />
              <span style={s.cardTitle}>¿Trabajas actualmente?</span>
            </div>
            <div style={s.trabajaRow}>
              <button
                onClick={() => setForm((p) => ({ ...p, trabaja: 'SI' }))}
                style={{ ...s.trabajaBtn, ...(form.trabaja === 'SI' ? s.trabajaBtnActive : {}) }}
              >
                Sí
              </button>
              <button
                onClick={() => setForm((p) => ({ ...p, trabaja: 'NO' }))}
                style={{ ...s.trabajaBtn, ...(form.trabaja === 'NO' ? s.trabajaBtnActiveNo : {}) }}
              >
                No
              </button>
            </div>
            <ErrorMsg message={errors.trabaja} />
          </div>

          <div style={s.quoteCard}>
            <Quote size={16} color={isDark ? '#FF5B2E' : '#FF8430'} style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={s.quoteText}>
              &ldquo;El 80% del &eacute;xito se basa simplemente en insistir.&rdquo; &mdash; Woody Allen
            </p>
          </div>

          {saveError && (
            <div style={{ fontSize: 12, color: t.error, textAlign: 'center', marginBottom: 8 }}>
              {saveError}
            </div>
          )}

          <button
            style={{ ...s.saveBtn, ...(saving ? { opacity: 0.7, cursor: 'not-allowed' } : {}) }}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Guardar Perfil'}
          </button>
        </div>
      </div>

      {/* ── MODAL AGREGAR MATERIA ── */}
      {showModal && (
        <div style={s.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={s.modalCard} onClick={(e) => e.stopPropagation()}>
            <h3 style={s.modalTitle}>Nueva Materia</h3>
            <input
              style={{ ...s.input, ...(modalError ? s.inputError : {}) }}
              placeholder="Ej: Cálculo Integral"
              autoFocus
              value={nuevaMateria}
              onChange={(e) => { setNuevaMateria(e.target.value); setModalError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleAddMateria()}
            />
            {modalError && <div style={s.errorRow}>{modalError}</div>}
            <div style={s.modalActions}>
              <button style={s.modalBtnSec} onClick={() => setShowModal(false)}>Cancelar</button>
              <button style={s.modalBtnPri} onClick={handleAddMateria}>Añadir</button>
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
    pageTitle: { fontFamily: t.fontPrimary, fontSize: 28, fontWeight: 800, color: isDark ? '#FF5B2E' : '#FF8430', margin: '0 0 8px 0' },
    pageDesc: { fontSize: 13, color: t.textSecondary, lineHeight: 1.6, marginBottom: 28, maxWidth: 680 },
    layout: { display: 'flex', gap: 20, alignItems: 'flex-start' },
    leftCol: { flex: 1, display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 },
    rightCol: { width: 220, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 },
    card: { background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: 16, padding: '18px 22px', boxShadow: t.cardShadow },
    cardHeader: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 },
    cardTitle: { fontSize: 14, fontWeight: 700, color: t.textPrimary, fontFamily: t.fontSecondary },
    formRow: { display: 'flex', gap: 16, marginBottom: 16 },
    formGroup: { flex: 1, minWidth: 0 },
    label: { display: 'block', fontSize: 11, fontWeight: 500, color: t.textSecondary, marginBottom: 6 },
    input: { width: '100%', background: t.inputBg, border: `1px solid ${t.inputBorder}`, borderRadius: 10, padding: '9px 12px', fontFamily: t.fontSecondary, fontSize: 12, color: t.textPrimary, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' },
    select: { appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer', paddingRight: 28 },
    inputError: { borderColor: t.error, boxShadow: `0 0 0 2px ${t.error}22` },
    errorRow: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: t.error, marginTop: 4, fontWeight: 500 },
    tagRow: { display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
    emptyTag: { fontSize: 11, color: t.textMuted, fontStyle: 'italic' },
    tag: { display: 'flex', alignItems: 'center', gap: 5, background: isDark ? 'rgba(196,16,122,0.15)' : 'rgba(255,132,48,0.12)', border: `1px solid ${isDark ? 'rgba(196,16,122,0.35)' : 'rgba(255,132,48,0.30)'}`, borderRadius: 20, padding: '4px 10px' },
    tagText: { fontSize: 11, color: isDark ? '#FF5B2E' : '#FF8430', fontWeight: 500 },
    tagClose: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 9, color: t.textSecondary, padding: 0, lineHeight: 1 },
    addMateriaBtn: { background: 'transparent', border: `1px dashed ${t.cardBorder}`, borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 500, color: t.textSecondary, cursor: 'pointer', fontFamily: t.fontSecondary },
    objetivoRow: { display: 'flex', gap: 12 },
    objetivoBtn: { flex: 1, padding: '14px 8px', borderRadius: 12, border: `1px solid ${t.cardBorder}`, background: t.inputBg, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, transition: 'all 0.2s' },
    objetivoBtnActive: { background: t.primaryGradientReverse, border: 'none' },
    objetivoLabel: { fontSize: 11, fontWeight: 600, color: t.textPrimary, textAlign: 'center', fontFamily: t.fontSecondary },
    dispItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, marginBottom: 8, cursor: 'pointer', border: `1px solid ${t.cardBorder}`, background: 'transparent', transition: 'all 0.2s' },
    dispItemActive: { background: t.primaryGradient, border: 'none' },
    dispRadio: { width: 14, height: 14, borderRadius: '50%', border: `2px solid ${t.textSecondary}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    dispRadioFill: { width: 6, height: 6, borderRadius: '50%', background: '#fff' },
    dispLabel: { fontSize: 12, fontWeight: 500, color: t.textPrimary, flex: 1 },
    dispHours: { fontSize: 11, color: t.textSecondary },
    estudioRow: { marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 },
    estudioLabel: { fontSize: 11, color: t.textSecondary },
    estudioSlider: { display: 'flex', alignItems: 'center', gap: 8 },
    estudioVal: { fontSize: 12, fontWeight: 700, color: isDark ? '#FF5B2E' : '#FF8430', minWidth: 24 },
    trabajaRow: { display: 'flex', gap: 10 },
    trabajaBtn: { flex: 1, padding: '9px', borderRadius: 10, border: `1px solid ${t.inputBorder}`, background: 'transparent', cursor: 'pointer', fontFamily: t.fontSecondary, fontSize: 13, fontWeight: 600, color: t.textSecondary, transition: 'all 0.2s' },
    trabajaBtnActive: { background: t.primaryGradient, border: 'none', color: '#fff' },
    trabajaBtnActiveNo: { background: t.cardBorder, border: 'none', color: t.textPrimary },
    quoteCard: { background: isDark ? 'rgba(196,16,122,0.08)' : 'rgba(255,132,48,0.08)', border: `1px solid ${isDark ? 'rgba(196,16,122,0.20)' : 'rgba(255,132,48,0.20)'}`, borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 10, alignItems: 'flex-start' },
    quoteText: { fontSize: 11.5, color: t.textSecondary, lineHeight: 1.6, fontStyle: 'italic', margin: 0 },
    saveBtn: { width: '100%', padding: 13, border: 'none', borderRadius: 10, background: t.primaryGradient, color: '#fff', fontFamily: t.fontPrimary, fontSize: 13, fontWeight: 700, letterSpacing: '0.04em', cursor: 'pointer' },
    modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalCard: { background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: 16, padding: '24px', width: '100%', maxWidth: 320, boxShadow: t.modalShadow },
    modalTitle: { margin: '0 0 16px 0', fontSize: 16, fontWeight: 700, color: t.textPrimary, fontFamily: t.fontPrimary },
    modalActions: { display: 'flex', gap: 12, marginTop: 20 },
    modalBtnSec: { flex: 1, padding: '10px', borderRadius: 8, border: `1px solid ${t.cardBorder}`, background: 'transparent', color: t.textSecondary, cursor: 'pointer', fontSize: 13, fontWeight: 600 },
    modalBtnPri: { flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: t.primaryGradient, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 },
  };
};

export default AcademicProfile;