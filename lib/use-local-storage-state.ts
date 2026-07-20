"use client";

import { useEffect, useState } from "react";

export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setState(JSON.parse(raw) as T);
    } catch {
      // localStorage indisponível (modo privado, quota excedida): ignora
    }
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // localStorage indisponível (modo privado, quota excedida): ignora
    }
  }, [key, state, hydrated]);

  return [state, setState] as const;
}
