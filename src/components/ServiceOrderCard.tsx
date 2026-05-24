import { StyleSheet, Text, View } from 'react-native';

import { StatusBadge } from '@/components/StatusBadge';
import { ServiceOrder, ServiceStatus } from '@/types/customer';

type ServiceOrderCardProps = {
  order: ServiceOrder;
};

export function ServiceOrderCard({ order }: ServiceOrderCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{order.title}</Text>
        <StatusBadge label={order.status} tone={getStatusTone(order.status)} />
      </View>
      <Text style={styles.description}>{order.description}</Text>
      <View style={styles.footer}>
        <Text style={styles.meta}>Data: {order.scheduledAt}</Text>
        <Text style={styles.meta}>R$ {order.amount.toFixed(2)}</Text>
      </View>
    </View>
  );
}

function getStatusTone(status: ServiceStatus) {
  if (status === 'Atrasado') {
    return 'red' as const;
  }

  if (status === 'Pendente') {
    return 'yellow' as const;
  }

  if (status === 'Agendado') {
    return 'blue' as const;
  }

  return 'green' as const;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D7DEE8',
    padding: 14,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  title: {
    flex: 1,
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
  },
  description: {
    color: '#475569',
    fontSize: 13,
    lineHeight: 19,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  meta: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
  },
});
