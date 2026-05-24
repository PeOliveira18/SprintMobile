import { StyleSheet, Text } from 'react-native';

type StatusBadgeProps = {
  label: string;
  tone?: 'green' | 'yellow' | 'red' | 'blue' | 'gray';
};

export function StatusBadge({ label, tone = 'gray' }: StatusBadgeProps) {
  return <Text style={[styles.badge, styles[tone]]}>{label}</Text>;
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    maxWidth: 96,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 12,
    fontWeight: '800',
    overflow: 'hidden',
    textAlign: 'center',
  },
  green: {
    backgroundColor: '#DFF7E8',
    color: '#166534',
  },
  yellow: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
  },
  red: {
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
  },
  blue: {
    backgroundColor: '#DBEAFE',
    color: '#1D4ED8',
  },
  gray: {
    backgroundColor: '#E2E8F0',
    color: '#334155',
  },
});
