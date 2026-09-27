import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { EmptyState } from '@/components/EmptyState';
import { ErrorMessage } from '@/components/ErrorMessage';
import { FordOneHeader } from '@/components/FordOneHeader';
import { Loading } from '@/components/Loading';
import { OneCard } from '@/components/OneCard';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { TextField } from '@/components/TextField';
import { CustomerVehicleBanner } from '@/components/VehicleBanner';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useCustomers } from '@/hooks/useCustomers';
import { scheduleCampaignNotification } from '@/services/notificationService';
import { colors, radius, spacing, typography } from '@/theme';
import { Campaign, CreateCampaignPayload, Customer } from '@/types/customer';
import { formatDateTime } from '@/utils/format';
import { channelLabel, leadPriorityLabel, leadTypeLabel, riskTone } from '@/utils/labels';

const CHANNELS: CreateCampaignPayload['channel'][] = ['WhatsApp', 'SMS', 'Email'];
const CHIP_WIDTH = 200;
const CHIP_GAP = 10;
const DEFAULT_TITLE = 'Ação de retenção VIN Share';
const DEFAULT_MESSAGE =
  'Identificamos uma oportunidade para trazer o seu Ford de volta à Rede oficial, com peças originais e técnicos especializados.';

export function CampaignScreen() {
  const params = useLocalSearchParams<{ customerId?: string; title?: string }>();
  const customersQuery = useCustomers();
  const campaignsHook = useCampaigns();
  const [selectedCustomerId, setSelectedCustomerId] = useState(parseCustomerId(params.customerId));
  const [channel, setChannel] = useState<CreateCampaignPayload['channel']>('WhatsApp');
  const [title, setTitle] = useState(params.title ?? DEFAULT_TITLE);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [errors, setErrors] = useState<{ title?: string; message?: string }>({});
  const railRef = useRef<ScrollView>(null);

  useEffect(() => {
    setSelectedCustomerId(parseCustomerId(params.customerId));
    setTitle(params.title ?? DEFAULT_TITLE);
  }, [params.customerId, params.title]);

  const customers = useMemo(() => customersQuery.data ?? [], [customersQuery.data]);
  const selectedCustomer = useMemo(
    () => customers.find((customer) => customer.id === selectedCustomerId),
    [customers, selectedCustomerId],
  );

  const scrollRailToSelected = useCallback(() => {
    const index = customers.findIndex((customer) => customer.id === selectedCustomerId);
    railRef.current?.scrollTo({ x: Math.max(0, index) * (CHIP_WIDTH + CHIP_GAP), animated: true });
  }, [customers, selectedCustomerId]);

  useEffect(() => {
    scrollRailToSelected();
  }, [scrollRailToSelected]);

  async function handleCreateCampaign() {
    const nextErrors = {
      title: title.trim() ? undefined : 'Informe o título do lead.',
      message: message.trim() ? undefined : 'Informe a mensagem para o cliente.',
    };
    setErrors(nextErrors);

    if (!selectedCustomer) {
      Alert.alert('Selecione um cliente', 'Escolha o cliente antes de criar o lead.');
      return;
    }

    if (nextErrors.title || nextErrors.message) {
      return;
    }

    const campaign = await campaignsHook.createCampaign({
      customerId: selectedCustomer.id,
      channel,
      title: title.trim(),
      message: message.trim(),
    });

    if (campaign) {
      const notified = await scheduleCampaignNotification(campaign, selectedCustomer.name);
      Alert.alert(
        'Lead salvo',
        `Ação de retenção salva para ${selectedCustomer.name}.${
          notified ? '' : '\n\nAtive as notificações do app para receber o alerta do lead.'
        }`,
      );
    }
  }

  function handleClear() {
    Alert.alert('Limpar leads', 'Remover todos os leads salvos neste aparelho?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () => {
          void campaignsHook.clearCampaigns();
        },
      },
    ]);
  }

  if (customersQuery.isLoading || campaignsHook.loading) {
    return <Loading fullScreen message="Preparando leads..." />;
  }

  if (customersQuery.error) {
    return (
      <ErrorMessage
        fullScreen
        message="Não foi possível carregar os clientes."
        onRetry={() => {
          void customersQuery.refetch();
        }}
      />
    );
  }

  return (
    <Screen>
      <FordOneHeader
        back
        minimal
        title="Leads de retenção"
        subtitle="Crie uma ação de pós-venda para manter o cliente conectado à Rede Ford."
      />

      {selectedCustomer ? <CustomerVehicleBanner customer={selectedCustomer} /> : null}

      <OneCard>
        <Text style={styles.eyebrow}>Passo 1</Text>
        <Text style={typography.cardTitle}>Selecione o cliente</Text>
        <ScrollView
          ref={railRef}
          horizontal
          onContentSizeChange={scrollRailToSelected}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.customerRail}
        >
          {customers.map((customer) => (
            <CustomerChip
              key={customer.id}
              customer={customer}
              selected={selectedCustomerId === customer.id}
              onPress={() => setSelectedCustomerId(customer.id)}
            />
          ))}
        </ScrollView>

        {selectedCustomer ? (
          <View style={styles.customerSummary}>
            <View style={styles.summaryTop}>
              <Text style={styles.summaryName} numberOfLines={1}>
                {selectedCustomer.name}
              </Text>
              <StatusBadge
                label={`Prioridade ${leadPriorityLabel(selectedCustomer.leadPriority).toLowerCase()}`}
                tone={riskTone(selectedCustomer.riskLevel)}
              />
            </View>
            <Text style={styles.summaryText}>
              {selectedCustomer.vehicle} · {selectedCustomer.dealership}
            </Text>
            <Text style={styles.summaryText}>{leadTypeLabel(selectedCustomer.leadType)}</Text>
          </View>
        ) : null}
      </OneCard>

      <OneCard>
        <Text style={styles.eyebrow}>Passo 2</Text>
        <Text style={typography.cardTitle}>Canal e mensagem</Text>
        <View style={styles.channelRow} accessibilityRole="radiogroup">
          {CHANNELS.map((item) => {
            const active = channel === item;
            return (
              <Pressable
                key={item}
                accessibilityRole="radio"
                accessibilityState={{ checked: active }}
                onPress={() => setChannel(item)}
                style={[styles.channel, active && styles.channelActive]}
              >
                <Text style={[styles.channelText, active && styles.channelTextActive]}>
                  {channelLabel(item)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <TextField
          label="Título"
          value={title}
          onChangeText={(value) => {
            setTitle(value);
            setErrors((current) => ({ ...current, title: undefined }));
          }}
          placeholder="Título do lead"
          error={errors.title}
          maxLength={80}
        />
        <TextField
          label="Mensagem"
          value={message}
          onChangeText={(value) => {
            setMessage(value);
            setErrors((current) => ({ ...current, message: undefined }));
          }}
          placeholder="Mensagem para o cliente"
          error={errors.message}
          multiline
          maxLength={400}
        />

        {campaignsHook.error ? <Text style={styles.error}>{campaignsHook.error}</Text> : null}

        <ActionButton
          label={campaignsHook.saving ? 'Salvando...' : 'Criar lead e notificar'}
          icon="send-outline"
          disabled={campaignsHook.saving}
          onPress={() => {
            void handleCreateCampaign();
          }}
        />
      </OneCard>

      <SectionHeader
        title="Leads salvos"
        description="Armazenados no aparelho com AsyncStorage."
        action={
          campaignsHook.campaigns.length > 0 ? (
            <ActionButton label="Limpar" icon="trash-outline" variant="danger" compact onPress={handleClear} />
          ) : undefined
        }
      />

      {campaignsHook.campaigns.length === 0 ? (
        <EmptyState
          title="Nenhum lead salvo"
          description="Os leads criados aparecem aqui e continuam salvos mesmo após reiniciar o app."
        />
      ) : (
        <View style={styles.list}>
          {campaignsHook.campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              customerName={customers.find((item) => item.id === campaign.customerId)?.name}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}

function CustomerChip({
  customer,
  selected,
  onPress,
}: {
  customer: Customer;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[styles.customerChip, selected && styles.customerChipActive]}
    >
      <Text style={[styles.customerChipTitle, selected && styles.customerChipTitleActive]} numberOfLines={1}>
        {customer.name}
      </Text>
      <Text style={styles.customerChipSubtitle} numberOfLines={1}>
        {customer.vehicle} · {leadPriorityLabel(customer.leadPriority)}
      </Text>
    </Pressable>
  );
}

function CampaignCard({ campaign, customerName }: { campaign: Campaign; customerName?: string }) {
  return (
    <OneCard>
      <View style={styles.campaignHeader}>
        <Text style={[typography.cardTitle, styles.flex]}>{campaign.title}</Text>
        <StatusBadge label={channelLabel(campaign.channel)} tone="blue" />
      </View>
      <Text style={typography.body}>{campaign.message}</Text>
      <Text style={styles.campaignMeta}>
        {customerName ?? `Cliente #${campaign.customerId}`} · criado em{' '}
        {formatDateTime(toLocalIso(campaign.createdAt))}
      </Text>
    </OneCard>
  );
}

function parseCustomerId(value?: string) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

function toLocalIso(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
}

const styles = StyleSheet.create({
  eyebrow: {
    ...typography.overline,
    color: colors.primary,
    marginBottom: -8,
  },
  customerRail: {
    gap: CHIP_GAP,
    paddingRight: spacing.sm,
  },
  customerChip: {
    width: CHIP_WIDTH,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
    backgroundColor: colors.surfaceMuted,
  },
  customerChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  customerChipTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
  },
  customerChipTitleActive: {
    color: colors.primary,
  },
  customerChipSubtitle: {
    ...typography.caption,
  },
  customerSummary: {
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    padding: spacing.md,
    gap: spacing.xs,
  },
  summaryTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  summaryName: {
    ...typography.cardTitle,
    flex: 1,
    minWidth: 0,
  },
  summaryText: {
    ...typography.caption,
    fontSize: 13,
    color: colors.textSecondary,
  },
  channelRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  channel: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
  },
  channelActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  channelText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '900',
  },
  channelTextActive: {
    color: colors.textInverse,
  },
  error: {
    color: colors.danger,
    fontWeight: '800',
  },
  list: {
    gap: spacing.md,
  },
  campaignHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  flex: {
    flex: 1,
  },
  campaignMeta: {
    ...typography.caption,
  },
});
