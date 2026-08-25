import { useEffect, useState } from "react";
import { CABIN_ORDER } from "~/features/cabin-layout/lib/seatAppearance";
import type { CabinClass, CabinSeatCounts } from "~/features/cabin-layout/model";
import type { Flight } from "~/features/flight/model";
import { useApi } from "~/shared/api/useApi";

export type CabinCapacity = {
  layoutId: string;
  totalSeats: number;
  cabins: { cabin: CabinClass; seats: number }[];
};

function cabinsOf(seatCounts: CabinSeatCounts): { cabin: CabinClass; seats: number }[] {
  return CABIN_ORDER.filter((cabin) => (seatCounts[cabin] ?? 0) > 0).map((cabin) => ({
    cabin,
    seats: seatCounts[cabin] ?? 0,
  }));
}

export function useCabinCapacity(flight: Flight): CabinCapacity | null {
  const { cabinLayoutService } = useApi();
  const [capacity, setCapacity] = useState<CabinCapacity | null>(null);

  const layoutId = flight.aircraft.cabinLayout?.id ?? null;

  useEffect(() => {
    if (layoutId === null) {
      setCapacity(null);
      return;
    }

    let cancelled = false;

    cabinLayoutService
      .fetchSeatMap(layoutId)
      .then((seatMap) => {
        if (!cancelled) {
          setCapacity({
            layoutId,
            totalSeats: seatMap.totalSeats,
            cabins: cabinsOf(seatMap.seatCounts),
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCapacity(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [cabinLayoutService, layoutId]);

  return capacity;
}
