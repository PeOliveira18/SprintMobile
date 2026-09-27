import { StyleSheet, Text } from 'react-native';

import { radius, Tone, tones } from '@/theme';

type StatusBadgeProps = {
  label: string;
  tone?: Tone;
};

export function StatusBadge({ label, tone = 'gray' }: StatusBadgeProps) {
  const palette = tones[tone];

  return (
    <Text
      style={[styles.badge, { backgroundColor: palette.background, color: palette.foreground }]}
      numberOfLines={1}
    >
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    maxWidth: 140,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 12,
    fontWeight: '800',
    overflow: 'hidden',
    textAlign: 'center',
  },
});
