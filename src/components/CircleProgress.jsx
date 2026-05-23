import React, { useState, useEffect, useId, useRef } from 'react';
import { tokens } from '../theme/tokens';
import { createStyles } from '../theme/createStyles';

export const CircleProgress = ({ pct, isDark, size = 120, label = 'Completado' }) => {
  const gradientId = useId();
  const s = createStyles(isDark);
  const [animatedPct, setAnimatedPct] = useState(0);
  const r = (size * 0.4).toFixed(0);
  const circ = 2 * Math.PI * r;
  const center = size / 2;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPct(pct);
    }, 100);
    return () => clearTimeout(timer);
  }, [pct]);

  const dash = (animatedPct / 100) * circ;

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
          style={{
            transition: 'stroke-dasharray 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
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
        <CountUpNumber target={pct} isDark={isDark} size={size} />
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

const CountUpNumber = ({ target, isDark, size }) => {
  const [display, setDisplay] = useState(0);
  const animRef = useRef(null);

  useEffect(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);

    const duration = 1200;
    const startVal = 0;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (target - startVal) * eased);
      setDisplay(current);
      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    const timer = setTimeout(() => {
      animRef.current = requestAnimationFrame(animate);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [target]);

  return (
    <span
      style={{
        fontFamily: tokens.fonts.primary,
        fontWeight: 800,
        fontSize: size * 0.18,
        color: isDark ? '#FF5B2E' : '#FF8430',
        transition: 'color 0.3s ease',
      }}
    >
      {display}%
    </span>
  );
};

export default CircleProgress;
