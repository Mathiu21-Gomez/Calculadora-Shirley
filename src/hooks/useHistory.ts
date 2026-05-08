import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'calculadora.history.v1';
const MAX_ITEMS = 50;

export type HistoryItem = {
  id: string;
  expression: string;
  result: string;
  at: number;
};

export function useHistory() {
  const [items, setItems] = useState<HistoryItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as HistoryItem[]) : [];
    } catch {
      return [];
    }
  });

  const hydrated = useRef(false);
  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage full or disabled — ignore
    }
  }, [items]);

  const push = useCallback((expression: string, result: string) => {
    setItems((prev) => {
      const next: HistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        expression,
        result,
        at: Date.now(),
      };
      return [next, ...prev].slice(0, MAX_ITEMS);
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  return { items, push, clear };
}
