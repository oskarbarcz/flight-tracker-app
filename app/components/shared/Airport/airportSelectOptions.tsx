import React from "react";
import { AirportShape } from "~/components/shared/Airport/AirportShape";
import type { AdvancedSelectOption } from "~/components/shared/Form/AdvancedSelect/AdvancedSelect";
import { OptionAvatarFrame } from "~/components/shared/Form/AdvancedSelect/OptionAvatarFrame";
import type { Airport } from "~/models";

export function airportSelectOptions(airports: Airport[]): AdvancedSelectOption[] {
  return airports.map((airport) => ({
    value: airport.id,
    keywords: [airport.iataCode, airport.icaoCode, airport.city, airport.name],
    avatar: (
      <OptionAvatarFrame>
        <AirportShape shape={airport.shape} />
      </OptionAvatarFrame>
    ),
    title: airport.name,
    subtitle: `${airport.city}, ${airport.country}`,
    selectedSubtitle: (
      <>
        IATA: <span className="font-semibold">{airport.iataCode}</span>, ICAO:{" "}
        <span className="font-semibold">{airport.icaoCode}</span>
      </>
    ),
  }));
}
