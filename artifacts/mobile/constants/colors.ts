/**
 * Anchor — Calm dark-first palette.
 * Both light and dark use the same deep-navy theme since this is a
 * sanctuary app that should always feel dim and soothing.
 */

const palette = {
  background: '#07090f',
  surface: '#0d1424',
  card: '#111827',
  primary: '#6baed6',
  primaryDim: 'rgba(107, 174, 214, 0.12)',
  accent: '#9b8fd4',
  accentDim: 'rgba(155, 143, 212, 0.12)',
  foreground: '#d8e6f3',
  mutedForeground: '#6b8099',
  border: '#1a2840',
  muted: '#1a2840',
  destructive: '#e57373',
  destructiveForeground: '#ffffff',
  success: '#81c995',
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
