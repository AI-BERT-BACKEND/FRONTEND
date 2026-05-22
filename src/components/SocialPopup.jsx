import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getSocialStyles } from './SocialPopup.styles';
import { 
  FriendsIcon, ChatIcon, AddFriendIcon, SearchIcon, 
  SendIcon, CloseIcon, MessageIcon, AddPersonIcon, BackIcon 
} from './SocialPopupIcons';
import { ArrowUp, ArrowDown, MoreHorizontal } from 'lucide-react';
import { 
  AMIGOS_ONLINE, AMIGOS_OFFLINE, CHATS, 
  MENSAJES_MAYA, ADD_FRIENDS 
} from './SocialPopup.data';

/* ── Avatar Component ── */
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
  const s = getSocialStyles(isDark);

  const renderFriends = () => (
    <>
      {selectedUser ? (
        /* ── CARD USUARIO ── */
        <div style={s.userCard}>
          <button style={s.cardClose} onClick={() => setSelectedUser(null)} aria-label="Cerrar perfil">
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
            <input style={s.searchInput} placeholder="Search friends..." aria-label="Buscar amigos" />
          </div>
          <div style={s.sectionLabel}>
            Online <span style={{ ...s.sectionCount, display: 'flex', alignItems: 'center', gap: 2 }}>{AMIGOS_ONLINE.length} <ArrowUp size={10} /></span>
          </div>
          {AMIGOS_ONLINE.map((u) => (
            <div 
              key={u.id} 
              style={s.friendRow} 
              onClick={() => setSelectedUser(u)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedUser(u)}
              aria-label={`Ver perfil de ${u.nombre}`}
            >
              <Avatar item={u} />
              <div style={s.friendInfo}>
                <div style={s.friendName}>{u.nombre}</div>
                <div style={s.friendStatus}>{u.statusText}</div>
              </div>
            </div>
          ))}
          <div style={s.sectionLabel}>
            Offline <span style={{ ...s.sectionCount, display: 'flex', alignItems: 'center', gap: 2 }}>{AMIGOS_OFFLINE.length} <ArrowDown size={10} /></span>
          </div>
          {AMIGOS_OFFLINE.map((u) => (
            <div 
              key={u.id} 
              style={{ ...s.friendRow, opacity: 0.6 }}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedUser(u)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedUser(u)}
              aria-label={`Ver perfil de ${u.nombre}`}
            >
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
            <button style={s.backBtn} onClick={() => setOpenChat(null)} aria-label="Volver a la lista de chats">
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
            {MENSAJES_MAYA.map((m, idx) =>
              m.tipo === 'escribiendo' ? (
                <div key={`msg-${idx}`} style={s.mensajeRecibido}>
                  <div style={s.bubbleRecibido}>
                    <MoreHorizontal size={14} />
                  </div>
                </div>
              ) : m.tipo === 'recibido' ? (
                <div key={`msg-${idx}`} style={s.mensajeRecibido}>
                  <div style={s.bubbleRecibido}>{m.texto}</div>
                </div>
              ) : (
                <div key={`msg-${idx}`} style={s.mensajeEnviado}>
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
              aria-label="Mensaje"
            />
            <button style={s.sendBtn} aria-label="Enviar mensaje">
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
            <input style={s.searchInput} placeholder="Buscar amigos..." aria-label="Buscar chats" />
          </div>
          {CHATS.map((c) => (
            <div 
              key={c.id} 
              style={s.chatRow} 
              onClick={() => setOpenChat(c)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setOpenChat(c)}
              aria-label={`Abrir chat con ${c.nombre}`}
            >
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
        <input style={s.searchInput} placeholder="Search friends..." aria-label="Buscar amigos para añadir" />
      </div>
      <div style={s.sectionLabel}>
        Online <span style={s.sectionCount}>{ADD_FRIENDS.length} ↑</span>
      </div>
      {ADD_FRIENDS.map((u) => (
        <div
          key={u.id}
          style={s.addFriendRow}
          onClick={() => setSelectedUser({ ...u, status: 'online', statusText: 'Online' })}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedUser({ ...u, status: 'online', statusText: 'Online' })}
          aria-label={`Añadir a ${u.nombre}`}
        >
          <Avatar item={u} />
          <div style={s.friendName}>{u.nombre}</div>
        </div>
      ))}
    </>
  );

  return (
    <div style={s.popup} role="complementary" aria-label="Social Popup">
      {/* TABS */}
      <div style={s.tabs} role="tablist">
        <button
          style={{ ...s.tabBtn, ...(tab === 'friends' ? s.tabActive : {}) }}
          onClick={() => {
            setTab('friends');
            setSelectedUser(null);
          }}
          role="tab"
          aria-selected={tab === 'friends'}
          aria-label="Amigos"
        >
          <FriendsIcon active={tab === 'friends'} isDark={isDark} />
        </button>
        <button
          style={{ ...s.tabBtn, ...(tab === 'chat' ? s.tabActive : {}) }}
          onClick={() => {
            setTab('chat');
            setSelectedUser(null);
          }}
          role="tab"
          aria-selected={tab === 'chat'}
          aria-label="Mensajes"
        >
          <ChatIcon active={tab === 'chat'} isDark={isDark} />
        </button>
        <button
          style={{ ...s.tabBtn, ...(tab === 'add' ? s.tabActive : {}) }}
          onClick={() => {
            setTab('add');
            setSelectedUser(null);
          }}
          role="tab"
          aria-selected={tab === 'add'}
          aria-label="Añadir amigo"
        >
          <AddFriendIcon active={tab === 'add'} isDark={isDark} />
        </button>
        {/* Avatar usuario */}
        <div style={s.myAvatar} aria-label="Mi perfil">
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
          <div style={s.userCard} role="dialog" aria-modal="true" aria-labelledby="user-card-name">
            <button style={s.cardClose} onClick={() => setSelectedUser(null)} aria-label="Cerrar perfil">
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
            <div id="user-card-name" style={s.userCardName}>{selectedUser.nombre}</div>
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

export default SocialPopup;
