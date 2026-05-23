import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { getSocialStyles } from './SocialPopup.styles';
import { 
  FriendsIcon, ChatIcon, AddFriendIcon, SearchIcon, 
  SendIcon, CloseIcon, MessageIcon, AddPersonIcon, BackIcon 
} from './SocialPopupIcons';
import { ArrowUp, ArrowDown, MoreHorizontal, Loader2 } from 'lucide-react';
import socialService from '../services/socialService';

const COLORS_PALETTE = ['#FF5B2E', '#C4107A', '#A855F7', '#00CFFF', '#22C55E', '#EAB308', '#6366F1', '#F7306D'];

const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.trim().split(/[\s_-]+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const adaptFriend = (f, idx) => {
  if (!f) return null;
  const name = f.name || f.nombre || f.username || f.displayName || 'Usuario';
  const status = f.status || f.presence || (f.isOnline ? 'online' : 'offline');
  return {
    id: f.id || f._id || idx + Date.now(),
    nombre: name,
    carrera: f.career || f.major || f.carrera || f.statusText || '',
    avatar: f.avatar || f.photoUrl || null,
    initials: f.initials || getInitials(name),
    color: f.color || COLORS_PALETTE[idx % COLORS_PALETTE.length],
    status: status === 'online' || status === true ? 'online' : 'offline',
    statusText: f.activity || f.statusMessage || f.statusText || (status === 'online' ? 'En línea' : 'Desconectado'),
  };
};

const adaptConversation = (c, idx) => {
  if (!c) return null;
  const friend = c.friend || c.user || c.with || {};
  const name = friend.name || friend.nombre || friend.username || c.name || c.nombre || 'Chat';
  const lastMsg = c.lastMessage || c.last_message || c.mensaje || '';
  return {
    id: c.id || c._id || c.conversationId || idx + Date.now(),
    friendId: friend.id || friend._id || c.friendId || c.userId,
    nombre: name,
    mensaje: lastMsg,
    hora: c.time || c.hora || c.timestamp || c.updatedAt || (c.isTyping ? 'AHORA' : ''),
    avatar: friend.avatar || friend.photoUrl || c.avatar || null,
    initials: friend.initials || getInitials(name),
    color: friend.color || c.color || COLORS_PALETTE[idx % COLORS_PALETTE.length],
    escribiendo: c.isTyping || c.typing || c.escribiendo || false,
    unread: c.unread || c.unreadCount || 0,
  };
};

const adaptMessage = (m, idx, myId) => {
  if (!m) return null;
  const senderId = m.senderId || m.sender_id || m.from || m.sender;
  const isMe = senderId === myId || m.isMe || m.mio || m.sentByMe;
  const tipo = isMe ? 'enviado' : 'recibido';
  return {
    id: m.id || m._id || idx + Date.now(),
    tipo: m.isTyping ? 'escribiendo' : tipo,
    texto: m.text || m.texto || m.content || m.message || '',
    hora: m.time || m.hora || m.timestamp || m.createdAt || '',
  };
};

const Avatar = ({ item, size = 36 }) => {
  if (!item) return null;
  return (
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
};

const SocialPopup = ({ onClose }) => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const userId = user?.id;

  const [tab, setTab] = useState('friends');
  const [selectedUser, setSelectedUser] = useState(null);
  const [openChat, setOpenChat] = useState(null);
  const [msgInput, setMsgInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  const [loading, setLoading] = useState({ friends: true, chats: true, search: false, messages: false });
  const [friends, setFriends] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeMessages, setActiveMessages] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const s = getSocialStyles(isDark);
  const msgEndRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const results = await Promise.allSettled([
          socialService.getFriends(userId).catch(() => ({ friends: [], data: [] })),
          socialService.getConversations(userId).catch(() => ({ conversations: [], data: [] })),
        ]);

        const friendsRes = results[0].status === 'fulfilled' ? results[0].value : { friends: [] };
        const chatsRes = results[1].status === 'fulfilled' ? results[1].value : { conversations: [] };

        const rawFriends = friendsRes.friends || friendsRes.data || friendsRes || [];
        const rawChats = chatsRes.conversations || chatsRes.data || chatsRes || [];

        const adaptedFriends = rawFriends.map((f, i) => adaptFriend(f, i)).filter(Boolean);
        const adaptedChats = rawChats.map((c, i) => adaptConversation(c, i)).filter(Boolean);

        setFriends(adaptedFriends);
        setConversations(adaptedChats);
      } catch {
        setFriends([]);
        setConversations([]);
      } finally {
        setLoading((prev) => ({ ...prev, friends: false, chats: false }));
      }
    };

    fetchData();
  }, [userId]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    if (searchTimeout) clearTimeout(searchTimeout);

    const timeout = setTimeout(async () => {
      setLoading((prev) => ({ ...prev, search: true }));
      try {
        const res = await socialService.searchUsers(query.trim());
        const items = res.users || res.data || res.results || res || [];
        const adapted = items.map((u, i) => adaptFriend(u, i + 100)).filter(Boolean);
        setSearchResults(adapted);
      } catch {
        setSearchResults([]);
      } finally {
        setLoading((prev) => ({ ...prev, search: false }));
      }
    }, 300);

    setSearchTimeout(timeout);
  }, [searchTimeout]);

  const openConversation = useCallback(async (friendId, chatItem) => {
    if (!userId || !friendId) return;
    setOpenChat(chatItem);
    setLoading((prev) => ({ ...prev, messages: true }));

    try {
      const res = await socialService.getConversation(userId, friendId);
      const msgs = res.messages || res.data || res || [];
      const adapted = msgs.map((m, i) => adaptMessage(m, i, userId)).filter(Boolean);
      setActiveMessages(adapted);
    } catch {
      setActiveMessages([]);
    } finally {
      setLoading((prev) => ({ ...prev, messages: false }));
    }
  }, [userId]);

  const sendMessage = useCallback(async () => {
    if (!msgInput.trim() || !openChat || !userId) return;
    const text = msgInput.trim();
    const friendId = openChat.friendId || openChat.id;

    const tempId = Date.now();
    const tempMsg = {
      id: tempId,
      tipo: 'enviado',
      texto: text,
      hora: 'Ahora',
    };
    setActiveMessages((prev) => [...prev, tempMsg]);
    setMsgInput('');

    try {
      await socialService.sendMessage(userId, { to: friendId, text, content: text });
    } catch {
      // error silencioso
    }
  }, [msgInput, openChat, userId]);

  useEffect(() => {
    if (msgEndRef.current) {
      msgEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeMessages]);

  const friendsOnline = friends.filter((f) => f.status === 'online');
  const friendsOffline = friends.filter((f) => f.status === 'offline');

  const addList = searchQuery.trim() ? searchResults : friendsOnline;

  const myInitials = user?.name ? getInitials(user.name) : user?.email ? getInitials(user.email.split('@')[0]) : 'JS';

  const renderEmptyState = (label) => (
    <div style={{ padding: 24, textAlign: 'center' }}>
      {loading.friends || loading.chats ? (
        <Loader2 size={18} style={{ animation: 'spin 0.8s linear infinite', color: isDark ? '#FF5B2E' : '#FF8430', margin: '0 auto' }} />
      ) : (
        <span style={{ fontSize: 12, color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontFamily: "'Poppins',sans-serif", fontStyle: 'italic' }}>
          {label}
        </span>
      )}
    </div>
  );

  const renderFriends = () => (
    <>
      {selectedUser ? (
        <div style={s.userCard}>
          <button style={s.cardClose} onClick={() => setSelectedUser(null)} aria-label="Cerrar perfil">
            <CloseIcon isDark={isDark} />
          </button>
          <div style={{ ...s.userCardAvatar, border: `3px solid ${selectedUser.color}` }}>
            <span style={{ fontSize: 28, fontWeight: 800, color: selectedUser.color, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {selectedUser.initials}
            </span>
            <div style={{ position: 'absolute', bottom: 4, right: 4, width: 12, height: 12, borderRadius: '50%', background: selectedUser.status === 'online' ? '#22C55E' : '#6B7280', border: '2px solid #fff' }} />
          </div>
          <div style={s.userCardName}>{selectedUser.nombre}</div>
          <div style={s.userCardStatus}>
            <span style={{ color: selectedUser.status === 'online' ? '#22C55E' : '#6B7280', fontSize: 11, fontWeight: 600 }}>
              {selectedUser.status === 'online' ? 'Online' : 'Offline'}
            </span>
            <span style={{ fontSize: 11, color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.40)', marginLeft: 6 }}>
              {selectedUser.carrera || ''}
            </span>
          </div>
          <button
            style={s.sendMsgBtn}
            onClick={() => {
              openConversation(selectedUser.id, selectedUser);
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
            <input
              style={s.searchInput}
              placeholder="Search friends..."
              aria-label="Buscar amigos"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {searchQuery.trim() ? (
            <>
              {loading.search && renderEmptyState('Buscando...')}
              {!loading.search && searchResults.length === 0 && renderEmptyState('Sin resultados')}
              {searchResults.map((u) => (
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
            </>
          ) : (
            <>
              <div style={s.sectionLabel}>
                Online <span style={{ ...s.sectionCount, display: 'flex', alignItems: 'center', gap: 2 }}>{friendsOnline.length} <ArrowUp size={10} /></span>
              </div>
              {friendsOnline.length === 0 && !loading.friends && renderEmptyState('Sin amigos en línea')}
              {loading.friends && friendsOnline.length === 0 && renderEmptyState('')}
              {friendsOnline.map((u) => (
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
                Offline <span style={{ ...s.sectionCount, display: 'flex', alignItems: 'center', gap: 2 }}>{friendsOffline.length} <ArrowDown size={10} /></span>
              </div>
              {friendsOffline.map((u) => (
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
      )}
    </>
  );

  const renderChat = () => (
    <>
      {openChat ? (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={s.chatHeader}>
            <button style={s.backBtn} onClick={() => { setOpenChat(null); setActiveMessages([]); }} aria-label="Volver a la lista de chats">
              <BackIcon isDark={isDark} />
            </button>
            <Avatar item={openChat} size={30} />
            <div>
              <div style={s.chatHeaderName}>{openChat.nombre}</div>
              <div style={{ fontSize: 10, color: '#22C55E', fontWeight: 600 }}>{openChat.escribiendo ? 'escribiendo...' : (openChat.status === 'online' ? 'En línea' : '')}</div>
            </div>
          </div>
          <div style={s.mensajesList}>
            {loading.messages && renderEmptyState('Cargando mensajes...')}
            {!loading.messages && activeMessages.length === 0 && renderEmptyState('Sin mensajes aún')}
            {activeMessages.map((m, idx) =>
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
            <div ref={msgEndRef} />
          </div>
          <div style={s.inputRow}>
            <input
              style={s.chatInput}
              placeholder="Escribe un mensaje..."
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              aria-label="Mensaje"
            />
            <button style={s.sendBtn} onClick={sendMessage} aria-label="Enviar mensaje" disabled={!msgInput.trim()}>
              <SendIcon />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={s.chatListHeader}>
            <span style={s.chatListTitle}>Mensajes</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.40)'} strokeWidth="2" strokeLinecap="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </div>
          <div style={s.searchWrap}>
            <SearchIcon isDark={isDark} />
            <input style={s.searchInput} placeholder="Buscar chats..." aria-label="Buscar chats" />
          </div>
          {loading.chats && renderEmptyState('Cargando...')}
          {!loading.chats && conversations.length === 0 && renderEmptyState('Sin conversaciones')}
          {conversations.map((c) => (
            <div 
              key={c.id} 
              style={s.chatRow} 
              onClick={() => openConversation(c.friendId || c.id, c)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openConversation(c.friendId || c.id, c)}
              aria-label={`Abrir chat con ${c.nombre}`}
            >
              <Avatar item={c} size={38} />
              <div style={s.chatRowInfo}>
                <div style={s.chatRowName}>{c.nombre}</div>
                <div style={{ ...s.chatRowMsg, color: c.escribiendo ? (isDark ? '#FF5B2E' : '#FF8430') : undefined }}>
                  {c.escribiendo ? 'escribiendo...' : c.mensaje}
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
        <input
          style={s.searchInput}
          placeholder="Search friends..."
          aria-label="Buscar amigos para añadir"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <div style={s.sectionLabel}>
        {searchQuery.trim() ? `Resultados` : `Sugerencias`}
        <span style={s.sectionCount}>{addList.length} {searchQuery.trim() ? '' : '↑'}</span>
      </div>
      {loading.search && renderEmptyState('Buscando...')}
      {!loading.search && addList.length === 0 && renderEmptyState(searchQuery.trim() ? 'Sin resultados' : 'Busca usuarios para añadir')}
      {addList.map((u) => (
        <div
          key={u.id}
          style={s.addFriendRow}
          onClick={() => setSelectedUser({ ...u, status: 'online', statusText: u.statusText || 'Online' })}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedUser({ ...u, status: 'online', statusText: u.statusText || 'Online' })}
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
      <div style={s.tabs} role="tablist">
        <button
          style={{ ...s.tabBtn, ...(tab === 'friends' ? s.tabActive : {}) }}
          onClick={() => { setTab('friends'); setSelectedUser(null); setSearchQuery(''); setSearchResults([]); }}
          role="tab"
          aria-selected={tab === 'friends'}
          aria-label="Amigos"
        >
          <FriendsIcon active={tab === 'friends'} isDark={isDark} />
        </button>
        <button
          style={{ ...s.tabBtn, ...(tab === 'chat' ? s.tabActive : {}) }}
          onClick={() => { setTab('chat'); setSelectedUser(null); setSearchQuery(''); }}
          role="tab"
          aria-selected={tab === 'chat'}
          aria-label="Mensajes"
        >
          <ChatIcon active={tab === 'chat'} isDark={isDark} />
        </button>
        <button
          style={{ ...s.tabBtn, ...(tab === 'add' ? s.tabActive : {}) }}
          onClick={() => { setTab('add'); setSelectedUser(null); setSearchQuery(''); setSearchResults([]); }}
          role="tab"
          aria-selected={tab === 'add'}
          aria-label="Añadir amigo"
        >
          <AddFriendIcon active={tab === 'add'} isDark={isDark} />
        </button>
        <div style={s.myAvatar} aria-label="Mi perfil">
          <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{myInitials}</span>
        </div>
      </div>

      <div style={s.body}>
        {!selectedUser && tab === 'friends' && <h3 style={s.title}>Social</h3>}
        {tab === 'friends' && renderFriends()}
        {tab === 'chat' && renderChat()}
        {tab === 'add' && renderAdd()}
      </div>

      {selectedUser && tab !== 'friends' && (
        <div style={s.overlayCard}>
          <div style={s.userCard} role="dialog" aria-modal="true" aria-labelledby="user-card-name-add">
            <button style={s.cardClose} onClick={() => setSelectedUser(null)} aria-label="Cerrar perfil">
              <CloseIcon isDark={isDark} />
            </button>
            <div style={{ ...s.userCardAvatar, border: `3px solid ${selectedUser.color}` }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: selectedUser.color, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {selectedUser.initials}
              </span>
              <div style={{ position: 'absolute', bottom: 4, right: 4, width: 12, height: 12, borderRadius: '50%', background: '#22C55E', border: '2px solid #fff' }} />
            </div>
            <div id="user-card-name-add" style={s.userCardName}>{selectedUser.nombre}</div>
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
