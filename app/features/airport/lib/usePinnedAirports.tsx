import { createContext, type ReactNode, useCallback, useContext, useMemo } from "react";
import type { Airport } from "~/features/airport";
import type { CountryRef } from "~/features/country/model";
import { useLocalStorage } from "~/shared/hooks/useLocalStorage";

export type PinnedAirport = {
  id: string;
  iataCode: string;
  icaoCode: string;
  name: string;
  city: string;
  country: CountryRef;
  shape: Airport["shape"];
};

type StoredPinnedAirport = Omit<PinnedAirport, "country"> & {
  country: CountryRef | string;
};

function fromStorage(entry: StoredPinnedAirport): PinnedAirport {
  return {
    ...entry,
    country: typeof entry.country === "string" ? { code: "", name: entry.country } : entry.country,
  };
}

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
  const [stored, setStored] = useLocalStorage<StoredPinnedAirport[]>(STORAGE_KEY, []);
  const pinned = useMemo(() => stored.map(fromStorage), [stored]);

  const pin = useCallback(
    (airport: Airport) => {
      setStored((current) =>
        current.some((entry) => entry.id === airport.id) ? current : [...current, toSnapshot(airport)],
      );
    },
    [setStored],
  );

  const unpin = useCallback(
    (id: string) => {
      setStored((current) => current.filter((entry) => entry.id !== id));
    },
    [setStored],
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
