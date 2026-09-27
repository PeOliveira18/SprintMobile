import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { EmptyState } from '@/components/EmptyState';
import { FordOneHeader } from '@/components/FordOneHeader';
import { Loading } from '@/components/Loading';
import { OneCard } from '@/components/OneCard';
import { SummaryList } from '@/components/onboarding/ChoiceControls';
import { FlowStepper } from '@/components/onboarding/FlowStepper';
import { OnboardingQuestions } from '@/components/onboarding/OnboardingQuestions';
import { Screen } from '@/components/Screen';
import { ONBOARDING_STEPS, onboardingSummaryRows } from '@/constants/onboarding';
import { useAccountSession } from '@/hooks/useAccountSession';
import { accountStorage } from '@/services/accountStorage';
import { colors, spacing, typography } from '@/theme';
import { AccountOnboarding } from '@/types/account';
import { goBackOrHome } from '@/utils/navigation';

export function ProfileUseScreen() {
  const { profile, loading } = useAccountSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [onboarding, setOnboarding] = useState<AccountOnboarding | null>(null);
  const [saving, setSaving] = useState(false);
  const isLastStep = currentStep === ONBOARDING_STEPS.length;

  useEffect(() => {
    if (profile && !onboarding) {
      setOnboarding(profile.onboarding);
    }
  }, [profile, onboarding]);

  async function handleSave(value: AccountOnboarding) {
    setSaving(true);

    try {
      await accountStorage.updateOnboarding(value);
      Alert.alert('Perfil atualizado', 'As recomendações do app já usam o seu novo perfil.', [
        { text: 'OK', onPress: goBackOrHome },
      ]);
    } catch (error) {
      Alert.alert('Perfil de uso', error instanceof Error ? error.message : 'Não foi possível salvar.');
    } finally {
      setSaving(false);
    }
  }

  if (loading && !onboarding) {
    return <Loading fullScreen message="Carregando perfil..." />;
  }

  if (!profile || !onboarding) {
    return (
      <Screen>
        <FordOneHeader back minimal title="Perfil de uso" />
        <EmptyState
          icon="person-circle-outline"
          title="Entre na sua conta"
          description="O perfil de uso fica salvo na sua conta Ford ONE. Cadastre-se ou entre para personalizar as recomendações."
          action={<ActionButton label="Entrar ou criar conta" onPress={() => router.replace('/conta')} />}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <FordOneHeader
        back
        minimal
        title="Vamos conhecer você melhor?"
        subtitle="Suas respostas personalizam serviços, lançamentos e comunicações para o seu Ford."
      />

      <FlowStepper steps={ONBOARDING_STEPS} currentStep={currentStep} />

      <OneCard>
        <OnboardingQuestions
          step={currentStep}
          value={onboarding}
          onChange={(patch) => setOnboarding((current) => (current ? { ...current, ...patch } : current))}
        />

        {isLastStep ? (
          <View style={styles.confirmation}>
            <View style={styles.confirmIcon}>
              <Ionicons name="checkmark-circle-outline" size={34} color={colors.success} />
            </View>
            <Text style={[typography.title, styles.centered]}>Perfil pronto para recomendações</Text>
            <Text style={[typography.body, styles.centered]}>
              A Ford ONE usará este perfil para sugerir serviços, ofertas e benefícios.
            </Text>
            <SummaryList rows={onboardingSummaryRows(onboarding)} />
          </View>
        ) : null}

        <View style={styles.actions}>
          <ActionButton
            label="Anterior"
            icon="chevron-back"
            variant="secondary"
            disabled={currentStep === 1 || saving}
            onPress={() => setCurrentStep((step) => Math.max(1, step - 1))}
            style={styles.actionButton}
          />
          <ActionButton
            label={isLastStep ? (saving ? 'Salvando...' : 'Salvar perfil') : 'Próximo'}
            disabled={saving}
            onPress={() => {
              if (isLastStep) {
                void handleSave(onboarding);
                return;
              }

              setCurrentStep((step) => Math.min(ONBOARDING_STEPS.length, step + 1));
            }}
            style={styles.actionButton}
          />
        </View>
      </OneCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  confirmation: {
    alignItems: 'center',
    gap: 10,
  },
  confirmIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.successSoft,
  },
  centered: {
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});
