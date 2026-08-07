import type { Route } from ".react-router/types/app/routes/operations/airports/runways/+types/CreateRunwayRoute";
import React from "react";
import { useNavigate } from "react-router";
import { useAirportManagement } from "~/features/airport/components/Management/airportManagementContext";
import { CreateRunwayModal } from "~/features/runway/components/CreateRunwayModal";

export default function CreateRunwayRoute({ params }: Route.ComponentProps) {
  const { airport } = useAirportManagement();
  const navigate = useNavigate();

  const close = () => navigate(`/airports/${params.id}/runways`, { viewTransition: true });

  return <CreateRunwayModal airport={airport} close={close} />;
}
