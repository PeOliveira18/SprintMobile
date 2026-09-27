import { Ionicons } from '@expo/vector-icons';

import { AccountOnboarding } from '@/types/account';

type IconName = keyof typeof Ionicons.glyphMap;

export const ONBOARDING_STEPS = [
  'Veículo',
  'Perfil de uso',
  'Preferências',
  'Contato',
  'Confirmação',
] as const;

export const VEHICLE_OPTIONS = [
  { label: 'Ford Territory Titanium 2022', meta: 'ABC1D23 · 58.200 km', model: 'Territory' },
  { label: 'Ford Ranger XLS 2023', meta: 'BRA2E19 · 31.000 km', model: 'Ranger' },
] as const;

export const OBJECTIVE_OPTIONS: { label: string; icon: IconName; description: string }[] = [
  { label: 'Trabalho', icon: 'briefcase-outline', description: 'Uso diário para negócios' },
  { label: 'Família', icon: 'people-outline', description: 'Transporte da rotina' },
  { label: 'Lazer', icon: 'trail-sign-outline', description: 'Viagens e passeios' },
  { label: 'Esportivo', icon: 'barbell-outline', description: 'Performance e prazer' },
  { label: 'Outros', icon: 'ellipsis-horizontal-outline', description: 'Outro tipo de uso principal' },
];

export const FREQUENCY_OPTIONS = [
  'Diariamente',
  '4 a 6 vezes por semana',
  '1 a 3 vezes por semana',
  'Quinzenalmente',
  'Raramente',
];

export const DISTANCE_OPTIONS = [
  'Até 500 km',
  '501 a 1.000 km',
  '1.001 a 2.000 km',
  '2.001 a 3.000 km',
  'Mais de 3.000 km',
];

export const PREFERENCE_OPTIONS = ['Conforto', 'Tecnologia', 'Economia', 'Segurança', 'Performance'];

export const CONTACT_OPTIONS = ['WhatsApp', 'SMS', 'E-mail', 'Telefone'];

export const DEFAULT_ONBOARDING: AccountOnboarding = {
  vehicle: VEHICLE_OPTIONS[0].label,
  objective: 'Lazer',
  frequency: '1 a 3 vezes por semana',
  monthlyDistance: '1.001 a 2.000 km',
  preference: 'Tecnologia',
  contactChannel: 'WhatsApp',
};

export function getVehicleOption(label: string) {
  return VEHICLE_OPTIONS.find((option) => option.label === label) ?? VEHICLE_OPTIONS[0];
}

export function onboardingSummaryRows(onboarding: AccountOnboarding) {
  return [
    { label: 'Veículo', value: onboarding.vehicle },
    { label: 'Uso', value: onboarding.objective },
    { label: 'Frequência', value: onboarding.frequency },
    { label: 'Distância', value: onboarding.monthlyDistance },
    { label: 'Preferência', value: onboarding.preference },
    { label: 'Contato', value: onboarding.contactChannel },
  ];
}
