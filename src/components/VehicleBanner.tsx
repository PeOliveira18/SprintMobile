import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, View } from 'react-native';

import { getVehicleImage } from '@/constants/images';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import { Customer } from '@/types/customer';
import { formatKm } from '@/utils/format';

type VehicleBannerProps = {
  vehicle: string;
  meta: string;
  connected: boolean;
  connectedLabel?: string;
  disconnectedLabel?: string;
};

export function VehicleBanner({
  vehicle,
  meta,
  connected,
  connectedLabel = 'Conectado à Rede Ford',
  disconnectedLabel = 'Lead fora da rede',
}: VehicleBannerProps) {
  return (
    <View style={styles.card}>
      <Image
        source={getVehicleImage(vehicle)}
        style={styles.image}
        accessibilityIgnoresInvertColors
        accessibilityLabel={`Imagem ilustrativa do ${vehicle}`}
      />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {vehicle}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {meta}
        </Text>
        <View style={styles.statusRow}>
          <Ionicons
            name={connected ? 'checkmark-circle' : 'alert-circle'}
            size={15}
            color={connected ? colors.success : colors.warning}
          />
          <Text style={[styles.statusText, !connected && styles.statusWarning]}>
            {connected ? connectedLabel : disconnectedLabel}
          </Text>
        </View>
      </View>
    </View>
  );
}

export function CustomerVehicleBanner({ customer }: { customer: Customer }) {
  return (
    <VehicleBanner
      vehicle={`${customer.vehicle} ${customer.modelYear}`}
      meta={`${customer.vin} · ${formatKm(customer.mileageKm)}`}
      connected={customer.hasServiceInNetwork}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
    ...shadows.card,
  },
  image: {
    width: 88,
    height: 58,
    borderRadius: 10,
    backgroundColor: colors.navy,
  },
  content: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  name: {
    ...typography.cardTitle,
    fontSize: 15,
  },
  meta: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  statusText: {
    color: colors.success,
    fontSize: 12,
    fontWeight: '800',
  },
  statusWarning: {
    color: colors.warning,
  },
});
