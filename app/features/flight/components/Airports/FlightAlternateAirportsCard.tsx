import React from "react";
import { useAuth } from "~/app-state/useAuth";
import { type AirportOnFlight, AirportOnFlightType } from "~/features/flight";
import { translateAirportOnFlightType } from "~/features/flight/i18n";
import { UserRole } from "~/features/user";
import { AirportIdentity } from "~/shared/ui/Display/AirportIdentity";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerEmptyState } from "~/shared/ui/Layout/ContainerEmptyState";

const ALTERNATE_TYPE_ORDER: AirportOnFlightType[] = [
  AirportOnFlightType.DestinationAlternate,
  AirportOnFlightType.EnrouteAlternate,
  AirportOnFlightType.EtopsEntry,
  AirportOnFlightType.EtopsExit,
];

type Props = {
  airports: AirportOnFlight[];
};

function AlternateAirportRow({ airport, canOpenAirport }: { airport: AirportOnFlight; canOpenAirport: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
        {translateAirportOnFlightType(airport.type)}
      </span>
      <AirportIdentity
        iataCode={airport.iataCode}
        name={airport.name}
        city={airport.city.name}
        country={airport.country.name}
        shape={airport.shape}
        href={canOpenAirport ? `/airports/${airport.id}` : undefined}
      />
    </div>
  );
}

export function FlightAlternateAirportsCard({ airports }: Props) {
  const { user } = useAuth();
  const canOpenAirport = user?.role !== UserRole.CabinCrew;
  const alternates = ALTERNATE_TYPE_ORDER.flatMap((type) => airports.filter((airport) => airport.type === type));

  return (
    <Container padding="condensed" header={<CardHeader title="Alternate airports" />}>
      {alternates.length === 0 ? (
        <ContainerEmptyState>No alternate airports for this flight.</ContainerEmptyState>
      ) : (
        <div className="flex flex-col gap-4">
          {alternates.map((airport) => (
            <AlternateAirportRow
              key={`${airport.type}-${airport.id}`}
              airport={airport}
              canOpenAirport={canOpenAirport}
            />
          ))}
        </div>
      )}
    </Container>
  );
}
