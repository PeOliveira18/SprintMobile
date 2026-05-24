import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { ReactNode } from 'react';

type OneCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function OneCard({ children, style }: OneCardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDE6F3',
    padding: 16,
    shadowColor: '#061B3A',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
});
