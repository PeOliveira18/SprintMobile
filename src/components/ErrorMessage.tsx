import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';

type ErrorMessageProps = {
  message: string;
  onRetry?: () => void;
};

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Falha ao carregar</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <ActionButton label="Tentar novamente" onPress={onRetry} variant="secondary" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F4B4A8',
    backgroundColor: '#FFF4F1',
    padding: 16,
    gap: 10,
  },
  title: {
    color: '#9A3412',
    fontSize: 16,
    fontWeight: '800',
  },
  message: {
    color: '#7C2D12',
    fontSize: 14,
    lineHeight: 20,
  },
});
