import { useRef, useCallback } from 'react';

interface LongPressOptions {
  onLongPress: () => void;
  delay?: number;
}

export const useLongPress = ({
  onLongPress,
  delay = 500,
}: LongPressOptions) => {
  const timerRef = useRef<number | null>(null);

  const start = useCallback(() => {
    timerRef.current = window.setTimeout(() => {
      onLongPress();
    }, delay);
  }, [onLongPress, delay]);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return {
    onTouchStart: start,
    onTouchEnd: clear,
    onTouchMove: clear,
    onTouchCancel: clear,
  };
};
