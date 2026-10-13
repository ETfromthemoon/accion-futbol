"use client";

import { useCallback, useSyncExternalStore } from "react";

// Media query reactiva. Devuelve null en el servidor y durante la hidratación
// (aún no se sabe qué dispositivo es); luego true/false según el navegador.
export function useMediaQuery(query: string): boolean | null {
  const subscribe = useCallback(
    (callback: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", callback);
      return () => media.removeEventListener("change", callback);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => null,
  );
}
