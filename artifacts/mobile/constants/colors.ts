/**
 * Cuan — Calm dark-first palette.
 * Both light and dark use the same deep-navy theme since this is a
 * sanctuary app that should always feel dim and soothing.
 */

const palette = {
  background: '#04060B',
  surface: '#0B1120',
  card: '#121A2F',
  primary: '#82C3E5',
  primaryDim: 'rgba(130, 195, 229, 0.15)',
  accent: '#A79DE0',
  accentDim: 'rgba(167, 157, 224, 0.15)',
  foreground: '#E2E8F0',
  mutedForeground: '#7B8C9C',
  border: '#1E293B',
  muted: '#1E293B',
  destructive: '#F87171',
  destructiveForeground: '#FFFFFF',
  success: '#86EFAC',
};

const colors = {
  light: {
    text: palette.foreground,
    tint: palette.primary,
    background: palette.background,
    foreground: palette.foreground,
    card: palette.card,
    cardForeground: palette.foreground,
    primary: palette.primary,
    primaryForeground: palette.background,
    primaryDim: palette.primaryDim,
    secondary: palette.surface,
    secondaryForeground: palette.foreground,
    muted: palette.muted,
    mutedForeground: palette.mutedForeground,
    accent: palette.accent,
    accentDim: palette.accentDim,
    accentForeground: palette.foreground,
    destructive: palette.destructive,
    destructiveForeground: palette.destructiveForeground,
    border: palette.border,
    input: palette.border,
    success: palette.success,
    surface: palette.surface,
  },
  dark: {
    text: palette.foreground,
    tint: palette.primary,
    background: palette.background,
    foreground: palette.foreground,
    card: palette.card,
    cardForeground: palette.foreground,
    primary: palette.primary,
    primaryForeground: palette.background,
    primaryDim: palette.primaryDim,
    secondary: palette.surface,
    secondaryForeground: palette.foreground,
    muted: palette.muted,
    mutedForeground: palette.mutedForeground,
    accent: palette.accent,
    accentDim: palette.accentDim,
    accentForeground: palette.foreground,
    destructive: palette.destructive,
    destructiveForeground: palette.destructiveForeground,
    border: palette.border,
    input: palette.border,
    success: palette.success,
    surface: palette.surface,
  },
  radius: 16,
};

export default colors;
