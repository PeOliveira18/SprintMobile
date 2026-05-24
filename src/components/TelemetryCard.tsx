import { StyleSheet, Text, View } from 'react-native';

import { StatusBadge } from '@/components/StatusBadge';
import { IoTSnapshot, SensorStatus } from '@/types/customer';

type TelemetryCardProps = {
  snapshot: IoTSnapshot;
};

export function TelemetryCard({ snapshot }: TelemetryCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <Text style={styles.vehicle}>{snapshot.vehicle}</Text>
          <Text style={styles.sync}>Cliente #{snapshot.customerId} | {snapshot.lastSync}</Text>
        </View>
        <StatusBadge label={snapshot.status} tone={getStatusTone(snapshot.status)} />
      </View>

      <View style={styles.grid}>
        <Metric label="Km" value={`${snapshot.odometerKm}`} />
        <Metric label="Bateria" value={`${snapshot.batteryPercent}%`} />
        <Metric label="Pneu" value={`${snapshot.tirePressurePsi} psi`} />
        <Metric label="Oleo" value={`${snapshot.oilLifePercent}%`} />
      </View>

      <Text style={styles.alert}>{snapshot.alert}</Text>
    </View>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

function getStatusTone(status: SensorStatus) {
  if (status === 'Critico') {
    return 'red' as const;
  }

  if (status === 'Atencao') {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleGroup: {
    flex: 1,
    gap: 3,
  },
  vehicle: {
    color: '#0F172A',
    fontSize: 17,
    fontWeight: '900',
  },
  sync: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metric: {
    minWidth: '47%',
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    padding: 10,
    gap: 4,
  },
  metricLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  metricValue: {
    color: '#172033',
    fontSize: 16,
    fontWeight: '900',
  },
  alert: {
    color: '#334155',
    fontSize: 14,
    lineHeight: 20,
  },
});
