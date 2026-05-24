import AsyncStorage from '@react-native-async-storage/async-storage';

import { Campaign } from '@/types/customer';

const CAMPAIGNS_KEY = '@ford-retention:campaigns';

export const campaignStorage = {
  async findAll(): Promise<Campaign[]> {
    const value = await AsyncStorage.getItem(CAMPAIGNS_KEY);
    return value ? (JSON.parse(value) as Campaign[]) : [];
  },

  async save(campaigns: Campaign[]): Promise<void> {
    await AsyncStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(CAMPAIGNS_KEY);
  },
};
