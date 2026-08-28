import type { Flight } from "~/features/flight";
import { operatorFinUrl } from "~/features/operator/components/OperatorFin";

type Props = {
  flight: Flight;
};

export function AircraftIdentityLabel({ flight }: Props) {
  const fin = operatorFinUrl(flight.operator.icaoCode);

  return (
    <>
      {fin && <img src={fin} alt={`${flight.operator.shortName} tail fin`} className="map-aircraft-label__fin" />}
      <span className="map-aircraft-label__identity">
        <span className="map-aircraft-label__flight">{flight.flightNumberWithoutSpaces}</span>
        <span className="map-aircraft-label__registration">{flight.aircraft.registration}</span>
      </span>
    </>
  );
}
