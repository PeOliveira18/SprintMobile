import { useQuery } from '@tanstack/react-query';

import { retentionService } from '@/services/retentionService';

export function useCustomers() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: retentionService.findCustomers,
  });
}
