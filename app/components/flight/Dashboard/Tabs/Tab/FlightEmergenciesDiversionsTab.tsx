"use client";

import { Button, Tooltip } from "flowbite-react";
import React, { useState } from "react";
import { FaPlaneCircleExclamation, FaTriangleExclamation } from "react-icons/fa6";
import { ActiveEmergencyPanel } from "~/components/flight/Dashboard/Emergency/ActiveEmergencyPanel";
import { DeclareEmergencyModal } from "~/components/flight/Dashboard/Emergency/DeclareEmergencyModal";
import { EmergencyEmptyState } from "~/components/flight/Dashboard/Emergency/EmergencyEmptyState";
import { ResolvedEmergenciesHistory } from "~/components/flight/Dashboard/Emergency/ResolvedEmergenciesHistory";
import { Container } from "~/components/shared/Layout/Container";
import { ContainerTitle } from "~/components/shared/Layout/ContainerTitle";
import { FlightStatus } from "~/models";
import { useTrackedFlight } from "~/state/api/context/useTrackedFlight";

const STATUSES_VALID_FOR_DECLARATION: ReadonlySet<FlightStatus> = new Set([
  FlightStatus.TaxiingOut,
  FlightStatus.InCruise,
  FlightStatus.TaxiingIn,
]);

export function FlightEmergenciesDiversionsTab() {
  const { flight, emergencies, activeEmergency } = useTrackedFlight();
  const [declaring, setDeclaring] = useState(false);

  if (!flight) return null;

  const canDeclare = STATUSES_VALID_FOR_DECLARATION.has(flight.status);
  const resolved = emergencies.filter((e) => !e.isActive);

  const declareButton = (
    <Button color="red" onClick={() => setDeclaring(true)} disabled={!canDeclare || Boolean(activeEmergency)}>
      <FaTriangleExclamation className="me-1.5" />
      Declare emergency
    </Button>
  );

  const emergencyActions = activeEmergency ? null : canDeclare ? (
    declareButton
  ) : (
    <Tooltip content="Available only between off-block and on-block.">
      <span>{declareButton}</span>
    </Tooltip>
  );

  return (
    <div className="mt-4 flex flex-col gap-4">
      <Container padding="condensed">
        <ContainerTitle
          icon={FaTriangleExclamation}
          title="Emergencies"
          description="Declare, manage and review emergency declarations for this flight."
          actions={emergencyActions}
        />

        {activeEmergency ? (
          <ActiveEmergencyPanel emergency={activeEmergency} />
        ) : (
          <EmergencyEmptyState>
            No active emergency on this flight.
            {canDeclare
              ? " Use the Declare button if a new situation arises."
              : " Emergencies can be declared once the flight is off-block and before on-block."}
          </EmergencyEmptyState>
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

      <Container padding="condensed">
        <ContainerTitle
          icon={FaPlaneCircleExclamation}
          title="Diversions"
          description="Report and review flight diversion decisions."
        />
        <EmergencyEmptyState>Diversion reporting is coming soon.</EmergencyEmptyState>
      </Container>

      {declaring && <DeclareEmergencyModal close={() => setDeclaring(false)} />}
    </div>
  );
}
