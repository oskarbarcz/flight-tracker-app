import { useEffect, useRef } from "react";
import { useCurrentFlight } from "~/features/flight/hooks/useCurrentFlight";

export function useOnCurrentFlightChange(handler: () => void) {
  const { currentFlight } = useCurrentFlight();
  const currentFlightId = currentFlight?.id ?? null;
  const observedFlightId = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const previous = observedFlightId.current;
    observedFlightId.current = currentFlightId;
    if (previous !== undefined && previous !== currentFlightId) {
      handler();
    }
  }, [currentFlightId, handler]);
}
