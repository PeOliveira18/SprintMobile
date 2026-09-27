import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { EmptyState } from '@/components/EmptyState';
import { ErrorMessage } from '@/components/ErrorMessage';
import { FordOneHeader } from '@/components/FordOneHeader';
import { Loading } from '@/components/Loading';
import { OneCard } from '@/components/OneCard';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { IMAGES } from '@/constants/images';
import { useCustomers } from '@/hooks/useCustomers';
import { colors, radius, spacing, typography } from '@/theme';
import { Customer } from '@/types/customer';

type DealershipRank = {
  name: string;
  city: string;
  state: string;
  score: number;
  reviews: number;
  vinShare: number;
  revenue: number;
  highlights: string[];
  customerId: number;
};

const ALL_STATES = 'Todos';

export function DealershipsScreen() {
  const { data: customers = [], isLoading, error, refetch, isRefetching } = useCustomers();
  const [stateFilter, setStateFilter] = useState(ALL_STATES);

  const ranking = useMemo(() => buildDealershipRanking(customers), [customers]);
  const states = useMemo(
    () => [ALL_STATES, ...Array.from(new Set(ranking.map((item) => item.state))).sort()],
    [ranking],
  );
  const filtered =
    stateFilter === ALL_STATES ? ranking : ranking.filter((item) => item.state === stateFilter);
  const featured = filtered[0];

  if (isLoading) {
    return <Loading fullScreen message="Montando ranking da rede..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        fullScreen
        message="Não foi possível carregar o ranking de concessionárias."
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
        title="Ranking de concessionárias"
        subtitle="Unidades com melhor desempenho em experiência, VIN Share e retenção."
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
        accessibilityRole="tablist"
      >
        {states.map((state) => {
          const active = state === stateFilter;
          return (
            <Pressable
              key={state}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              onPress={() => setStateFilter(state)}
              style={[styles.filterPill, active && styles.filterPillActive]}
            >
              <Text style={[styles.filterText, active && styles.filterTextActive]}>{state}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {featured ? (
        <OneCard>
          <View style={styles.featuredImageWrap}>
            <Image source={IMAGES.brand} style={styles.featuredImage} resizeMode="cover" />
            <View style={styles.medal}>
              <Ionicons name="trophy" size={18} color={colors.textInverse} />
            </View>
          </View>
          <View style={styles.featuredHeader}>
            <View style={styles.flexText}>
              <Text style={typography.title}>{featured.name}</Text>
              <Text style={styles.location}>
                {featured.city} - {featured.state}
              </Text>
            </View>
            <Rating score={featured.score} large />
          </View>
          <Text style={typography.body}>
            Referência em atendimento e qualidade, com alto aproveitamento dos leads gerados pela IA
            Ford.
          </Text>
          <View style={styles.featureList}>
            {featured.highlights.map((item) => (
              <FeatureItem key={item} label={item} />
            ))}
          </View>
          <ActionButton
            label="Agendar serviço nesta unidade"
            icon="calendar-outline"
            onPress={() =>
              router.push({
                pathname: '/campanha',
                params: {
                  customerId: String(featured.customerId),
                  title: `Agendamento na ${featured.name}`,
                },
              })
            }
          />
        </OneCard>
      ) : null}

      <SectionHeader title="Ranking geral" description={`${filtered.length} unidade(s) avaliada(s)`} />

      {filtered.length === 0 ? (
        <EmptyState
          title="Nenhuma unidade encontrada"
          description="Não há concessionárias com clientes para o filtro selecionado."
        />
      ) : (
        <View style={styles.list}>
          {filtered.map((dealership, index) => (
            <DealershipRow key={dealership.name} dealership={dealership} position={index + 1} />
          ))}
        </View>
      )}
    </Screen>
  );
}

function Rating({ score, large = false }: { score: number; large?: boolean }) {
  return (
    <View style={styles.rating} accessibilityLabel={`Nota ${score.toFixed(1)} de 5`}>
      <Text style={large ? styles.ratingLarge : styles.ratingText}>{score.toFixed(1)}</Text>
      <Ionicons name="star" size={large ? 18 : 16} color={colors.gold} />
    </View>
  );
}

function FeatureItem({ label }: { label: string }) {
  return (
    <View style={styles.featureItem}>
      <Ionicons name="checkmark-circle-outline" size={17} color={colors.success} />
      <Text style={styles.featureText}>{label}</Text>
    </View>
  );
}

function DealershipRow({ dealership, position }: { dealership: DealershipRank; position: number }) {
  const isFirst = position === 1;

  return (
    <OneCard variant={isFirst ? 'highlight' : 'default'} style={styles.rowCard}>
      <View style={[styles.position, isFirst && styles.positionFirst]}>
        <Text style={[styles.positionText, isFirst && styles.positionTextFirst]}>{position}</Text>
      </View>
      <View style={styles.rowContent}>
        <View style={styles.rowTop}>
          <View style={styles.flexText}>
            <Text style={typography.cardTitle}>{dealership.name}</Text>
            <Text style={styles.location}>
              {dealership.city} - {dealership.state}
            </Text>
          </View>
          <Rating score={dealership.score} />
        </View>
        <View style={styles.rowStats}>
          <Text style={styles.statText}>VIN Share {dealership.vinShare}%</Text>
          <Text style={styles.statText}>R$ {(dealership.revenue / 1000).toFixed(1).replace('.', ',')} mil</Text>
          <Text style={styles.statText}>{dealership.reviews} avaliações</Text>
        </View>
        <View style={styles.featureList}>
          {dealership.highlights.slice(0, 2).map((item) => (
            <FeatureItem key={item} label={item} />
          ))}
        </View>
      </View>
    </OneCard>
  );
}

function buildDealershipRanking(customers: Customer[]): DealershipRank[] {
  const groups = customers.reduce<Record<string, Customer[]>>((acc, customer) => {
    acc[customer.dealership] = acc[customer.dealership] ?? [];
    acc[customer.dealership].push(customer);
    return acc;
  }, {});

  const ranking = Object.entries(groups).map(([name, group], index) => {
    const revenue = group.reduce((total, customer) => total + customer.completedServiceRevenue, 0);
    const inNetwork = group.filter((customer) => customer.hasServiceInNetwork).length;
    const vinShare = Math.round((inNetwork / group.length) * 100);
    const score = Math.min(4.9, 4.2 + vinShare / 180 + revenue / 12000);

    return {
      name,
      city: group[0].city,
      state: group[0].state,
      score,
      reviews: 270 + index * 73 + group.length * 31,
      vinShare,
      revenue,
      highlights: getHighlights(vinShare, revenue),
      customerId: group[0].id,
    };
  });

  return ranking.sort((a, b) => b.score - a.score);
}

function getHighlights(vinShare: number, revenue: number) {
  if (vinShare >= 80) {
    return ['Alta fidelização na rede', 'Agilidade no atendimento', 'Histórico completo no DMS'];
  }

  if (revenue > 0) {
    return ['Boas oportunidades de retenção', 'Equipe técnica certificada', 'Carteira em recuperação'];
  }

  return ['Lead prioritário para pós-venda', 'Contato consultivo recomendado', 'Potencial de receita futura'];
}

const styles = StyleSheet.create({
  filters: {
    gap: spacing.sm,
  },
  filterPill: {
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: spacing.sm,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '800',
  },
  filterTextActive: {
    color: colors.textInverse,
  },
  featuredImageWrap: {
    height: 150,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.navy,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  medal: {
    position: 'absolute',
    left: spacing.md,
    top: spacing.md,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  flexText: {
    flex: 1,
    minWidth: 0,
  },
  location: {
    ...typography.caption,
    fontSize: 13,
    marginTop: 2,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '900',
  },
  ratingLarge: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  featureList: {
    gap: spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureText: {
    ...typography.body,
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  list: {
    gap: spacing.md,
  },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  position: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surfaceSunken,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  positionFirst: {
    backgroundColor: colors.gold,
  },
  positionText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '900',
  },
  positionTextFirst: {
    color: colors.textInverse,
  },
  rowContent: {
    flex: 1,
    minWidth: 0,
    gap: 10,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  rowStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statText: {
    color: colors.primary,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    overflow: 'hidden',
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    fontSize: 12,
    fontWeight: '800',
  },
});
