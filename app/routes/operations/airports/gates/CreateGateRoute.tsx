import type { Route } from ".react-router/types/app/routes/operations/airports/gates/+types/CreateGateRoute";
import React from "react";
import { useNavigate } from "react-router";
import { useAirportManagement } from "~/features/airport/components/Management/airportManagementContext";
import { CreateGateModal } from "~/features/gate/components/CreateGateModal";

export default function CreateGateRoute({ params }: Route.ComponentProps) {
  const { airport, terminals, parkingPositions } = useAirportManagement();
  const navigate = useNavigate();

  const close = () => navigate(`/airports/${params.id}/gates`, { viewTransition: true });

  return <CreateGateModal airport={airport} terminals={terminals} parkingPositions={parkingPositions} close={close} />;
}
