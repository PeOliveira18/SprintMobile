import * as SecureStore from 'expo-secure-store';

import { DEFAULT_ONBOARDING } from '@/constants/onboarding';
import {
  AccountCredentials,
  AccountOnboarding,
  AccountProfile,
  CreateAccountPayload,
  StoredAccount,
} from '@/types/account';

const ACCOUNT_KEY = 'ford_one_local_account';
const SESSION_KEY = 'ford_one_active_profile';

export const accountStorage = {
  async getStoredAccount(): Promise<StoredAccount | null> {
    return readJson<StoredAccount>(ACCOUNT_KEY);
  },

  async getSessionProfile(): Promise<AccountProfile | null> {
    const profile = await readJson<AccountProfile>(SESSION_KEY);
    return profile ? normalizeProfile(profile) : null;
  },

  async register(payload: CreateAccountPayload): Promise<AccountProfile> {
    const normalizedEmail = normalizeEmail(payload.email);

    if (!payload.name.trim() || !normalizedEmail || !payload.password.trim()) {
      throw new Error('Informe nome, e-mail e senha para cadastrar.');
    }

    const account: StoredAccount = {
      id: String(Date.now()),
      name: payload.name.trim(),
      email: normalizedEmail,
      phone: payload.phone.trim(),
      document: payload.document.trim(),
      onboarding: payload.onboarding,
      password: payload.password.trim(),
      createdAt: new Date().toISOString(),
    };
    const profile = toProfile(account);

    await SecureStore.setItemAsync(ACCOUNT_KEY, JSON.stringify(account));
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(profile));

    return profile;
  },

  async login(credentials: AccountCredentials): Promise<AccountProfile> {
    const account = await this.getStoredAccount();
    const email = normalizeEmail(credentials.email);

    if (!account) {
      throw new Error('Nenhuma conta local foi cadastrada neste aparelho.');
    }

    if (account.email !== email || account.password !== credentials.password.trim()) {
      throw new Error('E-mail ou senha inválidos.');
    }

    const profile = toProfile(account);
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(profile));

    return profile;
  },

  async updateOnboarding(onboarding: AccountOnboarding): Promise<AccountProfile> {
    const [account, session] = await Promise.all([
      this.getStoredAccount(),
      this.getSessionProfile(),
    ]);

    if (!account || !session || account.id !== session.id) {
      throw new Error('Entre na sua conta para atualizar o perfil de uso.');
    }

    const updatedAccount: StoredAccount = { ...account, onboarding };
    const profile = toProfile(updatedAccount);

    await SecureStore.setItemAsync(ACCOUNT_KEY, JSON.stringify(updatedAccount));
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(profile));

    return profile;
  },

  async logout() {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  },
};

async function readJson<T>(key: string): Promise<T | null> {
  const value = await SecureStore.getItemAsync(key);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    await SecureStore.deleteItemAsync(key);
    return null;
  }
}

function toProfile(account: StoredAccount): AccountProfile {
  return normalizeProfile({
    id: account.id,
    name: account.name,
    email: account.email,
    phone: account.phone,
    document: account.document,
    onboarding: account.onboarding ?? DEFAULT_ONBOARDING,
    createdAt: account.createdAt,
  });
}

function normalizeProfile(profile: AccountProfile): AccountProfile {
  return {
    ...profile,
    onboarding: profile.onboarding ?? DEFAULT_ONBOARDING,
  };
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}
