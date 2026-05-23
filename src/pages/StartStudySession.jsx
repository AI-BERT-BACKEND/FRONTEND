import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/Layout/AppLayout';
import ProgressBar from '../components/ProgressBar';
import { useTheme } from '../context/ThemeContext';
import { createStyles } from '../theme/createStyles';
import { useAuth } from '../context/AuthContext';
import socialService from '../services/socialService';
import academicService from '../services/academicService';



const TOTAL_BLOQUES = 4;

const fmt = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────

const LIMITE_SESION = 3 * 60 * 60; // 3 horas en segundos

const StartStudySession = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const s = getStyles(isDark);
  const t = createStyles(isDark);

  const [segundos,      setSegundos]      = useState(23 * 60 + 41);
  const [corriendo,     setCorriendo]     = useState(true);
  const [bloque,        setBloque]        = useState(2);
  const [bitacora,      setBitacora]      = useState([]);
  const [anotacion,     setAnotacion]     = useState('');
  const [tiempoTotal,   setTiempoTotal]   = useState(0);
  const [showShare,     setShowShare]     = useState(false);
  const [participantes, setParticipantes] = useState([]);
  const [meta,          setMeta]          = useState(null);
  const [sesionId] = useState(() => Math.random().toString(36).slice(2, 8));
  const [loading,       setLoading]       = useState(true);

  const sesionCumplida = tiempoTotal >= LIMITE_SESION;

  useEffect(() => {
    if (!corriendo || sesionCumplida) return;
    const id = setInterval(() => {
      setSegundos((p) => Math.max(0, p - 1));
      setTiempoTotal((p) => p + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [corriendo, sesionCumplida]);

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;

    const fetchData = async () => {
      try {
        const [panel, goals] = await Promise.all([
          socialService.getSocialPanel(user.id),
          academicService.getGoals(),
        ]);
        if (cancelled) return;
        if (panel?.bitacora) setBitacora(panel.bitacora);
        if (panel?.participantes) setParticipantes(panel.participantes);
        if (goals?.length) {
          setMeta({ titulo: goals[0].titulo, progreso: goals[0].progreso });
        }
      } catch {
        // fallback to empty/null
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, [user?.id]);

  const irBloque = (delta) => {
    const next = bloque + delta;
    if (next < 1 || next > TOTAL_BLOQUES) return;
    setBloque(next);
    setSegundos(23 * 60 + 41);
  };

  const agregarAnotacion = () => {
    const txt = anotacion.trim();
    if (!txt) return;
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    setBitacora((p) => [
      { id: Date.now(), tiempo: `${h}:${m}`, autor: 'YO', color: '#00CFFF', texto: txt },
      ...p,
    ]);
    setAnotacion('');
  };

  if (loading) {
    return (
      <AppLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 520, color: t.textMuted, fontFamily: t.fontSecondary, fontSize: 13 }}>
          Cargando…
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
       <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 600, color: '#FFFFFF', fontFamily: t.fontSecondary, padding: '4px 0', marginBottom: 14 }} onClick={() => navigate(-1)}>
         ← Volver
       </button>
      <div style={s.layout}>

        {/* ── IZQUIERDA: BITÁCORA ───────────────────────────── */}
        <div style={s.bitacoraPanel}>

          <div style={s.panelHeader}>
            <span style={s.panelHeaderTitle}>BITÁCORA</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke={isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.30)'}
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          </div>

          <div style={s.bitacoraList}>
            {bitacora.map((e) => (
              <div key={e.id} style={s.entry}>
                <div style={s.entryMeta}>
                  <span style={s.entryTime}>{e.tiempo}</span>
                  <span style={{ ...s.entryAutor, color: e.color }}>— {e.autor}</span>
                </div>
                <p style={s.entryTexto}>{e.texto}</p>
              </div>
            ))}
          </div>

          <div style={s.inputRow}>
            <input
              style={s.anotacionInput}
              type="text"
              placeholder="Nueva anotación"
              value={anotacion}
              onChange={(e) => setAnotacion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && agregarAnotacion()}
            />
            <button style={s.sendBtn} onClick={agregarAnotacion}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>

        {/* ── CENTRO: TIMER ─────────────────────────────────── */}
        <div style={s.timerPanel}>
          <span style={s.deepLabel}>DEEP WORK SESSION</span>

          <div style={s.timerDisplay}>{fmt(segundos)}</div>

          <div style={s.badges}>
            <span style={s.bloqueBadge}>
              BLOQUE {String(bloque).padStart(2, '0')}/{String(TOTAL_BLOQUES).padStart(2, '0')}
            </span>
            <span style={{ ...s.estadoBadge, ...(corriendo ? {} : s.estadoBadgePaused) }}>
              {corriendo ? 'EN CURSO' : 'PAUSADO'}
            </span>
          </div>

          {sesionCumplida && (
            <div style={{
              background: 'rgba(34,197,94,0.14)',
              border: '1px solid rgba(34,197,94,0.30)',
              borderRadius: 12,
              padding: '10px 18px',
              fontSize: 12,
              color: '#22C55E',
              fontWeight: 600,
              textAlign: 'center',
              fontFamily: t.fontSecondary,
            }}>
              ✓ Sesión completada — 3 horas alcanzadas
            </div>
          )}

          <div style={s.controls}>
            <button
              style={{ ...s.controlBtn, ...(sesionCumplida ? { opacity: 0.4, cursor: 'not-allowed' } : {}) }}
              onClick={() => !sesionCumplida && irBloque(-1)}
              disabled={sesionCumplida}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="19 20 9 12 19 4 19 20"/>
                <line x1="5" y1="19" x2="5" y2="5"/>
              </svg>
            </button>

            <button
              style={{ ...s.playBtn, ...(sesionCumplida ? { opacity: 0.4, cursor: 'not-allowed' } : {}) }}
              onClick={() => !sesionCumplida && setCorriendo((p) => !p)}
              disabled={sesionCumplida}
            >
              {corriendo && !sesionCumplida ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="4" width="4" height="16"/>
                  <rect x="14" y="4" width="4" height="16"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              )}
            </button>

            <button
              style={{ ...s.controlBtn, ...(sesionCumplida ? { opacity: 0.4, cursor: 'not-allowed' } : {}) }}
              onClick={() => !sesionCumplida && irBloque(1)}
              disabled={sesionCumplida}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 4 15 12 5 20 5 4"/>
                <line x1="19" y1="5" x2="19" y2="19"/>
              </svg>
            </button>
          </div>
        </div>

        {/* ── DERECHA: PARTICIPANTES + META ─────────────────── */}
        <div style={s.rightPanel}>

          <div style={s.enSesionHeader}>
            <span style={s.enSesionTitle}>EN ESTA SESIÓN</span>
          </div>

          <div style={s.participantesList}>
            {participantes.map((p) => (
              <div key={p.id} style={s.participanteRow}>
                <div style={s.avatarWrap}>
                  <div style={s.avatar}>{p.iniciales}</div>
                  <span style={{
                    ...s.presenciaDot,
                    background: p.activo ? '#22C55E' : '#EF4444',
                  }} />
                </div>
                <div style={s.pInfo}>
                  <div style={s.pNombre}>{p.nombre}</div>
                  <div style={{
                    ...s.pEstado,
                    color: p.activo ? '#22C55E' : '#EF4444',
                  }}>
                    {p.activo ? 'Disponible ahora' : 'Ocupado'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button style={s.invitarBtn} onClick={() => setShowShare(true)}>INVITAR A LA SALA</button>

          {/* Meta actual */}
          <div style={s.metaCard}>
            <span style={s.metaLabel}>META ACTUAL</span>
            <p style={s.metaDesc}>{meta?.titulo || ''}</p>
            <span style={s.progresoLabel}>PROGRESO</span>
            <ProgressBar value={meta?.progreso || 0} isDark={isDark} />
            <span style={s.progresoPct}>{meta?.progreso || 0}%</span>
          </div>

        </div>
      </div>
      {/* ── MODAL COMPARTIR ── */}
      {showShare && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.70)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 300, backdropFilter: 'blur(3px)',
        }} onClick={() => setShowShare(false)}>
          <div style={{
            background: t.cardBg, border: `1px solid ${t.cardBorder}`,
            borderRadius: 20, width: '100%', maxWidth: 360, margin: '0 20px',
            padding: '28px 28px 24px', boxShadow: t.modalShadow,
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontFamily: t.fontPrimary, fontSize: 18, fontWeight: 700, backgroundImage: t.primaryGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Invitar a la sala
              </span>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textSecondary, fontSize: 18, lineHeight: 1, padding: 4 }} onClick={() => setShowShare(false)}>✕</button>
            </div>
            <p style={{ fontSize: 12, color: t.textSecondary, marginBottom: 16 }}>
              Comparte este enlace con tus compañeros para unirse a la sesión de estudio.
            </p>
            <div style={{ display: 'flex', gap: 8, background: t.inputBg, border: `1px solid ${t.inputBorder}`, borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
              <span style={{ flex: 1, fontSize: 12, color: t.textSecondary, fontFamily: t.fontSecondary, wordBreak: 'break-all' }}>
                aibert.app/sesion/sala-{sesionId}
              </span>
              <button style={{ background: t.primaryGradient, border: 'none', borderRadius: 7, padding: '4px 12px', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
                Copiar
              </button>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['WhatsApp', 'Teams', 'Email'].map(app => (
                <button key={app} style={{ flex: 1, padding: '9px 0', borderRadius: 9, border: `1px solid ${t.cardBorder}`, background: 'transparent', cursor: 'pointer', fontFamily: t.fontSecondary, fontSize: 11, fontWeight: 600, color: t.textSecondary }}>
                  {app}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

// ── ESTILOS ───────────────────────────────────────────────────────────────────

const getStyles = (isDark) => {
  const t = createStyles(isDark);
  const accent = isDark ? '#FF5B2E' : '#FF8430';

  return {
    layout: {
      display: 'flex',
      gap: 16,
      alignItems: 'stretch',
      minHeight: 520,
    },

    // ── BITÁCORA ─────────────────────────────────────────────
    bitacoraPanel: {
      width: 268,
      flexShrink: 0,
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 16,
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: t.cardShadow,
    },
    panelHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 10,
      marginBottom: 12,
      borderBottom: `1px solid ${t.cardBorder}`,
    },
    panelHeaderTitle: {
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.10em',
      color: t.textMuted,
      fontFamily: t.fontSecondary,
    },
    bitacoraList: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      overflowY: 'auto',
    },
    entry: {
      background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.025)',
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 10,
      padding: '10px 12px',
    },
    entryMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      marginBottom: 5,
    },
    entryTime: {
      fontSize: 10,
      color: t.textMuted,
      fontFamily: t.fontSecondary,
    },
    entryAutor: {
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.05em',
      fontFamily: t.fontSecondary,
    },
    entryTexto: {
      fontSize: 11,
      color: t.textSecondary,
      lineHeight: 1.55,
      margin: 0,
      fontFamily: t.fontSecondary,
    },
    inputRow: {
      display: 'flex',
      gap: 8,
      marginTop: 12,
      paddingTop: 10,
      borderTop: `1px solid ${t.cardBorder}`,
    },
    anotacionInput: {
      flex: 1,
      background: t.inputBg,
      border: `1px solid ${t.inputBorder}`,
      borderRadius: 8,
      padding: '8px 10px',
      fontFamily: t.fontSecondary,
      fontSize: 12,
      color: t.textPrimary,
      outline: 'none',
    },
    sendBtn: {
      width: 32,
      height: 32,
      borderRadius: 8,
      border: 'none',
      background: t.primaryGradient,
      color: '#fff',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },

    // ── TIMER ─────────────────────────────────────────────────
    timerPanel: {
      flex: 1,
      background: t.cardBgAlt,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 16,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
      padding: '32px 24px',
      boxShadow: t.cardShadow,
    },
    deepLabel: {
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.22em',
      color: t.textMuted,
      fontFamily: t.fontSecondary,
    },
    timerDisplay: {
      fontFamily: t.fontPrimary,
      fontSize: 'clamp(64px, 8vw, 88px)',
      fontWeight: 800,
      color: t.textPrimary,
      lineHeight: 1,
      letterSpacing: '-0.03em',
    },
    badges: {
      display: 'flex',
      gap: 8,
    },
    bloqueBadge: {
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: '0.07em',
      padding: '4px 10px',
      borderRadius: 20,
      background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)',
      color: t.textSecondary,
      fontFamily: t.fontSecondary,
    },
    estadoBadge: {
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: '0.07em',
      padding: '4px 10px',
      borderRadius: 20,
      background: 'rgba(34,197,94,0.14)',
      color: '#22C55E',
      fontFamily: t.fontSecondary,
    },
    estadoBadgePaused: {
      background: isDark ? 'rgba(255,91,46,0.16)' : 'rgba(255,132,48,0.14)',
      color: accent,
    },
    controls: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    },
    controlBtn: {
      width: 40,
      height: 40,
      borderRadius: '50%',
      border: `1px solid ${t.cardBorder}`,
      background: 'transparent',
      color: t.textSecondary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
    },
    playBtn: {
      width: 52,
      height: 52,
      borderRadius: '50%',
      border: 'none',
      background: t.primaryGradient,
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: isDark
        ? '0 0 24px rgba(196,16,122,0.45)'
        : '0 4px 18px rgba(255,132,48,0.38)',
    },

    // ── DERECHA ───────────────────────────────────────────────
    rightPanel: {
      width: 210,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    },
    enSesionHeader: {
      paddingBottom: 8,
      borderBottom: `1px solid ${t.cardBorder}`,
    },
    enSesionTitle: {
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.10em',
      color: t.textMuted,
      fontFamily: t.fontSecondary,
    },
    participantesList: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    },
    participanteRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    },
    avatarWrap: {
      position: 'relative',
      flexShrink: 0,
    },
    avatar: {
      width: 30,
      height: 30,
      borderRadius: '50%',
      background: isDark
        ? 'linear-gradient(135deg, #C4107A, #FF5B2E)'
        : 'linear-gradient(135deg, #FF8430, #F7306D)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: 10,
      fontWeight: 700,
      fontFamily: t.fontPrimary,
    },
    presenciaDot: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 8,
      height: 8,
      borderRadius: '50%',
      border: `2px solid ${t.bg}`,
    },
    pInfo: {
      flex: 1,
      minWidth: 0,
    },
    pNombre: {
      fontSize: 12,
      fontWeight: 600,
      color: t.textPrimary,
      fontFamily: t.fontSecondary,
    },
    pEstado: {
      fontSize: 9,
      fontFamily: t.fontSecondary,
      marginTop: 1,
    },
    invitarBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontFamily: t.fontSecondary,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.06em',
      color: accent,
      padding: '4px 0',
      textAlign: 'left',
    },

    // Meta actual
    metaCard: {
      marginTop: 'auto',
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderLeft: `3px solid ${accent}`,
      borderRadius: 12,
      padding: '14px',
      boxShadow: t.cardShadow,
      display: 'flex',
      flexDirection: 'column',
      gap: 5,
    },
    metaLabel: {
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: '0.10em',
      color: accent,
      fontFamily: t.fontSecondary,
    },
    metaDesc: {
      fontSize: 11,
      color: t.textSecondary,
      lineHeight: 1.5,
      margin: 0,
      fontFamily: t.fontSecondary,
    },
    progresoLabel: {
      fontSize: 9,
      fontWeight: 600,
      letterSpacing: '0.07em',
      color: t.textMuted,
      fontFamily: t.fontSecondary,
      marginTop: 4,
    },
    progresoPct: {
      fontSize: 11,
      fontWeight: 700,
      color: t.textPrimary,
      fontFamily: t.fontPrimary,
      textAlign: 'right',
    },
  };
};

export default StartStudySession;
