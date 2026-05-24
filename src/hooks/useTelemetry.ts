import { useQuery } from '@tanstack/react-query';

import { retentionService } from '@/services/retentionService';

export function useTelemetry() {
  return useQuery({
    queryKey: ['iot-telemetry'],
    queryFn: retentionService.findTelemetry,
  });
}
