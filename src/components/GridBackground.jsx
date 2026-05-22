import React from 'react';

const GridBackground = ({ isDark }) => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: isDark ? '#050208' : '#FDF2EB',
        backgroundImage: isDark
          ? `linear-gradient(#041B36 1px, transparent 1px), linear-gradient(90deg, #041B36 1px, transparent 1px)`
          : `linear-gradient(rgba(210,140,100,0.30) 1px, transparent 1px), linear-gradient(90deg, rgba(210,140,100,0.30) 1px, transparent 1px)`,
        backgroundSize: '36px 36px',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

export default GridBackground;
