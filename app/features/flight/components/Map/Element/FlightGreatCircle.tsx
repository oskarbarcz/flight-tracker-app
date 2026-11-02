import { useMapSettings } from "~/app-state/useMapSettings";
import type { Airport } from "~/features/airport";
import { GreatCirclePath } from "~/features/flight/components/Map/Element/GreatCirclePath";
import { emphasisOf } from "~/shared/lib/flightData";

type Props = {
  start: Airport;
  end: Airport;
};

export function FlightGreatCircle({ start, end }: Props) {
  const { mapSettings } = useMapSettings();

  if (mapSettings.greatCircleDisplay === "hide") {
    return null;
  }

  return <GreatCirclePath start={start} end={end} emphasis={emphasisOf(mapSettings.greatCircleDisplay)} />;
}
