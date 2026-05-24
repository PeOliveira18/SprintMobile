import { StyleSheet, Text, View } from 'react-native';

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D7DEE8',
    backgroundColor: '#F8FAFC',
    padding: 18,
    gap: 6,
  },
  title: {
    color: '#172033',
    fontSize: 16,
    fontWeight: '800',
  },
  description: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 20,
  },
});
