import type { Route } from ".react-router/types/app/routes/operations/airports/parking-positions/+types/CreateParkingPositionRoute";
import React from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAirportManagement } from "~/features/airport/components/Management/airportManagementContext";
import { CreateParkingPositionModal } from "~/features/parking-position/components/CreateParkingPositionModal";

export default function CreateParkingPositionRoute({ params }: Route.ComponentProps) {
  const { airport, terminals, parkingPositions } = useAirportManagement();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const duplicateFrom = searchParams.get("duplicateFrom");
  const duplicateOf = parkingPositions.find((candidate) => candidate.id === duplicateFrom) ?? null;

  const close = () => navigate(`/airports/${params.id}/parking-positions`, { viewTransition: true });

  return <CreateParkingPositionModal airport={airport} terminals={terminals} duplicateOf={duplicateOf} close={close} />;
}
