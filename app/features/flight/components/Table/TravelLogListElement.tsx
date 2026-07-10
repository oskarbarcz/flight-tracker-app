import { Badge, TableCell, TableRow } from "flowbite-react";
import React from "react";
import { AirportRoute } from "~/features/airport/components/Airport/AirportRoute";
import { TravelStatus, TravelType, type UserTravel } from "~/features/travel";
import { FormattedIcaoDate } from "~/shared/ui/Date/FormattedIcaoDate";

type Props = {
  travel: UserTravel;
};

const TYPE_COLOR: Record<TravelType, string> = {
  [TravelType.PerformingFlight]: "indigo",
  [TravelType.DeadHeadManual]: "info",
  [TravelType.DeadHeadAutomatic]: "gray",
};

const STATUS_COLOR: Record<TravelStatus, string> = {
  [TravelStatus.Pending]: "warning",
  [TravelStatus.Finished]: "success",
};

export function TravelLogListElement({ travel }: Props) {
  return (
    <TableRow>
      <TableCell>
        <FormattedIcaoDate date={travel.createdAt} />
      </TableCell>
      <TableCell>
        <AirportRoute departure={travel.departureAirport} destination={travel.destinationAirport} />
      </TableCell>
      <TableCell>
        <Badge color={TYPE_COLOR[travel.type]}>{travel.typeLabel}</Badge>
      </TableCell>
      <TableCell>
        <Badge color={STATUS_COLOR[travel.status]}>{travel.statusLabel}</Badge>
      </TableCell>
      <TableCell className="font-mono">{travel.distance} nm</TableCell>
    </TableRow>
  );
}
