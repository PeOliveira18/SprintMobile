export type CustomerSegment = 'Fiel' | 'Abandono' | 'Esquecido' | 'Economico';

export type RiskLevel = 'Baixo' | 'Medio' | 'Alto' | 'Critico';

export type ServiceStatus = 'Agendado' | 'Concluido' | 'Pendente' | 'Atrasado';

export type SensorStatus = 'Normal' | 'Atencao' | 'Critico';

export type LeadType =
  | 'REVISAO_ATRASADA'
  | 'GARANTIA_PROXIMA'
  | 'RETENCAO_POS_VENDA'
  | 'OFERTA_PERSONALIZADA';

export type LeadPriority = 'BAIXA' | 'MEDIA' | 'ALTA';

export type LeadStatus = 'ABERTO' | 'EM_CONTATO' | 'CONVERTIDO' | 'PERDIDO' | 'CANCELADO';

export type FordVehicleProfile = {
  id: number;
  name: string;
  email: string;
  phone: string;
  document: string;
  city: string;
  state: string;
  dealershipCode: string;
  dealership: string;
  model: string;
  modelYear: number;
  vin: string;
  purchaseDate: string;
  mileageKm: number;
  warrantyActive: boolean;
  networkServiceCount: number;
  completedServiceRevenue: number;
  segment: CustomerSegment;
  lastServiceDays: number;
  nextServiceKm: number;
};

export type NhtsaRecall = {
  Manufacturer: string;
  NHTSACampaignNumber: string;
  ReportReceivedDate: string;
  Component: string;
  Summary: string;
  Consequence: string;
  Remedy: string;
  Notes?: string | null;
  ModelYear?: string;
  Make?: string;
  Model?: string;
  parkIt?: boolean;
  parkOutSide?: boolean;
};

export type NhtsaRecallsResponse = {
  Count: number;
  Message: string;
  results?: NhtsaRecall[];
  Results?: NhtsaRecall[];
};

export type FordRecallSummary = {
  campaignNumber: string;
  component: string;
  reportReceivedDate: string;
  summary: string;
  consequence: string;
  remedy: string;
};

export type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  document: string;
  city: string;
  state: string;
  dealershipCode: string;
  dealership: string;
  vehicle: string;
  modelYear: number;
  vin: string;
  purchaseDate: string;
  mileageKm: number;
  warrantyActive: boolean;
  networkServiceCount: number;
  completedServiceRevenue: number;
  hasServiceInNetwork: boolean;
  leadType: LeadType;
  leadPriority: LeadPriority;
  leadStatus: LeadStatus;
  segment: CustomerSegment;
  riskLevel: RiskLevel;
  retentionScore: number;
  churnProbability: number;
  lastServiceDays: number;
  nextServiceKm: number;
  recallCount: number;
  criticalRecallCount: number;
  latestRecall?: FordRecallSummary;
  recommendedAction: string;
  insight: string;
};

export type ServiceOrder = {
  id: number;
  customerId: number;
  title: string;
  description: string;
  status: ServiceStatus;
  amount: number;
  scheduledAt: string;
};

export type IoTSnapshot = {
  id: number;
  customerId: number;
  vehicle: string;
  odometerKm: number;
  batteryPercent: number;
  tirePressurePsi: number;
  oilLifePercent: number;
  status: SensorStatus;
  alert: string;
  lastSync: string;
};

export type CreateCampaignPayload = {
  customerId: number;
  channel: 'WhatsApp' | 'SMS' | 'Email';
  title: string;
  message: string;
};

export type Campaign = CreateCampaignPayload & {
  id: number;
  createdAt: string;
};
