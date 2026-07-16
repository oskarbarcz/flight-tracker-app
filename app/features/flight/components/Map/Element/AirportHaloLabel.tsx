import type { Airport } from "~/features/airport";

type Props = {
  airport: Airport;
  variant?: "primary" | "diversion";
  expanded?: boolean;
};

export function AirportHaloLabel({ airport, variant = "primary", expanded = false }: Props) {
  return (
    <div className={`map-airport-label${variant === "diversion" ? " map-airport-label--diversion" : ""}`}>
      <span className="map-airport-label__code">{airport.iataCode}</span>
      {expanded && (
        <>
          <span className="map-airport-label__sep">|</span>
          <span className="map-airport-label__name">{airport.name}</span>
        </>
      )}
    </div>
  );
}
