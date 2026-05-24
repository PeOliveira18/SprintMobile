import { Image, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { EmptyState } from '@/components/EmptyState';
import { ErrorMessage } from '@/components/ErrorMessage';
import { FordOneHeader } from '@/components/FordOneHeader';
import { Loading } from '@/components/Loading';
import { MetricCard } from '@/components/MetricCard';
import { OneCard } from '@/components/OneCard';
import { TelemetryCard } from '@/components/TelemetryCard';
import { TERRITORY_IMAGE } from '@/components/VehicleBanner';
import { useDeviceBattery } from '@/hooks/useDeviceBattery';
import { useTelemetry } from '@/hooks/useTelemetry';
import { useWeatherInsight } from '@/hooks/useWeatherInsight';
import { IoTSnapshot } from '@/types/customer';
import { WeatherInsight } from '@/types/weather';

export function IoTScreen() {
  const { data: snapshots = [], isLoading, isRefetching, error, refetch } = useTelemetry();
  const weatherQuery = useWeatherInsight();
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
          refreshing={isRefetching || weatherQuery.isRefetching}
          onRefresh={() => {
            void refetch();
            void weatherQuery.refetch();
          }}
        />
      }
    >
      <FordOneHeader
        title="Dados do seu veiculo"
        subtitle="Informacoes em tempo real para antecipar manutencoes e proteger o VIN Share."
      />

      <View style={styles.connectedCard}>
        <Image source={TERRITORY_IMAGE} style={styles.connectedImage} />
        <View style={styles.connectedTextGroup}>
          <Text style={styles.connectedTitle}>Ford Territory Titanium 2022</Text>
          <Text style={styles.connectedText}>ABC1D23 | 18.732 km</Text>
          <View style={styles.connectedStatus}>
            <View style={styles.connectedDot} />
            <Text style={styles.connectedStatusText}>FordPass Connect ativo</Text>
          </View>
        </View>
        <ActionButton
          label="Atualizar"
          onPress={() => {
            void refetch();
            void weatherQuery.refetch();
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

      <WeatherInsightCard
        insight={weatherQuery.data}
        loading={weatherQuery.isLoading}
        error={Boolean(weatherQuery.error)}
        onRetry={() => {
          void weatherQuery.refetch();
        }}
      />

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

function WeatherInsightCard({
  insight,
  loading,
  error,
  onRetry,
}: {
  insight?: WeatherInsight;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
}) {
  if (loading) {
    return (
      <OneCard style={styles.weatherCard}>
        <Text style={styles.deviceEyebrow}>Condicoes externas</Text>
        <Text style={styles.deviceTitle}>Carregando clima real...</Text>
        <Text style={styles.deviceText}>Buscando dados atuais da Open-Meteo.</Text>
      </OneCard>
    );
  }

  if (error || !insight) {
    return (
      <OneCard style={styles.weatherCard}>
        <Text style={styles.deviceEyebrow}>Condicoes externas</Text>
        <Text style={styles.deviceTitle}>Clima indisponivel</Text>
        <Text style={styles.deviceText}>
          Nao foi possivel consultar a Open-Meteo agora.
        </Text>
        <ActionButton label="Tentar novamente" variant="secondary" onPress={onRetry} />
      </OneCard>
    );
  }

  return (
    <OneCard style={styles.weatherCard}>
      <View style={styles.weatherHeader}>
        <View style={styles.weatherIcon}>
          <Text style={styles.weatherIconText}>{getWeatherIcon(insight.severity)}</Text>
        </View>
        <View style={styles.connectedTextGroup}>
          <Text style={styles.deviceEyebrow}>Condicoes externas</Text>
          <Text style={styles.deviceTitle}>{insight.location}</Text>
          <Text style={styles.deviceText}>{formatWeatherTime(insight.updatedAt)}</Text>
        </View>
      </View>

      <View style={styles.weatherMetrics}>
        <WeatherMetric label="Temp." value={formatNumber(insight.temperature, ' C')} />
        <WeatherMetric label="Chuva" value={formatNumber(insight.rain, ' mm')} />
        <WeatherMetric label="Prob." value={formatNumber(insight.precipitationProbability, ' %')} />
        <WeatherMetric label="Vento" value={formatNumber(insight.windSpeed, ' km/h')} />
      </View>

      <View style={[styles.weatherInsightBox, styles[getSeverityStyle(insight.severity)]]}>
        <Text style={styles.weatherSeverity}>{insight.severity}</Text>
        <Text style={styles.weatherRecommendation}>{insight.recommendation}</Text>
      </View>
    </OneCard>
  );
}

function WeatherMetric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.weatherMetric}>
      <Text style={styles.deviceMetricLabel}>{label}</Text>
      <Text style={styles.deviceMetricValue}>{value}</Text>
    </View>
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

function formatNumber(value: number | null, unit: string) {
  if (value === null) {
    return '--';
  }

  return `${Math.round(value)}${unit}`;
}

function formatWeatherTime(value: string | null) {
  if (!value) {
    return 'Atualizacao em tempo real';
  }

  return `Atualizado em ${value.replace('T', ' ')}`;
}

function getWeatherIcon(severity: WeatherInsight['severity']) {
  if (severity === 'Critico') {
    return '!';
  }

  if (severity === 'Atencao') {
    return '~';
  }

  return 'OK';
}

function getSeverityStyle(severity: WeatherInsight['severity']) {
  if (severity === 'Critico') {
    return 'weatherCritical' as const;
  }

  if (severity === 'Atencao') {
    return 'weatherWarning' as const;
  }

  return 'weatherNormal' as const;
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
  connectedImage: {
    width: 78,
    height: 52,
    borderRadius: 8,
    backgroundColor: '#EEF3F8',
  },
  connectedDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#09A66D',
  },
  connectedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 5,
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
  connectedStatusText: {
    color: '#0A7B4B',
    fontSize: 12,
    fontWeight: '800',
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
  weatherCard: {
    gap: 14,
  },
  weatherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  weatherIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF2FF',
  },
  weatherIconText: {
    color: '#005BEA',
    fontSize: 23,
    fontWeight: '900',
  },
  weatherMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  weatherMetric: {
    minWidth: '47%',
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    padding: 12,
    gap: 4,
  },
  weatherInsightBox: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    gap: 5,
  },
  weatherNormal: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  weatherWarning: {
    backgroundColor: '#FFF8DF',
    borderColor: '#F7E4A4',
  },
  weatherCritical: {
    backgroundColor: '#FFF0EE',
    borderColor: '#FFD4CD',
  },
  weatherSeverity: {
    color: '#071331',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  weatherRecommendation: {
    color: '#334155',
    fontSize: 14,
    lineHeight: 20,
  },
});
