import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { createStyles } from '../theme/createStyles';

/* ── Data ── */
const AMIGOS_ONLINE = [
  {
    id: 1,
    nombre: 'AlexNeural',
    carrera: 'Ing. de Inteligencia Artificial',
    avatar: null,
    initials: 'AN',
    color: '#FF5B2E',
    status: 'online',
    statusText: 'En curso: IA Avanzado',
  },
  {
    id: 2,
    nombre: 'Luna_Core',
    carrera: 'Artist · Battleborn',
    avatar: null,
    initials: 'LC',
    color: '#C4107A',
    status: 'online',
    statusText: 'Artist · Battleborn',
  },
];
const AMIGOS_OFFLINE = [
  {
    id: 3,
    nombre: 'Chipancini-Banini',
    carrera: 'Offline',
    avatar: null,
    initials: 'CB',
    color: '#6B7280',
    status: 'offline',
    statusText: 'Offline',
  },
];
const CHATS = [
  {
    id: 1,
    nombre: 'Maya Sterling',
    mensaje: 'escribiendo...',
    hora: 'AHORA',
    avatar: null,
    initials: 'MS',
    color: '#FF5B2E',
    escribiendo: true,
  },
  {
    id: 2,
    nombre: 'Marcus Chen',
    mensaje: '¿Revisaste el último módulo de IA?',
    hora: '14:21',
    avatar: null,
    initials: 'MC',
    color: '#C4107A',
    escribiendo: false,
  },
  {
    id: 3,
    nombre: 'Elena Rodríguez',
    mensaje: 'Enviado un archivo .py',
    hora: 'AYER',
    avatar: null,
    initials: 'ER',
    color: '#A855F7',
    escribiendo: false,
  },
];
const MENSAJES_MAYA = [
  {
    id: 1,
    tipo: 'recibido',
    texto: '¡Hola! ¿Lograste optimizar el núcleo del sistema ALBERT para la simulación de mañana?',
    hora: '14:10',
  },
  {
    id: 2,
    tipo: 'enviado',
    texto:
      'Sí, acabo de terminar. Reduje la latencia de respuesta en un 15% usando el nuevo protocolo orbital.',
    hora: '14:11',
  },
  {
    id: 3,
    tipo: 'recibido',
    texto:
      '¡Increíble! ¿Puedes enviarme los registros de depuración? Me gustaría compararlos con mi estructura.',
    hora: '14:12',
  },
  { id: 4, tipo: 'escribiendo', hora: '' },
];
const ADD_FRIENDS = [
  { id: 1, nombre: 'AlexNeural', avatar: null, initials: 'AN', color: '#FF5B2E' },
  { id: 2, nombre: 'Luna_Core', avatar: null, initials: 'LC', color: '#C4107A' },
  { id: 3, nombre: 'Chimpancini-Bananini', avatar: null, initials: 'CB', color: '#6B7280' },
];

/* ── Icons ── */
const FriendsIcon = ({ active, isDark }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke={
      active
        ? isDark
          ? '#FF5B2E'
          : '#FF8430'
        : isDark
          ? 'rgba(255,255,255,0.50)'
          : 'rgba(0,0,0,0.40)'
    }
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const ChatIcon = ({ active, isDark }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke={
      active
        ? isDark
          ? '#FF5B2E'
          : '#FF8430'
        : isDark
          ? 'rgba(255,255,255,0.50)'
          : 'rgba(0,0,0,0.40)'
    }
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const AddFriendIcon = ({ active, isDark }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke={
      active
        ? isDark
          ? '#FF5B2E'
          : '#FF8430'
        : isDark
          ? 'rgba(255,255,255,0.50)'
          : 'rgba(0,0,0,0.40)'
    }
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="22" y1="11" x2="16" y2="11" />
  </svg>
);
const SearchIcon = ({ isDark }) => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke={isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);
const SendIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff" stroke="none">
    <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
  </svg>
);
const CloseIcon = ({ isDark }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke={isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.40)'}
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);
const MessageIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#fff"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const AddPersonIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#fff"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="22" y1="11" x2="16" y2="11" />
  </svg>
);
const BackIcon = ({ isDark }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke={isDark ? 'rgba(255,255,255,0.60)' : 'rgba(0,0,0,0.50)'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

/* ── Avatar ── */
const Avatar = ({ item, size = 36 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: item.color + '33',
      border: `2px solid ${item.color}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.3,
      fontWeight: 700,
      color: item.color,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      flexShrink: 0,
      position: 'relative',
    }}
  >
    {item.initials}
    {item.status === 'online' && (
      <div
        style={{
          position: 'absolute',
          bottom: 1,
          right: 1,
          width: size * 0.22,
          height: size * 0.22,
          borderRadius: '50%',
          background: '#22C55E',
          border: '1.5px solid #fff',
        }}
      />
    )}
  </div>
);

/* ── SocialPopup ── */
const SocialPopup = ({ onClose }) => {
  const { isDark } = useTheme();
  const [tab, setTab] = useState('friends'); // friends | chat | add
  const [selectedUser, setSelectedUser] = useState(null);
  const [openChat, setOpenChat] = useState(null);
  const [msgInput, setMsgInput] = useState('');
  const s = getStyles(isDark);

  const renderFriends = () => (
    <>
      {selectedUser ? (
        /* ── CARD USUARIO ── */
        <div style={s.userCard}>
          <button style={s.cardClose} onClick={() => setSelectedUser(null)}>
            <CloseIcon isDark={isDark} />
          </button>
          <div style={{ ...s.userCardAvatar, border: `3px solid ${selectedUser.color}` }}>
            <span
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: selectedUser.color,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {selectedUser.initials}
            </span>
            <div
              style={{
                position: 'absolute',
                bottom: 4,
                right: 4,
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: selectedUser.status === 'online' ? '#22C55E' : '#6B7280',
                border: '2px solid #fff',
              }}
            />
          </div>
          <div style={s.userCardName}>{selectedUser.nombre}</div>
          <div style={s.userCardStatus}>
            <span
              style={{
                color: selectedUser.status === 'online' ? '#22C55E' : '#6B7280',
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              {selectedUser.status === 'online' ? 'Online' : 'Offline'}
            </span>
            <span
              style={{
                fontSize: 11,
                color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.40)',
                marginLeft: 6,
              }}
            >
              ING SISTEMAS
            </span>
          </div>
          <button
            style={s.sendMsgBtn}
            onClick={() => {
              setOpenChat(selectedUser);
              setTab('chat');
              setSelectedUser(null);
            }}
          >
            <MessageIcon /> Send Message
          </button>
        </div>
      ) : (
        <>
          <div style={s.searchWrap}>
            <SearchIcon isDark={isDark} />
            <input style={s.searchInput} placeholder="Search friends..." />
          </div>
          <div style={s.sectionLabel}>
            Online <span style={s.sectionCount}>{AMIGOS_ONLINE.length} ↑</span>
          </div>
          {AMIGOS_ONLINE.map((u) => (
            <div key={u.id} style={s.friendRow} onClick={() => setSelectedUser(u)}>
              <Avatar item={u} />
              <div style={s.friendInfo}>
                <div style={s.friendName}>{u.nombre}</div>
                <div style={s.friendStatus}>{u.statusText}</div>
              </div>
            </div>
          ))}
          <div style={s.sectionLabel}>
            Offline <span style={s.sectionCount}>{AMIGOS_OFFLINE.length} ↓</span>
          </div>
          {AMIGOS_OFFLINE.map((u) => (
            <div key={u.id} style={{ ...s.friendRow, opacity: 0.6 }}>
              <Avatar item={u} />
              <div style={s.friendInfo}>
                <div style={s.friendName}>{u.nombre}</div>
                <div style={s.friendStatus}>{u.statusText}</div>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );

  const renderChat = () => (
    <>
      {openChat ? (
        /* ── CONVERSACIÓN ── */
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={s.chatHeader}>
            <button style={s.backBtn} onClick={() => setOpenChat(null)}>
              <BackIcon isDark={isDark} />
            </button>
            <Avatar item={openChat} size={30} />
            <div>
              <div style={s.chatHeaderName}>{openChat.nombre}</div>
              <div style={{ fontSize: 10, color: '#22C55E', fontWeight: 600 }}>escribiendo...</div>
            </div>
          </div>
          <div style={s.mensajesList}>
            <div style={s.protocolBadge}>PROTOCOL_SESSION_ESTABLISHED // 21.05.2024</div>
            {MENSAJES_MAYA.map((m) =>
              m.tipo === 'escribiendo' ? (
                <div key={m.id} style={s.mensajeRecibido}>
                  <div style={s.bubbleRecibido}>
                    <span style={{ letterSpacing: 2 }}>• • •</span>
                  </div>
                </div>
              ) : m.tipo === 'recibido' ? (
                <div key={m.id} style={s.mensajeRecibido}>
                  <div style={s.bubbleRecibido}>{m.texto}</div>
                </div>
              ) : (
                <div key={m.id} style={s.mensajeEnviado}>
                  <div style={s.bubbleEnviado}>{m.texto}</div>
                </div>
              )
            )}
          </div>
          <div style={s.inputRow}>
            <input
              style={s.chatInput}
              placeholder="Escribe un mensaje encriptado..."
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
            />
            <button style={s.sendBtn}>
              <SendIcon />
            </button>
          </div>
        </div>
      ) : (
        /* ── LISTA CHATS ── */
        <>
          <div style={s.chatListHeader}>
            <span style={s.chatListTitle}>Mensajes</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.40)'}
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </div>
          <div style={s.searchWrap}>
            <SearchIcon isDark={isDark} />
            <input style={s.searchInput} placeholder="Buscar amigos..." />
          </div>
          {CHATS.map((c) => (
            <div key={c.id} style={s.chatRow} onClick={() => setOpenChat(c)}>
              <Avatar item={c} size={38} />
              <div style={s.chatRowInfo}>
                <div style={s.chatRowName}>{c.nombre}</div>
                <div
                  style={{
                    ...s.chatRowMsg,
                    color: c.escribiendo ? (isDark ? '#FF5B2E' : '#FF8430') : undefined,
                  }}
                >
                  {c.mensaje}
                </div>
              </div>
              <div style={s.chatRowHora}>{c.hora}</div>
            </div>
          ))}
        </>
      )}
    </>
  );

  const renderAdd = () => (
    <>
      <h3 style={s.addTitle}>Añadir amigo</h3>
      <div style={s.searchWrap}>
        <SearchIcon isDark={isDark} />
        <input style={s.searchInput} placeholder="Search friends..." />
      </div>
      <div style={s.sectionLabel}>
        Online <span style={s.sectionCount}>{ADD_FRIENDS.length} ↑</span>
      </div>
      {ADD_FRIENDS.map((u) => (
        <div
          key={u.id}
          style={s.addFriendRow}
          onClick={() => setSelectedUser({ ...u, status: 'online', statusText: 'Online' })}
        >
          <Avatar item={u} />
          <div style={s.friendName}>{u.nombre}</div>
        </div>
      ))}
    </>
  );

  return (
    <div style={s.popup}>
      {/* TABS */}
      <div style={s.tabs}>
        <button
          style={{ ...s.tabBtn, ...(tab === 'friends' ? s.tabActive : {}) }}
          onClick={() => {
            setTab('friends');
            setSelectedUser(null);
          }}
        >
          <FriendsIcon active={tab === 'friends'} isDark={isDark} />
        </button>
        <button
          style={{ ...s.tabBtn, ...(tab === 'chat' ? s.tabActive : {}) }}
          onClick={() => {
            setTab('chat');
            setSelectedUser(null);
          }}
        >
          <ChatIcon active={tab === 'chat'} isDark={isDark} />
        </button>
        <button
          style={{ ...s.tabBtn, ...(tab === 'add' ? s.tabActive : {}) }}
          onClick={() => {
            setTab('add');
            setSelectedUser(null);
          }}
        >
          <AddFriendIcon active={tab === 'add'} isDark={isDark} />
        </button>
        {/* Avatar usuario */}
        <div style={s.myAvatar}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>JS</span>
        </div>
      </div>

      {/* CONTENIDO */}
      <div style={s.body}>
        {!selectedUser && tab === 'friends' && <h3 style={s.title}>Social</h3>}
        {tab === 'friends' && renderFriends()}
        {tab === 'chat' && renderChat()}
        {tab === 'add' && renderAdd()}
      </div>

      {/* CARD USUARIO (sobre cualquier tab) */}
      {selectedUser && tab !== 'friends' && (
        <div style={s.overlayCard}>
          <div style={s.userCard}>
            <button style={s.cardClose} onClick={() => setSelectedUser(null)}>
              <CloseIcon isDark={isDark} />
            </button>
            <div style={{ ...s.userCardAvatar, border: `3px solid ${selectedUser.color}` }}>
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: selectedUser.color,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {selectedUser.initials}
              </span>
              <div
                style={{
                  position: 'absolute',
                  bottom: 4,
                  right: 4,
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: '#22C55E',
                  border: '2px solid #fff',
                }}
              />
            </div>
            <div style={s.userCardName}>{selectedUser.nombre}</div>
            <div style={s.userCardBadge}>{selectedUser.initials}</div>
            <button style={s.addFriendBtn}>
              <AddPersonIcon /> Add Friend
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const getStyles = (isDark) => {
  const t = createStyles(isDark);
  return {
    popup: {
      position: 'absolute',
      top: 'calc(100% + 10px)',
      right: 0,
      width: 300,
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 16,
      boxShadow: t.popupShadow,
      zIndex: 100,
      overflow: 'hidden',
      maxHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
    },
    tabs: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      padding: '10px 14px',
      borderBottom: `1px solid ${t.cardBorder}`,
    },
    tabBtn: {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: '6px 8px',
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 0.15s',
    },
    tabActive: {
      background: isDark ? 'rgba(255,91,46,0.12)' : 'rgba(255,132,48,0.12)',
    },
    myAvatar: {
      marginLeft: 'auto',
      width: 30,
      height: 30,
      borderRadius: '50%',
      background: t.primaryGradient,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    body: {
      padding: '12px 14px',
      overflowY: 'auto',
      flex: 1,
    },
    title: {
      fontFamily: t.fontPrimary,
      fontSize: 18,
      fontWeight: 800,
      color: t.textPrimary,
      margin: '0 0 10px 0',
    },
    addTitle: {
      fontFamily: t.fontPrimary,
      fontSize: 18,
      fontWeight: 800,
      color: t.textPrimary,
      margin: '0 0 10px 0',
    },
    searchWrap: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: t.inputBg,
      borderRadius: 10,
      padding: '7px 12px',
      marginBottom: 12,
    },
    searchInput: {
      background: 'none',
      border: 'none',
      outline: 'none',
      fontSize: 12,
      color: t.textSecondary,
      fontFamily: t.fontSecondary,
      width: '100%',
    },
    sectionLabel: {
      fontSize: 11,
      fontWeight: 700,
      color: t.textMuted,
      marginBottom: 8,
      display: 'flex',
      justifyContent: 'space-between',
    },
    sectionCount: {
      fontSize: 10,
      color: t.textMuted,
    },
    friendRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '7px 6px',
      borderRadius: 10,
      cursor: 'pointer',
      marginBottom: 2,
      transition: 'background 0.15s',
    },
    friendInfo: { flex: 1, minWidth: 0 },
    friendName: {
      fontSize: 13,
      fontWeight: 600,
      color: t.textPrimary,
      fontFamily: t.fontSecondary,
    },
    friendStatus: {
      fontSize: 10,
      color: t.textSecondary,
    },

    /* USER CARD */
    userCard: {
      background: isDark ? '#1E1E1E' : '#FFF5F5',
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 16,
      padding: '20px 16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      position: 'relative',
      marginBottom: 8,
    },
    cardClose: {
      position: 'absolute',
      top: 10,
      right: 10,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 4,
      display: 'flex',
      alignItems: 'center',
    },
    userCardAvatar: {
      width: 70,
      height: 70,
      borderRadius: '50%',
      background: isDark ? '#2a2a2a' : '#f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    userCardName: {
      fontFamily: t.fontPrimary,
      fontSize: 18,
      fontWeight: 800,
      color: t.textPrimary,
    },
    userCardStatus: {
      display: 'flex',
      alignItems: 'center',
    },
    userCardBadge: {
      background: 'rgba(34,197,94,0.15)',
      color: '#22C55E',
      fontSize: 10,
      fontWeight: 700,
      padding: '3px 10px',
      borderRadius: 20,
    },
    sendMsgBtn: {
      background: t.primaryGradient,
      border: 'none',
      borderRadius: 10,
      padding: '10px 20px',
      color: '#fff',
      fontFamily: t.fontSecondary,
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginTop: 4,
    },
    addFriendBtn: {
      background: t.primaryGradient,
      border: 'none',
      borderRadius: 10,
      padding: '10px 20px',
      color: '#fff',
      fontFamily: t.fontSecondary,
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginTop: 4,
    },

    /* CHAT */
    chatListHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    chatListTitle: {
      fontFamily: t.fontPrimary,
      fontSize: 18,
      fontWeight: 800,
      color: t.textPrimary,
    },
    chatRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 6px',
      borderRadius: 10,
      cursor: 'pointer',
      marginBottom: 2,
    },
    chatRowInfo: { flex: 1, minWidth: 0 },
    chatRowName: {
      fontSize: 13,
      fontWeight: 600,
      color: t.textPrimary,
      fontFamily: t.fontSecondary,
    },
    chatRowMsg: {
      fontSize: 11,
      color: t.textSecondary,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    chatRowHora: {
      fontSize: 10,
      color: t.textMuted,
      flexShrink: 0,
    },
    chatHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      paddingBottom: 10,
      borderBottom: `1px solid ${t.cardBorder}`,
      marginBottom: 10,
    },
    backBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 4,
      display: 'flex',
      alignItems: 'center',
    },
    chatHeaderName: {
      fontSize: 13,
      fontWeight: 700,
      color: t.textPrimary,
    },
    mensajesList: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      overflowY: 'auto',
      maxHeight: 220,
      paddingBottom: 8,
    },
    protocolBadge: {
      fontSize: 8,
      textAlign: 'center',
      color: t.textMuted,
      letterSpacing: '0.05em',
      marginBottom: 4,
    },
    mensajeRecibido: { display: 'flex', justifyContent: 'flex-start' },
    mensajeEnviado: { display: 'flex', justifyContent: 'flex-end' },
    bubbleRecibido: {
      background: t.inputBg,
      borderRadius: '12px 12px 12px 2px',
      padding: '8px 12px',
      fontSize: 11,
      color: t.textPrimary,
      maxWidth: '80%',
      lineHeight: 1.5,
    },
    bubbleEnviado: {
      background: t.primaryGradient,
      borderRadius: '12px 12px 2px 12px',
      padding: '8px 12px',
      fontSize: 11,
      color: '#fff',
      maxWidth: '80%',
      lineHeight: 1.5,
    },
    inputRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      paddingTop: 8,
      borderTop: `1px solid ${t.cardBorder}`,
    },
    chatInput: {
      flex: 1,
      background: t.inputBg,
      border: 'none',
      borderRadius: 10,
      padding: '8px 12px',
      fontSize: 11,
      color: t.textPrimary,
      fontFamily: t.fontSecondary,
      outline: 'none',
    },
    sendBtn: {
      width: 30,
      height: 30,
      borderRadius: '50%',
      background: t.primaryGradient,
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },

    /* ADD FRIEND */
    addFriendRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 10px',
      borderRadius: 10,
      cursor: 'pointer',
      marginBottom: 4,
      background: t.inputBg,
      border: `1px solid ${t.cardBorder}`,
    },
    overlayCard: {
      position: 'absolute',
      inset: 0,
      background: isDark ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      zIndex: 10,
      borderRadius: 16,
    },
  };
};

export default SocialPopup;
