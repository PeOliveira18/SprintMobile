import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { FordOneHeader } from '@/components/FordOneHeader';
import { OneCard } from '@/components/OneCard';
import { TERRITORY_IMAGE } from '@/components/VehicleBanner';
import { useCustomers } from '@/hooks/useCustomers';
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
};

const fallbackDealerships: DealershipRank[] = [
  {
    name: 'Ford Nacao',
    city: 'Sao Paulo',
    state: 'SP',
    score: 4.9,
    reviews: 512,
    vinShare: 88,
    revenue: 286000,
    highlights: ['Melhor avaliacao de clientes', 'Alta taxa de resolucao', 'Sala de espera Premium'],
  },
  {
    name: 'Ford Ipiranga',
    city: 'Sao Paulo',
    state: 'SP',
    score: 4.7,
    reviews: 423,
    vinShare: 81,
    revenue: 214000,
    highlights: ['Otimo pos-venda', 'Equipe tecnica certificada', 'Ambiente confortavel'],
  },
  {
    name: 'Ford Vila Guilherme',
    city: 'Sao Paulo',
    state: 'SP',
    score: 4.6,
    reviews: 389,
    vinShare: 76,
    revenue: 198000,
    highlights: ['Atendimento personalizado', 'Transparencia nos servicos', 'Instalacoes modernas'],
  },
];

export function DealershipsScreen() {
  const { data: customers = [] } = useCustomers();
  const dealerships = buildDealershipRanking(customers);
  const featured = dealerships[0] ?? fallbackDealerships[0];
  const featuredCustomer = customers.find((customer) => customer.dealership === featured.name) ??
    customers[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <FordOneHeader
        title="Ranking de Concessionarias"
        subtitle="Confira as unidades com melhor desempenho em experiencia, VIN Share e retencao."
      />

      <View style={styles.filters}>
        <FilterPill label="Regiao" value="Sudeste" />
        <FilterPill label="Estado" value="Sao Paulo" />
        <FilterPill label="Periodo" value="Ultimos 3 meses" />
      </View>

      <OneCard style={styles.featured}>
        <View style={styles.featuredImageWrap}>
          <Image source={TERRITORY_IMAGE} style={styles.featuredImage} />
          <View style={styles.medal}>
            <Text style={styles.medalText}>1</Text>
          </View>
        </View>
        <View style={styles.featuredHeader}>
          <View>
            <Text style={styles.featuredName}>{featured.name}</Text>
            <Text style={styles.featuredLocation}>
              {featured.city} - {featured.state}
            </Text>
          </View>
          <View style={styles.ratingBox}>
            <Text style={styles.rating}>{featured.score.toFixed(1)}</Text>
            <Ionicons name="star" size={18} color="#005BEA" />
          </View>
        </View>
        <Text style={styles.featuredCopy}>
          Referencia em atendimento e qualidade, com alto aproveitamento dos leads
          gerados pela IA Ford.
        </Text>
        <View style={styles.featureList}>
          {featured.highlights.map((item) => (
            <FeatureItem key={item} label={item} />
          ))}
        </View>
        <ActionButton
          label={featuredCustomer ? 'Agendar servico nesta unidade' : 'Carregando...'}
          disabled={!featuredCustomer}
          onPress={() => {
            if (featuredCustomer) {
              router.push(`/campanha?customerId=${featuredCustomer.id}`);
            }
          }}
        />
      </OneCard>

      <Text style={styles.sectionTitle}>Ranking geral</Text>
      <View style={styles.list}>
        {dealerships.map((dealership, index) => (
          <DealershipRow key={dealership.name} dealership={dealership} position={index + 1} />
        ))}
      </View>
    </ScrollView>
  );
}

function FilterPill({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.filterPill}>
      <Text style={styles.filterLabel}>{label}</Text>
      <Text style={styles.filterValue}>{value}</Text>
    </View>
  );
}

function FeatureItem({ label }: { label: string }) {
  return (
    <View style={styles.featureItem}>
      <Ionicons name="checkmark-circle-outline" size={17} color="#09A66D" />
      <Text style={styles.featureText}>{label}</Text>
    </View>
  );
}

function DealershipRow({ dealership, position }: { dealership: DealershipRank; position: number }) {
  return (
    <OneCard style={[styles.rowCard, position === 1 && styles.firstRow]}>
      <View style={styles.position}>
        <Text style={[styles.positionText, position === 1 && styles.positionGold]}>{position}</Text>
      </View>
      <View style={styles.rowContent}>
        <View style={styles.rowTop}>
          <View style={styles.rowNameGroup}>
            <Text style={styles.rowName}>{dealership.name}</Text>
            <Text style={styles.rowLocation}>
              {dealership.city} - {dealership.state}
            </Text>
          </View>
          <View style={styles.rowRating}>
            <Text style={styles.rowRatingText}>{dealership.score.toFixed(1)}</Text>
            <Ionicons name="star" size={16} color="#005BEA" />
          </View>
        </View>
        <View style={styles.rowStats}>
          <Text style={styles.statText}>VIN Share {dealership.vinShare}%</Text>
          <Text style={styles.statText}>
            R$ {Math.round(dealership.revenue / 1000)} mil
          </Text>
          <Text style={styles.statText}>{dealership.reviews} avaliacoes</Text>
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

function buildDealershipRanking(customers: Customer[]) {
  if (customers.length === 0) {
    return fallbackDealerships;
  }

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
    };
  });

  return ranking.sort((a, b) => b.score - a.score);
}

function getHighlights(vinShare: number, revenue: number) {
  if (vinShare >= 80) {
    return ['Alta fidelizacao na rede', 'Agilidade no atendimento', 'Historico completo no DMS'];
  }

  if (revenue > 0) {
    return ['Boas oportunidades de retencao', 'Equipe tecnica certificada', 'Carteira em recuperacao'];
  }

  return ['Lead prioritario para pos-venda', 'Contato consultivo recomendado', 'Potencial de receita futura'];
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F8FC' },
  content: { padding: 16, paddingBottom: 36, gap: 16 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  filterPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDE6F3',
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 120,
  },
  filterLabel: { color: '#728199', fontSize: 11, fontWeight: '800' },
  filterValue: { color: '#071331', fontSize: 14, fontWeight: '900', marginTop: 2 },
  featured: { gap: 14 },
  featuredImageWrap: {
    height: 156,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#EEF3F8',
  },
  featuredImage: { width: '100%', height: '100%' },
  medal: {
    position: 'absolute',
    left: 12,
    top: 12,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFC233',
    alignItems: 'center',
    justifyContent: 'center',
  },
  medalText: { color: '#FFFFFF', fontSize: 18, fontWeight: '900' },
  featuredHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  featuredName: { color: '#071331', fontSize: 21, fontWeight: '900' },
  featuredLocation: { color: '#526174', fontSize: 13, marginTop: 2 },
  ratingBox: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rating: { color: '#071331', fontSize: 22, fontWeight: '900' },
  featuredCopy: { color: '#43516A', fontSize: 14, lineHeight: 20 },
  featureList: { gap: 8 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: { color: '#43516A', fontSize: 13, flex: 1, fontWeight: '700' },
  sectionTitle: { color: '#071331', fontSize: 19, fontWeight: '900' },
  list: { gap: 12 },
  rowCard: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  firstRow: { borderColor: '#B9D2FF', backgroundColor: '#F8FBFF' },
  position: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EEF3F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  positionText: { color: '#526174', fontSize: 14, fontWeight: '900' },
  positionGold: { color: '#B7791F' },
  rowContent: { flex: 1, minWidth: 0, gap: 10 },
  rowTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 },
  rowNameGroup: { flex: 1, minWidth: 0 },
  rowName: { color: '#071331', fontSize: 16, fontWeight: '900' },
  rowLocation: { color: '#526174', fontSize: 13, marginTop: 2 },
  rowRating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  rowRatingText: { color: '#071331', fontSize: 17, fontWeight: '900' },
  rowStats: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statText: {
    color: '#005BEA',
    backgroundColor: '#EAF2FF',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 5,
    fontSize: 12,
    fontWeight: '800',
  },
});
