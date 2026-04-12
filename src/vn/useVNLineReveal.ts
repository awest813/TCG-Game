import React from 'react';

/**
 * Ren'Py / RenJS-style line reveal: text prints in, then the player clicks again to advance.
 */
export function useVNLineReveal(text: string, stepKey: string, enabled: boolean, charsPerSec = 52): VNLineReveal {
  const [shown, setShown] = React.useState('');
  const [complete, setComplete] = React.useState(!enabled || !text);

  React.useEffect(() => {
    if (!enabled || !text) {
      setShown(text);
      setComplete(true);
      return undefined;
    }
    setShown('');
    setComplete(false);
    let cancelled = false;
    let i = 0;
    const delayMs = Math.max(12, Math.floor(1000 / charsPerSec));
    let timeoutId: number | undefined;

    const tick = () => {
      if (cancelled) return;
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        setComplete(true);
        return;
      }
      timeoutId = window.setTimeout(tick, delayMs);
    };

    timeoutId = window.setTimeout(tick, 0);
    return () => {
      cancelled = true;
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [text, stepKey, enabled, charsPerSec]);

  const forceReveal = React.useCallback(() => {
    setShown(text);
    setComplete(true);
  }, [text]);

  return { shown, complete, forceReveal };
}

export type VNLineReveal = {
  shown: string;
  complete: boolean;
  forceReveal: () => void;
};
