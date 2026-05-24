import { router } from 'expo-router';
import { Image, ImageSourcePropType, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { FordOneHeader } from '@/components/FordOneHeader';
import { OneCard } from '@/components/OneCard';
import { useAccountSession } from '@/hooks/useAccountSession';
import { useCustomers } from '@/hooks/useCustomers';
import { AccountOnboarding } from '@/types/account';

const launches = [
  {
    name: 'Novo Ford Territory 2025',
    price: 'R$ 189.990',
    image: require('../../assets/ford-one/image27.jpg') as ImageSourcePropType,
    features: ['Motor EcoBoost 1.5L Turbo', 'Painel digital de 12,3"', 'Ford Co-Pilot360 Assist'],
  },
  {
    name: 'Nova Ford Maverick 2025',
    price: 'R$ 164.990',
    image: require('../../assets/ford-one/image3.jpg') as ImageSourcePropType,
    features: ['Motor 2.0L EcoBoost', 'Cacamba versatil', 'FordPass Connect'],
  },
  {
    name: 'Novo Ford Edge 2025',
    price: 'R$ 229.990',
    image: require('../../assets/ford-one/image9.png') as ImageSourcePropType,
    features: ['Motor V6 EcoBoost', 'Tracao AWD inteligente', 'Teto solar panoramico'],
  },
];

export function LaunchesScreen() {
  const { data: customers = [] } = useCustomers();
  const { profile, loading: profileLoading } = useAccountSession();
  const customer = customers[0];
  const onboarding = profile?.onboarding;
  const recommendedLaunches = getRecommendedLaunches(onboarding);
  const featuredModel = recommendedLaunches[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <FordOneHeader
        title="Novos lancamentos que combinam com voce"
        subtitle={
          onboarding
            ? `Recomendacoes para o perfil de ${profile.name}.`
            : 'Entre ou cadastre seu perfil para receber recomendacoes personalizadas.'
        }
      />

      {onboarding ? (
        <View style={styles.tags}>
          <Text style={styles.tag}>Perfil: {onboarding.objective}</Text>
          <Text style={styles.tag}>Uso: {onboarding.frequency}</Text>
          <Text style={styles.tag}>Km/mes: {onboarding.monthlyDistance}</Text>
          <Text style={styles.tag}>Preferencia: {onboarding.preference}</Text>
        </View>
      ) : (
        <OneCard style={styles.emptyProfile}>
          <Text style={styles.emptyTitle}>
            {profileLoading ? 'Carregando perfil...' : 'Perfil nao encontrado'}
          </Text>
          <Text style={styles.emptyText}>
            Cadastre ou entre na sua conta para usar perfil de uso, frequencia e
            quilometragem mensal nas recomendacoes.
          </Text>
          <ActionButton label="Abrir minha conta" onPress={() => router.push('/conta')} />
        </OneCard>
      )}

      {recommendedLaunches.map((item) => (
        <OneCard key={item.name}>
          <Image source={item.image} style={styles.carImage} />
          <Text style={styles.badge}>Novo</Text>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>A partir de {item.price}</Text>
          <View style={styles.features}>
            {item.features.map((feature) => (
              <Text key={feature} style={styles.feature}>✓ {feature}</Text>
            ))}
          </View>
          <Text style={styles.link}>Ver detalhes do modelo →</Text>
        </OneCard>
      ))}

      <OneCard style={styles.compare}>
        <Text style={styles.compareTitle}>Compare com modelos da mesma categoria</Text>
        <Text style={styles.compareText}>
          {onboarding
            ? `${featuredModel.name} foi priorizado para seu perfil ${onboarding.objective.toLowerCase()}, com foco em ${onboarding.preference.toLowerCase()} e ${onboarding.monthlyDistance} por mes.`
            : 'As recomendacoes serao personalizadas assim que houver uma conta com perfil de uso cadastrado.'}
        </Text>
        <ActionButton
          label={customer ? 'Agendar atendimento' : 'Carregando...'}
          disabled={!customer}
          onPress={() => {
            if (customer) {
              router.push(`/campanha?customerId=${customer.id}`);
            }
          }}
        />
      </OneCard>
    </ScrollView>
  );
}

function getRecommendedLaunches(onboarding?: AccountOnboarding) {
  if (!onboarding) {
    return launches;
  }

  const priority = getPriorityModel(onboarding);

  return launches
    .slice()
    .sort((a, b) => Number(b.name.includes(priority)) - Number(a.name.includes(priority)));
}

function getPriorityModel(onboarding: AccountOnboarding) {
  const text = `${onboarding.objective} ${onboarding.preference} ${onboarding.monthlyDistance}`.toLowerCase();

  if (text.includes('trabalho') || text.includes('performance') || text.includes('3.000')) {
    return 'Maverick';
  }

  if (text.includes('familia') || text.includes('conforto') || text.includes('seguranca')) {
    return 'Territory';
  }

  if (text.includes('tecnologia') || text.includes('esportivo')) {
    return 'Edge';
  }

  return 'Territory';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F8FC' },
  content: { padding: 16, paddingBottom: 36, gap: 16 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { color: '#43516A', backgroundColor: '#FFFFFF', borderColor: '#DDE6F3', borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 7, fontWeight: '800' },
  emptyProfile: { gap: 10, backgroundColor: '#F8FBFF' },
  emptyTitle: { color: '#071331', fontSize: 17, fontWeight: '900' },
  emptyText: { color: '#43516A', fontSize: 14, lineHeight: 20 },
  carImage: { width: '100%', height: 158, borderRadius: 12, backgroundColor: '#EEF3F8' },
  badge: { alignSelf: 'flex-start', marginTop: 12, color: '#FFFFFF', backgroundColor: '#005BEA', borderRadius: 7, overflow: 'hidden', paddingHorizontal: 8, paddingVertical: 4, fontWeight: '900' },
  name: { color: '#071331', fontSize: 21, fontWeight: '900', marginTop: 10 },
  price: { color: '#071331', fontSize: 18, fontWeight: '900', marginTop: 6 },
  features: { gap: 6, marginTop: 12 },
  feature: { color: '#0A7B4B', fontSize: 14, fontWeight: '800' },
  link: { color: '#005BEA', fontSize: 14, fontWeight: '900', marginTop: 14 },
  compare: { backgroundColor: '#F3F8FF', gap: 8 },
  compareTitle: { color: '#071331', fontSize: 17, fontWeight: '900' },
  compareText: { color: '#43516A', fontSize: 14, lineHeight: 20 },
});
