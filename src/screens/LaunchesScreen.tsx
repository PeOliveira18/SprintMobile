import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { FordOneHeader } from '@/components/FordOneHeader';
import { OneCard } from '@/components/OneCard';
import { Screen } from '@/components/Screen';
import { StatusBadge } from '@/components/StatusBadge';
import { getVehicleImage } from '@/constants/images';
import { useAccountSession } from '@/hooks/useAccountSession';
import { useCustomers } from '@/hooks/useCustomers';
import { colors, radius, spacing, typography } from '@/theme';
import { AccountOnboarding } from '@/types/account';
import { formatCurrency, normalizeText } from '@/utils/format';

type Launch = {
  model: 'Territory' | 'Maverick' | 'Edge';
  name: string;
  category: string;
  price: number;
  features: string[];
};

const launches: Launch[] = [
  {
    model: 'Territory',
    name: 'Novo Ford Territory 2025',
    category: 'SUV médio',
    price: 189990,
    features: ['Motor EcoBoost 1.5L Turbo', 'Painel digital de 12,3"', 'Ford Co-Pilot360 Assist'],
  },
  {
    model: 'Maverick',
    name: 'Nova Ford Maverick 2025',
    category: 'Picape',
    price: 164990,
    features: ['Motor 2.0L EcoBoost', 'Caçamba versátil', 'FordPass Connect'],
  },
  {
    model: 'Edge',
    name: 'Novo Ford Edge 2025',
    category: 'SUV premium',
    price: 229990,
    features: ['Motor V6 EcoBoost', 'Tração AWD inteligente', 'Teto solar panorâmico'],
  },
];

export function LaunchesScreen() {
  const { data: customers = [] } = useCustomers();
  const { profile, loading: profileLoading } = useAccountSession();
  const customer = customers[0];
  const onboarding = profile?.onboarding;
  const priority = onboarding ? getPriorityModel(onboarding) : null;
  const recommendedLaunches = sortByPriority(priority);

  function scheduleTestDrive(launch: Launch) {
    if (!customer) {
      return;
    }

    router.push({
      pathname: '/campanha',
      params: { customerId: String(customer.id), title: `Test drive ${launch.name}` },
    });
  }

  return (
    <Screen>
      <FordOneHeader
        title="Novos lançamentos que combinam com você"
        subtitle={
          profile
            ? `Recomendações para o perfil de ${profile.name}.`
            : 'Entre ou cadastre seu perfil para receber recomendações personalizadas.'
        }
      />

      {onboarding ? (
        <OneCard variant="highlight">
          <View style={styles.profileHeader}>
            <Text style={typography.cardTitle}>Seu perfil de uso</Text>
            <ActionButton
              label="Editar"
              icon="create-outline"
              variant="secondary"
              compact
              onPress={() => router.push('/perfil')}
            />
          </View>
          <View style={styles.tags}>
            <Tag label="Uso" value={onboarding.objective} />
            <Tag label="Frequência" value={onboarding.frequency} />
            <Tag label="Km/mês" value={onboarding.monthlyDistance} />
            <Tag label="Preferência" value={onboarding.preference} />
          </View>
        </OneCard>
      ) : (
        <OneCard variant="highlight">
          <Text style={typography.cardTitle}>
            {profileLoading ? 'Carregando perfil...' : 'Perfil não encontrado'}
          </Text>
          <Text style={typography.body}>
            Cadastre ou entre na sua conta para usar perfil de uso, frequência e quilometragem mensal
            nas recomendações.
          </Text>
          <ActionButton label="Abrir minha conta" onPress={() => router.push('/conta')} />
        </OneCard>
      )}

      {recommendedLaunches.map((launch) => (
        <OneCard key={launch.model}>
          <View>
            <Image
              source={getVehicleImage(launch.model)}
              style={styles.carImage}
              resizeMode="cover"
              accessibilityLabel={`Imagem ilustrativa do ${launch.name}`}
            />
            <Text style={styles.imageCaption}>Imagem ilustrativa</Text>
          </View>
          <View style={styles.badges}>
            <StatusBadge label="Novo" tone="blue" />
            <StatusBadge label={launch.category} tone="gray" />
            {launch.model === priority ? (
              <StatusBadge label="Recomendado" tone="green" />
            ) : null}
          </View>
          <View style={styles.titleGroup}>
            <Text style={styles.name}>{launch.name}</Text>
            <Text style={styles.price}>A partir de {formatCurrency(launch.price).replace(/,00$/, '')}</Text>
          </View>
          <View style={styles.features}>
            {launch.features.map((feature) => (
              <View key={feature} style={styles.featureRow}>
                <Ionicons name="checkmark-circle-outline" size={17} color={colors.success} />
                <Text style={styles.feature}>{feature}</Text>
              </View>
            ))}
          </View>
          <ActionButton
            label="Agendar test drive"
            icon="calendar-outline"
            variant="secondary"
            disabled={!customer}
            onPress={() => scheduleTestDrive(launch)}
          />
        </OneCard>
      ))}

      <OneCard variant="highlight">
        <Text style={typography.cardTitle}>Por que esta ordem?</Text>
        <Text style={typography.body}>
          {onboarding && priority
            ? `O ${launches.find((item) => item.model === priority)?.name} foi priorizado para o seu perfil ${onboarding.objective.toLowerCase()}, com foco em ${onboarding.preference.toLowerCase()} e ${onboarding.monthlyDistance} por mês.`
            : 'As recomendações serão personalizadas assim que houver uma conta com perfil de uso cadastrado.'}
        </Text>
      </OneCard>
    </Screen>
  );
}

function Tag({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagLabel}>{label}</Text>
      <Text style={styles.tagValue}>{value}</Text>
    </View>
  );
}

function sortByPriority(priority: Launch['model'] | null) {
  if (!priority) {
    return launches;
  }

  return launches
    .slice()
    .sort((a, b) => Number(b.model === priority) - Number(a.model === priority));
}

function getPriorityModel(onboarding: AccountOnboarding): Launch['model'] {
  const text = normalizeText(
    `${onboarding.objective} ${onboarding.preference} ${onboarding.monthlyDistance}`,
  );

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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagLabel: {
    ...typography.overline,
    fontSize: 10,
    lineHeight: 14,
  },
  tagValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  carImage: {
    width: '100%',
    height: 170,
    borderRadius: radius.md,
    backgroundColor: colors.navy,
  },
  imageCaption: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    color: colors.textInverse,
    backgroundColor: 'rgba(0, 27, 77, 0.6)',
    borderRadius: radius.sm,
    overflow: 'hidden',
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 10,
    fontWeight: '700',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  titleGroup: {
    gap: spacing.xs,
  },
  name: {
    ...typography.title,
  },
  price: {
    ...typography.cardTitle,
    color: colors.primary,
  },
  features: {
    gap: 6,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  feature: {
    ...typography.bodyStrong,
    flex: 1,
  },
});
