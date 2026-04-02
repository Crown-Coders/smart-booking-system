// constants/theme.ts
export const colors = {
  primary: '#002324',
  primaryLight: '#EBFACF',
  accent: '#A1AD95',
  background: '#F7F8F7',
  surface: '#FFFFFF',
  text: '#002324',
  textSecondary: '#A1AD95',
  border: '#E5DDDE',
  error: '#F44336',
  success: '#4CAF50',
  warning: '#FF9800',
  info: '#2196F3',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  h1: { fontSize: 32, fontWeight: 'bold' as const },
  h2: { fontSize: 24, fontWeight: '600' as const },
  h3: { fontSize: 20, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: 'normal' as const },
  caption: { fontSize: 12, fontWeight: 'normal' as const },
};