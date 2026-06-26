import { GreatCirclePath } from "~/components/flight/Map/Element/GreatCirclePath";
import { MapAirportLabel } from "~/components/flight/Map/Element/MapAirportLabel";
import type { Airport, Diversion } from "~/models";

type Props = {
  origin: Airport;
  diversion: Diversion | null;
};

export function DiversionRoute({ origin, diversion }: Props) {
  if (!diversion) return null;
  return (
    <>
      <GreatCirclePath start={origin} end={diversion.airport} variant="diversion" />
      <MapAirportLabel airport={diversion.airport} variant="diversion" />
    </>
  );
}
