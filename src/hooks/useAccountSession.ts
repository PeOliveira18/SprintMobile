import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { accountStorage } from '@/services/accountStorage';
import { AccountProfile } from '@/types/account';

export function useAccountSession() {
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const session = await accountStorage.getSessionProfile();
    setProfile(session);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void reload();
    }, [reload]),
  );

  return { profile, loading, reload };
}
