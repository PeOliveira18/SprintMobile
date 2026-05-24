import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ReactNode, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { FordOneHeader } from '@/components/FordOneHeader';
import { OneCard } from '@/components/OneCard';

const steps = ['Veiculo', 'Perfil de Uso', 'Preferencias', 'Contato', 'Confirmacao'] as const;

const objectives = [
  { label: 'Trabalho', icon: 'briefcase-outline', description: 'Uso diario para negocios' },
  { label: 'Familia', icon: 'people-outline', description: 'Transporte da rotina' },
  { label: 'Lazer', icon: 'trail-sign-outline', description: 'Viagens e passeios' },
  { label: 'Esportivo', icon: 'barbell-outline', description: 'Performance e prazer' },
  { label: 'Outros', icon: 'ellipsis-horizontal-outline', description: 'Outro tipo de uso principal' },
] as const;

const frequencies = [
  'Diariamente',
  '4 a 6 vezes por semana',
  '1 a 3 vezes por semana',
  'Quinzenalmente',
  'Raramente',
];

const distances = [
  'Ate 500 km',
  '501 a 1.000 km',
  '1.001 a 2.000 km',
  '2.001 a 3.000 km',
  'Mais de 3.000 km',
];

const preferences = ['Conforto', 'Tecnologia', 'Economia', 'Seguranca', 'Performance'];
const contactChannels = ['WhatsApp', 'SMS', 'Email', 'Telefone'];

export function ProfileUseScreen() {
  const [currentStep, setCurrentStep] = useState(2);
  const [objective, setObjective] = useState('Lazer');
  const [frequency, setFrequency] = useState('1 a 3 vezes por semana');
  const [distance, setDistance] = useState('1.001 a 2.000 km');
  const [preference, setPreference] = useState('Tecnologia');
  const [contact, setContact] = useState('WhatsApp');

  const isLastStep = currentStep === steps.length;

  function handlePrevious() {
    setCurrentStep((step) => Math.max(1, step - 1));
  }

  function handleNext() {
    if (isLastStep) {
      router.replace('/');
      return;
    }

    setCurrentStep((step) => Math.min(steps.length, step + 1));
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <FordOneHeader mode="flow" />

      <FlowStepper currentStep={currentStep} />

      <View style={styles.intro}>
        <View style={styles.introCopy}>
          <Text style={styles.title}>Vamos conhecer voce melhor?</Text>
          <Text style={styles.subtitle}>
            Suas respostas ajudam a oferecer servicos e comunicacoes personalizadas
            para o seu Ford.
          </Text>
        </View>

        <OneCard style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons name="information-circle-outline" size={22} color="#005BEA" />
          </View>
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>Por que essas perguntas?</Text>
            <Text style={styles.infoDescription}>
              Entender seu perfil e objetivos de uso permite recomendar manutencoes,
              servicos e beneficios que realmente fazem sentido para voce.
            </Text>
          </View>
        </OneCard>
      </View>

      <OneCard>
        {currentStep === 1 ? <VehicleStep /> : null}

        {currentStep === 2 ? (
          <>
            <Question
              title="Qual e o principal objetivo de uso do seu veiculo?"
              subtitle="Selecione a opcao que melhor representa seu dia a dia"
            >
              <View style={styles.optionGrid}>
                {objectives.map((item) => (
                  <SelectableCard
                    key={item.label}
                    label={item.label}
                    description={item.description}
                    icon={item.icon}
                    selected={objective === item.label}
                    onPress={() => setObjective(item.label)}
                  />
                ))}
              </View>
            </Question>

            <Question
              title="Com que frequencia voce utiliza seu veiculo?"
              subtitle="Isso nos ajuda a entender seu padrao de uso"
            >
              <View style={styles.rowOptions}>
                {frequencies.map((item) => (
                  <Chip
                    key={item}
                    label={item}
                    selected={frequency === item}
                    onPress={() => setFrequency(item)}
                  />
                ))}
              </View>
            </Question>

            <Question
              title="Qual e a distancia media que voce percorre por mes?"
              subtitle="Aproximadamente quantos quilometros voce roda mensalmente?"
            >
              <View style={styles.rowOptions}>
                {distances.map((item) => (
                  <Chip
                    key={item}
                    label={item}
                    selected={distance === item}
                    onPress={() => setDistance(item)}
                  />
                ))}
              </View>
            </Question>
          </>
        ) : null}

        {currentStep === 3 ? (
          <Question
            title="Quais beneficios combinam mais com voce?"
            subtitle="Escolha a preferencia principal para personalizar recomendacoes."
          >
            <View style={styles.rowOptions}>
              {preferences.map((item) => (
                <Chip
                  key={item}
                  label={item}
                  selected={preference === item}
                  onPress={() => setPreference(item)}
                />
              ))}
            </View>
          </Question>
        ) : null}

        {currentStep === 4 ? (
          <Question
            title="Como a Ford pode falar com voce?"
            subtitle="Escolha o canal principal de contato para ofertas e manutencoes."
          >
            <View style={styles.rowOptions}>
              {contactChannels.map((item) => (
                <Chip
                  key={item}
                  label={item}
                  selected={contact === item}
                  onPress={() => setContact(item)}
                />
              ))}
            </View>
          </Question>
        ) : null}

        {currentStep === 5 ? (
          <ConfirmationStep
            objective={objective}
            frequency={frequency}
            distance={distance}
            preference={preference}
            contact={contact}
          />
        ) : null}

        <View style={styles.actions}>
          <ActionButton
            label="Anterior"
            variant="secondary"
            disabled={currentStep === 1}
            onPress={handlePrevious}
            style={styles.actionButton}
          />
          <ActionButton
            label={isLastStep ? 'Concluir' : 'Proximo'}
            onPress={handleNext}
            style={styles.actionButton}
          />
        </View>
      </OneCard>
    </ScrollView>
  );
}

function FlowStepper({ currentStep }: { currentStep: number }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.stepper}
    >
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isDone = stepNumber < currentStep;

        return (
          <View key={label} style={styles.stepItem}>
            <View
              style={[
                styles.stepCircle,
                isActive && styles.stepCircleActive,
                isDone && styles.stepCircleDone,
              ]}
            >
              <Text
                style={[
                  styles.stepNumber,
                  (isActive || isDone) && styles.stepNumberActive,
                ]}
              >
                {isDone ? '✓' : stepNumber}
              </Text>
            </View>
            <Text style={[styles.stepLabel, isActive && styles.stepLabelActive]}>{label}</Text>
            {stepNumber < steps.length ? <View style={styles.stepLine} /> : null}
          </View>
        );
      })}
    </ScrollView>
  );
}

function VehicleStep() {
  return (
    <Question
      title="Confirme o veiculo principal"
      subtitle="A jornada sera personalizada com base neste Ford."
    >
      <View style={styles.vehicleCard}>
        <View style={styles.vehicleIcon}>
          <Ionicons name="car-sport-outline" size={24} color="#005BEA" />
        </View>
        <View style={styles.vehicleCopy}>
          <Text style={styles.vehicleTitle}>Ford Territory Titanium 2022</Text>
          <Text style={styles.vehicleMeta}>ABC1D23 | 58.200 km | Rede Ford</Text>
        </View>
      </View>
    </Question>
  );
}

function ConfirmationStep({
  objective,
  frequency,
  distance,
  preference,
  contact,
}: {
  objective: string;
  frequency: string;
  distance: string;
  preference: string;
  contact: string;
}) {
  return (
    <View style={styles.confirmation}>
      <View style={styles.confirmIcon}>
        <Ionicons name="checkmark-circle-outline" size={34} color="#09A66D" />
      </View>
      <Text style={styles.confirmTitle}>Perfil pronto para recomendacoes</Text>
      <Text style={styles.confirmText}>
        A Ford ONE usara este perfil para sugerir servicos, ofertas e beneficios.
      </Text>
      <View style={styles.summaryBox}>
        <SummaryRow label="Uso" value={objective} />
        <SummaryRow label="Frequencia" value={frequency} />
        <SummaryRow label="Distancia" value={distance} />
        <SummaryRow label="Preferencia" value={preference} />
        <SummaryRow label="Contato" value={contact} />
      </View>
    </View>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

function Question({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.question}>
      <View>
        <Text style={styles.questionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.questionSubtitle}>{subtitle}</Text> : null}
      </View>
      {children}
    </View>
  );
}

function SelectableCard({
  label,
  description,
  icon,
  selected,
  onPress,
}: {
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.selectable,
        selected && styles.selectableActive,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.selectableIcon}>
        <Ionicons name={icon} size={20} color={selected ? '#005BEA' : '#66738A'} />
      </View>
      <View style={styles.selectableCopy}>
        <Text style={[styles.selectableTitle, selected && styles.selectableTitleActive]}>
          {label}
        </Text>
        <Text style={styles.selectableDescription}>{description}</Text>
      </View>
      {selected ? (
        <Ionicons name="checkmark-circle" size={20} color="#005BEA" style={styles.checkIcon} />
      ) : null}
    </Pressable>
  );
}

function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipActive,
        pressed && styles.pressed,
      ]}
    >
      <Ionicons
        name={selected ? 'radio-button-on' : 'radio-button-off'}
        size={17}
        color={selected ? '#005BEA' : '#B5C1D1'}
      />
      <Text style={[styles.chipLabel, selected && styles.chipLabelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F8FC' },
  content: { padding: 16, paddingBottom: 36, gap: 16 },
  stepper: { alignItems: 'center', paddingVertical: 4 },
  stepItem: { flexDirection: 'row', alignItems: 'center' },
  stepCircle: {
    width: 31,
    height: 31,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#8390A5',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  stepCircleActive: { borderColor: '#005BEA', backgroundColor: '#005BEA' },
  stepCircleDone: { borderColor: '#005BEA', backgroundColor: '#005BEA' },
  stepNumber: { color: '#43516A', fontSize: 13, fontWeight: '900' },
  stepNumberActive: { color: '#FFFFFF' },
  stepLabel: { color: '#43516A', fontSize: 13, fontWeight: '800', marginLeft: 8 },
  stepLabelActive: { color: '#005BEA' },
  stepLine: { width: 32, height: 1, backgroundColor: '#CBD5E1', marginHorizontal: 12 },
  intro: { gap: 14 },
  introCopy: { gap: 6 },
  title: { color: '#071331', fontSize: 25, fontWeight: '900', lineHeight: 31 },
  subtitle: { color: '#43516A', fontSize: 14, lineHeight: 20 },
  infoCard: { flexDirection: 'row', gap: 12, backgroundColor: '#F3F8FF' },
  infoIcon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  infoText: { flex: 1, gap: 4 },
  infoTitle: { color: '#071331', fontSize: 16, fontWeight: '900' },
  infoDescription: { color: '#43516A', fontSize: 14, lineHeight: 20 },
  question: { gap: 12, marginBottom: 22 },
  questionTitle: { color: '#071331', fontSize: 16, fontWeight: '900' },
  questionSubtitle: { color: '#526174', fontSize: 13, marginTop: 3, lineHeight: 18 },
  optionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  selectable: {
    width: '48%',
    minHeight: 94,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDE6F3',
    padding: 12,
    gap: 8,
    backgroundColor: '#FFFFFF',
  },
  selectableActive: { borderColor: '#005BEA', backgroundColor: '#F2F7FF' },
  pressed: { transform: [{ scale: 0.98 }] },
  selectableIcon: { width: 26, height: 24, justifyContent: 'center' },
  selectableCopy: { gap: 2, paddingRight: 10 },
  selectableTitle: { fontSize: 15, fontWeight: '900', color: '#071331' },
  selectableTitleActive: { color: '#005BEA' },
  selectableDescription: { fontSize: 12, color: '#526174', lineHeight: 18 },
  checkIcon: { position: 'absolute', right: 10, top: 10 },
  rowOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDE6F3',
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
  },
  chipActive: { borderColor: '#005BEA', backgroundColor: '#F2F7FF' },
  chipLabel: { color: '#526174', fontWeight: '800', flexShrink: 1 },
  chipLabelActive: { color: '#005BEA' },
  vehicleCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDE6F3',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8FBFF',
  },
  vehicleIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF2FF',
  },
  vehicleCopy: { flex: 1, minWidth: 0 },
  vehicleTitle: { color: '#071331', fontSize: 16, fontWeight: '900' },
  vehicleMeta: { color: '#526174', fontSize: 13, marginTop: 3, fontWeight: '700' },
  confirmation: { alignItems: 'center', gap: 10, paddingVertical: 4 },
  confirmIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F8F0',
  },
  confirmTitle: { color: '#071331', fontSize: 20, fontWeight: '900', textAlign: 'center' },
  confirmText: { color: '#43516A', fontSize: 14, lineHeight: 20, textAlign: 'center' },
  summaryBox: {
    alignSelf: 'stretch',
    borderRadius: 12,
    backgroundColor: '#F8FBFF',
    borderWidth: 1,
    borderColor: '#DDE6F3',
    padding: 12,
    gap: 8,
    marginTop: 6,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  summaryLabel: { color: '#526174', fontSize: 13, fontWeight: '800' },
  summaryValue: { color: '#071331', fontSize: 13, fontWeight: '900', flexShrink: 1, textAlign: 'right' },
  actions: { flexDirection: 'row', gap: 10 },
  actionButton: { flex: 1 },
});
