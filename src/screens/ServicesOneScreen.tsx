import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { ErrorMessage } from '@/components/ErrorMessage';
import { FordOneHeader } from '@/components/FordOneHeader';
import { Loading } from '@/components/Loading';
import { MetricCard } from '@/components/MetricCard';
import { OneCard } from '@/components/OneCard';
import { Screen } from '@/components/Screen';
import { CustomerVehicleBanner } from '@/components/VehicleBanner';
import { useCustomers } from '@/hooks/useCustomers';
import { colors, radius, spacing, typography } from '@/theme';
import { formatCurrency } from '@/utils/format';

const REVIEW_PRICE = 1280;

const benefits = [
  'Peças originais Ford',
  'Técnicos especializados',
  'Equipamentos de diagnóstico',
  'Atualizações oficiais',
  'Histórico completo do veículo',
  'Preservação da garantia',
];

const risks = [
  'Perda da garantia de fábrica',
  'Peças de qualidade inferior',
  'Diagnósticos imprecisos',
  'Custos maiores no futuro',
];

export function ServicesOneScreen() {
  const { data: customers = [], isLoading, error, refetch, isRefetching } = useCustomers();
  const customer = customers[0];

  if (isLoading) {
    return <Loading fullScreen message="Carregando serviços..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        fullScreen
        message="Não foi possível carregar os dados do veículo."
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
        title="Sua garantia está chegando ao fim"
        subtitle="Veja por que continuar realizando revisões na Rede Ford é a melhor escolha para o seu veículo."
      />

      {customer ? <CustomerVehicleBanner customer={customer} /> : null}

      <View style={styles.metrics}>
        <MetricCard
          label="Garantia"
          value="45 dias"
          helper="Ou 1.800 km restantes"
          icon="shield-checkmark-outline"
        />
        <MetricCard
          label="Revisão"
          value="60.000 km"
          helper="Recomendada pela IA"
          tone="yellow"
          icon="construct-outline"
        />
      </View>

      <OneCard>
        <Text style={typography.section}>Rede Ford vs. fora da rede</Text>
        <View style={styles.compareColumn}>
          <Text style={[styles.compareTitle, styles.positiveTitle]}>Na Rede Ford</Text>
          {benefits.map((item) => (
            <FeatureRow key={item} label={item} positive />
          ))}
        </View>
        <View style={styles.compareColumn}>
          <Text style={[styles.compareTitle, styles.negativeTitle]}>Fora da rede</Text>
          {risks.map((item) => (
            <FeatureRow key={item} label={item} />
          ))}
        </View>
      </OneCard>

      <OneCard variant="highlight">
        <Text style={typography.section}>Recomendação da IA Ford</Text>
        <Text style={typography.body}>
          Com base no histórico do veículo e no seu perfil de uso, recomendamos realizar a revisão
          dos 60.000 km na Rede Ford.
        </Text>
        <View>
          <Text style={typography.caption}>A partir de</Text>
          <Text style={styles.price}>{formatCurrency(REVIEW_PRICE)}</Text>
        </View>
        <ActionButton
          label="Agendar revisão"
          disabled={!customer}
          onPress={() => {
            if (customer) {
              router.push({
                pathname: '/campanha',
                params: { customerId: String(customer.id), title: 'Agendamento de revisão 60.000 km' },
              });
            }
          }}
        />
      </OneCard>
    </Screen>
  );
}

function FeatureRow({ label, positive = false }: { label: string; positive?: boolean }) {
  return (
    <View style={styles.featureRow}>
      <Ionicons
        name={positive ? 'checkmark-circle-outline' : 'close-circle-outline'}
        size={18}
        color={positive ? colors.success : colors.danger}
      />
      <Text style={styles.featureText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  compareColumn: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 10,
  },
  compareTitle: {
    fontSize: 15,
    fontWeight: '900',
  },
  positiveTitle: {
    color: colors.primary,
  },
  negativeTitle: {
    color: colors.danger,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureText: {
    ...typography.body,
    flex: 1,
  },
  price: {
    ...typography.metric,
  },
});
