import { useEffect, useState } from "react";
import { type FirNames, loadFirNames } from "~/features/airspace/lib/firNames";

export function useFirName(code: string | null): string | null {
  const [names, setNames] = useState<FirNames | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadFirNames().then((loaded) => {
      if (!cancelled) {
        setNames(loaded);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return code === null ? null : (names?.[code] ?? null);
}
