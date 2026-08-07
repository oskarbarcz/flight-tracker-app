import type { Route } from ".react-router/types/app/routes/operations/airports/runways/+types/EditRunwayRoute";
import React from "react";
import { Navigate, useNavigate } from "react-router";
import { useAirportManagement } from "~/features/airport/components/Management/airportManagementContext";
import { EditRunwayModal } from "~/features/runway/components/EditRunwayModal";

export default function EditRunwayRoute({ params }: Route.ComponentProps) {
  const { airport, runways } = useAirportManagement();
  const navigate = useNavigate();

  const listPath = `/airports/${params.id}/runways`;
  const runway = runways.find((candidate) => candidate.id === params.runwayId);

  if (!runway) {
    return <Navigate to={listPath} replace />;
  }

  return (
    <EditRunwayModal airport={airport} runway={runway} close={() => navigate(listPath, { viewTransition: true })} />
  );
}
