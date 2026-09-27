import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';

type InfoRowProps = {
  label: string;
  value: string;
};

export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  label: {
    ...typography.caption,
    fontWeight: '800',
    color: colors.textSecondary,
  },
  value: {
    ...typography.bodyStrong,
    fontSize: 13,
    fontWeight: '800',
    flex: 1,
    textAlign: 'right',
  },
});
