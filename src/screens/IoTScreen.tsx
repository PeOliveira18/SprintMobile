import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { EmptyState } from '@/components/EmptyState';
import { ErrorMessage } from '@/components/ErrorMessage';
import { FordOneHeader } from '@/components/FordOneHeader';
import { Loading } from '@/components/Loading';
import { MetricCard } from '@/components/MetricCard';
import { OneCard } from '@/components/OneCard';
import { TelemetryCard } from '@/components/TelemetryCard';
import { useDeviceBattery } from '@/hooks/useDeviceBattery';
import { useTelemetry } from '@/hooks/useTelemetry';
import { IoTSnapshot } from '@/types/customer';

export function IoTScreen() {
  const { data: snapshots = [], isLoading, isRefetching, error, refetch } = useTelemetry();
  const deviceBattery = useDeviceBattery();
  const metrics = buildTelemetryMetrics(snapshots);

  if (isLoading) {
    return <Loading message="Sincronizando telemetria IoT..." />;
  }

  if (error) {
    return (
      <View style={styles.feedback}>
        <ErrorMessage
          message="Nao foi possivel carregar a telemetria."
          onRetry={() => {
            void refetch();
          }}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={() => {
            void refetch();
          }}
        />
      }
    >
      <FordOneHeader
        title="Dados do seu veiculo"
        subtitle="Informacoes em tempo real para antecipar manutencoes e proteger o VIN Share."
      />

      <View style={styles.connectedCard}>
        <View style={styles.connectedDot} />
        <View style={styles.connectedTextGroup}>
          <Text style={styles.connectedTitle}>FordPass Connect ativo</Text>
          <Text style={styles.connectedText}>Atualizado ha poucos segundos</Text>
        </View>
        <ActionButton
          label="Atualizar"
          onPress={() => {
            void refetch();
          }}
          variant="secondary"
          style={styles.refreshButton}
        />
      </View>

      <View style={styles.metrics}>
        <MetricCard
          label="Veiculos"
          value={String(metrics.total)}
          helper="Com leitura ativa"
          icon="car-outline"
        />
        <MetricCard
          label="Criticos"
          value={String(metrics.critical)}
          helper="Acionar consultor"
          tone="red"
          icon="alert-circle-outline"
        />
        <MetricCard
          label="Atencao"
          value={String(metrics.warning)}
          helper="Monitorar e lembrar"
          tone="yellow"
          icon="warning-outline"
        />
        <MetricCard
          label="Normal"
          value={String(metrics.normal)}
          helper="Relacionamento preventivo"
          tone="green"
          icon="checkmark-circle-outline"
        />
      </View>

      <OneCard>
        <View>
          <Text style={styles.deviceEyebrow}>Sensor do dispositivo</Text>
          <Text style={styles.deviceTitle}>Bateria do aparelho</Text>
          <Text style={styles.deviceText}>
            Leitura real via Expo Battery para demonstrar integracao com recurso
            nativo do dispositivo.
          </Text>
        </View>
        <View style={styles.deviceMetricRow}>
          <View style={styles.deviceMetric}>
            <Text style={styles.deviceMetricLabel}>Nivel</Text>
            <Text style={styles.deviceMetricValue}>
              {deviceBattery.batteryLevel === null ? '--' : `${deviceBattery.batteryLevel}%`}
            </Text>
          </View>
          <View style={styles.deviceMetric}>
            <Text style={styles.deviceMetricLabel}>Economia</Text>
            <Text style={styles.deviceMetricValue}>
              {deviceBattery.lowPowerMode ? 'Ativa' : 'Inativa'}
            </Text>
          </View>
        </View>
        <ActionButton
          label={deviceBattery.loading ? 'Lendo...' : 'Atualizar sensor'}
          disabled={deviceBattery.loading}
          onPress={() => {
            void deviceBattery.reload();
          }}
          variant="secondary"
        />
      </OneCard>

      {snapshots.length === 0 ? (
        <EmptyState
          title="Sem telemetria"
          description="A API nao retornou leituras para montar o painel IoT."
        />
      ) : (
        <View style={styles.list}>
          {snapshots.map((snapshot) => (
            <TelemetryCard key={snapshot.id} snapshot={snapshot} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

function buildTelemetryMetrics(snapshots: IoTSnapshot[]) {
  return {
    total: snapshots.length,
    critical: snapshots.filter((snapshot) => snapshot.status === 'Critico').length,
    warning: snapshots.filter((snapshot) => snapshot.status === 'Atencao').length,
    normal: snapshots.filter((snapshot) => snapshot.status === 'Normal').length,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FC',
  },
  content: {
    padding: 18,
    paddingBottom: 36,
    gap: 16,
  },
  feedback: {
    flex: 1,
    backgroundColor: '#F5F8FC',
    padding: 18,
    justifyContent: 'center',
  },
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  list: {
    gap: 12,
  },
  connectedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D7DEE8',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  connectedDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#09A66D',
  },
  connectedTextGroup: {
    flex: 1,
    minWidth: 0,
  },
  connectedTitle: {
    color: '#071331',
    fontSize: 15,
    fontWeight: '900',
  },
  connectedText: {
    color: '#526174',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  refreshButton: {
    minHeight: 40,
  },
  deviceEyebrow: {
    color: '#0B5CAD',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  deviceTitle: {
    color: '#0F172A',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 4,
  },
  deviceText: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  deviceMetricRow: {
    flexDirection: 'row',
    gap: 10,
  },
  deviceMetric: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    padding: 12,
    gap: 4,
  },
  deviceMetricLabel: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  deviceMetricValue: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '900',
  },
});
