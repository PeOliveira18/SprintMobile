import { useQuery } from '@tanstack/react-query';

import { retentionService } from '@/services/retentionService';

export function useServiceOrders(customerId: number) {
  return useQuery({
    queryKey: ['service-orders', customerId],
    queryFn: () => retentionService.findServiceOrders(customerId),
    enabled: Number.isFinite(customerId),
  });
}
