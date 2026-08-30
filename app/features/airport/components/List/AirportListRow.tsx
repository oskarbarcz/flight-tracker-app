import React from "react";
import type { Airport } from "~/features/airport";
import { airportListLayout } from "~/features/airport/components/List/airportListLayout";
import { AirportEnrichmentCell } from "~/features/airport/components/List/Cell/AirportEnrichmentCell";
import { AirportIdentityCell } from "~/features/airport/components/List/Cell/AirportIdentityCell";
import { AirportLocationCell } from "~/features/airport/components/List/Cell/AirportLocationCell";
import { toHuman } from "~/i18n/translate";
import { RecordListRow } from "~/shared/ui/List/RecordListRow";

type Props = {
  airport: Airport;
  onEnrich: (airport: Airport) => void;
};

export function AirportListRow({ airport, onEnrich }: Props) {
  const label = `${airport.iataCode} ${airport.icaoCode}, ${airport.name}, ${toHuman.airport.dataQuality(airport.dataQuality)} data quality`;

  return (
    <RecordListRow
      layout={airportListLayout}
      href={`/airports/${airport.id}`}
      label={label}
      trailing={<AirportEnrichmentCell airport={airport} onEnrich={onEnrich} />}
    >
      <AirportIdentityCell airport={airport} />
      <AirportLocationCell airport={airport} />
    </RecordListRow>
  );
}
