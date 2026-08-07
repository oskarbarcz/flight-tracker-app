import type { Route } from ".react-router/types/app/routes/operations/airports/gates/+types/EditGateRoute";
import React from "react";
import { Navigate, useNavigate } from "react-router";
import { useAirportManagement } from "~/features/airport/components/Management/airportManagementContext";
import { EditGateModal } from "~/features/gate/components/EditGateModal";

export default function EditGateRoute({ params }: Route.ComponentProps) {
  const { airport, gates, terminals, parkingPositions } = useAirportManagement();
  const navigate = useNavigate();

  const listPath = `/airports/${params.id}/gates`;
  const gate = gates.find((candidate) => candidate.id === params.gateId);

  if (!gate) {
    return <Navigate to={listPath} replace />;
  }

  return (
    <EditGateModal
      airport={airport}
      gate={gate}
      terminals={terminals}
      parkingPositions={parkingPositions}
      close={() => navigate(listPath, { viewTransition: true })}
    />
  );
}
