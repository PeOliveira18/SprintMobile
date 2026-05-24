import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { EmptyState } from '@/components/EmptyState';
import { ErrorMessage } from '@/components/ErrorMessage';
import { FordOneHeader } from '@/components/FordOneHeader';
import { Loading } from '@/components/Loading';
import { StatusBadge } from '@/components/StatusBadge';
import { VehicleBanner } from '@/components/VehicleBanner';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useCustomers } from '@/hooks/useCustomers';
import { scheduleCampaignNotification } from '@/services/notificationService';
import { Campaign, CreateCampaignPayload } from '@/types/customer';

const CHANNELS: CreateCampaignPayload['channel'][] = ['WhatsApp', 'SMS', 'Email'];

export function CampaignScreen() {
  const { customerId } = useLocalSearchParams<{ customerId?: string }>();
  const parsedCustomerId = Number(customerId);
  const customersQuery = useCustomers();
  const campaignsHook = useCampaigns();
  const [selectedCustomerId, setSelectedCustomerId] = useState(
    Number.isFinite(parsedCustomerId) ? parsedCustomerId : 1,
  );
  const [channel, setChannel] = useState<CreateCampaignPayload['channel']>('WhatsApp');
  const [title, setTitle] = useState('Acao de retencao VIN Share');
  const [message, setMessage] = useState(
    'Identificamos um lead de retencao para trazer o veiculo de volta a rede oficial Ford.',
  );

  const selectedCustomer = useMemo(
    () => customersQuery.data?.find((customer) => customer.id === selectedCustomerId),
    [customersQuery.data, selectedCustomerId],
  );

  async function handleCreateCampaign() {
    if (!selectedCustomer) {
      Alert.alert('Validacao', 'Selecione um cliente antes de criar a campanha.');
      return;
    }

    if (!title.trim() || !message.trim()) {
      Alert.alert('Validacao', 'Informe titulo e mensagem da campanha.');
      return;
    }

    const campaign = await campaignsHook.createCampaign({
      customerId: selectedCustomer.id,
      channel,
      title: title.trim(),
      message: message.trim(),
    });

    if (campaign) {
      await scheduleCampaignNotification(campaign, selectedCustomer.name);
      Alert.alert('Lead salvo', `Acao de retencao salva para ${selectedCustomer.name}.`);
    }
  }

  if (customersQuery.isLoading || campaignsHook.loading) {
    return <Loading message="Preparando campanha..." />;
  }

  if (customersQuery.error) {
    return (
      <View style={styles.feedback}>
        <ErrorMessage
          message="Nao foi possivel carregar os clientes."
          onRetry={() => {
            void customersQuery.refetch();
          }}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <FordOneHeader
        title="Agendar servico"
        subtitle="Crie uma acao de pos-venda para manter o cliente conectado a Rede Ford."
      />

      {selectedCustomer ? <VehicleBanner customer={selectedCustomer} /> : null}

      <View style={styles.panel}>
        <View style={styles.panelHeader}>
          <View style={styles.panelTitleGroup}>
            <Text style={styles.panelEyebrow}>Ford ONE</Text>
            <Text style={styles.panelTitle}>Cliente selecionado</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <Text style={styles.backButtonText}>Voltar</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.customerRail}
        >
          {customersQuery.data?.map((customer) => (
            <Pressable
              key={customer.id}
              accessibilityRole="button"
              onPress={() => setSelectedCustomerId(customer.id)}
              style={[
                styles.customerChip,
                selectedCustomerId === customer.id && styles.customerChipActive,
              ]}
            >
              <Text
                style={[
                  styles.customerChipTitle,
                  selectedCustomerId === customer.id && styles.customerChipTitleActive,
                ]}
              >
                #{customer.id} {customer.name}
              </Text>
              <Text
                style={[
                  styles.customerChipSubtitle,
                  selectedCustomerId === customer.id && styles.customerChipSubtitleActive,
                ]}
              >
                {customer.leadType.replaceAll('_', ' ')} | {customer.leadPriority}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {selectedCustomer ? (
          <View style={styles.customerSummary}>
            <View style={styles.summaryTop}>
              <Text style={styles.summaryName} numberOfLines={1}>
                {selectedCustomer.name}
              </Text>
              <StatusBadge
                label={selectedCustomer.leadPriority}
                tone={
                  selectedCustomer.riskLevel === 'Baixo'
                    ? 'green'
                    : selectedCustomer.riskLevel === 'Medio'
                      ? 'yellow'
                      : 'red'
                }
              />
            </View>
            <Text style={styles.summaryText} numberOfLines={1}>
              {selectedCustomer.vehicle} | {selectedCustomer.dealership}
            </Text>
            <Text style={styles.summaryText} numberOfLines={2}>
              VIN {selectedCustomer.vin} | {selectedCustomer.leadType.replaceAll('_', ' ')}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Canal de contato</Text>
        <View style={styles.channelRow}>
          {CHANNELS.map((item) => (
            <Pressable
              key={item}
              accessibilityRole="button"
              onPress={() => setChannel(item)}
              style={[styles.channel, channel === item && styles.channelActive]}
            >
              <Text style={[styles.channelText, channel === item && styles.channelTextActive]}>
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.inputLabel}>Titulo</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Titulo do lead"
          style={styles.input}
        />

        <Text style={styles.inputLabel}>Mensagem</Text>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Mensagem para contato"
          multiline
          style={[styles.input, styles.textArea]}
          textAlignVertical="top"
        />

        {campaignsHook.error ? <Text style={styles.error}>{campaignsHook.error}</Text> : null}

        <ActionButton
          label={campaignsHook.saving ? 'Salvando...' : 'Criar lead'}
          disabled={campaignsHook.saving}
          onPress={() => {
            void handleCreateCampaign();
          }}
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Leads salvos</Text>
        {campaignsHook.campaigns.length > 0 ? (
          <ActionButton
            label="Limpar"
            onPress={() => {
              void campaignsHook.clearCampaigns();
            }}
            variant="danger"
            style={styles.clearButton}
          />
        ) : null}
      </View>

      {campaignsHook.campaigns.length === 0 ? (
        <EmptyState
          title="Nenhum lead local"
          description="Os leads criados aparecerao aqui mesmo apos reiniciar o app."
        />
      ) : (
        <View style={styles.list}>
          {campaignsHook.campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

function CampaignCard({ campaign }: { campaign: Campaign }) {
  return (
    <View style={styles.campaignCard}>
      <View style={styles.campaignHeader}>
        <Text style={styles.campaignTitle}>{campaign.title}</Text>
        <StatusBadge label={campaign.channel} tone="blue" />
      </View>
      <Text style={styles.campaignMessage}>{campaign.message}</Text>
      <Text style={styles.campaignMeta}>
        Cliente #{campaign.customerId} | Local #{campaign.id}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FC',
  },
  content: {
    padding: 16,
    paddingBottom: 36,
    gap: 16,
  },
  feedback: {
    flex: 1,
    backgroundColor: '#F5F8FC',
    padding: 18,
    justifyContent: 'center',
  },
  panel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D7DEE8',
    padding: 16,
    gap: 12,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  panelTitleGroup: {
    flex: 1,
    minWidth: 0,
  },
  panelEyebrow: {
    color: '#005BEA',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  panelTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '900',
  },
  backButton: {
    borderRadius: 999,
    backgroundColor: '#EEF5FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backButtonText: {
    color: '#005BEA',
    fontSize: 12,
    fontWeight: '900',
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  customerRail: {
    gap: 10,
    paddingRight: 8,
  },
  customerChip: {
    width: 210,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D7DEE8',
    padding: 12,
    gap: 4,
    backgroundColor: '#F8FAFC',
  },
  customerChipActive: {
    borderColor: '#005BEA',
    backgroundColor: '#EEF5FF',
  },
  customerChipTitle: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '900',
  },
  customerChipTitleActive: {
    color: '#005BEA',
  },
  customerChipSubtitle: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '700',
  },
  customerChipSubtitleActive: {
    color: '#12324A',
  },
  customerSummary: {
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    padding: 12,
    gap: 6,
  },
  summaryTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  summaryName: {
    flex: 1,
    minWidth: 0,
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '900',
  },
  summaryText: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 3,
  },
  channelRow: {
    flexDirection: 'row',
    gap: 8,
  },
  channel: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D7DEE8',
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  channelActive: {
    backgroundColor: '#005BEA',
    borderColor: '#005BEA',
  },
  channelText: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '900',
  },
  channelTextActive: {
    color: '#FFFFFF',
  },
  inputLabel: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#0F172A',
    fontSize: 15,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    minHeight: 120,
  },
  error: {
    color: '#B91C1C',
    fontWeight: '800',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  sectionTitle: {
    color: '#0F172A',
    fontSize: 21,
    fontWeight: '900',
  },
  clearButton: {
    minHeight: 42,
  },
  list: {
    gap: 12,
  },
  campaignCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D7DEE8',
    backgroundColor: '#FFFFFF',
    padding: 14,
    gap: 10,
  },
  campaignHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  campaignTitle: {
    flex: 1,
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '900',
  },
  campaignMessage: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 20,
  },
  campaignMeta: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '700',
  },
});
