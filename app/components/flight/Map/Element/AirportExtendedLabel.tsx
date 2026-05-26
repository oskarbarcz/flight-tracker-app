"use client";

import type { Airport } from "~/models";

type Props = {
  airport: Airport;
  variant?: "primary" | "diversion";
};

export function AirportExtendedLabel({ airport, variant = "primary" }: Props) {
  return (
    <div className={`airport-marker${variant === "diversion" ? " airport-marker--diversion" : ""}`}>
      <span className="airport-marker__code">{airport.iataCode}</span>
      <div className="airport-marker__details">
        <span className="airport-marker__name">{airport.name}</span>
        <span className="airport-marker__location">
          {airport.city}, {airport.country}
        </span>
      </div>
    </div>
  );
}
