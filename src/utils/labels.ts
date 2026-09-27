import { Tone } from '@/theme';
import {
  CreateCampaignPayload,
  LeadPriority,
  LeadStatus,
  LeadType,
  RiskLevel,
  SensorStatus,
  ServiceStatus,
} from '@/types/customer';
import { WeatherInsight } from '@/types/weather';

const LEAD_TYPE_LABELS: Record<LeadType, string> = {
  REVISAO_ATRASADA: 'Revisão atrasada',
  GARANTIA_PROXIMA: 'Garantia próxima do fim',
  RETENCAO_POS_VENDA: 'Retenção pós-venda',
  OFERTA_PERSONALIZADA: 'Oferta personalizada',
};

const LEAD_PRIORITY_LABELS: Record<LeadPriority, string> = {
  ALTA: 'Alta',
  MEDIA: 'Média',
  BAIXA: 'Baixa',
};

const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  ABERTO: 'Aberto',
  EM_CONTATO: 'Em contato',
  CONVERTIDO: 'Convertido',
  PERDIDO: 'Perdido',
  CANCELADO: 'Cancelado',
};

const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  Baixo: 'Baixo',
  Medio: 'Médio',
  Alto: 'Alto',
  Critico: 'Crítico',
};

const SENSOR_STATUS_LABELS: Record<SensorStatus, string> = {
  Normal: 'Normal',
  Atencao: 'Atenção',
  Critico: 'Crítico',
};

const SERVICE_STATUS_LABELS: Record<ServiceStatus, string> = {
  Agendado: 'Agendado',
  Concluido: 'Concluído',
  Pendente: 'Pendente',
  Atrasado: 'Atrasado',
};

const CHANNEL_LABELS: Record<CreateCampaignPayload['channel'], string> = {
  WhatsApp: 'WhatsApp',
  SMS: 'SMS',
  Email: 'E-mail',
};

export const leadTypeLabel = (value: LeadType) => LEAD_TYPE_LABELS[value];
export const leadPriorityLabel = (value: LeadPriority) => LEAD_PRIORITY_LABELS[value];
export const leadStatusLabel = (value: LeadStatus) => LEAD_STATUS_LABELS[value];
export const riskLevelLabel = (value: RiskLevel) => RISK_LEVEL_LABELS[value];
export const sensorStatusLabel = (value: SensorStatus) => SENSOR_STATUS_LABELS[value];
export const serviceStatusLabel = (value: ServiceStatus) => SERVICE_STATUS_LABELS[value];
export const channelLabel = (value: CreateCampaignPayload['channel']) => CHANNEL_LABELS[value];
export const severityLabel = (value: WeatherInsight['severity']) => SENSOR_STATUS_LABELS[value];

type AlertTone = Extract<Tone, 'red' | 'yellow' | 'green'>;

export function riskTone(riskLevel: RiskLevel): AlertTone {
  if (riskLevel === 'Critico' || riskLevel === 'Alto') {
    return 'red';
  }

  return riskLevel === 'Medio' ? 'yellow' : 'green';
}

export function serviceStatusTone(status: ServiceStatus): Exclude<Tone, 'gray'> {
  if (status === 'Atrasado') {
    return 'red';
  }

  if (status === 'Pendente') {
    return 'yellow';
  }

  return status === 'Agendado' ? 'blue' : 'green';
}

export function sensorTone(status: SensorStatus | WeatherInsight['severity']): AlertTone {
  if (status === 'Critico') {
    return 'red';
  }

  return status === 'Atencao' ? 'yellow' : 'green';
}
