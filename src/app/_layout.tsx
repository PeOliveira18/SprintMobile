import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 3,
    },
  },
});

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            headerStyle: {
              backgroundColor: '#FFFFFF',
            },
            headerTintColor: '#001B4D',
            headerTitleStyle: {
              fontWeight: '900',
            },
            contentStyle: {
              backgroundColor: '#EEF3F8',
            },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ title: 'Ford ONE' }} />
          <Stack.Screen
            name="clientes/[id]"
            options={{
              headerShown: true,
              headerBackTitle: 'Voltar',
              title: 'Plano VIN',
            }}
          />
        </Stack>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
