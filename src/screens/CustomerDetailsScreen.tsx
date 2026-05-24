import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { EmptyState } from '@/components/EmptyState';
import { ErrorMessage } from '@/components/ErrorMessage';
import { FordOneHeader } from '@/components/FordOneHeader';
import { Loading } from '@/components/Loading';
import { MetricCard } from '@/components/MetricCard';
import { OneCard } from '@/components/OneCard';
import { ServiceOrderCard } from '@/components/ServiceOrderCard';
import { StatusBadge } from '@/components/StatusBadge';
import { VehicleBanner } from '@/components/VehicleBanner';
import { useCustomerDetails } from '@/hooks/useCustomerDetails';
import { useServiceOrders } from '@/hooks/useServiceOrders';

export function CustomerDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const customerId = Number(id);
  const customerQuery = useCustomerDetails(customerId);
  const ordersQuery = useServiceOrders(customerId);

  if (!Number.isFinite(customerId)) {
    return (
      <View style={styles.feedback}>
        <ErrorMessage message="Cliente invalido na rota." />
      </View>
    );
  }

  if (customerQuery.isLoading) {
    return <Loading message="Carregando VIN..." />;
  }

  if (customerQuery.error || !customerQuery.data) {
    return (
      <View style={styles.feedback}>
        <ErrorMessage
          message="Nao foi possivel carregar os dados do cliente."
          onRetry={() => {
            void customerQuery.refetch();
          }}
        />
      </View>
    );
  }

  const customer = customerQuery.data;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <FordOneHeader
        safeTop={false}
        title="Plano do VIN"
        subtitle="Compare dados do veiculo, historico da rede Ford e recomendacoes de retencao."
      />

      <VehicleBanner customer={customer} />

      <OneCard>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.eyebrow}>Lead de retencao</Text>
            <Text style={styles.title}>{customer.name}</Text>
          </View>
          <StatusBadge
            label={customer.leadPriority}
            tone={
              customer.riskLevel === 'Alto' || customer.riskLevel === 'Critico'
                ? 'red'
                : 'green'
            }
          />
        </View>
        <ActionButton
          label="Criar acao"
          onPress={() => router.push(`/campanha?customerId=${customer.id}`)}
        />
      </OneCard>

      <View style={styles.metrics}>
        <MetricCard
          label="Rede oficial"
          value={customer.hasServiceInNetwork ? 'Sim' : 'Nao'}
          helper="Conta no VIN Share"
          tone="green"
        />
        <MetricCard
          label="Evasao"
          value={`${customer.churnProbability}%`}
          helper="Probabilidade estimada"
          tone="red"
        />
        <MetricCard
          label="Sem servico"
          value={`${customer.lastServiceDays}d`}
          helper="Dias sem OS na rede"
          tone="yellow"
        />
        <MetricCard
          label="Km atual"
          value={`${customer.mileageKm}`}
          helper="Base do veiculo"
          tone="blue"
        />
        <MetricCard
          label="Recalls"
          value={String(customer.recallCount)}
          helper="NHTSA por modelo/ano"
          tone={customer.criticalRecallCount > 0 ? 'red' : 'yellow'}
        />
      </View>

      <OneCard>
        <Text style={styles.panelTitle}>Diagnostico VIN Share</Text>
        <Text style={styles.panelText}>{customer.insight}</Text>
        {customer.latestRecall ? (
          <>
            <Text style={styles.actionTitle}>Recall mais recente</Text>
            <Text style={styles.panelText}>
              {customer.latestRecall.component} | Campanha{' '}
              {customer.latestRecall.campaignNumber}
            </Text>
          </>
        ) : null}
        <Text style={styles.actionTitle}>Lead sugerido</Text>
        <Text style={styles.panelText}>
          {customer.leadType.replaceAll('_', ' ')} | Status {customer.leadStatus}
        </Text>
        <Text style={styles.actionTitle}>Acao recomendada</Text>
        <Text style={styles.panelText}>{customer.recommendedAction}</Text>
      </OneCard>

      <OneCard>
        <Text style={styles.panelTitle}>Cliente, veiculo e concessionaria</Text>
        <InfoRow label="Email" value={customer.email} />
        <InfoRow label="Telefone" value={customer.phone} />
        <InfoRow label="Documento" value={customer.document} />
        <InfoRow label="Cidade" value={`${customer.city}/${customer.state}`} />
        <InfoRow label="VIN" value={customer.vin} />
        <InfoRow label="Concessionaria" value={customer.dealership} />
        <InfoRow label="Data de compra" value={customer.purchaseDate} />
        <InfoRow label="Garantia ativa" value={customer.warrantyActive ? 'Sim' : 'Nao'} />
      </OneCard>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Ordens de servico</Text>
        {ordersQuery.isFetching ? <Text style={styles.muted}>Atualizando...</Text> : null}
      </View>

      {ordersQuery.isLoading ? <Loading message="Carregando ordens..." /> : null}

      {ordersQuery.error ? (
        <ErrorMessage
          message="Nao foi possivel carregar as ordens de servico."
          onRetry={() => {
            void ordersQuery.refetch();
          }}
        />
      ) : null}

      {ordersQuery.data && ordersQuery.data.length === 0 ? (
        <EmptyState
          title="Sem ordens recentes"
          description="A NHTSA nao retornou recalls para este veiculo; exibimos apenas revisao preventiva."
        />
      ) : null}

      <View style={styles.list}>
        {ordersQuery.data?.map((order) => (
          <ServiceOrderCard key={order.id} order={order} />
        ))}
      </View>
    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  eyebrow: {
    color: '#0B5CAD',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    color: '#0F172A',
    fontSize: 27,
    fontWeight: '900',
  },
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  panelTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '900',
  },
  panelText: {
    color: '#334155',
    fontSize: 14,
    lineHeight: 21,
  },
  actionTitle: {
    color: '#0B5CAD',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  infoRow: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 10,
    gap: 4,
  },
  infoLabel: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  infoValue: {
    color: '#172033',
    fontSize: 15,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#0F172A',
    fontSize: 21,
    fontWeight: '900',
  },
  muted: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '700',
  },
  list: {
    gap: 12,
  },
});
