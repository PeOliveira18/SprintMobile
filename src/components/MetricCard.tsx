import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadows, spacing, Tone, tones, typography } from '@/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

type MetricCardProps = {
  label: string;
  value: string;
  helper: string;
  tone?: Exclude<Tone, 'gray'>;
  icon?: IconName;
};

export function MetricCard({ label, value, helper, tone = 'blue', icon }: MetricCardProps) {
  const palette = tones[tone];

  return (
    <View
      style={[styles.card, { borderColor: palette.border }]}
      accessible
      accessibilityLabel={`${label}: ${value}. ${helper}`}
    >
      <View style={styles.topRow}>
        {icon ? (
          <View style={[styles.iconBox, { backgroundColor: palette.background }]}>
            <Ionicons name={icon} size={17} color={palette.foreground} />
          </View>
        ) : null}
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      </View>
      <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={styles.helper}>{helper}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 150,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    padding: 14,
    gap: 6,
    borderWidth: 1,
    ...shadows.card,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.overline,
    color: colors.textSecondary,
    flexShrink: 1,
  },
  value: {
    ...typography.metric,
  },
  helper: {
    ...typography.caption,
    fontWeight: '400',
    lineHeight: 18,
    color: colors.textSecondary,
  },
});
