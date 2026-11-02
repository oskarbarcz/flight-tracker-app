import type { FeatureCollection } from "geojson";
import { useEffect, useState } from "react";
import { loadFirPolarLines } from "~/features/airspace/lib/firBoundaryOverlay";

export function useFirPolarLines(enabled: boolean): FeatureCollection | null {
  const [lines, setLines] = useState<FeatureCollection | null>(null);

  useEffect(() => {
    if (!enabled || lines !== null) {
      return;
    }

    let cancelled = false;

    loadFirPolarLines().then((loaded) => {
      if (!cancelled) {
        setLines(loaded);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [enabled, lines]);

  return enabled ? lines : null;
}
