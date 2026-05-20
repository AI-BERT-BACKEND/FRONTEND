import React from 'react';
import { createStyles } from '../theme/createStyles';

export const ProgressBar = ({ value, isDark, color }) => {
  const s = createStyles(isDark);

  const styles = {
    progressTrack: {
      height: 7,
      borderRadius: 4,
      background: s.cardBorder,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      width: `${value}%`,
      borderRadius: 4,
      background: color || s.primaryGradient,
      transition: 'width 0.3s ease',
    },
  };

  return (
    <div style={styles.progressTrack}>
      <div style={styles.progressFill} />
    </div>
  );
};

export default ProgressBar;
