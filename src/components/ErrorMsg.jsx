import React from 'react';
import ErrorIcon from './ErrorIcon';
import { tokens } from '../theme/tokens';

export const ErrorMsg = ({ message }) => {
  if (!message) return null;

  const styles = {
    errorRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginTop: 4,
      color: tokens.colors.error,
      fontSize: 12,
      fontFamily: tokens.fonts.secondary,
    },
  };

  return (
    <div style={styles.errorRow}>
      <ErrorIcon />
      <span>{message}</span>
    </div>
  );
};

export default ErrorMsg;
