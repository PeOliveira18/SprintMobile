import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { EmptyState } from '@/components/EmptyState';
import { ErrorMessage } from '@/components/ErrorMessage';
import { FordOneHeader } from '@/components/FordOneHeader';
import { Loading } from '@/components/Loading';
import { MetricCard } from '@/components/MetricCard';
import { OneCard } from '@/components/OneCard';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { TelemetryCard } from '@/components/TelemetryCard';
import { VehicleBanner } from '@/components/VehicleBanner';
import { getVehicleOption } from '@/constants/onboarding';
import { useAccountSession } from '@/hooks/useAccountSession';
import { useDeviceBattery } from '@/hooks/useDeviceBattery';
import { useTelemetry } from '@/hooks/useTelemetry';
import { useWeatherInsight } from '@/hooks/useWeatherInsight';
import { colors, radius, spacing, tones, typography } from '@/theme';
import { IoTSnapshot } from '@/types/customer';
import { WeatherInsight } from '@/types/weather';
import { formatDateTime } from '@/utils/format';
import { sensorTone, severityLabel } from '@/utils/labels';

type IconName = ComponentProps<typeof Ionicons>['name'];

export function IoTScreen() {
  const { data: snapshots = [], isLoading, isRefetching, error, refetch } = useTelemetry();
  const weatherQuery = useWeatherInsight();
  const deviceBattery = useDeviceBattery();
  const { profile } = useAccountSession();
  const metrics = buildTelemetryMetrics(snapshots);
  const vehicle = getVehicleOption(profile?.onboarding.vehicle ?? '');

  function refreshAll() {
    void refetch();
    void weatherQuery.refetch();
    void deviceBattery.reload();
  }

  if (isLoading) {
    return <Loading fullScreen message="Sincronizando telemetria IoT..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        fullScreen
        message="Não foi possível carregar a telemetria."
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <Screen refreshing={isRefetching || weatherQuery.isRefetching} onRefresh={refreshAll}>
      <FordOneHeader
        title="Dados do seu veículo"
        subtitle="Informações em tempo real para antecipar manutenções e proteger o VIN Share."
      />

      <VehicleBanner
        vehicle={vehicle.label}
        meta={vehicle.meta}
        connected
        connectedLabel="FordPass Connect ativo"
      />

      <View style={styles.metrics}>
        <MetricCard label="Veículos" value={String(metrics.total)} helper="Com leitura ativa" icon="car-outline" />
        <MetricCard
          label="Críticos"
          value={String(metrics.critical)}
          helper="Acionar consultor"
          tone="red"
          icon="alert-circle-outline"
        />
        <MetricCard
          label="Atenção"
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
        <CardHeading
          icon="phone-portrait-outline"
          eyebrow="Sensor do dispositivo"
          title="Bateria do aparelho"
        />
        <Text style={typography.body}>
          Leitura real via Expo Battery, demonstrando integração com um recurso nativo do dispositivo.
        </Text>
        <View style={styles.tileRow}>
          <Tile
            label="Nível"
            value={deviceBattery.batteryLevel === null ? '--' : `${deviceBattery.batteryLevel}%`}
          />
          <Tile label="Economia" value={deviceBattery.lowPowerMode ? 'Ativa' : 'Inativa'} />
        </View>
        <ActionButton
          label={deviceBattery.loading ? 'Lendo sensor...' : 'Atualizar sensor'}
          icon="refresh-outline"
          disabled={deviceBattery.loading}
          onPress={() => {
            void deviceBattery.reload();
          }}
          variant="secondary"
        />
      </OneCard>

      <SectionHeader
        title="Telemetria da frota"
        description="Leituras simuladas de sensores dos veículos conectados."
      />

      {snapshots.length === 0 ? (
        <EmptyState
          title="Sem telemetria"
          description="Nenhum veículo enviou leituras para montar o painel IoT."
        />
      ) : (
        <View style={styles.list}>
          {snapshots.map((snapshot) => (
            <TelemetryCard key={snapshot.id} snapshot={snapshot} />
          ))}
        </View>
      )}
    </Screen>
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
      <OneCard>
        <CardHeading icon="cloud-outline" eyebrow="Condições externas" title="Carregando clima real..." />
        <Text style={typography.body}>Buscando dados atuais da Open-Meteo.</Text>
      </OneCard>
    );
  }

  if (error || !insight) {
    return (
      <OneCard>
        <CardHeading icon="cloud-offline-outline" eyebrow="Condições externas" title="Clima indisponível" />
        <Text style={typography.body}>Não foi possível consultar a Open-Meteo agora.</Text>
        <ActionButton label="Tentar novamente" icon="refresh-outline" variant="secondary" onPress={onRetry} />
      </OneCard>
    );
  }

  const tone = tones[sensorTone(insight.severity)];

  return (
    <OneCard>
      <View style={styles.weatherHeader}>
        <CardHeading
          icon={getWeatherIcon(insight)}
          eyebrow="Condições externas"
          title={insight.location}
        />
        <StatusBadge label={severityLabel(insight.severity)} tone={sensorTone(insight.severity)} />
      </View>
      <Text style={styles.updatedAt}>
        {insight.updatedAt ? `Atualizado em ${formatDateTime(insight.updatedAt)}` : 'Atualização em tempo real'}
      </Text>

      <View style={styles.tileRow}>
        <Tile label="Temp." value={formatValue(insight.temperature, ' °C')} />
        <Tile label="Chuva" value={formatValue(insight.rain, ' mm')} />
      </View>
      <View style={styles.tileRow}>
        <Tile label="Prob. chuva" value={formatValue(insight.precipitationProbability, '%')} />
        <Tile label="Vento" value={formatValue(insight.windSpeed, ' km/h')} />
      </View>

      <View style={[styles.insightBox, { backgroundColor: tone.background, borderColor: tone.border }]}>
        <Text style={styles.insightTitle}>Recomendação para a rede</Text>
        <Text style={typography.body}>{insight.recommendation}</Text>
      </View>
    </OneCard>
  );
}

function CardHeading({ icon, eyebrow, title }: { icon: IconName; eyebrow: string; title: string }) {
  return (
    <View style={styles.heading}>
      <View style={styles.headingIcon}>
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>
      <View style={styles.headingCopy}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={typography.title}>{title}</Text>
      </View>
    </View>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.tile}>
      <Text style={typography.overline}>{label}</Text>
      <Text style={styles.tileValue}>{value}</Text>
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

function formatValue(value: number | null, unit: string) {
  return value === null ? '--' : `${Math.round(value)}${unit}`;
}

function getWeatherIcon(insight: WeatherInsight): IconName {
  if ((insight.rain ?? 0) > 0 || (insight.precipitationProbability ?? 0) >= 55) {
    return 'rainy-outline';
  }

  if ((insight.temperature ?? 0) >= 32) {
    return 'sunny-outline';
  }

  return insight.severity === 'Normal' ? 'partly-sunny-outline' : 'cloudy-outline';
}

const styles = StyleSheet.create({
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  list: {
    gap: spacing.md,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
    minWidth: 0,
  },
  headingIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  headingCopy: {
    flex: 1,
    minWidth: 0,
  },
  eyebrow: {
    ...typography.overline,
    color: colors.primary,
  },
  weatherHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  updatedAt: {
    ...typography.caption,
  },
  tileRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tile: {
    flex: 1,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
    padding: spacing.md,
    gap: spacing.xs,
  },
  tileValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  insightBox: {
    borderRadius: 10,
    borderWidth: 1,
    padding: spacing.md,
    gap: 5,
  },
  insightTitle: {
    ...typography.overline,
    color: colors.text,
  },
});
