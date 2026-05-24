import { useQuery } from '@tanstack/react-query';

import { weatherService } from '@/services/weatherService';

export function useWeatherInsight() {
  return useQuery({
    queryKey: ['ford-one-weather-insight'],
    queryFn: weatherService.findFordOneWeatherInsight,
    staleTime: 1000 * 60 * 10,
  });
}
