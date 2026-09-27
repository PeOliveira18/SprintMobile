import { StyleSheet, Text, View } from 'react-native';

import { StatusBadge } from '@/components/StatusBadge';
import { colors, radius, spacing, typography } from '@/theme';
import { ServiceOrder } from '@/types/customer';
import { formatCurrency, formatDate } from '@/utils/format';
import { serviceStatusLabel, serviceStatusTone } from '@/utils/labels';

type ServiceOrderCardProps = {
  order: ServiceOrder;
};

export function ServiceOrderCard({ order }: ServiceOrderCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{order.title}</Text>
        <StatusBadge label={serviceStatusLabel(order.status)} tone={serviceStatusTone(order.status)} />
      </View>
      <Text style={styles.description}>{order.description}</Text>
      <View style={styles.footer}>
        <Text style={styles.meta}>Data: {formatDate(order.scheduledAt)}</Text>
        <Text style={styles.meta}>
          {order.amount > 0 ? formatCurrency(order.amount) : 'Sem custo (recall)'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  title: {
    ...typography.bodyStrong,
    fontSize: 15,
    fontWeight: '800',
    flex: 1,
  },
  description: {
    ...typography.body,
    fontSize: 13,
    lineHeight: 19,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  meta: {
    ...typography.caption,
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
});
