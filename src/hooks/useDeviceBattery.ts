import * as Battery from 'expo-battery';
import { useCallback, useEffect, useState } from 'react';

export function useDeviceBattery() {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [batteryState, setBatteryState] = useState<Battery.BatteryState | null>(null);
  const [lowPowerMode, setLowPowerMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadBattery = useCallback(async () => {
    try {
      setLoading(true);
      const [level, state, lowPower] = await Promise.all([
        Battery.getBatteryLevelAsync(),
        Battery.getBatteryStateAsync(),
        Battery.isLowPowerModeEnabledAsync(),
      ]);

      setBatteryLevel(level >= 0 ? Math.round(level * 100) : null);
      setBatteryState(state);
      setLowPowerMode(lowPower);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBattery();

    const levelSubscription = Battery.addBatteryLevelListener(({ batteryLevel: level }) => {
      setBatteryLevel(level >= 0 ? Math.round(level * 100) : null);
    });

    const stateSubscription = Battery.addBatteryStateListener(({ batteryState: state }) => {
      setBatteryState(state);
    });

    return () => {
      levelSubscription.remove();
      stateSubscription.remove();
    };
  }, [loadBattery]);

  return {
    batteryLevel,
    batteryState,
    lowPowerMode,
    loading,
    reload: loadBattery,
  };
}
