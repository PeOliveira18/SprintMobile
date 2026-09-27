import { Ionicons } from '@expo/vector-icons';
import { ComponentProps, ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

export function Question({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.question}>
      <View style={styles.questionCopy}>
        <Text style={styles.questionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.questionSubtitle}>{subtitle}</Text> : null}
      </View>
      {children}
    </View>
  );
}

export function OptionChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, selected && styles.selected, pressed && styles.pressed]}
    >
      <Ionicons
        name={selected ? 'radio-button-on' : 'radio-button-off'}
        size={17}
        color={selected ? colors.primary : colors.iconMuted}
      />
      <Text style={[styles.chipLabel, selected && styles.selectedText]}>{label}</Text>
    </Pressable>
  );
}

export function SelectableCard({
  label,
  description,
  icon,
  selected,
  onPress,
}: {
  label: string;
  description: string;
  icon: IconName;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${label}. ${description}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.selectable,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}
    >
      <Ionicons name={icon} size={20} color={selected ? colors.primary : colors.iconMuted} />
      <View style={styles.selectableCopy}>
        <Text style={[styles.selectableTitle, selected && styles.selectedText]}>{label}</Text>
        <Text style={styles.selectableDescription}>{description}</Text>
      </View>
      {selected ? (
        <Ionicons name="checkmark-circle" size={20} color={colors.primary} style={styles.checkIcon} />
      ) : null}
    </Pressable>
  );
}

export function VehicleOption({
  label,
  meta,
  selected,
  onPress,
}: {
  label: string;
  meta: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.vehicleOption,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.vehicleIcon}>
        <Ionicons name="car-sport-outline" size={24} color={selected ? colors.primary : colors.iconMuted} />
      </View>
      <View style={styles.vehicleCopy}>
        <Text style={styles.vehicleTitle}>{label}</Text>
        <Text style={styles.vehicleMeta}>{meta}</Text>
      </View>
      {selected ? <Ionicons name="checkmark-circle" size={20} color={colors.primary} /> : null}
    </Pressable>
  );
}

export function SummaryList({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <View style={styles.summaryBox}>
      {rows.map((row) => (
        <View key={row.label} style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{row.label}</Text>
          <Text style={styles.summaryValue}>{row.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  question: {
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  questionCopy: {
    gap: 3,
  },
  questionTitle: {
    ...typography.cardTitle,
  },
  questionSubtitle: {
    ...typography.caption,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    color: colors.textSecondary,
  },
  chip: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
  },
  chipLabel: {
    color: colors.textSecondary,
    fontWeight: '800',
    flexShrink: 1,
  },
  selected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySubtle,
  },
  selectedText: {
    color: colors.primary,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  selectable: {
    width: '48%',
    flexGrow: 1,
    minHeight: 94,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.surface,
  },
  selectableCopy: {
    gap: 2,
    paddingRight: 10,
  },
  selectableTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.text,
  },
  selectableDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  checkIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  vehicleOption: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
  },
  vehicleIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  vehicleCopy: {
    flex: 1,
    minWidth: 0,
  },
  vehicleTitle: {
    ...typography.cardTitle,
    fontSize: 15,
  },
  vehicleMeta: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    marginTop: 3,
  },
  summaryBox: {
    alignSelf: 'stretch',
    borderRadius: radius.md,
    backgroundColor: colors.primarySubtle,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  summaryLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '800',
  },
  summaryValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '900',
    flex: 1,
    textAlign: 'right',
  },
});
