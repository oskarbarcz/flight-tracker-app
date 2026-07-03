import React from "react";
import { FaTriangleExclamation } from "react-icons/fa6";
import { ActiveEmergencyPanel } from "~/features/emergency/components/ActiveEmergencyPanel";
import { EmergencyEmptyState } from "~/features/emergency/components/EmergencyEmptyState";
import { ResolvedEmergenciesHistory } from "~/features/emergency/components/ResolvedEmergenciesHistory";
import { FlightAlternateAirportsCard } from "~/features/flight/components/Airports/FlightAlternateAirportsCard";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";

export default function FlightEmergenciesRoute() {
  const { flight, emergencies, activeEmergency } = useTrackedFlight();
  const resolved = emergencies.filter((e) => !e.isActive);

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
      <FlightAlternateAirportsCard airports={flight?.airports ?? []} />

      <Container padding="condensed" className="lg:col-span-2">
        <ContainerTitle icon={FaTriangleExclamation} title="Emergencies" />

        {activeEmergency ? (
          <ActiveEmergencyPanel emergency={activeEmergency} readOnly />
        ) : (
          <EmergencyEmptyState>No active emergency on this flight.</EmergencyEmptyState>
        )}

        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
            Past declarations
          </h4>
          {resolved.length === 0 ? (
            <EmergencyEmptyState>No past emergency declarations for this flight.</EmergencyEmptyState>
          ) : (
            <ResolvedEmergenciesHistory emergencies={resolved} />
          )}
        </div>
      </Container>
    </div>
  );
}
