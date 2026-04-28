import React, { useState } from 'react';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
const TIMES = ['8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','2:00 PM','3:00 PM'];
const COLORS = ['#6366f1','#0ea5e9','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899'];

const SUBJECTS = ['Mathematics','Science','English','History','Computer','Physics','Chemistry'];
const TEACHERS = [
  { name: 'Dr. Sharma',  avatar: 'https://i.pravatar.cc/32?img=11' },
  { name: 'Ms. Patel',   avatar: 'https://i.pravatar.cc/32?img=20' },
  { name: 'Mr. Verma',   avatar: 'https://i.pravatar.cc/32?img=15' },
  { name: 'Dr. Singh',   avatar: 'https://i.pravatar.cc/32?img=33' },
  { name: 'Ms. Gupta',   avatar: 'https://i.pravatar.cc/32?img=47' },
];

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)]; // eslint-disable-line

// Build a static weekly timetable
const buildWeek = () =>
  DAYS.map(day => ({
    day,
    slots: TIMES.map((time, i) => ({
      time,
      subject: SUBJECTS[i % SUBJECTS.length],
      teacher: TEACHERS[i % TEACHERS.length],
      room: `Room ${101 + i * 10}`,
      color: COLORS[i % COLORS.length],
    })),
  }));

const WEEK = buildWeek();

export default function Timetable() {
  const todayName = DAYS[new Date().getDay() - 1] || 'Monday';
  const [activeDay, setActiveDay] = useState(todayName);
  const dayData = WEEK.find(d => d.day === activeDay) || WEEK[0];

  return (
    <div className="db-wrapper">
      <div className="add-page-header">
        <div><h2>Timetable</h2><p>Weekly class schedule</p></div>
      </div>

      {/* Day tabs */}
      <div className="db-panel">
        <div className="tt-day-tabs">
          {DAYS.map(d => (
            <button key={d}
              className={`tt-day-tab ${activeDay === d ? 'tt-day-tab-active' : ''} ${d === todayName ? 'tt-day-tab-today' : ''}`}
              onClick={() => setActiveDay(d)}>
              {d}
              {d === todayName && <span className="tt-today-badge">Today</span>}
            </button>
          ))}
        </div>

        {/* Schedule cards */}
        <div className="tt-schedule">
          {dayData.slots.map((slot, i) => (
            <div className="tt-schedule-card" key={i} style={{ '--tt-color': slot.color }}>
              <div className="tt-schedule-time">{slot.time}</div>
              <div className="tt-schedule-line" style={{ background: slot.color }} />
              <div className="tt-schedule-body">
                <div className="tt-schedule-subject" style={{ color: slot.color }}>{slot.subject}</div>
                <div className="tt-schedule-meta">
                  <img src={slot.teacher.avatar} alt={slot.teacher.name} className="tt-avatar"
                    onError={e => e.target.style.display='none'} />
                  <span>{slot.teacher.name}</span>
                  <span className="tt-schedule-room">{slot.room}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full week grid */}
      <div className="db-panel">
        <div className="db-panel-hdr"><h3>Full Week Overview</h3></div>
        <div className="tt-week-grid">
          <div className="tt-week-header">
            <div className="tt-week-time-col">Time</div>
            {DAYS.map(d => (
              <div key={d} className={`tt-week-day-col ${d === todayName ? 'tt-week-today' : ''}`}>{d}</div>
            ))}
          </div>
          {TIMES.map((time, ti) => (
            <div className="tt-week-row" key={ti}>
              <div className="tt-week-time">{time}</div>
              {WEEK.map((dayData, di) => {
                const slot = dayData.slots[ti];
                return (
                  <div key={di} className={`tt-week-cell ${dayData.day === todayName ? 'tt-week-today-col' : ''}`}>
                    <div className="tt-week-cell-inner" style={{ borderLeft: `3px solid ${slot.color}`, background: slot.color + '12' }}>
                      <div className="tt-week-subject" style={{ color: slot.color }}>{slot.subject}</div>
                      <div className="tt-week-teacher">{slot.teacher.name}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
