import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type IconName = ComponentProps<typeof Ionicons>['name'];

type MetricCardProps = {
  label: string;
  value: string;
  helper: string;
  tone?: 'blue' | 'green' | 'red' | 'yellow';
  icon?: IconName;
};

export function MetricCard({ label, value, helper, tone = 'blue', icon }: MetricCardProps) {
  return (
    <View style={[styles.card, styles[tone]]}>
      <View style={styles.topRow}>
        {icon ? (
          <View style={[styles.iconBox, styles[`${tone}Icon`]]}>
            <Ionicons name={icon} size={17} color={getIconColor(tone)} />
          </View>
        ) : null}
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.helper}>{helper}</Text>
    </View>
  );
}

function getIconColor(tone: NonNullable<MetricCardProps['tone']>) {
  if (tone === 'green') {
    return '#0A8F5A';
  }

  if (tone === 'red') {
    return '#D92D20';
  }

  if (tone === 'yellow') {
    return '#B7791F';
  }

  return '#005BEA';
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 150,
    borderRadius: 12,
    padding: 14,
    gap: 7,
    borderWidth: 1,
    shadowColor: '#061B3A',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  blue: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CFE0FF',
  },
  green: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CFEBDD',
  },
  red: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFD4CD',
  },
  yellow: {
    backgroundColor: '#FFFFFF',
    borderColor: '#F7E4A4',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blueIcon: {
    backgroundColor: '#EAF2FF',
  },
  greenIcon: {
    backgroundColor: '#E8F8F0',
  },
  redIcon: {
    backgroundColor: '#FFF0EE',
  },
  yellowIcon: {
    backgroundColor: '#FFF8DF',
  },
  label: {
    color: '#526174',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    flexShrink: 1,
  },
  value: {
    color: '#071331',
    fontSize: 25,
    fontWeight: '900',
  },
  helper: {
    color: '#526174',
    fontSize: 13,
    lineHeight: 18,
  },
});
