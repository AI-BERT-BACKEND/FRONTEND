import { tokens } from './tokens';

export const createStyles = (isDark) => ({
  // General colors
  bg: isDark ? tokens.colors.bg.dark : tokens.colors.bg.light,
  cardBg: isDark ? tokens.colors.card.dark : tokens.colors.card.light,
  cardBgAlt: isDark ? tokens.colors.card.darkAlt : tokens.colors.card.lightAlt,
  cardBorder: isDark ? tokens.colors.border.dark : tokens.colors.border.light,
  cardShadow: isDark ? tokens.shadows.card.dark : tokens.shadows.card.light,

  // Text colors
  textPrimary: isDark ? tokens.colors.text.primary.dark : tokens.colors.text.primary.light,
  textSecondary: isDark ? tokens.colors.text.secondary.dark : tokens.colors.text.secondary.light,
  textMuted: isDark ? tokens.colors.text.muted.dark : tokens.colors.text.muted.light,

  // Gradients
  primaryGradient: isDark ? tokens.colors.gradient.primary.dark : tokens.colors.gradient.primary.light,
  primaryGradientReverse: isDark
    ? tokens.colors.gradient.primary.darkReverse
    : tokens.colors.gradient.primary.lightReverse,

  // Functional colors
  error: tokens.colors.error,
  success: tokens.colors.success,

  // Inputs
  inputBg: isDark ? tokens.colors.input.bg.dark : tokens.colors.input.bg.light,
  inputBorder: isDark ? tokens.colors.input.border.dark : tokens.colors.input.border.light,

  // Spacing & Radius
  ...tokens.spacing,
  ...tokens.radius,

  // Fonts
  fontPrimary: tokens.fonts.primary,
  fontSecondary: tokens.fonts.secondary,

  // Shared patterns
  modalShadow: isDark ? tokens.shadows.modal.dark : tokens.shadows.modal.light,
  popupShadow: isDark ? tokens.shadows.popup.dark : tokens.shadows.popup.light,
});
