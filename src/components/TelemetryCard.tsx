import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { StatusBadge } from '@/components/StatusBadge';
import { colors, radius, spacing, typography } from '@/theme';
import { IoTSnapshot } from '@/types/customer';
import { formatKm, formatRelativeTime } from '@/utils/format';
import { sensorStatusLabel, sensorTone } from '@/utils/labels';

type TelemetryCardProps = {
  snapshot: IoTSnapshot;
};

export function TelemetryCard({ snapshot }: TelemetryCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <Text style={styles.vehicle}>{snapshot.vehicle}</Text>
          <Text style={styles.sync}>
            Cliente #{snapshot.customerId} · sincronizado {formatRelativeTime(snapshot.lastSync)}
          </Text>
        </View>
        <StatusBadge label={sensorStatusLabel(snapshot.status)} tone={sensorTone(snapshot.status)} />
      </View>

      <View style={styles.grid}>
        <Metric icon="speedometer-outline" label="Odômetro" value={formatKm(snapshot.odometerKm)} />
        <Metric icon="battery-half-outline" label="Bateria" value={`${snapshot.batteryPercent}%`} />
        <Metric icon="disc-outline" label="Pneus" value={`${snapshot.tirePressurePsi} psi`} />
        <Metric icon="water-outline" label="Óleo" value={`${snapshot.oilLifePercent}%`} />
      </View>

      <Text style={styles.alert}>{snapshot.alert}</Text>
    </View>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
}) {
  return (
    <View style={styles.metric}>
      <View style={styles.metricLabelRow}>
        <Ionicons name={icon} size={14} color={colors.textMuted} />
        <Text style={styles.metricLabel}>{label}</Text>
      </View>
      <Text style={styles.metricValue}>{value}</Text>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  titleGroup: {
    flex: 1,
    gap: 3,
  },
  vehicle: {
    ...typography.cardTitle,
    fontSize: 17,
  },
  sync: {
    ...typography.caption,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  metric: {
    flexGrow: 1,
    flexBasis: '46%',
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
    padding: 10,
    gap: spacing.xs,
  },
  metricLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metricLabel: {
    ...typography.overline,
    fontSize: 11,
  },
  metricValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  alert: {
    ...typography.body,
  },
});
