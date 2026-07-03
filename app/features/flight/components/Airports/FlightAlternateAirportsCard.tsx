import React from "react";
import { FaMapLocationDot } from "react-icons/fa6";
import { Link } from "react-router";
import { useAuth } from "~/app-state/useAuth";
import { AirportShape } from "~/features/airport/components/Airport/AirportShape";
import { type AirportOnFlight, AirportOnFlightType } from "~/features/flight";
import { translateAirportOnFlightType } from "~/features/flight/i18n";
import { UserRole } from "~/features/user";
import { OptionAvatarFrame } from "~/shared/ui/Form/AdvancedSelect/OptionAvatarFrame";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerEmptyState } from "~/shared/ui/Layout/ContainerEmptyState";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";

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
  const iataClassName = "shrink-0 font-mono text-lg font-bold text-gray-900 dark:text-white";

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
        {translateAirportOnFlightType(airport.type)}
      </span>
      <div className="flex items-center gap-3">
        <OptionAvatarFrame>
          <AirportShape shape={airport.shape} />
        </OptionAvatarFrame>
        <div className="min-w-0">
          <div className="flex min-w-0 items-baseline gap-2">
            {canOpenAirport ? (
              <Link
                to={`/airports/${airport.id}/overview`}
                viewTransition
                className={`${iataClassName} hover:text-primary-500`}
              >
                {airport.iataCode}
              </Link>
            ) : (
              <span className={iataClassName}>{airport.iataCode}</span>
            )}
            <span className="shrink-0 text-gray-300 dark:text-gray-600">|</span>
            <span className="truncate text-sm font-medium text-gray-700 dark:text-gray-200">{airport.name}</span>
          </div>
          <div className="truncate text-sm text-gray-500 dark:text-gray-400">
            {airport.city}, {airport.country}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FlightAlternateAirportsCard({ airports }: Props) {
  const { user } = useAuth();
  const canOpenAirport = user?.role !== UserRole.CabinCrew;
  const alternates = ALTERNATE_TYPE_ORDER.flatMap((type) => airports.filter((airport) => airport.type === type));

  return (
    <Container padding="condensed">
      <ContainerTitle icon={FaMapLocationDot} title="Alternate airports" />

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
