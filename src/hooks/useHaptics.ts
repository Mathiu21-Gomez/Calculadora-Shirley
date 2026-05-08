import { useCallback } from 'react';

type HapticPattern = 'tap' | 'success' | 'error';

const PATTERNS: Record<HapticPattern, number | number[]> = {
  tap: 8,
  success: [10, 40, 10],
  error: [40, 30, 40],
};

export function useHaptics(enabled: boolean = true) {
  return useCallback((pattern: HapticPattern) => {
    if (!enabled) return;
    if (typeof navigator === 'undefined' || !navigator.vibrate) return;
    navigator.vibrate(PATTERNS[pattern]);
  }, [enabled]);
}
