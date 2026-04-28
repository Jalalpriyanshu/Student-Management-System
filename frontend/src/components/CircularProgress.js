import React from 'react';

export default function CircularProgress({ pct = 0, size = 80, stroke = 7, color = '#6366f1', label = '' }) {
  const r   = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  const col = pct >= 85 ? '#10b981' : pct >= 70 ? '#f59e0b' : '#ef4444';

  return (
    <div className="circ-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none"
          stroke={color || col}
          strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="circ-label">
        <span className="circ-pct">{pct}%</span>
        {label && <span className="circ-sub">{label}</span>}
      </div>
    </div>
  );
}
