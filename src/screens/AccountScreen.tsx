import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ReactNode, useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { FordOneHeader } from '@/components/FordOneHeader';
import { OneCard } from '@/components/OneCard';
import { accountStorage } from '@/services/accountStorage';
import { AccountOnboarding, AccountProfile, StoredAccount } from '@/types/account';

type AuthMode = 'register' | 'login';
type IconName = keyof typeof Ionicons.glyphMap;

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

export function AccountScreen() {
  const [mode, setMode] = useState<AuthMode>('register');
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [storedAccount, setStoredAccount] = useState<StoredAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [vehicle, setVehicle] = useState('Ford Territory Titanium 2022');
  const [objective, setObjective] = useState('Lazer');
  const [frequency, setFrequency] = useState('1 a 3 vezes por semana');
  const [monthlyDistance, setMonthlyDistance] = useState('1.001 a 2.000 km');
  const [preference, setPreference] = useState('Tecnologia');
  const [contactChannel, setContactChannel] = useState('WhatsApp');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [document, setDocument] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    void loadAccount();
  }, []);

  async function loadAccount() {
    setLoading(true);
    const [session, account] = await Promise.all([
      accountStorage.getSessionProfile(),
      accountStorage.getStoredAccount(),
    ]);

    setProfile(session);
    setStoredAccount(account);
    setMode(account ? 'login' : 'register');

    setLoading(false);
  }

  async function handleRegister() {
    setSaving(true);

    try {
      const createdProfile = await accountStorage.register({
        name,
        email,
        phone,
        document,
        password,
        onboarding: buildOnboarding(),
      });
      setProfile(createdProfile);
      setStoredAccount(await accountStorage.getStoredAccount());
      Alert.alert('Conta criada', 'Seu perfil Ford ONE foi salvo neste aparelho.');
    } catch (error) {
      Alert.alert('Cadastro', getMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function handleLogin() {
    setSaving(true);

    try {
      const loggedProfile = await accountStorage.login({ email, password });
      setProfile(loggedProfile);
      Alert.alert('Login realizado', `Bem-vindo, ${loggedProfile.name}.`);
    } catch (error) {
      Alert.alert('Login', getMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await accountStorage.logout();
    setProfile(null);
    clearFormFields();
    Alert.alert('Sessao encerrada', 'A conta continua salva localmente para novo login.');
  }

  function handleModeChange(nextMode: AuthMode) {
    setMode(nextMode);
    clearFormFields();

    if (nextMode === 'register') {
      setCurrentStep(1);
    }
  }

  function clearFormFields() {
    setName('');
    setEmail('');
    setPhone('');
    setDocument('');
    setPassword('');
  }

  function buildOnboarding(): AccountOnboarding {
    return {
      vehicle,
      objective,
      frequency,
      monthlyDistance,
      preference,
      contactChannel,
    };
  }

  function handleNextStep() {
    const validationMessage = currentStep === 4 ? getContactValidationMessage() : null;

    if (validationMessage) {
      Alert.alert('Contato', validationMessage);
      return;
    }

    if (currentStep === steps.length) {
      void handleRegister();
      return;
    }

    setCurrentStep((step) => Math.min(steps.length, step + 1));
  }

  function getContactValidationMessage() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      return 'Informe nome, email e senha para continuar.';
    }

    if (document.trim() && document.length !== 11) {
      return 'O CPF deve ter 11 numeros.';
    }

    if (password.length < 6) {
      return 'A senha deve ter pelo menos 6 caracteres.';
    }

    return null;
  }

  if (loading) {
    return (
      <View style={styles.feedback}>
        <Text style={styles.loadingText}>Carregando conta...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <FordOneHeader
          title="Minha conta"
          subtitle="Cadastre ou acesse seu perfil salvo localmente no dispositivo."
          accountName={profile?.name}
        />

        {profile ? (
          <LoggedProfile profile={profile} onLogout={handleLogout} />
        ) : (
          <OneCard style={styles.authCard}>
            <View style={styles.modeRow}>
              <ModeButton
                label="Cadastrar"
                active={mode === 'register'}
                onPress={() => handleModeChange('register')}
              />
              <ModeButton
                label="Logar"
                active={mode === 'login'}
                onPress={() => handleModeChange('login')}
              />
            </View>

            {mode === 'register' ? (
              <>
                <FlowStepper currentStep={currentStep} />
                <View style={styles.intro}>
                  <View style={styles.introCopy}>
                    <Text style={styles.formTitle}>Vamos conhecer voce melhor?</Text>
                    <Text style={styles.formText}>
                      Antes de criar sua conta, vamos personalizar sua experiencia Ford ONE.
                    </Text>
                  </View>
                  <View style={styles.infoCard}>
                    <Ionicons name="information-circle-outline" size={22} color="#005BEA" />
                    <Text style={styles.infoText}>
                      Essas respostas ajudam a recomendar manutencoes, beneficios e
                      comunicacoes que fazem sentido para voce.
                    </Text>
                  </View>
                </View>

                {currentStep === 1 ? (
                  <Question
                    title="Confirme seu veiculo principal"
                    subtitle="A conta sera personalizada com base neste Ford."
                  >
                    <VehicleOption
                      label="Ford Territory Titanium 2022"
                      meta="ABC1D23 | 58.200 km"
                      selected={vehicle === 'Ford Territory Titanium 2022'}
                      onPress={() => setVehicle('Ford Territory Titanium 2022')}
                    />
                    <VehicleOption
                      label="Ford Ranger XLS 2023"
                      meta="9BFRNG23P9988776 | 31.000 km"
                      selected={vehicle === 'Ford Ranger XLS 2023'}
                      onPress={() => setVehicle('Ford Ranger XLS 2023')}
                    />
                  </Question>
                ) : null}

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
                            selected={monthlyDistance === item}
                            onPress={() => setMonthlyDistance(item)}
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
                  <>
                    <Question
                      title="Como a Ford pode falar com voce?"
                      subtitle="Escolha o canal principal e informe seus dados de acesso."
                    >
                      <View style={styles.rowOptions}>
                        {contactChannels.map((item) => (
                          <Chip
                            key={item}
                            label={item}
                            selected={contactChannel === item}
                            onPress={() => setContactChannel(item)}
                          />
                        ))}
                      </View>
                    </Question>
                    <Input label="Nome" value={name} onChangeText={setName} placeholder="Seu nome" />
                    <Input
                      label="Email"
                      value={email}
                      onChangeText={setEmail}
                      placeholder="voce@email.com"
                      keyboardType="email-address"
                    />
                    <Input
                      label="Telefone"
                      value={phone}
                      onChangeText={(value) => setPhone(onlyDigits(value, 11))}
                      placeholder="11999999999"
                      keyboardType="phone-pad"
                      maxLength={11}
                    />
                    <Input
                      label="Documento"
                      value={document}
                      onChangeText={(value) => setDocument(onlyDigits(value, 11))}
                      placeholder="12345678901"
                      keyboardType="number-pad"
                      maxLength={11}
                    />
                    <Input
                      label="Senha"
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Minimo 6 caracteres"
                      secureTextEntry
                    />
                  </>
                ) : null}

                {currentStep === 5 ? (
                  <ConfirmationStep
                    name={name}
                    email={email}
                    onboarding={buildOnboarding()}
                  />
                ) : null}

                <View style={styles.actions}>
                  <ActionButton
                    label="Anterior"
                    variant="secondary"
                    disabled={currentStep === 1}
                    onPress={() => setCurrentStep((step) => Math.max(1, step - 1))}
                    style={styles.actionButton}
                  />
                  <ActionButton
                    label={
                      currentStep === steps.length
                        ? saving
                          ? 'Salvando...'
                          : 'Criar conta'
                        : 'Proximo'
                    }
                    disabled={saving}
                    onPress={handleNextStep}
                    style={styles.actionButton}
                  />
                </View>
              </>
            ) : (
              <>
                <Text style={styles.formTitle}>Entrar na conta local</Text>
                <Text style={styles.formText}>
                  {storedAccount
                    ? 'Use o email e a senha cadastrados neste aparelho.'
                    : 'Ainda nao existe conta local salva neste aparelho.'}
                </Text>
                <Input
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="voce@email.com"
                  keyboardType="email-address"
                />
                <Input
                  label="Senha"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Senha local"
                  secureTextEntry
                />
                <ActionButton
                  label={saving ? 'Entrando...' : 'Logar'}
                  disabled={saving}
                  onPress={() => {
                    void handleLogin();
                  }}
                />
              </>
            )}
          </OneCard>
        )}

        <ActionButton label="Voltar" variant="secondary" onPress={() => router.back()} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function LoggedProfile({
  profile,
  onLogout,
}: {
  profile: AccountProfile;
  onLogout: () => void;
}) {
  return (
    <OneCard style={styles.profileCard}>
      <View style={styles.profileHeader}>
        <View style={styles.profileAvatar}>
          <Ionicons name="person-outline" size={28} color="#005BEA" />
        </View>
        <View style={styles.profileTitleGroup}>
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileEmail}>{profile.email}</Text>
        </View>
      </View>

      <View style={styles.infoList}>
        <InfoRow label="Telefone" value={profile.phone || 'Nao informado'} />
        <InfoRow label="Documento" value={profile.document || 'Nao informado'} />
        <InfoRow label="Veiculo" value={profile.onboarding.vehicle} />
        <InfoRow label="Uso" value={profile.onboarding.objective} />
        <InfoRow label="Frequencia" value={profile.onboarding.frequency} />
        <InfoRow label="Distancia" value={profile.onboarding.monthlyDistance} />
        <InfoRow label="Preferencia" value={profile.onboarding.preference} />
        <InfoRow label="Contato" value={profile.onboarding.contactChannel} />
        <InfoRow label="Criado em" value={formatDate(profile.createdAt)} />
        <InfoRow label="Armazenamento" value="SecureStore local" />
      </View>

      <ActionButton label="Sair da conta" variant="secondary" onPress={onLogout} />
    </OneCard>
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
            <Text style={[styles.stepLabel, isActive && styles.stepLabelActive]}>
              {label}
            </Text>
            {stepNumber < steps.length ? <View style={styles.stepLine} /> : null}
          </View>
        );
      })}
    </ScrollView>
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

function VehicleOption({
  label,
  meta,
  selected,
  onPress,
}: {
  label: string;
  meta: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.vehicleOption,
        selected && styles.vehicleOptionActive,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.vehicleIcon}>
        <Ionicons name="car-sport-outline" size={24} color={selected ? '#005BEA' : '#66738A'} />
      </View>
      <View style={styles.vehicleCopy}>
        <Text style={styles.vehicleTitle}>{label}</Text>
        <Text style={styles.vehicleMeta}>{meta}</Text>
      </View>
      {selected ? <Ionicons name="checkmark-circle" size={20} color="#005BEA" /> : null}
    </Pressable>
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
  icon: IconName;
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

function ConfirmationStep({
  name,
  email,
  onboarding,
}: {
  name: string;
  email: string;
  onboarding: AccountOnboarding;
}) {
  return (
    <View style={styles.confirmation}>
      <View style={styles.confirmIcon}>
        <Ionicons name="checkmark-circle-outline" size={34} color="#09A66D" />
      </View>
      <Text style={styles.confirmTitle}>Confirme seu cadastro Ford ONE</Text>
      <Text style={styles.confirmText}>
        A conta sera criada localmente e o app passara a exibir seu nome no topo.
      </Text>
      <View style={styles.summaryBox}>
        <SummaryRow label="Nome" value={name || 'Nao informado'} />
        <SummaryRow label="Email" value={email || 'Nao informado'} />
        <SummaryRow label="Veiculo" value={onboarding.vehicle} />
        <SummaryRow label="Uso" value={onboarding.objective} />
        <SummaryRow label="Frequencia" value={onboarding.frequency} />
        <SummaryRow label="Distancia" value={onboarding.monthlyDistance} />
        <SummaryRow label="Preferencia" value={onboarding.preference} />
        <SummaryRow label="Contato" value={onboarding.contactChannel} />
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
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.modeButton,
        active && styles.modeButtonActive,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.modeButtonText, active && styles.modeButtonTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

function Input({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  secureTextEntry,
  maxLength,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'number-pad';
  secureTextEntry?: boolean;
  maxLength?: number;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        maxLength={maxLength}
        autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
        style={styles.input}
      />
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('pt-BR');
}

function getMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Nao foi possivel concluir a acao.';
}

function onlyDigits(value: string, maxLength: number) {
  return value.replace(/\D/g, '').slice(0, maxLength);
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F8FC' },
  content: { padding: 16, paddingBottom: 36, gap: 16 },
  feedback: {
    flex: 1,
    backgroundColor: '#F5F8FC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingText: { color: '#43516A', fontSize: 15, fontWeight: '800' },
  authCard: { gap: 14 },
  modeRow: {
    flexDirection: 'row',
    borderRadius: 12,
    backgroundColor: '#EEF3F8',
    padding: 4,
    gap: 4,
  },
  modeButton: {
    flex: 1,
    borderRadius: 9,
    paddingVertical: 10,
    alignItems: 'center',
  },
  modeButtonActive: { backgroundColor: '#005BEA' },
  modeButtonText: { color: '#526174', fontSize: 14, fontWeight: '900' },
  modeButtonTextActive: { color: '#FFFFFF' },
  pressed: { transform: [{ scale: 0.98 }] },
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
  intro: { gap: 12 },
  introCopy: { gap: 4 },
  formTitle: { color: '#071331', fontSize: 20, fontWeight: '900' },
  formText: { color: '#43516A', fontSize: 14, lineHeight: 20 },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CFE0FF',
    backgroundColor: '#F3F8FF',
    padding: 12,
  },
  infoText: { color: '#43516A', fontSize: 13, lineHeight: 19, flex: 1 },
  question: { gap: 12, marginBottom: 16 },
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
  vehicleOption: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDE6F3',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
  },
  vehicleOptionActive: { borderColor: '#005BEA', backgroundColor: '#F2F7FF' },
  vehicleIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF2FF',
  },
  vehicleCopy: { flex: 1, minWidth: 0 },
  vehicleTitle: { color: '#071331', fontSize: 15, fontWeight: '900' },
  vehicleMeta: { color: '#526174', fontSize: 12, marginTop: 3, fontWeight: '700' },
  inputGroup: { gap: 6 },
  inputLabel: {
    color: '#526174',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  input: {
    minHeight: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDE6F3',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    color: '#071331',
    fontSize: 15,
    fontWeight: '700',
  },
  actions: { flexDirection: 'row', gap: 10 },
  actionButton: { flex: 1 },
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
  summaryValue: { color: '#071331', fontSize: 13, fontWeight: '900', flex: 1, textAlign: 'right' },
  profileCard: { gap: 16 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EAF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileTitleGroup: { flex: 1, minWidth: 0 },
  profileName: { color: '#071331', fontSize: 22, fontWeight: '900' },
  profileEmail: { color: '#526174', fontSize: 14, marginTop: 3 },
  infoList: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDE6F3',
    backgroundColor: '#F8FBFF',
    padding: 12,
    gap: 10,
  },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  infoLabel: { color: '#526174', fontSize: 13, fontWeight: '800' },
  infoValue: {
    color: '#071331',
    fontSize: 13,
    fontWeight: '900',
    flex: 1,
    textAlign: 'right',
  },
});
