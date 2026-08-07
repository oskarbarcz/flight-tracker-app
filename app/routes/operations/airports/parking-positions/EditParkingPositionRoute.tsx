import type { Route } from ".react-router/types/app/routes/operations/airports/parking-positions/+types/EditParkingPositionRoute";
import React from "react";
import { Navigate, useNavigate } from "react-router";
import { useAirportManagement } from "~/features/airport/components/Management/airportManagementContext";
import { EditParkingPositionModal } from "~/features/parking-position/components/EditParkingPositionModal";

export default function EditParkingPositionRoute({ params }: Route.ComponentProps) {
  const { airport, parkingPositions, terminals } = useAirportManagement();
  const navigate = useNavigate();

  const listPath = `/airports/${params.id}/parking-positions`;
  const parkingPosition = parkingPositions.find((candidate) => candidate.id === params.parkingPositionId);

  if (!parkingPosition) {
    return <Navigate to={listPath} replace />;
  }

  return (
    <EditParkingPositionModal
      airport={airport}
      parkingPosition={parkingPosition}
      terminals={terminals}
      close={() => navigate(listPath, { viewTransition: true })}
    />
  );
}
