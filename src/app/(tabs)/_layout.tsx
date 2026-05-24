import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { ComponentProps } from 'react';

type IconName = ComponentProps<typeof Ionicons>['name'];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerTintColor: '#001B4D',
        headerTitleStyle: {
          fontWeight: '900',
        },
        tabBarActiveTintColor: '#0B5CAD',
        tabBarInactiveTintColor: '#64748B',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '800',
          lineHeight: 12,
          marginTop: -2,
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#D7DEE8',
          height: 70,
          paddingBottom: 12,
          paddingHorizontal: 12,
          paddingTop: 6,
        },
        tabBarItemStyle: {
          minWidth: 0,
          paddingHorizontal: 0,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Resumo',
          tabBarIcon: ({ color, size }) => tabIcon('home-outline', color, size),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          href: null,
          tabBarIcon: ({ color, size }) => tabIcon('person-outline', color, size),
        }}
      />
      <Tabs.Screen
        name="servicos"
        options={{
          title: 'Serv.',
          tabBarIcon: ({ color, size }) => tabIcon('construct-outline', color, size),
        }}
      />
      <Tabs.Screen
        name="lancamentos"
        options={{
          title: 'Modelos',
          tabBarIcon: ({ color, size }) => tabIcon('sparkles-outline', color, size),
        }}
      />
      <Tabs.Screen
        name="concessionarias"
        options={{
          title: 'Concess.',
          tabBarIcon: ({ color, size }) => tabIcon('trophy-outline', color, size),
        }}
      />
      <Tabs.Screen
        name="campanha"
        options={{
          title: 'Leads',
          href: null,
          tabBarIcon: ({ color, size }) => tabIcon('chatbox-ellipses-outline', color, size),
        }}
      />
      <Tabs.Screen
        name="iot"
        options={{
          title: 'IA',
          tabBarIcon: ({ color, size }) => tabIcon('hardware-chip-outline', color, size),
        }}
      />
    </Tabs>
  );
}

function tabIcon(name: IconName, color: string, size: number) {
  return <Ionicons name={name} color={color} size={Math.min(size, 24)} />;
}
