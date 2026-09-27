import { ImageSourcePropType } from 'react-native';

import { normalizeText } from '@/utils/format';

export const IMAGES = {
  pickup: require('../../assets/ford-one/image27.jpg') as ImageSourcePropType,
  brand: require('../../assets/ford-one/image3.jpg') as ImageSourcePropType,
};

const PICKUP_MODELS = ['ranger', 'maverick', 'f-150', 'f150'];

export function getVehicleImage(vehicle: string): ImageSourcePropType {
  const text = normalizeText(vehicle);
  return PICKUP_MODELS.some((model) => text.includes(model)) ? IMAGES.pickup : IMAGES.brand;
}
