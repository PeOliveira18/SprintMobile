import { useQuery } from '@tanstack/react-query';

import { retentionService } from '@/services/retentionService';

export function useCustomerDetails(customerId: number) {
  return useQuery({
    queryKey: ['customers', customerId],
    queryFn: () => retentionService.findCustomerById(customerId),
    enabled: Number.isFinite(customerId),
  });
}
