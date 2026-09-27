import { StyleSheet, View } from 'react-native';

import {
  CONTACT_OPTIONS,
  DISTANCE_OPTIONS,
  FREQUENCY_OPTIONS,
  OBJECTIVE_OPTIONS,
  PREFERENCE_OPTIONS,
  VEHICLE_OPTIONS,
} from '@/constants/onboarding';
import {
  OptionChip,
  Question,
  SelectableCard,
  VehicleOption,
} from '@/components/onboarding/ChoiceControls';
import { AccountOnboarding } from '@/types/account';

type OnboardingQuestionsProps = {
  step: number;
  value: AccountOnboarding;
  onChange: (patch: Partial<AccountOnboarding>) => void;
};

export function OnboardingQuestions({ step, value, onChange }: OnboardingQuestionsProps) {
  if (step === 1) {
    return (
      <Question
        title="Confirme seu veículo principal"
        subtitle="A jornada será personalizada com base neste Ford."
      >
        {VEHICLE_OPTIONS.map((option) => (
          <VehicleOption
            key={option.label}
            label={option.label}
            meta={option.meta}
            selected={value.vehicle === option.label}
            onPress={() => onChange({ vehicle: option.label })}
          />
        ))}
      </Question>
    );
  }

  if (step === 2) {
    return (
      <>
        <Question
          title="Qual é o principal objetivo de uso do seu veículo?"
          subtitle="Selecione a opção que melhor representa seu dia a dia."
        >
          <View style={styles.grid}>
            {OBJECTIVE_OPTIONS.map((item) => (
              <SelectableCard
                key={item.label}
                label={item.label}
                description={item.description}
                icon={item.icon}
                selected={value.objective === item.label}
                onPress={() => onChange({ objective: item.label })}
              />
            ))}
          </View>
        </Question>

        <ChipQuestion
          title="Com que frequência você utiliza seu veículo?"
          subtitle="Isso nos ajuda a entender seu padrão de uso."
          options={FREQUENCY_OPTIONS}
          selected={value.frequency}
          onSelect={(frequency) => onChange({ frequency })}
        />

        <ChipQuestion
          title="Qual é a distância média que você percorre por mês?"
          subtitle="Aproximadamente quantos quilômetros você roda mensalmente?"
          options={DISTANCE_OPTIONS}
          selected={value.monthlyDistance}
          onSelect={(monthlyDistance) => onChange({ monthlyDistance })}
        />
      </>
    );
  }

  if (step === 3) {
    return (
      <ChipQuestion
        title="Quais benefícios combinam mais com você?"
        subtitle="Escolha a preferência principal para personalizar recomendações."
        options={PREFERENCE_OPTIONS}
        selected={value.preference}
        onSelect={(preference) => onChange({ preference })}
      />
    );
  }

  if (step === 4) {
    return (
      <ChipQuestion
        title="Como a Ford pode falar com você?"
        subtitle="Escolha o canal principal para ofertas e lembretes de manutenção."
        options={CONTACT_OPTIONS}
        selected={value.contactChannel}
        onSelect={(contactChannel) => onChange({ contactChannel })}
      />
    );
  }

  return null;
}

function ChipQuestion({
  title,
  subtitle,
  options,
  selected,
  onSelect,
}: {
  title: string;
  subtitle: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <Question title={title} subtitle={subtitle}>
      <View style={styles.grid} accessibilityRole="radiogroup">
        {options.map((item) => (
          <OptionChip
            key={item}
            label={item}
            selected={selected === item}
            onPress={() => onSelect(item)}
          />
        ))}
      </View>
    </Question>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
});
