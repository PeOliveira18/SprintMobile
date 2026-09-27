import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { StatusBadge } from '@/components/StatusBadge';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import { Customer } from '@/types/customer';
import { leadPriorityLabel, leadTypeLabel, riskTone } from '@/utils/labels';

type CustomerCardProps = {
  customer: Customer;
  onPress: () => void;
};

export function CustomerCard({ customer, onPress }: CustomerCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Abrir plano do VIN de ${customer.name}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        <View style={styles.nameGroup}>
          <Text style={styles.name} numberOfLines={1}>
            {customer.name}
          </Text>
          <Text style={styles.vehicle} numberOfLines={1}>
            {customer.vehicle} {customer.modelYear} · {customer.dealershipCode}
          </Text>
          <Text style={styles.vin} numberOfLines={1}>
            VIN {customer.vin}
          </Text>
        </View>
        <StatusBadge
          label={`Prioridade ${leadPriorityLabel(customer.leadPriority).toLowerCase()}`}
          tone={riskTone(customer.riskLevel)}
        />
      </View>

      <View style={styles.row}>
        <Stat label="VIN Share" value={customer.hasServiceInNetwork ? 'Rede' : 'Fora'} />
        <Stat label="Evasão" value={`${customer.churnProbability}%`} />
        <Stat label="Lead" value={leadTypeLabel(customer.leadType)} small />
      </View>

      <View style={styles.footer}>
        <Text style={styles.action}>{customer.recommendedAction}</Text>
        <Ionicons name="chevron-forward" size={18} color={colors.primary} />
      </View>
    </Pressable>
  );
}

function Stat({ label, value, small = false }: { label: string; value: string; small?: boolean }) {
  return (
    <View style={[styles.stat, small && styles.statWide]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={small ? styles.valueSmall : styles.value} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: 14,
    ...shadows.card,
  },
  pressed: {
    opacity: 0.8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  nameGroup: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  name: {
    ...typography.cardTitle,
    fontSize: 17,
  },
  vehicle: {
    ...typography.caption,
    fontSize: 13,
  },
  vin: {
    ...typography.caption,
    fontWeight: '800',
    color: colors.textSecondary,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  stat: {
    gap: 2,
  },
  statWide: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    ...typography.overline,
  },
  value: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '900',
  },
  valueSmall: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  action: {
    ...typography.body,
    flex: 1,
  },
});
