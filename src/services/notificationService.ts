import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { Campaign } from '@/types/customer';

export async function requestNotificationPermission() {
  if (Platform.OS === 'web') {
    return false;
  }

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
      title: 'Lead VIN Share criado',
      body: `${customerName}: ${campaign.title}`,
      data: {
        campaignId: campaign.id,
        customerId: campaign.customerId,
      },
    },
    trigger: null,
  });

  return true;
}
