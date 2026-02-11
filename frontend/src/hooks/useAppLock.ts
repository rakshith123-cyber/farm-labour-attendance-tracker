import { useState, useEffect } from 'react';
import { useActor } from './useActor';

const LOCK_ENABLED_KEY = 'farm-app-lock-enabled';
const LOCK_STATUS_KEY = 'farm-app-lock-status';

export function useAppLock() {
  const { actor } = useActor();
  const [isEnabled, setIsEnabled] = useState(() => {
    return localStorage.getItem(LOCK_ENABLED_KEY) === 'true';
  });
  const [isLocked, setIsLocked] = useState(() => {
    return isEnabled && localStorage.getItem(LOCK_STATUS_KEY) !== 'unlocked';
  });

  useEffect(() => {
    if (isEnabled) {
      localStorage.setItem(LOCK_ENABLED_KEY, 'true');
    } else {
      localStorage.removeItem(LOCK_ENABLED_KEY);
      localStorage.removeItem(LOCK_STATUS_KEY);
      setIsLocked(false);
    }
  }, [isEnabled]);

  const setPasscode = async (passcode: string) => {
    if (!actor) throw new Error('Actor not initialized');
    await actor.setPasscode(passcode);
    setIsEnabled(true);
  };

  const unlock = async (passcode: string): Promise<boolean> => {
    if (!actor) throw new Error('Actor not initialized');
    const isValid = await actor.checkPasscode(passcode);
    if (isValid) {
      localStorage.setItem(LOCK_STATUS_KEY, 'unlocked');
      setIsLocked(false);
      return true;
    }
    return false;
  };

  const toggleLock = (enabled: boolean) => {
    setIsEnabled(enabled);
    if (!enabled) {
      setIsLocked(false);
    } else {
      // When enabling, lock immediately
      localStorage.removeItem(LOCK_STATUS_KEY);
      setIsLocked(true);
    }
  };

  return {
    isEnabled,
    isLocked,
    setPasscode,
    unlock,
    toggleLock,
  };
}
