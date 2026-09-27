import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { FordOneHeader } from '@/components/FordOneHeader';
import { InfoRow } from '@/components/InfoRow';
import { Loading } from '@/components/Loading';
import { OneCard } from '@/components/OneCard';
import { SummaryList } from '@/components/onboarding/ChoiceControls';
import { FlowStepper } from '@/components/onboarding/FlowStepper';
import { OnboardingQuestions } from '@/components/onboarding/OnboardingQuestions';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import {
  DEFAULT_ONBOARDING,
  ONBOARDING_STEPS,
  onboardingSummaryRows,
} from '@/constants/onboarding';
import { accountStorage } from '@/services/accountStorage';
import { colors, radius, spacing, typography } from '@/theme';
import { AccountOnboarding, AccountProfile, StoredAccount } from '@/types/account';
import { formatDate, formatPhone } from '@/utils/format';

type AuthMode = 'register' | 'login';
type FieldErrors = Partial<Record<'name' | 'email' | 'document' | 'password', string>>;

const CONTACT_STEP = 4;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AccountScreen() {
  const [mode, setMode] = useState<AuthMode>('register');
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [storedAccount, setStoredAccount] = useState<StoredAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [onboarding, setOnboarding] = useState<AccountOnboarding>(DEFAULT_ONBOARDING);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [document, setDocument] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});

  const loadAccount = useCallback(async () => {
    const [session, account] = await Promise.all([
      accountStorage.getSessionProfile(),
      accountStorage.getStoredAccount(),
    ]);

    setProfile(session);
    setStoredAccount(account);
    setMode((current) => (account && !session ? 'login' : current));
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadAccount();
    }, [loadAccount]),
  );

  async function handleRegister() {
    setSaving(true);

    try {
      const createdProfile = await accountStorage.register({
        name,
        email,
        phone,
        document,
        password,
        onboarding,
      });
      setProfile(createdProfile);
      setStoredAccount(await accountStorage.getStoredAccount());
      clearForm();
      Alert.alert('Conta criada', 'Seu perfil Ford ONE foi salvo com segurança neste aparelho.');
    } catch (error) {
      Alert.alert('Cadastro', getMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function handleLogin() {
    const nextErrors: FieldErrors = {
      email: EMAIL_PATTERN.test(email.trim()) ? undefined : 'Informe um e-mail válido.',
      password: password ? undefined : 'Informe sua senha.',
    };
    setErrors(nextErrors);

    if (nextErrors.email || nextErrors.password) {
      return;
    }

    setSaving(true);

    try {
      const loggedProfile = await accountStorage.login({ email, password });
      setProfile(loggedProfile);
      clearForm();
      Alert.alert('Login realizado', `Bem-vindo de volta, ${loggedProfile.name}.`);
    } catch (error) {
      Alert.alert('Login', getMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await accountStorage.logout();
    setProfile(null);
    setMode('login');
    clearForm();
  }

  function handleModeChange(nextMode: AuthMode) {
    setMode(nextMode);
    clearForm();

    if (nextMode === 'register') {
      setCurrentStep(1);
      setOnboarding(DEFAULT_ONBOARDING);
    }
  }

  function updateField(field: keyof FieldErrors, value: string, setter: (value: string) => void) {
    setter(value);
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function clearForm() {
    setName('');
    setEmail('');
    setPhone('');
    setDocument('');
    setPassword('');
    setErrors({});
  }

  function validateContactStep(): boolean {
    const nextErrors: FieldErrors = {
      name: name.trim() ? undefined : 'Informe seu nome.',
      email: EMAIL_PATTERN.test(email.trim()) ? undefined : 'Informe um e-mail válido.',
      document:
        document && document.length !== 11 ? 'O CPF deve ter 11 números.' : undefined,
      password: password.length >= 6 ? undefined : 'A senha deve ter pelo menos 6 caracteres.',
    };
    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  }

  function handleNextStep() {
    if (currentStep === CONTACT_STEP && !validateContactStep()) {
      return;
    }

    if (currentStep === ONBOARDING_STEPS.length) {
      void handleRegister();
      return;
    }

    setCurrentStep((step) => Math.min(ONBOARDING_STEPS.length, step + 1));
  }

  if (loading) {
    return <Loading fullScreen message="Carregando conta..." />;
  }

  return (
    <Screen>
      <FordOneHeader
        back
        minimal
        title="Minha conta"
        subtitle={
          profile
            ? 'Seus dados e preferências Ford ONE, salvos com segurança no aparelho.'
            : 'Cadastre-se ou acesse seu perfil Ford ONE salvo no dispositivo.'
        }
        accountName={profile?.name}
      />

      {profile ? (
        <LoggedProfile profile={profile} onLogout={handleLogout} />
      ) : (
        <OneCard>
          <View style={styles.modeRow} accessibilityRole="tablist">
            <ModeButton
              label="Cadastrar"
              active={mode === 'register'}
              onPress={() => handleModeChange('register')}
            />
            <ModeButton
              label="Entrar"
              active={mode === 'login'}
              onPress={() => handleModeChange('login')}
            />
          </View>

          {mode === 'register' ? (
            <>
              <FlowStepper steps={ONBOARDING_STEPS} currentStep={currentStep} />

              {currentStep === 1 ? (
                <View style={styles.infoCard}>
                  <Ionicons name="information-circle-outline" size={22} color={colors.primary} />
                  <Text style={styles.infoText}>
                    Antes de criar sua conta, vamos personalizar sua experiência. As respostas ajudam
                    a recomendar manutenções, benefícios e comunicações que fazem sentido para você.
                  </Text>
                </View>
              ) : null}

              <OnboardingQuestions
                step={currentStep}
                value={onboarding}
                onChange={(patch) => setOnboarding((current) => ({ ...current, ...patch }))}
              />

              {currentStep === CONTACT_STEP ? (
                <View style={styles.form}>
                  <TextField
                    label="Nome"
                    value={name}
                    onChangeText={(value) => updateField('name', value, setName)}
                    placeholder="Seu nome completo"
                    autoComplete="name"
                    error={errors.name}
                  />
                  <TextField
                    label="E-mail"
                    value={email}
                    onChangeText={(value) => updateField('email', value, setEmail)}
                    placeholder="voce@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    error={errors.email}
                  />
                  <TextField
                    label="Telefone (opcional)"
                    value={phone}
                    onChangeText={(value) => setPhone(onlyDigits(value, 11))}
                    placeholder="11999999999"
                    keyboardType="phone-pad"
                    maxLength={11}
                  />
                  <TextField
                    label="CPF (opcional)"
                    value={document}
                    onChangeText={(value) => updateField('document', onlyDigits(value, 11), setDocument)}
                    placeholder="Somente números"
                    keyboardType="number-pad"
                    maxLength={11}
                    error={errors.document}
                  />
                  <TextField
                    label="Senha"
                    value={password}
                    onChangeText={(value) => updateField('password', value, setPassword)}
                    placeholder="Mínimo de 6 caracteres"
                    secureTextEntry
                    autoCapitalize="none"
                    error={errors.password}
                  />
                </View>
              ) : null}

              {currentStep === ONBOARDING_STEPS.length ? (
                <View style={styles.confirmation}>
                  <View style={styles.confirmIcon}>
                    <Ionicons name="checkmark-circle-outline" size={34} color={colors.success} />
                  </View>
                  <Text style={[typography.title, styles.centered]}>Confirme seu cadastro Ford ONE</Text>
                  <Text style={[typography.body, styles.centered]}>
                    A conta será criada neste aparelho e o app passará a exibir seu nome no topo.
                  </Text>
                  <SummaryList
                    rows={[
                      { label: 'Nome', value: name },
                      { label: 'E-mail', value: email.trim().toLowerCase() },
                      ...onboardingSummaryRows(onboarding),
                    ]}
                  />
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
                  label={
                    currentStep === ONBOARDING_STEPS.length
                      ? saving
                        ? 'Salvando...'
                        : 'Criar conta'
                      : 'Próximo'
                  }
                  disabled={saving}
                  onPress={handleNextStep}
                  style={styles.actionButton}
                />
              </View>
            </>
          ) : (
            <View style={styles.form}>
              <Text style={typography.title}>Entrar na conta</Text>
              <Text style={typography.body}>
                {storedAccount
                  ? 'Use o e-mail e a senha cadastrados neste aparelho.'
                  : 'Ainda não existe conta salva neste aparelho. Toque em "Cadastrar" para criar a sua.'}
              </Text>
              <TextField
                label="E-mail"
                value={email}
                onChangeText={(value) => updateField('email', value, setEmail)}
                placeholder="voce@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={errors.email}
              />
              <TextField
                label="Senha"
                value={password}
                onChangeText={(value) => updateField('password', value, setPassword)}
                placeholder="Sua senha"
                secureTextEntry
                autoCapitalize="none"
                error={errors.password}
              />
              <ActionButton
                label={saving ? 'Entrando...' : 'Entrar'}
                disabled={saving || !storedAccount}
                onPress={() => {
                  void handleLogin();
                }}
              />
            </View>
          )}
        </OneCard>
      )}
    </Screen>
  );
}

function LoggedProfile({ profile, onLogout }: { profile: AccountProfile; onLogout: () => void }) {
  return (
    <>
      <OneCard>
        <View style={styles.profileHeader}>
          <View style={styles.profileAvatar}>
            <Ionicons name="person-outline" size={28} color={colors.primary} />
          </View>
          <View style={styles.profileTitleGroup}>
            <Text style={typography.title}>{profile.name}</Text>
            <Text style={typography.body}>{profile.email}</Text>
          </View>
        </View>

        <View style={styles.infoList}>
          <InfoRow label="Telefone" value={profile.phone ? formatPhone(profile.phone) : 'Não informado'} />
          <InfoRow label="CPF" value={profile.document ? 'Cadastrado' : 'Não informado'} />
          <InfoRow label="Cliente desde" value={formatDate(profile.createdAt)} />
        </View>
      </OneCard>

      <OneCard>
        <Text style={typography.section}>Perfil de uso</Text>
        <SummaryList rows={onboardingSummaryRows(profile.onboarding)} />
        <ActionButton
          label="Editar perfil de uso"
          icon="create-outline"
          variant="secondary"
          onPress={() => router.push('/perfil')}
        />
      </OneCard>

      <ActionButton label="Sair da conta" icon="log-out-outline" variant="danger" onPress={onLogout} />
    </>
  );
}

function ModeButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.modeButton,
        active && styles.modeButtonActive,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.modeButtonText, active && styles.modeButtonTextActive]}>{label}</Text>
    </Pressable>
  );
}

function getMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Não foi possível concluir a ação.';
}

function onlyDigits(value: string, maxLength: number) {
  return value.replace(/\D/g, '').slice(0, maxLength);
}

const styles = StyleSheet.create({
  modeRow: {
    flexDirection: 'row',
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSunken,
    padding: spacing.xs,
    gap: spacing.xs,
  },
  modeButton: {
    flex: 1,
    borderRadius: 9,
    paddingVertical: 10,
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: colors.primary,
  },
  modeButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '900',
  },
  modeButtonTextActive: {
    color: colors.textInverse,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    backgroundColor: colors.primarySubtle,
    padding: spacing.md,
  },
  infoText: {
    ...typography.body,
    fontSize: 13,
    lineHeight: 19,
    flex: 1,
  },
  form: {
    gap: spacing.md,
  },
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
    gap: 10,
  },
  actionButton: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileTitleGroup: {
    flex: 1,
    minWidth: 0,
  },
  infoList: {
    gap: 10,
  },
});
