import { createContext, type ReactNode, useCallback, useContext, useMemo } from "react";
import type { Airport } from "~/features/airport";
import { useLocalStorage } from "~/shared/hooks/useLocalStorage";

export type PinnedAirport = {
  id: string;
  iataCode: string;
  icaoCode: string;
  name: string;
  city: string;
  country: string;
  shape: Airport["shape"];
};

function toSnapshot(airport: Airport): PinnedAirport {
  return {
    id: airport.id,
    iataCode: airport.iataCode,
    icaoCode: airport.icaoCode,
    name: airport.name,
    city: airport.city,
    country: airport.country,
    shape: airport.shape,
  };
}

type PinnedAirportsContextValue = {
  pinned: PinnedAirport[];
  pin: (airport: Airport) => void;
  unpin: (id: string) => void;
  isPinned: (id: string) => boolean;
};

const PinnedAirportsContext = createContext<PinnedAirportsContextValue | null>(null);

const STORAGE_KEY = "pinnedAirports";

export function PinnedAirportsProvider({ children }: { children: ReactNode }) {
  const [pinned, setPinned] = useLocalStorage<PinnedAirport[]>(STORAGE_KEY, []);

  const pin = useCallback(
    (airport: Airport) => {
      setPinned((current) =>
        current.some((entry) => entry.id === airport.id) ? current : [...current, toSnapshot(airport)],
      );
    },
    [setPinned],
  );

  const unpin = useCallback(
    (id: string) => {
      setPinned((current) => current.filter((entry) => entry.id !== id));
    },
    [setPinned],
  );

  const isPinned = useCallback((id: string) => pinned.some((entry) => entry.id === id), [pinned]);

  const value = useMemo(() => ({ pinned, pin, unpin, isPinned }), [pinned, pin, unpin, isPinned]);

  return <PinnedAirportsContext.Provider value={value}>{children}</PinnedAirportsContext.Provider>;
}

export function usePinnedAirports(): PinnedAirportsContextValue {
  const context = useContext(PinnedAirportsContext);
  if (!context) {
    throw new Error("usePinnedAirports must be used within a PinnedAirportsProvider");
  }
  return context;
}
