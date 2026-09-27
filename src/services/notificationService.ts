import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { colors } from '@/theme';
import { Campaign } from '@/types/customer';

const ANDROID_CHANNEL_ID = 'ford-one-leads';

async function ensureAndroidChannel() {
  if (Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: 'Leads de retenção',
    importance: Notifications.AndroidImportance.HIGH,
    lightColor: colors.primary,
  });
}

export async function requestNotificationPermission() {
  if (Platform.OS === 'web') {
    return false;
  }

  await ensureAndroidChannel();

  const currentPermissions = await Notifications.getPermissionsAsync();

  if (currentPermissions.granted) {
    return true;
  }

  const requestedPermissions = await Notifications.requestPermissionsAsync();
  return requestedPermissions.granted;
}

export async function scheduleCampaignNotification(
  campaign: Campaign,
  customerName: string,
) {
  const hasPermission = await requestNotificationPermission();

  if (!hasPermission) {
    return false;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Lead de retenção criado',
      body: `${customerName}: ${campaign.title}`,
      data: {
        campaignId: campaign.id,
        customerId: campaign.customerId,
      },
    },
    trigger: Platform.OS === 'android' ? { channelId: ANDROID_CHANNEL_ID } : null,
  });

  return true;
}
