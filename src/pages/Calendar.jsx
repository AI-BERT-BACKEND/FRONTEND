import React, { useState } from 'react';
import AppLayout from '../components/Layout/AppLayout';
import { ChevronDown } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { useTheme } from '../context/ThemeContext';
import { createStyles } from '../theme/createStyles';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const WEEK_DAYS_MONTH = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = [
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
];

const EVENTS_INIT = [
  {
    id: 1,
    titulo: 'Clase de DOSW',
    fecha: '2026-05-18',
    hora: '11:00',
    materia: 'DOSW',
    estado: 'pendiente',
    color: '#FF8430',
  },
  {
    id: 2,
    titulo: 'Lab de AYSR',
    fecha: '2026-05-18',
    hora: '14:00',
    materia: 'AYSR',
    estado: 'pendiente',
    color: '#C4107A',
  },
  {
    id: 3,
    titulo: 'Entrega Proyecto FUPR',
    fecha: '2026-05-20',
    hora: '08:30',
    materia: 'FUPR',
    estado: 'urgente',
    color: '#FF5B2E',
  },
  {
    id: 4,
    titulo: 'Parcial TPRO',
    fecha: '2026-05-21',
    hora: '10:00',
    materia: 'TPRO',
    estado: 'examen',
    color: '#C4107A',
  },
  {
    id: 5,
    titulo: 'Parcial DOSW',
    fecha: '2026-05-22',
    hora: '08:00',
    materia: 'DOSW',
    estado: 'examen',
    color: '#C4107A',
  },
  {
    id: 6,
    titulo: 'Parcial IPRO',
    fecha: '2026-05-23',
    hora: '09:00',
    materia: 'IPRO',
    estado: 'examen',
    color: '#C4107A',
  },
];

const SUBJECTS = ['All subjects', 'DOSW', 'AYSR', 'FUPR', 'TPRO', 'IPRO'];
const STATUSES = ['All', 'pendiente', 'urgente', 'examen', 'completado'];

const Calendar = () => {
  const { isDark } = useTheme();
  const t = createStyles(isDark);
  const [view, setView] = useState('month');
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 4, 1));
  const [events, setEvents] = useState(EVENTS_INIT);
  const [filterSubject, setFilterSubject] = useState('All subjects');
  const [filterStatus, setFilterStatus] = useState('All');
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [eventDetail, setEventDetail] = useState(null);

  const s = getStyles(isDark);

  const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const firstDay = (y, m) => new Date(y, m, 1).getDay();

  const getMonthGrid = () => {
    const y = currentMonth.getFullYear();
    const m = currentMonth.getMonth();
    const total = daysInMonth(y, m);
    const start = firstDay(y, m);
    const grid = [];
    for (let i = 0; i < start; i++) grid.push(null);
    for (let d = 1; d <= total; d++) grid.push(d);
    while (grid.length % 7 !== 0) grid.push(null);
    return grid;
  };

  const getWeekDays = () => {
    const today = new Date(2026, 4, 18);
    const sun = new Date(today);
    sun.setDate(today.getDate() - today.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(sun);
      d.setDate(sun.getDate() + i);
      return d;
    });
  };

  const dateStr = (y, m, d) =>
    `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const filteredEvents = events.filter((e) => {
    const okS = filterSubject === 'All subjects' || e.materia === filterSubject;
    const okSt = filterStatus === 'All' || e.estado === filterStatus;
    return okS && okSt;
  });

  const upcomingEvents = [...filteredEvents]
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(0, 6);

  const statusBadgeColor = (status) => {
    if (status === 'urgente') return { bg: 'rgba(255,91,46,0.20)', color: '#FF5B2E' };
    if (status === 'examen') return { bg: 'rgba(196,16,122,0.20)', color: '#C4107A' };
    if (status === 'completado') return { bg: 'rgba(34,197,94,0.20)', color: '#22C55E' };
    return {
      bg: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
      color: isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.45)',
    };
  };

  const handleDragStart = (e, event) => {
    setDragging(event);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragOver = (e, key) => {
    e.preventDefault();
    setDragOver(key);
  };
  const handleDrop = (e, fecha, hora = null) => {
    e.preventDefault();
    if (dragging)
      setEvents((prev) =>
        prev.map((ev) => (ev.id === dragging.id ? { ...ev, fecha, ...(hora ? { hora } : {}) } : ev))
      );
    setDragging(null);
    setDragOver(null);
  };

  const today = new Date(2026, 4, 18);
  const todayStr = dateStr(today.getFullYear(), today.getMonth(), today.getDate());

  /* ── Icons específicos de esta pantalla ── */
  const IconPrev = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M9 11L5 7l4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  const IconNext = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M5 3l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  const IconCalendar = () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <rect
        x="0.5"
        y="1.5"
        width="12"
        height="10"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M0.5 4.5h12" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M3.5 0.5v2M9.5 0.5v2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
  const IconKanban = () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <rect x="0.5" y="0.5" width="3.5" height="9" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect
        x="4.75"
        y="0.5"
        width="3.5"
        height="6"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <rect x="9" y="0.5" width="3.5" height="11" rx="1" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
  const IconClose = () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path
        d="M1.5 1.5l10 10M11.5 1.5l-10 10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
  const IconClock = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6 3.5v2.8l1.8 1.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
  const IconTag = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M1 1h4.5l5 5-4.5 4.5-5-5V1z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="3" cy="3" r="0.8" fill="currentColor" />
    </svg>
  );
  const IconEventSmall = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <rect
        x="0.5"
        y="1.5"
        width="11"
        height="9"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <path d="M0.5 4h11" stroke="currentColor" strokeWidth="1.1" />
      <path d="M3 0.5v2M9 0.5v2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );

  return (
    <AppLayout>
      <div style={s.controls}>
        <div style={s.navGroup}>
          <button
            style={s.navBtn}
            onClick={() =>
              setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
            }
          >
            <IconPrev />
            <span>Prev</span>
          </button>
          <button
            style={s.navBtn}
            onClick={() =>
              setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
            }
          >
            <span>Next</span>
            <IconNext />
          </button>
        </div>

        <h2 style={s.monthTitle}>
          {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>

        <div style={s.viewGroup}>
          {['month', 'week'].map((v) => (
            <button
              key={v}
              style={{ ...s.viewBtn, ...(view === v ? s.viewBtnActive : {}) }}
              onClick={() => setView(v)}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
          <button
            style={{
              ...s.viewBtn,
              ...s.viewBtnIcon,
              ...(view === 'calendar' ? s.viewBtnActive : {}),
            }}
            onClick={() => setView('calendar')}
          >
            <IconCalendar />
            <span>Calendar</span>
          </button>
          <button
            style={{
              ...s.viewBtn,
              ...s.viewBtnIcon,
              ...(view === 'kanban' ? s.viewBtnActive : {}),
            }}
            onClick={() => setView('kanban')}
          >
            <IconKanban />
            <span>Kanban</span>
          </button>
        </div>

        <div style={s.filtersGroup}>
          <div style={{ position: 'relative' }}>
            <select
              style={s.filterSelect}
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
            >
              {SUBJECTS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <span style={s.filterChevron}>
              <ChevronDown size={10} color={isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.40)'} />
            </span>
          </div>
          <div style={{ position: 'relative' }}>
            <select
              style={s.filterSelect}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              {STATUSES.map((e) => (
                <option key={e} value={e}>
                  {e.charAt(0).toUpperCase() + e.slice(1)}
                </option>
              ))}
            </select>
            <span style={s.filterChevron}>
              <ChevronDown size={10} color={isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.40)'} />
            </span>
          </div>
        </div>
      </div>

      <div style={s.calLayout}>
        {/* MONTH VIEW */}
        {view === 'month' && (
          <div style={s.calMain}>
            <div style={s.weekHeader}>
              {WEEK_DAYS_MONTH.map((d) => (
                <div key={d} style={s.weekHeaderCell}>
                  {d}
                </div>
              ))}
            </div>
            <div style={s.monthGrid}>
              {getMonthGrid().map((day, idx) => {
                const fecha = day
                  ? dateStr(currentMonth.getFullYear(), currentMonth.getMonth(), day)
                  : null;
                const dayEvents = fecha
                  ? filteredEvents.filter((e) => e.fecha === fecha)
                  : [];
                const isToday = fecha === todayStr;
                const isDragTarget = dragOver === fecha;
                return (
                  <div
                    key={idx}
                    style={{
                      ...s.monthCell,
                      ...(isToday ? s.monthCellToday : {}),
                      ...(isDragTarget ? s.dragOverCell : {}),
                      opacity: day ? 1 : 0.3,
                    }}
                    onDragOver={(e) => fecha && handleDragOver(e, fecha)}
                    onDrop={(e) => fecha && handleDrop(e, fecha)}
                  >
                    {day && (
                      <>
                        <span style={{ ...s.dayNum, ...(isToday ? s.dayNumToday : {}) }}>
                          {day}
                        </span>
                        <div style={s.eventsInCell}>
                          {dayEvents.slice(0, 2).map((ev) => (
                            <div
                              key={ev.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, ev)}
                              style={{
                                ...s.eventChip,
                                background: ev.color + '33',
                                borderLeft: `2px solid ${ev.color}`,
                              }}
                              onClick={() => setEventDetail(ev)}
                            >
                              <span style={{ ...s.eventChipText, color: ev.color }}>
                                {ev.titulo}
                              </span>
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <span style={s.moreEvents}>+{dayEvents.length - 2} more</span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view === 'week' && (
          <div style={s.calMain}>
            <div style={s.weekViewHeader}>
              <div style={s.timeHeaderCell} />
              {getWeekDays().map((d, i) => (
                <div key={i} style={s.weekViewHeaderCell}>
                  <span style={s.weekDayName}>{WEEK_DAYS_MONTH[d.getDay()]}</span>
                  <span
                    style={{
                      ...s.weekDayNum,
                      ...(d.getDate() === today.getDate() ? s.weekDayNumToday : {}),
                    }}
                  >
                    {d.getDate()}
                  </span>
                </div>
              ))}
            </div>
            <div style={s.weekBody}>
              {HOURS.map((hour) => (
                <div key={hour} style={s.weekRow}>
                  <div style={s.timeCell}>{hour}</div>
                  {getWeekDays().map((d, i) => {
                    const fecha = dateStr(d.getFullYear(), d.getMonth(), d.getDate());
                    const ev = filteredEvents.find(
                      (e) => e.fecha === fecha && e.hora === hour
                    );
                    const isDragTarget = dragOver === `${fecha}-${hour}`;
                    return (
                      <div
                        key={i}
                        style={{ ...s.weekCell, ...(isDragTarget ? s.dragOverCell : {}) }}
                        onDragOver={(e) => handleDragOver(e, `${fecha}-${hour}`)}
                        onDrop={(e) => handleDrop(e, fecha, hour)}
                      >
                        {ev && (
                          <div
                            draggable
                            onDragStart={(e) => handleDragStart(e, ev)}
                            style={{
                              ...s.weekEvent,
                              background: ev.color + '33',
                              borderLeft: `2px solid ${ev.color}`,
                            }}
                            onClick={() => setEventDetail(ev)}
                          >
                            <span style={{ fontSize: 10, color: ev.color, fontWeight: 600 }}>
                              {ev.titulo}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'kanban' && (
          <div style={s.calMain}>
            <div style={s.kanbanWrap}>
              {['pendiente', 'urgente', 'examen', 'completado'].map((col) => (
                <div key={col} style={s.kanbanCol}>
                  <div style={s.kanbanHeader}>
                    <span style={{ ...s.kanbanBadge, ...statusBadgeColor(col) }}>
                      {col.charAt(0).toUpperCase() + col.slice(1)}
                    </span>
                    <span style={s.kanbanCount}>
                      {filteredEvents.filter((e) => e.estado === col).length}
                    </span>
                  </div>
                  {filteredEvents
                    .filter((e) => e.estado === col)
                    .map((ev) => (
                      <div
                        key={ev.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, ev)}
                        style={s.kanbanCard}
                        onClick={() => setEventDetail(ev)}
                      >
                        <div style={{ borderLeft: `3px solid ${ev.color}`, paddingLeft: 8 }}>
                          <div style={s.kanbanCardTitle}>{ev.titulo}</div>
                          <div style={s.kanbanCardMeta}>
                            <IconClock />
                            <span style={{ marginLeft: 4 }}>
                              {ev.fecha} · {ev.hora}
                            </span>
                          </div>
                          <div style={{ ...s.kanbanCardMeta, marginTop: 4 }}>
                            <IconTag />
                            <span style={{ marginLeft: 4, color: ev.color }}>
                              {ev.materia}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={s.upcomingPanel}>
          <div style={s.upcomingHeader}>
            <span style={{ color: isDark ? '#FF5B2E' : '#FF8430' }}>
              <IconEventSmall />
            </span>
            <span style={s.upcomingTitle}>Upcoming Events</span>
          </div>
          <div style={s.upcomingList}>
            {upcomingEvents.length === 0 && (
              <div style={s.upcomingEmpty}>No events match the selected filters</div>
            )}
            {upcomingEvents.map((ev) => {
              const badge = statusBadgeColor(ev.estado);
              return (
                <div
                  key={ev.id}
                  style={{ ...s.upcomingItem, borderLeft: `3px solid ${ev.color}` }}
                  onClick={() => setEventDetail(ev)}
                >
                  <div style={s.upcomingTop}>
                    <span style={s.upcomingEventTitle}>{ev.titulo}</span>
                    {ev.estado !== 'pendiente' && (
                      <StatusBadge
                        label={ev.estado}
                        color={badge.color}
                        bgColor={badge.bg}
                      />
                    )}
                  </div>
                  <div style={s.upcomingMeta}>
                    {ev.fecha} · {ev.hora}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {eventDetail && (
        <div style={s.modalOverlay} onClick={() => setEventDetail(null)}>
          <div style={s.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <div style={{ borderLeft: `4px solid ${eventDetail.color}`, paddingLeft: 12 }}>
                <div style={s.modalTitle}>{eventDetail.titulo}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <span
                    style={{
                      ...s.modalBadge,
                      background: eventDetail.color + '22',
                      color: eventDetail.color,
                    }}
                  >
                    {eventDetail.materia}
                  </span>
                  <span style={{ ...s.modalBadge, ...statusBadgeColor(eventDetail.estado) }}>
                    {eventDetail.estado.charAt(0).toUpperCase() + eventDetail.estado.slice(1)}
                  </span>
                </div>
              </div>
              <button style={s.modalClose} onClick={() => setEventDetail(null)}>
                <IconClose />
              </button>
            </div>
            <div style={s.modalBody}>
              <div style={s.modalRow}>
                <span style={{ color: t.textSecondary }}>
                  <IconClock />
                </span>
                <div>
                  <div style={s.modalRowLabel}>Date & Time</div>
                  <div style={s.modalRowVal}>
                    {eventDetail.fecha} · {eventDetail.hora}
                  </div>
                </div>
              </div>
              <div style={s.modalRow}>
                <span style={{ color: t.textSecondary }}>
                  <IconTag />
                </span>
                <div>
                  <div style={s.modalRowLabel}>Subject</div>
                  <div style={{ ...s.modalRowVal, color: eventDetail.color }}>
                    {eventDetail.materia}
                  </div>
                </div>
              </div>
              <div style={s.modalRow}>
                <span style={{ color: t.textSecondary }}>
                  <IconEventSmall />
                </span>
                <div>
                  <div style={s.modalRowLabel}>Status</div>
                  <div style={s.modalRowVal}>
                    {eventDetail.estado.charAt(0).toUpperCase() + eventDetail.estado.slice(1)}
                  </div>
                </div>
              </div>
            </div>
            <div style={s.modalFooter}>
              <button style={s.modalBtnOutline} onClick={() => setEventDetail(null)}>
                Close
              </button>
              <button style={s.modalBtnFill}>Edit event</button>
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
    controls: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, flexWrap: 'wrap' },
    navGroup: { display: 'flex', gap: 6 },
    navBtn: {
      background: t.primaryGradient,
      border: 'none',
      borderRadius: 8,
      padding: '5px 12px',
      color: '#fff',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 11,
      fontFamily: t.fontSecondary,
      fontWeight: 600,
    },
    monthTitle: {
      fontFamily: t.fontPrimary,
      fontSize: 22,
      fontWeight: 800,
      color: t.textPrimary,
      margin: 0,
      flex: 1,
      textAlign: 'center',
    },
    viewGroup: {
      display: 'flex',
      gap: 3,
      background: t.inputBg,
      borderRadius: 10,
      padding: 3,
    },
    viewBtn: {
      background: 'transparent',
      border: 'none',
      borderRadius: 7,
      padding: '5px 11px',
      cursor: 'pointer',
      fontFamily: t.fontSecondary,
      fontSize: 11,
      fontWeight: 500,
      color: t.textSecondary,
      transition: 'all 0.2s',
    },
    viewBtnIcon: { display: 'flex', alignItems: 'center', gap: 5 },
    viewBtnActive: {
      background: t.primaryGradient,
      color: '#fff',
      fontWeight: 600,
    },
    filtersGroup: { display: 'flex', gap: 8 },
    filterSelect: {
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 8,
      padding: '6px 28px 6px 10px',
      fontFamily: t.fontSecondary,
      fontSize: 11,
      color: t.textPrimary,
      cursor: 'pointer',
      appearance: 'none',
      WebkitAppearance: 'none',
      outline: 'none',
    },
    filterChevron: {
      position: 'absolute',
      right: 8,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      color: t.textSecondary,
    },
    calLayout: { display: 'flex', gap: 16, alignItems: 'flex-start' },
    calMain: {
      flex: 1,
      background: t.cardBgAlt,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 16,
      overflow: 'hidden',
      minWidth: 0,
    },
    weekHeader: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      borderBottom: `1px solid ${t.cardBorder}`,
    },
    weekHeaderCell: {
      padding: '10px 0',
      textAlign: 'center',
      fontSize: 11,
      fontWeight: 600,
      color: t.textSecondary,
      letterSpacing: '0.05em',
    },
    monthGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' },
    monthCell: {
      minHeight: 90,
      padding: '6px 8px',
      borderRight: `1px solid ${t.cardBorder}`,
      borderBottom: `1px solid ${t.cardBorder}`,
      background: 'transparent',
      transition: 'background 0.15s',
      boxSizing: 'border-box',
    },
    monthCellToday: {
      background: isDark ? 'rgba(196,16,122,0.07)' : 'rgba(255,132,48,0.07)',
      outline: `1.5px solid ${isDark ? '#C4107A' : '#FF8430'}`,
      outlineOffset: '-1px',
    },
    dragOverCell: { background: isDark ? 'rgba(196,16,122,0.15)' : 'rgba(255,132,48,0.15)' },
    dayNum: {
      fontSize: 12,
      fontWeight: 500,
      color: t.textSecondary,
      display: 'block',
      marginBottom: 4,
    },
    dayNumToday: { color: isDark ? '#FF5B2E' : '#FF8430', fontWeight: 700 },
    eventsInCell: { display: 'flex', flexDirection: 'column', gap: 2 },
    eventChip: { borderRadius: 4, padding: '2px 5px', cursor: 'grab', userSelect: 'none' },
    eventChipText: {
      fontSize: 9,
      fontWeight: 600,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: 'block',
    },
    moreEvents: {
      fontSize: 9,
      color: t.textMuted,
      paddingLeft: 4,
    },
    weekViewHeader: {
      display: 'grid',
      gridTemplateColumns: '52px repeat(7, 1fr)',
      borderBottom: `1px solid ${t.cardBorder}`,
    },
    timeHeaderCell: { width: 52 },
    weekViewHeaderCell: {
      padding: '8px 0',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2,
      borderLeft: `1px solid ${t.cardBorder}`,
    },
    weekDayName: {
      fontSize: 10,
      fontWeight: 600,
      color: t.textSecondary,
      letterSpacing: '0.05em',
    },
    weekDayNum: {
      fontSize: 14,
      fontWeight: 700,
      color: t.textPrimary,
    },
    weekDayNumToday: { color: isDark ? '#FF5B2E' : '#FF8430' },
    weekBody: { overflowY: 'auto', maxHeight: 'calc(100vh - 240px)' },
    weekRow: {
      display: 'grid',
      gridTemplateColumns: '52px repeat(7, 1fr)',
      borderBottom: `1px solid ${t.cardBorder}`,
    },
    timeCell: {
      width: 52,
      fontSize: 9,
      color: t.textMuted,
      padding: '6px 6px 0',
      textAlign: 'right',
      flexShrink: 0,
    },
    weekCell: {
      minHeight: 44,
      borderLeft: `1px solid ${t.cardBorder}`,
      padding: 3,
      transition: 'background 0.1s',
    },
    weekEvent: { borderRadius: 4, padding: '3px 5px', cursor: 'grab', userSelect: 'none' },
    kanbanWrap: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, padding: 16 },
    kanbanCol: {
      background: t.inputBg,
      borderRadius: 12,
      padding: 12,
      minHeight: 300,
    },
    kanbanHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    kanbanBadge: { fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20 },
    kanbanCount: {
      fontSize: 11,
      color: t.textMuted,
      fontWeight: 600,
    },
    kanbanCard: {
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 10,
      padding: '10px 10px 10px 0',
      marginBottom: 8,
      cursor: 'grab',
      userSelect: 'none',
    },
    kanbanCardTitle: {
      fontSize: 12,
      fontWeight: 600,
      color: t.textPrimary,
      marginBottom: 4,
    },
    kanbanCardMeta: {
      display: 'flex',
      alignItems: 'center',
      fontSize: 10,
      color: t.textSecondary,
    },
    upcomingPanel: {
      width: 220,
      flexShrink: 0,
      background: t.cardBgAlt,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 16,
      overflow: 'hidden',
    },
    upcomingHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      padding: '14px 16px',
      borderBottom: `1px solid ${t.cardBorder}`,
    },
    upcomingTitle: { fontSize: 12, fontWeight: 700, color: isDark ? '#FF5B2E' : '#FF8430' },
    upcomingList: { padding: 8, display: 'flex', flexDirection: 'column', gap: 6 },
    upcomingEmpty: {
      fontSize: 11,
      color: t.textMuted,
      textAlign: 'center',
      padding: '16px 8px',
      fontStyle: 'italic',
    },
    upcomingItem: {
      background: t.inputBg,
      borderRadius: 8,
      padding: '8px 10px',
      cursor: 'pointer',
      transition: 'background 0.15s',
    },
    upcomingTop: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 4,
    },
    upcomingEventTitle: {
      fontSize: 11,
      fontWeight: 600,
      color: t.textPrimary,
      lineHeight: 1.3,
      flex: 1,
    },
    upcomingMeta: {
      fontSize: 9,
      color: t.textMuted,
      marginTop: 3,
    },
    modalOverlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.65)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
      backdropFilter: 'blur(2px)',
    },
    modalCard: {
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 16,
      width: '100%',
      maxWidth: 380,
      margin: '0 20px',
      boxShadow: t.modalShadow,
      overflow: 'hidden',
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: '20px 20px 0',
    },
    modalTitle: {
      fontFamily: t.fontPrimary,
      fontSize: 17,
      fontWeight: 700,
      color: t.textPrimary,
      marginBottom: 4,
    },
    modalBadge: { fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10 },
    modalClose: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: t.textSecondary,
      padding: 4,
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
    },
    modalBody: { padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 },
    modalRow: { display: 'flex', alignItems: 'flex-start', gap: 10 },
    modalRowLabel: {
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: t.textMuted,
      marginBottom: 2,
    },
    modalRowVal: { fontSize: 13, fontWeight: 500, color: t.textPrimary },
    modalFooter: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10,
      padding: '12px 20px 18px',
      borderTop: `1px solid ${t.cardBorder}`,
    },
    modalBtnOutline: {
      padding: '8px 18px',
      borderRadius: 8,
      border: `1px solid ${t.inputBorder}`,
      background: 'transparent',
      cursor: 'pointer',
      fontFamily: t.fontSecondary,
      fontSize: 12,
      fontWeight: 500,
      color: t.textSecondary,
    },
    modalBtnFill: {
      padding: '8px 18px',
      borderRadius: 8,
      border: 'none',
      background: t.primaryGradient,
      cursor: 'pointer',
      fontFamily: t.fontPrimary,
      fontSize: 12,
      fontWeight: 700,
      color: '#fff',
    },
  };
};

export default Calendar;
