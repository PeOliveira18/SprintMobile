import {
  Customer,
  FordRecallSummary,
  FordVehicleProfile,
  IoTSnapshot,
  NhtsaRecall,
  RiskLevel,
  SensorStatus,
} from '@/types/customer';

export const FORD_CUSTOMERS: FordVehicleProfile[] = [
  {
    id: 1,
    name: 'Mariana Alves',
    email: 'mariana.alves@email.com',
    phone: '(11) 98888-7777',
    document: '12345678901',
    city: 'São Paulo',
    state: 'SP',
    dealershipCode: 'SP001',
    dealership: 'Ford Center Paulista',
    model: 'Ranger',
    modelYear: 2023,
    vin: '9BFZH55L9P8123456',
    purchaseDate: '2023-05-20',
    mileageKm: 28000,
    warrantyActive: true,
    networkServiceCount: 2,
    completedServiceRevenue: 1310,
    segment: 'Fiel',
    lastServiceDays: 58,
    nextServiceKm: 6000,
  },
  {
    id: 2,
    name: 'Bruno Costa',
    email: 'bruno.costa@email.com',
    phone: '(21) 97777-6666',
    document: '98765432100',
    city: 'Rio de Janeiro',
    state: 'RJ',
    dealershipCode: 'RJ001',
    dealership: 'Ford Barra Service',
    model: 'Territory',
    modelYear: 2022,
    vin: '8AFAR23L7N8765432',
    purchaseDate: '2022-03-15',
    mileageKm: 42000,
    warrantyActive: false,
    networkServiceCount: 0,
    completedServiceRevenue: 0,
    segment: 'Abandono',
    lastServiceDays: 220,
    nextServiceKm: 2000,
  },
  {
    id: 3,
    name: 'Camila Rocha',
    email: 'camila.rocha@email.com',
    phone: '(41) 96666-5555',
    document: '45678912300',
    city: 'Curitiba',
    state: 'PR',
    dealershipCode: 'PR001',
    dealership: 'Ford Curitiba Norte',
    model: 'Maverick',
    modelYear: 2024,
    vin: '9BFBR55L6R7654321',
    purchaseDate: '2024-08-10',
    mileageKm: 9500,
    warrantyActive: true,
    networkServiceCount: 1,
    completedServiceRevenue: 760,
    segment: 'Fiel',
    lastServiceDays: 44,
    nextServiceKm: 8200,
  },
  {
    id: 4,
    name: 'Lucas Pereira',
    email: 'lucas.pereira@email.com',
    phone: '(41) 96664-0404',
    document: '32165498700',
    city: 'Curitiba',
    state: 'PR',
    dealershipCode: 'PR001',
    dealership: 'Ford Center Curitiba',
    model: 'Maverick',
    modelYear: 2022,
    vin: '9BFBR55L6N1122334',
    purchaseDate: '2022-11-08',
    mileageKm: 36500,
    warrantyActive: false,
    networkServiceCount: 1,
    completedServiceRevenue: 540,
    segment: 'Economico',
    lastServiceDays: 89,
    nextServiceKm: 6100,
  },
  {
    id: 5,
    name: 'Beatriz Lima',
    email: 'beatriz.lima@email.com',
    phone: '(51) 93335-0505',
    document: '74185296300',
    city: 'Porto Alegre',
    state: 'RS',
    dealershipCode: 'RS001',
    dealership: 'Ford Superauto POA',
    model: 'Explorer',
    modelYear: 2020,
    vin: '9BFEXPL20L4455667',
    purchaseDate: '2020-09-14',
    mileageKm: 71000,
    warrantyActive: false,
    networkServiceCount: 0,
    completedServiceRevenue: 0,
    segment: 'Abandono',
    lastServiceDays: 176,
    nextServiceKm: 3500,
  },
  {
    id: 6,
    name: 'Diego Martins',
    email: 'diego.martins@email.com',
    phone: '(85) 98886-0606',
    document: '85296374100',
    city: 'Fortaleza',
    state: 'CE',
    dealershipCode: 'CE001',
    dealership: 'Ford Crasa Fortaleza',
    model: 'Ranger',
    modelYear: 2023,
    vin: '9BFRNG23P9988776',
    purchaseDate: '2023-01-22',
    mileageKm: 31000,
    warrantyActive: true,
    networkServiceCount: 1,
    completedServiceRevenue: 890,
    segment: 'Fiel',
    lastServiceDays: 31,
    nextServiceKm: 9600,
  },
];

export function mapProfileToCustomer(
  profile: FordVehicleProfile,
  recalls: FordRecallSummary[],
): Customer {
  const criticalRecallCount = recalls.filter(isCriticalRecall).length;
  const riskLevel = getRiskLevel(profile, recalls.length, criticalRecallCount);
  const churnProbability = getChurnProbability(
    profile.lastServiceDays,
    profile.segment,
    recalls.length,
    criticalRecallCount,
  );
  const retentionScore = Math.max(5, 100 - churnProbability);

  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    document: profile.document,
    city: profile.city,
    state: profile.state,
    dealershipCode: profile.dealershipCode,
    dealership: profile.dealership,
    vehicle: `Ford ${profile.model}`,
    modelYear: profile.modelYear,
    vin: profile.vin,
    purchaseDate: profile.purchaseDate,
    mileageKm: profile.mileageKm,
    warrantyActive: profile.warrantyActive,
    networkServiceCount: profile.networkServiceCount,
    completedServiceRevenue: profile.completedServiceRevenue,
    hasServiceInNetwork: profile.networkServiceCount > 0,
    leadType: getLeadType(profile, recalls.length, criticalRecallCount),
    leadPriority: getLeadPriority(riskLevel),
    leadStatus: profile.networkServiceCount > 0 && riskLevel === 'Baixo' ? 'CONVERTIDO' : 'ABERTO',
    segment: profile.segment,
    riskLevel,
    retentionScore,
    churnProbability,
    lastServiceDays: profile.lastServiceDays,
    nextServiceKm: profile.nextServiceKm,
    recallCount: recalls.length,
    criticalRecallCount,
    latestRecall: recalls[0],
    recommendedAction: getRecommendedAction(profile, recalls.length, criticalRecallCount),
    insight: getCustomerInsight(profile, recalls.length, criticalRecallCount),
  };
}

export function mapNhtsaRecall(recall: NhtsaRecall): FordRecallSummary {
  return {
    campaignNumber: recall.NHTSACampaignNumber,
    component: recall.Component,
    reportReceivedDate: recall.ReportReceivedDate,
    summary: recall.Summary,
    consequence: recall.Consequence,
    remedy: recall.Remedy,
  };
}

export function buildFallbackServiceOrders(customerId: number, model: string) {
  return [
    {
      id: customerId * 100 + 1,
      customerId,
      title: `Revisão preventiva Ford ${model}`,
      description:
        'Checklist de freios, bateria, pneus, fluidos e atualizações recomendadas pela concessionária.',
      status: 'Agendado' as const,
      amount: 590,
      scheduledAt: daysFromNow(7),
    },
  ];
}

export function buildTelemetrySnapshots(): IoTSnapshot[] {
  return FORD_CUSTOMERS.map((profile) => {
    const batteryPercent = Math.max(36, 82 - profile.lastServiceDays / 4);
    const tirePressurePsi = profile.segment === 'Esquecido' ? 28 : 33 - (profile.id % 3);
    const oilLifePercent = Math.max(16, 76 - profile.lastServiceDays / 3);
    const status = getSensorStatus(batteryPercent, tirePressurePsi, oilLifePercent);

    return {
      id: profile.id,
      customerId: profile.id,
      vehicle: `Ford ${profile.model}`,
      odometerKm: 18000 + profile.id * 5900,
      batteryPercent: Math.round(batteryPercent),
      tirePressurePsi,
      oilLifePercent: Math.round(oilLifePercent),
      status,
      alert: getSensorAlert(status),
      lastSync: new Date(Date.now() - profile.id * 7 * 60 * 1000).toISOString(),
    };
  });
}

function isCriticalRecall(recall: FordRecallSummary) {
  const text = `${recall.component} ${recall.summary} ${recall.consequence}`.toLowerCase();
  return (
    text.includes('fire') ||
    text.includes('brake') ||
    text.includes('air bag') ||
    text.includes('seat belt') ||
    text.includes('fuel') ||
    text.includes('engine')
  );
}

function getRiskLevel(
  profile: FordVehicleProfile,
  recallCount: number,
  criticalRecallCount: number,
): RiskLevel {
  if (!profile.networkServiceCount || criticalRecallCount > 0 || profile.lastServiceDays > 180) {
    return 'Critico';
  }

  if (recallCount >= 2 || profile.lastServiceDays > 120 || profile.segment === 'Abandono') {
    return 'Alto';
  }

  if (recallCount === 1 || profile.segment === 'Economico') {
    return 'Medio';
  }

  return 'Baixo';
}

function getChurnProbability(
  lastServiceDays: number,
  segment: FordVehicleProfile['segment'],
  recallCount: number,
  criticalRecallCount: number,
) {
  const segmentWeight = {
    Fiel: 10,
    Economico: 26,
    Esquecido: 38,
    Abandono: 48,
  }[segment];

  const serviceDelayWeight = Math.min(30, Math.round(lastServiceDays / 8));
  const recallWeight = Math.min(20, recallCount * 4 + criticalRecallCount * 8);

  return Math.min(95, segmentWeight + serviceDelayWeight + recallWeight);
}

function getLeadType(
  profile: FordVehicleProfile,
  recallCount: number,
  criticalRecallCount: number,
) {
  if (criticalRecallCount > 0 || recallCount > 0) {
    return 'RETENCAO_POS_VENDA' as const;
  }

  if (!profile.warrantyActive) {
    return 'GARANTIA_PROXIMA' as const;
  }

  if (profile.lastServiceDays > 180 || profile.networkServiceCount === 0) {
    return 'REVISAO_ATRASADA' as const;
  }

  return 'OFERTA_PERSONALIZADA' as const;
}

function getLeadPriority(riskLevel: RiskLevel) {
  if (riskLevel === 'Critico' || riskLevel === 'Alto') {
    return 'ALTA' as const;
  }

  if (riskLevel === 'Medio') {
    return 'MEDIA' as const;
  }

  return 'BAIXA' as const;
}

function getRecommendedAction(
  profile: FordVehicleProfile,
  recallCount: number,
  criticalRecallCount: number,
) {
  if (criticalRecallCount > 0) {
    return 'Contato ativo com prioridade máxima para campanha de recall e agendamento assistido.';
  }

  if (recallCount > 0) {
    return 'Enviar campanha de serviço com explicação do recall e horários disponíveis.';
  }

  if (profile.segment === 'Abandono') {
    return 'Oferta de retorno com diagnóstico gratuito e contato consultivo.';
  }

  if (profile.segment === 'Esquecido') {
    return 'Lembrete ativo com janela de agendamento e benefício de revisão.';
  }

  if (profile.segment === 'Economico') {
    return 'Cupom de manutenção e pacote com preço fechado.';
  }

  return 'Programa de benefícios e convite para revisão preventiva.';
}

function getCustomerInsight(
  profile: FordVehicleProfile,
  recallCount: number,
  criticalRecallCount: number,
) {
  if (criticalRecallCount > 0) {
    return `A API da NHTSA indica recall crítico para o Ford ${profile.model} ${profile.modelYear}.`;
  }

  if (recallCount > 0) {
    return `A API da NHTSA retornou ${recallCount} recall(s) para o Ford ${profile.model} ${profile.modelYear}.`;
  }

  if (profile.segment === 'Abandono') {
    return 'Cliente tende a sair da rede após a primeira revisão.';
  }

  if (profile.segment === 'Esquecido') {
    return 'Cliente perde o timing de manutenção e retorna tarde demais.';
  }

  if (profile.segment === 'Economico') {
    return 'Cliente responde melhor a condições comerciais claras.';
  }

  return 'Cliente mantém relacionamento consistente com a rede oficial.';
}

function getSensorStatus(
  batteryPercent: number,
  tirePressurePsi: number,
  oilLifePercent: number,
): SensorStatus {
  if (batteryPercent < 45 || tirePressurePsi < 29 || oilLifePercent < 25) {
    return 'Critico';
  }

  if (batteryPercent < 58 || tirePressurePsi < 32 || oilLifePercent < 40) {
    return 'Atencao';
  }

  return 'Normal';
}

function getSensorAlert(status: SensorStatus) {
  if (status === 'Critico') {
    return 'Acionar concessionária antes da próxima revisão.';
  }

  if (status === 'Atencao') {
    return 'Enviar lembrete preventivo com sugestão de horário.';
  }

  return 'Veículo dentro do padrão esperado.';
}

function daysFromNow(days: number) {
  const date = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  return date.toISOString().slice(0, 10);
}
