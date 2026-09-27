import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { colors, radius, shadows, spacing } from '@/theme';

type OneCardProps = {
  children: ReactNode;
  variant?: 'default' | 'highlight';
  style?: StyleProp<ViewStyle>;
};

export function OneCard({ children, variant = 'default', style }: OneCardProps) {
  return <View style={[styles.card, variant === 'highlight' && styles.highlight, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.card,
  },
  highlight: {
    backgroundColor: colors.primarySubtle,
    borderColor: colors.primaryBorder,
  },
});
