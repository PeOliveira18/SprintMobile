import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

type LoadingProps = {
  message?: string;
};

export function Loading({ message = 'Carregando dados...' }: LoadingProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator color="#0B5CAD" size="large" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 48,
  },
  text: {
    color: '#475569',
    fontSize: 15,
    fontWeight: '600',
  },
});
