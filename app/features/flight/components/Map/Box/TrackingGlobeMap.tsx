import { useMemo } from "react";
import { useAdsbData } from "~/features/adsb/hooks/useAdsbData";
import { FlightGlobeMap } from "~/features/flight/components/Map/Box/FlightGlobeMap";
import { useAuthorizedLayoutServices } from "~/features/flight/hooks/useAirportLayoutData";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { usePlannedRoute } from "~/features/route/hooks/useRouteBriefing";
import type { MapCameraView } from "~/shared/lib/mapCameraView";
import type { MapFocus } from "~/shared/lib/mapFocus";

type Props = {
  topInset: number;
  initialView: MapCameraView | null;
  onViewChange: (view: MapCameraView) => void;
  onFixClick: (ordinal: number) => void;
  focus: MapFocus | null;
};

const BOTTOM_BAR_HEIGHT = 88;

export function TrackingGlobeMap({ topInset, initialView, onViewChange, onFixClick, focus }: Props) {
  const { flight, diversion } = useTrackedFlight();
  const { flightPath } = useAdsbData();
  const plannedRoute = usePlannedRoute();
  const layoutServices = useAuthorizedLayoutServices();
  const insets = useMemo(() => ({ top: topInset, bottom: BOTTOM_BAR_HEIGHT }), [topInset]);

  if (!flight) {
    return null;
  }

  return (
    <FlightGlobeMap
      flight={flight}
      diversion={diversion}
      flightPath={flightPath}
      plannedRoute={plannedRoute}
      layoutServices={layoutServices}
      insets={insets}
      initialView={initialView}
      onViewChange={onViewChange}
      onFixClick={onFixClick}
      focus={focus}
      withAirspace={true}
    />
  );
}
