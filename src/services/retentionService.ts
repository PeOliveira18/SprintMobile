import { api } from '@/services/api';
import {
  Campaign,
  CreateCampaignPayload,
  Customer,
  FordRecallSummary,
  FordVehicleProfile,
  IoTSnapshot,
  NhtsaRecallsResponse,
  ServiceOrder,
  ServiceStatus,
} from '@/types/customer';
import {
  buildFallbackServiceOrders,
  buildTelemetrySnapshots,
  FORD_CUSTOMERS,
  mapNhtsaRecall,
  mapProfileToCustomer,
} from '@/mocks/retention';

export const retentionService = {
  async findCustomers(): Promise<Customer[]> {
    const customers = await Promise.all(
      FORD_CUSTOMERS.map(async (profile) => {
        const recalls = await findRecallsByProfile(profile);
        return mapProfileToCustomer(profile, recalls);
      }),
    );

    return customers;
  },

  async findCustomerById(id: number): Promise<Customer> {
    const profile = getProfileById(id);
    const recalls = await findRecallsByProfile(profile);
    return mapProfileToCustomer(profile, recalls);
  },

  async findServiceOrders(customerId: number): Promise<ServiceOrder[]> {
    const profile = getProfileById(customerId);
    const recalls = await findRecallsByProfile(profile);
    const recallOrders = recalls.slice(0, 5).map((recall, index) =>
      mapRecallToServiceOrder(recall, profile, index),
    );

    return recallOrders.length > 0
      ? recallOrders
      : buildFallbackServiceOrders(profile.id, profile.model);
  },

  async findTelemetry(): Promise<IoTSnapshot[]> {
    return buildTelemetrySnapshots();
  },

  async createCampaign(payload: CreateCampaignPayload): Promise<Campaign> {
    return {
      ...payload,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
  },
};

async function findRecallsByProfile(profile: FordVehicleProfile): Promise<FordRecallSummary[]> {
  try {
    const response = await api.get<NhtsaRecallsResponse>('/recalls/recallsByVehicle', {
      params: {
        make: 'Ford',
        model: profile.model,
        modelYear: profile.modelYear,
      },
    });

    const results = response.data.results ?? response.data.Results ?? [];
    return results.map(mapNhtsaRecall);
  } catch {
    return [];
  }
}

function getProfileById(id: number) {
  const profile = FORD_CUSTOMERS.find((customer) => customer.id === id);

  if (!profile) {
    throw new Error('Cliente Ford nao encontrado.');
  }

  return profile;
}

function mapRecallToServiceOrder(
  recall: FordRecallSummary,
  profile: FordVehicleProfile,
  index: number,
): ServiceOrder {
  return {
    id: profile.id * 1000 + index,
    customerId: profile.id,
    title: `${recall.component} | Campanha ${recall.campaignNumber}`,
    description: `${recall.summary}\n\nCorrecao indicada: ${recall.remedy}`,
    status: getStatus(index, recall),
    amount: 0,
    scheduledAt: normalizeDate(recall.reportReceivedDate),
  };
}

function getStatus(index: number, recall: FordRecallSummary): ServiceStatus {
  const text = `${recall.component} ${recall.consequence}`.toLowerCase();

  if (text.includes('fire') || text.includes('brake') || text.includes('fuel')) {
    return 'Atrasado';
  }

  if (index === 0) {
    return 'Pendente';
  }

  return index % 2 === 0 ? 'Agendado' : 'Concluido';
}

function normalizeDate(value: string) {
  if (!value) {
    return '2026-05-24';
  }

  const [day, month, year] = value.split('/');

  if (!month || !day || !year) {
    return value;
  }

  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}
