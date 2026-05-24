import { Ionicons } from '@expo/vector-icons';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';

import { Customer } from '@/types/customer';

export const TERRITORY_IMAGE = require('../../assets/ford-one/image27.jpg') as ImageSourcePropType;

type VehicleBannerProps = {
  customer: Customer;
};

export function VehicleBanner({ customer }: VehicleBannerProps) {
  return (
    <View style={styles.card}>
      <Image source={TERRITORY_IMAGE} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>
          {customer.vehicle} {customer.modelYear}
        </Text>
        <Text style={styles.meta}>
          {customer.vin} • {customer.mileageKm.toLocaleString('pt-BR')} km
        </Text>
        <View style={styles.statusRow}>
          <Ionicons name="checkmark-circle" size={15} color="#09A66D" />
          <Text style={styles.statusText}>
            {customer.hasServiceInNetwork ? 'Conectado a rede Ford' : 'Lead fora da rede'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDE6F3',
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  image: {
    width: 88,
    height: 58,
    borderRadius: 10,
    backgroundColor: '#EEF3F8',
  },
  content: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  name: {
    color: '#071331',
    fontSize: 15,
    fontWeight: '900',
  },
  meta: {
    color: '#526174',
    fontSize: 12,
    fontWeight: '700',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 3,
  },
  statusText: {
    color: '#0A7B4B',
    fontSize: 12,
    fontWeight: '800',
  },
});
