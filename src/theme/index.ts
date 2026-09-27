import { TextStyle, ViewStyle } from 'react-native';

export const colors = {
  primary: '#005BEA',
  primaryDark: '#064FAE',
  primarySoft: '#EAF2FF',
  primarySubtle: '#F3F8FF',
  primaryBorder: '#CFE0FF',
  navy: '#001B4D',
  navyOverlay: 'rgba(0, 27, 77, 0.6)',

  background: '#F5F8FC',
  surface: '#FFFFFF',
  surfaceMuted: '#F8FAFC',
  surfaceSunken: '#EEF3F8',
  border: '#DDE6F3',
  borderStrong: '#CBD5E1',

  text: '#071331',
  textSecondary: '#43516A',
  textMuted: '#64748B',
  textInverse: '#FFFFFF',
  iconMuted: '#8390A5',

  success: '#0A8F5A',
  successSoft: '#E8F8F0',
  successBorder: '#CFEBDD',
  warning: '#B7791F',
  warningSoft: '#FFF8DF',
  warningBorder: '#F7E4A4',
  danger: '#D92D20',
  dangerSoft: '#FFF0EE',
  dangerBorder: '#FFD4CD',
  dangerStrong: '#9A3412',
  gold: '#FFC233',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const typography = {
  display: { color: colors.text, fontSize: 24, lineHeight: 30, fontWeight: '900' },
  title: { color: colors.text, fontSize: 20, lineHeight: 26, fontWeight: '900' },
  section: { color: colors.text, fontSize: 19, lineHeight: 24, fontWeight: '900' },
  cardTitle: { color: colors.text, fontSize: 16, lineHeight: 22, fontWeight: '900' },
  body: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
  bodyStrong: { color: colors.text, fontSize: 14, lineHeight: 20, fontWeight: '700' },
  caption: { color: colors.textMuted, fontSize: 12, lineHeight: 16, fontWeight: '600' },
  overline: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  metric: { color: colors.text, fontSize: 24, lineHeight: 30, fontWeight: '900' },
  link: { color: colors.primary, fontSize: 14, lineHeight: 20, fontWeight: '900' },
} satisfies Record<string, TextStyle>;

export const shadows = {
  card: {
    shadowColor: '#061B3A',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
} satisfies Record<string, ViewStyle>;

export type Tone = 'blue' | 'green' | 'yellow' | 'red' | 'gray';

export const tones: Record<Tone, { foreground: string; background: string; border: string }> = {
  blue: { foreground: colors.primary, background: colors.primarySoft, border: colors.primaryBorder },
  green: { foreground: colors.success, background: colors.successSoft, border: colors.successBorder },
  yellow: { foreground: colors.warning, background: colors.warningSoft, border: colors.warningBorder },
  red: { foreground: colors.danger, background: colors.dangerSoft, border: colors.dangerBorder },
  gray: { foreground: colors.textSecondary, background: colors.surfaceSunken, border: colors.border },
};
