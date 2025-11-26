import { useCallback, useRef } from "react";

export function useDebounce<F extends (...args: any[]) => void>(func: F, delay: number) {
  const timerRef = useRef<NodeJS.Timeout>();

  return useCallback((...args: Parameters<F>) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      func(...args);
    }, delay);
  }, [func, delay]);
}