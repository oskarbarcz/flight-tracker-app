"use client";

import { Airport } from "~/models";

type Props = {
  airport: Airport;
};

export default function AirportExtendedLabel({ airport }: Props) {
  return (
    <div className="airport-marker">
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
