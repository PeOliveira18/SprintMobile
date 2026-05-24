import { Pressable, StyleSheet, Text, View } from 'react-native';

import { StatusBadge } from '@/components/StatusBadge';
import { Customer, RiskLevel } from '@/types/customer';

type CustomerCardProps = {
  customer: Customer;
  onPress: () => void;
};

export function CustomerCard({ customer, onPress }: CustomerCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        <View style={styles.nameGroup}>
          <Text style={styles.name} numberOfLines={1}>
            {customer.name}
          </Text>
          <Text style={styles.vehicle} numberOfLines={1}>
            {customer.vehicle} {customer.modelYear} | {customer.dealershipCode}
          </Text>
          <Text style={styles.vin} numberOfLines={1}>
            {customer.vin}
          </Text>
        </View>
        <StatusBadge label={customer.leadPriority} tone={getRiskTone(customer.riskLevel)} />
      </View>

      <View style={styles.row}>
        <View>
          <Text style={styles.label}>VIN Share</Text>
          <Text style={styles.value}>{customer.hasServiceInNetwork ? 'Rede' : 'Fora'}</Text>
        </View>
        <View>
          <Text style={styles.label}>Evasao</Text>
          <Text style={styles.value}>{customer.churnProbability}%</Text>
        </View>
        <View>
          <Text style={styles.label}>Lead</Text>
          <Text style={styles.valueSmall}>{formatLeadType(customer.leadType)}</Text>
        </View>
      </View>

      <Text style={styles.action}>{customer.recommendedAction}</Text>
    </Pressable>
  );
}

function formatLeadType(value: string) {
  return value.replaceAll('_', ' ');
}

function getRiskTone(riskLevel: RiskLevel) {
  if (riskLevel === 'Critico' || riskLevel === 'Alto') {
    return 'red' as const;
  }

  if (riskLevel === 'Medio') {
    return 'yellow' as const;
  }

  return 'green' as const;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D7DEE8',
    padding: 16,
    gap: 14,
  },
  pressed: {
    opacity: 0.75,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  nameGroup: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  name: {
    color: '#0F172A',
    fontSize: 17,
    fontWeight: '900',
  },
  vehicle: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
  },
  vin: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '800',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  label: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  value: {
    color: '#172033',
    fontSize: 19,
    fontWeight: '900',
  },
  valueSmall: {
    color: '#172033',
    fontSize: 15,
    fontWeight: '900',
  },
  action: {
    color: '#334155',
    fontSize: 14,
    lineHeight: 20,
  },
});
