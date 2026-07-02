import React from "react";
import { HiOutlineHome } from "react-icons/hi";
import type { AircraftAirport } from "~/models";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerEmptyState } from "~/shared/ui/Layout/ContainerEmptyState";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";

type Props = {
  baseAirport: AircraftAirport | null;
};

export function AircraftBaseAirportCard({ baseAirport }: Props) {
  return (
    <Container>
      <ContainerTitle icon={HiOutlineHome} title="Base airport" />

      {baseAirport ? (
        <div className="flex items-center gap-5">
          <span className="font-mono text-2xl font-bold text-gray-900 dark:text-white">{baseAirport.iataCode}</span>
          <div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">{baseAirport.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {baseAirport.city}, {baseAirport.country}
            </div>
          </div>
        </div>
      ) : (
        <ContainerEmptyState>No base airport assigned.</ContainerEmptyState>
      )}
    </Container>
  );
}
