// src/styles/theme.ts
export const colors = {
  deepTeal: '#002324',
  sand: '#E5DDDE',
  sage: '#A1AD95',
  mint: '#EBFACF',
  white: '#FFFFFF',
  error: '#d32f2f',
  success: '#276749',
  warning: '#B7791F',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: 'bold' as const },
  h2: { fontSize: 24, fontWeight: 'bold' as const },
  h3: { fontSize: 20, fontWeight: '600' as const },
  body: { fontSize: 14, fontWeight: 'normal' as const },
  caption: { fontSize: 12, color: colors.sage },
};