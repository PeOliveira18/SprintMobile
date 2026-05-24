import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { FordOneHeader } from '@/components/FordOneHeader';
import { MetricCard } from '@/components/MetricCard';
import { OneCard } from '@/components/OneCard';
import { VehicleBanner } from '@/components/VehicleBanner';
import { useCustomers } from '@/hooks/useCustomers';

const benefits = [
  'Pecas originais Ford',
  'Tecnicos especializados',
  'Equipamentos de diagnostico',
  'Atualizacoes oficiais',
  'Historico completo do veiculo',
  'Preservacao da garantia',
];

const risks = [
  'Perda da garantia de fabrica',
  'Pecas de qualidade inferior',
  'Diagnosticos imprecisos',
  'Custos maiores no futuro',
];

export function ServicesOneScreen() {
  const { data: customers = [] } = useCustomers();
  const customer = customers[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <FordOneHeader
        title="Sua garantia esta chegando ao fim"
        subtitle="Veja por que continuar realizando revisoes na Rede Ford e a melhor escolha para o seu veiculo."
      />

      {customer ? <VehicleBanner customer={customer} /> : null}

      <View style={styles.metrics}>
        <MetricCard label="Garantia" value="45 dias" helper="Ou 1.800 km restantes" icon="shield-checkmark-outline" />
        <MetricCard label="Revisao" value="60.000 km" helper="Recomendada pela IA" tone="yellow" icon="construct-outline" />
      </View>

      <OneCard>
        <Text style={styles.sectionTitle}>Rede Ford vs. Fora da Rede</Text>
        <View style={styles.compareGrid}>
          <View style={styles.compareColumn}>
            <Text style={styles.compareTitle}>Rede Ford</Text>
            {benefits.map((item) => (
              <FeatureRow key={item} label={item} positive />
            ))}
          </View>
          <View style={styles.compareColumn}>
            <Text style={styles.compareTitle}>Fora da Rede</Text>
            {risks.map((item) => (
              <FeatureRow key={item} label={item} />
            ))}
          </View>
        </View>
      </OneCard>

      <OneCard style={styles.recommendation}>
        <Text style={styles.sectionTitle}>Recomendacao da IA Ford</Text>
        <Text style={styles.description}>
          Com base no historico do veiculo e no seu perfil de uso, recomendamos
          realizar a revisao dos 60.000 km na Rede Ford.
        </Text>
        <View style={styles.priceRow}>
          <View>
            <Text style={styles.priceLabel}>A partir de</Text>
            <Text style={styles.price}>R$ 1.280,00</Text>
          </View>
          <ActionButton
            label={customer ? 'Agendar agora' : 'Carregando...'}
            disabled={!customer}
            onPress={() => {
              if (customer) {
                router.push(`/campanha?customerId=${customer.id}`);
              }
            }}
            style={styles.cta}
          />
        </View>
      </OneCard>
    </ScrollView>
  );
}

function FeatureRow({ label, positive = false }: { label: string; positive?: boolean }) {
  return (
    <View style={styles.featureRow}>
      <Ionicons
        name={positive ? 'checkmark-circle-outline' : 'close-circle-outline'}
        size={17}
        color={positive ? '#09A66D' : '#D92D20'}
      />
      <Text style={styles.featureText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F8FC' },
  content: { padding: 16, paddingBottom: 36, gap: 16 },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  sectionTitle: { color: '#071331', fontSize: 18, fontWeight: '900', marginBottom: 12 },
  compareGrid: { gap: 12 },
  compareColumn: { borderRadius: 12, borderWidth: 1, borderColor: '#DDE6F3', padding: 14, gap: 10 },
  compareTitle: { color: '#005BEA', fontSize: 15, fontWeight: '900' },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: { color: '#43516A', fontSize: 14, flex: 1 },
  recommendation: { backgroundColor: '#F3F8FF' },
  description: { color: '#43516A', fontSize: 14, lineHeight: 20 },
  priceRow: { marginTop: 14, gap: 12 },
  priceLabel: { color: '#526174', fontSize: 12, fontWeight: '700' },
  price: { color: '#071331', fontSize: 24, fontWeight: '900' },
  cta: { marginTop: 4 },
});
