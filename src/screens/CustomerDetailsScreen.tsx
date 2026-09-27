import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { EmptyState } from '@/components/EmptyState';
import { ErrorMessage } from '@/components/ErrorMessage';
import { FordOneHeader } from '@/components/FordOneHeader';
import { InfoRow } from '@/components/InfoRow';
import { Loading } from '@/components/Loading';
import { MetricCard } from '@/components/MetricCard';
import { OneCard } from '@/components/OneCard';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { ServiceOrderCard } from '@/components/ServiceOrderCard';
import { StatusBadge } from '@/components/StatusBadge';
import { CustomerVehicleBanner } from '@/components/VehicleBanner';
import { useCustomerDetails } from '@/hooks/useCustomerDetails';
import { useServiceOrders } from '@/hooks/useServiceOrders';
import { colors, spacing, typography } from '@/theme';
import { formatDate, formatNumber } from '@/utils/format';
import {
  leadPriorityLabel,
  leadStatusLabel,
  leadTypeLabel,
  riskLevelLabel,
  riskTone,
} from '@/utils/labels';

export function CustomerDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const customerId = Number(id);
  const customerQuery = useCustomerDetails(customerId);
  const ordersQuery = useServiceOrders(customerId);

  if (!Number.isFinite(customerId)) {
    return <ErrorMessage fullScreen title="Cliente inválido" message="O link aberto não corresponde a um cliente." />;
  }

  if (customerQuery.isLoading) {
    return <Loading fullScreen message="Carregando VIN..." />;
  }

  if (customerQuery.error || !customerQuery.data) {
    return (
      <ErrorMessage
        fullScreen
        message="Não foi possível carregar os dados do cliente."
        onRetry={() => {
          void customerQuery.refetch();
        }}
      />
    );
  }

  const customer = customerQuery.data;

  return (
    <Screen
      refreshing={customerQuery.isRefetching}
      onRefresh={() => {
        void customerQuery.refetch();
        void ordersQuery.refetch();
      }}
    >
      <FordOneHeader
        back
        title="Plano do VIN"
        subtitle="Dados do veículo, histórico na Rede Ford e recomendações de retenção."
      />

      <CustomerVehicleBanner customer={customer} />

      <OneCard>
        <View style={styles.headerTop}>
          <View style={styles.flex}>
            <Text style={styles.eyebrow}>Lead de retenção</Text>
            <Text style={typography.display}>{customer.name}</Text>
          </View>
          <StatusBadge
            label={`Prioridade ${leadPriorityLabel(customer.leadPriority).toLowerCase()}`}
            tone={riskTone(customer.riskLevel)}
          />
        </View>
        <ActionButton
          label="Criar ação de retenção"
          onPress={() =>
            router.push({ pathname: '/campanha', params: { customerId: String(customer.id) } })
          }
        />
      </OneCard>

      <View style={styles.metrics}>
        <MetricCard
          label="Rede oficial"
          value={customer.hasServiceInNetwork ? 'Sim' : 'Não'}
          helper="Conta no VIN Share"
          tone={customer.hasServiceInNetwork ? 'green' : 'red'}
          icon="git-network-outline"
        />
        <MetricCard
          label="Evasão"
          value={`${customer.churnProbability}%`}
          helper={`Risco ${riskLevelLabel(customer.riskLevel).toLowerCase()}`}
          tone={riskTone(customer.riskLevel)}
          icon="trending-down-outline"
        />
        <MetricCard
          label="Sem serviço"
          value={`${customer.lastServiceDays} dias`}
          helper="Desde a última OS na rede"
          tone="yellow"
          icon="time-outline"
        />
        <MetricCard
          label="Km atual"
          value={formatNumber(customer.mileageKm)}
          helper={`Próxima revisão em ${formatNumber(customer.nextServiceKm)} km`}
          tone="blue"
          icon="speedometer-outline"
        />
        <MetricCard
          label="Recalls"
          value={String(customer.recallCount)}
          helper="NHTSA por modelo/ano"
          tone={customer.criticalRecallCount > 0 ? 'red' : 'yellow'}
          icon="warning-outline"
        />
      </View>

      <OneCard>
        <Text style={typography.section}>Diagnóstico VIN Share</Text>
        <Text style={typography.body}>{customer.insight}</Text>
        {customer.latestRecall ? (
          <DiagnosisItem
            title="Recall mais recente"
            text={`${customer.latestRecall.component} · Campanha ${customer.latestRecall.campaignNumber}`}
          />
        ) : null}
        <DiagnosisItem
          title="Lead sugerido"
          text={`${leadTypeLabel(customer.leadType)} · ${leadStatusLabel(customer.leadStatus)}`}
        />
        <DiagnosisItem title="Ação recomendada" text={customer.recommendedAction} />
      </OneCard>

      <OneCard>
        <Text style={typography.section}>Cliente, veículo e concessionária</Text>
        <View style={styles.infoList}>
          <InfoRow label="E-mail" value={customer.email} />
          <InfoRow label="Telefone" value={customer.phone} />
          <InfoRow label="Documento" value={maskDocument(customer.document)} />
          <InfoRow label="Cidade" value={`${customer.city}/${customer.state}`} />
          <InfoRow label="VIN" value={customer.vin} />
          <InfoRow label="Concessionária" value={customer.dealership} />
          <InfoRow label="Data de compra" value={formatDate(customer.purchaseDate)} />
          <InfoRow label="Garantia ativa" value={customer.warrantyActive ? 'Sim' : 'Não'} />
        </View>
      </OneCard>

      <SectionHeader
        title="Ordens de serviço"
        description="Recalls reais da NHTSA convertidos em ordens para a concessionária."
        action={ordersQuery.isFetching && !ordersQuery.isLoading ? <Text style={styles.muted}>Atualizando...</Text> : undefined}
      />

      {ordersQuery.isLoading ? <Loading message="Carregando ordens..." /> : null}

      {ordersQuery.error ? (
        <ErrorMessage
          message="Não foi possível carregar as ordens de serviço."
          onRetry={() => {
            void ordersQuery.refetch();
          }}
        />
      ) : null}

      {ordersQuery.data && ordersQuery.data.length === 0 ? (
        <EmptyState
          title="Sem ordens recentes"
          description="Nenhum recall ou revisão pendente para este veículo."
        />
      ) : null}

      <View style={styles.list}>
        {ordersQuery.data?.map((order) => (
          <ServiceOrderCard key={order.id} order={order} />
        ))}
      </View>
    </Screen>
  );
}

function DiagnosisItem({ title, text }: { title: string; text: string }) {
  return (
    <View style={styles.diagnosisItem}>
      <Text style={styles.eyebrow}>{title}</Text>
      <Text style={typography.body}>{text}</Text>
    </View>
  );
}

function maskDocument(document: string) {
  const digits = document.replace(/\D/g, '');
  return digits.length === 11 ? `***.***.**${digits[8]}-${digits.slice(9)}` : document;
}

const styles = StyleSheet.create({
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  flex: {
    flex: 1,
    minWidth: 0,
  },
  eyebrow: {
    ...typography.overline,
    color: colors.primary,
  },
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  diagnosisItem: {
    gap: 2,
  },
  infoList: {
    gap: 10,
  },
  muted: {
    ...typography.caption,
    fontWeight: '700',
  },
  list: {
    gap: spacing.md,
  },
});
