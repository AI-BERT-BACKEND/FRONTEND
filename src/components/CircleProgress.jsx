import React, { useId } from 'react';
import { tokens } from '../theme/tokens';
import { createStyles } from '../theme/createStyles';

export const CircleProgress = ({ pct, isDark, size = 120, label = 'Completado' }) => {
  const gradientId = useId();
  const s = createStyles(isDark);
  const r = (size * 0.4).toFixed(0);
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const center = size / 2;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={isDark ? '#FF5B2E' : '#FF8430'} />
            <stop offset="100%" stopColor={isDark ? '#C4107A' : '#F7306D'} />
          </linearGradient>
        </defs>
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke={s.cardBorder}
          strokeWidth="10"
        />
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="10"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ / 4}
          strokeLinecap="round"
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily: tokens.fonts.primary,
            fontWeight: 800,
            fontSize: size * 0.18,
            color: isDark ? '#FF5B2E' : '#FF8430',
          }}
        >
          {pct}%
        </span>
        <span
          style={{
            fontSize: size * 0.08,
            color: s.textSecondary,
            fontFamily: tokens.fonts.secondary,
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

export default CircleProgress;
