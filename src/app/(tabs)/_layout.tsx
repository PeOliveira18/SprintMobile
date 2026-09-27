import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { ComponentProps } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

const TAB_BAR_HEIGHT = 60;

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '800',
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: TAB_BAR_HEIGHT + insets.bottom,
          paddingBottom: insets.bottom + 6,
          paddingTop: 6,
        },
        tabBarItemStyle: {
          minWidth: 0,
          paddingHorizontal: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Resumo',
          tabBarIcon: ({ color, focused }) => tabIcon(focused ? 'home' : 'home-outline', color),
        }}
      />
      <Tabs.Screen
        name="servicos"
        options={{
          title: 'Serviços',
          tabBarIcon: ({ color, focused }) =>
            tabIcon(focused ? 'construct' : 'construct-outline', color),
        }}
      />
      <Tabs.Screen
        name="lancamentos"
        options={{
          title: 'Modelos',
          tabBarIcon: ({ color, focused }) =>
            tabIcon(focused ? 'sparkles' : 'sparkles-outline', color),
        }}
      />
      <Tabs.Screen
        name="concessionarias"
        options={{
          title: 'Rede',
          tabBarIcon: ({ color, focused }) => tabIcon(focused ? 'trophy' : 'trophy-outline', color),
        }}
      />
      <Tabs.Screen
        name="iot"
        options={{
          title: 'IoT',
          tabBarIcon: ({ color, focused }) =>
            tabIcon(focused ? 'hardware-chip' : 'hardware-chip-outline', color),
        }}
      />
    </Tabs>
  );
}

function tabIcon(name: IconName, color: string) {
  return <Ionicons name={name} color={color} size={22} />;
}
