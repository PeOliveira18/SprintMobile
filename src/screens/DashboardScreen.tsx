import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CustomerCard } from '@/components/CustomerCard';
import { EmptyState } from '@/components/EmptyState';
import { ErrorMessage } from '@/components/ErrorMessage';
import { FordOneHeader } from '@/components/FordOneHeader';
import { Loading } from '@/components/Loading';
import { MetricCard } from '@/components/MetricCard';
import { OneCard } from '@/components/OneCard';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { CustomerVehicleBanner } from '@/components/VehicleBanner';
import { useAccountSession } from '@/hooks/useAccountSession';
import { useCustomers } from '@/hooks/useCustomers';
import { colors, radius, spacing, typography } from '@/theme';
import { Customer } from '@/types/customer';
import { firstName, formatCurrency } from '@/utils/format';
import { leadPriorityLabel } from '@/utils/labels';

export function DashboardScreen() {
  const { data: customers = [], isLoading, isRefetching, error, refetch } = useCustomers();
  const { profile } = useAccountSession();

  const metrics = useMemo(() => buildMetrics(customers), [customers]);
  const rankedCustomers = useMemo(
    () => customers.slice().sort((a, b) => b.churnProbability - a.churnProbability),
    [customers],
  );
  const featuredCustomer =
    customers.find((customer) => customer.vehicle.includes('Territory')) ?? customers[0];
  const topLead = rankedCustomers[0];
  const name = firstName(profile?.name);

  if (isLoading) {
    return <Loading fullScreen message="Carregando VIN Share..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        fullScreen
        message="Não foi possível carregar os dados da rede."
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <Screen
      refreshing={isRefetching}
      onRefresh={() => {
        void refetch();
      }}
    >
      <FordOneHeader
        title={name ? `Olá, ${name}!` : 'Olá!'}
        subtitle="Confira os indicadores e recomendações para melhorar o VIN Share da Rede Ford."
      />

      {featuredCustomer ? <CustomerVehicleBanner customer={featuredCustomer} /> : null}

      <View style={styles.metrics}>
        <MetricCard
          label="VIN Share"
          value={`${metrics.vinShare}%`}
          helper="Veículos com serviço na rede"
          tone="blue"
          icon="analytics-outline"
        />
        <MetricCard
          label="Veículos"
          value={String(metrics.total)}
          helper={`${metrics.inNetwork} vinculados a ordens`}
          tone="green"
          icon="car-sport-outline"
        />
        <MetricCard
          label="Leads abertos"
          value={String(metrics.openLeads)}
          helper="Retenção e revisão atrasada"
          tone="red"
          icon="flag-outline"
        />
        <MetricCard
          label="Receita"
          value={metrics.revenue}
          helper="Serviços concluídos"
          tone="yellow"
          icon="cash-outline"
        />
      </View>

      {topLead ? (
        <OneCard variant="highlight">
          <View style={styles.recommendationHeader}>
            <View style={styles.recommendationIcon}>
              <Ionicons name="sparkles-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.recommendationTitleGroup}>
              <Text style={typography.cardTitle}>Recomendação da IA Ford</Text>
              <Text style={styles.cardSubtitle}>Lead com maior impacto potencial no VIN Share.</Text>
            </View>
          </View>
          <View style={styles.recommendationBody}>
            <Text style={typography.cardTitle}>{topLead.name}</Text>
            <Text style={typography.body}>
              {topLead.vehicle} está há {topLead.lastServiceDays} dias sem serviço na rede.
              Prioridade {leadPriorityLabel(topLead.leadPriority).toLowerCase()} para contato.
            </Text>
          </View>
          <Pressable
            accessibilityRole="link"
            onPress={() => router.push(`/clientes/${topLead.id}`)}
            style={({ pressed }) => [styles.linkRow, pressed && styles.pressed]}
          >
            <Text style={typography.link}>Ver plano do VIN</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.primary} />
          </Pressable>
        </OneCard>
      ) : null}

      <SectionHeader
        title="Leads de retenção"
        description="Toque em um lead para ver VIN, concessionária, ordens e ação recomendada."
      />

      {rankedCustomers.length === 0 ? (
        <EmptyState
          title="Nenhum cliente encontrado"
          description="Não há veículos para calcular o VIN Share."
        />
      ) : (
        <View style={styles.list}>
          {rankedCustomers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onPress={() => router.push(`/clientes/${customer.id}`)}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}

function buildMetrics(customers: Customer[]) {
  if (customers.length === 0) {
    return { total: 0, inNetwork: 0, vinShare: 0, openLeads: 0, revenue: formatCurrency(0) };
  }

  const inNetwork = customers.filter((customer) => customer.hasServiceInNetwork).length;
  const openLeads = customers.filter((customer) => customer.leadStatus === 'ABERTO').length;
  const revenue = customers.reduce((total, customer) => total + customer.completedServiceRevenue, 0);

  return {
    total: customers.length,
    inNetwork,
    vinShare: Math.round((inNetwork / customers.length) * 100),
    openLeads,
    revenue: formatCurrency(revenue).replace(/,00$/, ''),
  };
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
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  recommendationIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendationTitleGroup: {
    flex: 1,
    gap: 3,
  },
  cardSubtitle: {
    ...typography.caption,
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  recommendationBody: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 5,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  pressed: {
    opacity: 0.7,
  },
});
