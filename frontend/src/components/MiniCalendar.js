import React, { useState } from 'react';

const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function MiniCalendar() {
  const today = new Date();
  const [cur, setCur] = useState({ y: today.getFullYear(), m: today.getMonth() });

  const firstDay  = new Date(cur.y, cur.m, 1).getDay();
  const daysInMonth = new Date(cur.y, cur.m + 1, 0).getDate();

  const prev = () => setCur(c => c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 });
  const next = () => setCur(c => c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 });

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (d) => d === today.getDate() && cur.m === today.getMonth() && cur.y === today.getFullYear();

  // dummy event days
  const events = [3, 7, 14, 18, 22, 27];

  return (
    <div className="mini-cal">
      <div className="mini-cal-header">
        <button onClick={prev} className="mini-cal-nav">‹</button>
        <span className="mini-cal-title">{MONTHS[cur.m]} {cur.y}</span>
        <button onClick={next} className="mini-cal-nav">›</button>
      </div>
      <div className="mini-cal-grid">
        {DAYS.map(d => <div key={d} className="mini-cal-day-label">{d}</div>)}
        {cells.map((d, i) => (
          <div key={i} className={`mini-cal-cell ${!d ? 'mini-cal-empty' : ''} ${isToday(d) ? 'mini-cal-today' : ''} ${d && events.includes(d) ? 'mini-cal-event' : ''}`}>
            {d}
            {d && events.includes(d) && !isToday(d) && <span className="mini-cal-dot" />}
          </div>
        ))}
      </div>
      <div className="mini-cal-legend">
        <span className="mini-cal-legend-item"><span className="mcl-dot today-dot" />Today</span>
        <span className="mini-cal-legend-item"><span className="mcl-dot event-dot" />Event</span>
      </div>
    </div>
  );
}
