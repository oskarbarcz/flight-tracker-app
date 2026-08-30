import React from "react";
import type { Flight } from "~/features/flight";
import { FlightListDateCell } from "~/features/flight/components/List/Cell/FlightListDateCell";
import { FlightListFlightCell } from "~/features/flight/components/List/Cell/FlightListFlightCell";
import { FlightListRouteCell } from "~/features/flight/components/List/Cell/FlightListRouteCell";
import type { FlightListTrailingColumn } from "~/features/flight/components/List/FlightListColumns";
import type { FlightListLinks } from "~/features/flight/components/List/FlightListLinks";
import { RecordListRow } from "~/shared/ui/List/RecordListRow";

type Props = {
  flight: Flight;
  links: FlightListLinks;
  trailingColumn: FlightListTrailingColumn;
};

export function FlightListRow({ flight, links, trailingColumn }: Props) {
  const label = `${flight.flightNumber}, ${flight.departureAirport.iataCode} to ${flight.destinationAirport.iataCode}, ${trailingColumn.label(flight)}`;

  return (
    <RecordListRow
      layout={trailingColumn.layout}
      href={links.flight(flight)}
      label={label}
      trailing={trailingColumn.render(flight)}
    >
      <FlightListDateCell flight={flight} />
      <FlightListFlightCell flight={flight} links={links} />
      <FlightListRouteCell flight={flight} links={links} />
    </RecordListRow>
  );
}
