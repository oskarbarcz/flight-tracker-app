import React from "react";
import { FaTriangleExclamation } from "react-icons/fa6";
import { ActiveEmergencyPanel } from "~/components/flight/Dashboard/Emergency/ActiveEmergencyPanel";
import { EmergencyEmptyState } from "~/components/flight/Dashboard/Emergency/EmergencyEmptyState";
import { ResolvedEmergenciesHistory } from "~/components/flight/Dashboard/Emergency/ResolvedEmergenciesHistory";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";
import { useTrackedFlight } from "~/state/api/context/useTrackedFlight";

export default function FlightEmergenciesRoute() {
  const { emergencies, activeEmergency } = useTrackedFlight();
  const resolved = emergencies.filter((e) => !e.isActive);

  return (
    <div className="mt-4 flex flex-col gap-4">
      <Container padding="condensed">
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
