import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { CustomerCard } from '@/components/CustomerCard';
import { EmptyState } from '@/components/EmptyState';
import { ErrorMessage } from '@/components/ErrorMessage';
import { FordOneHeader } from '@/components/FordOneHeader';
import { Loading } from '@/components/Loading';
import { MetricCard } from '@/components/MetricCard';
import { OneCard } from '@/components/OneCard';
import { VehicleBanner } from '@/components/VehicleBanner';
import { useCustomers } from '@/hooks/useCustomers';
import { Customer } from '@/types/customer';

export function DashboardScreen() {
  const { data: customers = [], isLoading, isRefetching, error, refetch } = useCustomers();

  const metrics = useMemo(() => buildMetrics(customers), [customers]);
  const featuredCustomer = customers.find((customer) => customer.vehicle.includes('Territory')) ??
    customers[0];
  const topLead = customers
    .slice()
    .sort((a, b) => b.churnProbability - a.churnProbability)[0];

  if (isLoading) {
    return <Loading message="Carregando VIN Share..." />;
  }

  if (error) {
    return (
      <View style={styles.feedback}>
        <ErrorMessage
          message="Nao foi possivel carregar os dados."
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
        title="Ola, Carlos!"
        subtitle="Confira os indicadores e recomendacoes para melhorar o VIN Share da rede Ford."
      />

      {featuredCustomer ? <VehicleBanner customer={featuredCustomer} /> : null}

      <View style={styles.metrics}>
        <MetricCard
          label="VIN Share"
          value={`${metrics.vinShare}%`}
          helper="Veiculos com servico na rede"
          tone="blue"
          icon="analytics-outline"
        />
        <MetricCard
          label="Veiculos"
          value={String(metrics.total)}
          helper={`${metrics.inNetwork} vinculados a ordens`}
          tone="green"
          icon="car-sport-outline"
        />
        <MetricCard
          label="Leads abertos"
          value={String(metrics.openLeads)}
          helper="Retencao e revisao atrasada"
          tone="red"
          icon="flag-outline"
        />
        <MetricCard
          label="Receita"
          value={`R$ ${metrics.revenue}`}
          helper="Servicos concluidos"
          tone="yellow"
          icon="cash-outline"
        />
      </View>

      {topLead ? (
        <OneCard>
          <View style={styles.recommendationHeader}>
            <View style={styles.recommendationIcon}>
              <Ionicons name="sparkles-outline" size={20} color="#005BEA" />
            </View>
            <View style={styles.recommendationTitleGroup}>
              <Text style={styles.cardTitle}>Recomendacao da IA Ford</Text>
              <Text style={styles.cardSubtitle}>
                Lead com maior impacto potencial no VIN Share.
              </Text>
            </View>
          </View>
          <View style={styles.recommendationBody}>
            <Text style={styles.recommendationName}>{topLead.name}</Text>
            <Text style={styles.recommendationText}>
              {topLead.vehicle} esta ha {topLead.lastServiceDays} dias sem servico
              recente. Prioridade {topLead.leadPriority.toLowerCase()} para contato.
            </Text>
          </View>
          <Text
            style={styles.link}
            onPress={() => router.push(`/clientes/${topLead.id}`)}
          >
            Ver plano do VIN →
          </Text>
        </OneCard>
      ) : null}

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Leads de retencao</Text>
          <Text style={styles.sectionDescription}>
            Toque em um lead para ver VIN, concessionaria, ordens e acao recomendada.
          </Text>
        </View>
      </View>

      {customers.length === 0 ? (
        <EmptyState
          title="Nenhum cliente encontrado"
          description="Nao ha veiculos para calcular o VIN Share."
        />
      ) : (
        <View style={styles.list}>
          {customers
            .slice()
            .sort((a, b) => b.churnProbability - a.churnProbability)
            .map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                onPress={() => router.push(`/clientes/${customer.id}`)}
              />
            ))}
        </View>
      )}
    </ScrollView>
  );
}

function buildMetrics(customers: Customer[]) {
  if (customers.length === 0) {
    return {
      total: 0,
      inNetwork: 0,
      vinShare: 0,
      openLeads: 0,
      revenue: '0',
    };
  }

  const inNetwork = customers.filter((customer) => customer.hasServiceInNetwork).length;
  const vinShare = Math.round((inNetwork / customers.length) * 100);
  const openLeads = customers.filter((customer) => customer.leadStatus === 'ABERTO').length;
  const revenue = customers.reduce(
    (total, customer) => total + customer.completedServiceRevenue,
    0,
  );

  return {
    total: customers.length,
    inNetwork,
    vinShare,
    openLeads,
    revenue: revenue.toLocaleString('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }),
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FC',
  },
  content: {
    padding: 16,
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: '#071331',
    fontSize: 21,
    fontWeight: '900',
  },
  sectionDescription: {
    color: '#526174',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  list: {
    gap: 12,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recommendationIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EAF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendationTitleGroup: {
    flex: 1,
    gap: 3,
  },
  cardTitle: {
    color: '#071331',
    fontSize: 16,
    fontWeight: '900',
  },
  cardSubtitle: {
    color: '#526174',
    fontSize: 13,
    lineHeight: 18,
  },
  recommendationBody: {
    marginTop: 14,
    backgroundColor: '#F7FAFF',
    borderRadius: 10,
    padding: 12,
    gap: 5,
  },
  recommendationName: {
    color: '#071331',
    fontSize: 16,
    fontWeight: '900',
  },
  recommendationText: {
    color: '#43516A',
    fontSize: 14,
    lineHeight: 20,
  },
  link: {
    color: '#005BEA',
    fontSize: 14,
    fontWeight: '900',
    marginTop: 14,
  },
});
