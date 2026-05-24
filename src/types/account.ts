export type AccountOnboarding = {
  vehicle: string;
  objective: string;
  frequency: string;
  monthlyDistance: string;
  preference: string;
  contactChannel: string;
};

export type AccountProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  onboarding: AccountOnboarding;
  createdAt: string;
};

export type AccountCredentials = {
  email: string;
  password: string;
};

export type CreateAccountPayload = AccountCredentials & {
  name: string;
  phone: string;
  document: string;
  onboarding: AccountOnboarding;
};

export type StoredAccount = AccountProfile & {
  password: string;
};
