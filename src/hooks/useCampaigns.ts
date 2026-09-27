import { useCallback, useEffect, useState } from 'react';

import { campaignStorage } from '@/services/campaignStorage';
import { retentionService } from '@/services/retentionService';
import { Campaign, CreateCampaignPayload } from '@/types/customer';

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const storedCampaigns = await campaignStorage.findAll();
      setCampaigns(storedCampaigns);
    } catch {
      setError('Erro ao carregar os leads salvos.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createCampaign = useCallback(
    async (payload: CreateCampaignPayload) => {
      try {
        setSaving(true);
        setError('');
        const campaign = await retentionService.createCampaign(payload);
        const nextCampaigns = [campaign, ...campaigns];
        setCampaigns(nextCampaigns);
        await campaignStorage.save(nextCampaigns);
        return campaign;
      } catch {
        setError('Erro ao criar o lead de retenção.');
        return null;
      } finally {
        setSaving(false);
      }
    },
    [campaigns],
  );

  const clearCampaigns = useCallback(async () => {
    await campaignStorage.clear();
    setCampaigns([]);
  }, []);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  return {
    campaigns,
    loading,
    saving,
    error,
    reload: loadCampaigns,
    createCampaign,
    clearCampaigns,
  };
}
