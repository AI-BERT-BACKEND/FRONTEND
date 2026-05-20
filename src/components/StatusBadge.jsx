import React from 'react';

export const StatusBadge = ({ label, color, bgColor, style = {} }) => {
  if (!label) return null;

  const badgeStyle = {
    fontSize: 9,
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: 20,
    letterSpacing: '0.06em',
    color: color,
    background: bgColor,
    textTransform: 'uppercase',
    ...style,
  };

  return <span style={badgeStyle}>{label}</span>;
};

export default StatusBadge;
