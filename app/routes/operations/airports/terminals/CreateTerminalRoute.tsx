import type { Route } from ".react-router/types/app/routes/operations/airports/terminals/+types/CreateTerminalRoute";
import React from "react";
import { useNavigate } from "react-router";
import { useAirportManagement } from "~/features/airport/components/Management/airportManagementContext";
import { CreateTerminalModal } from "~/features/terminal/components/CreateTerminalModal";

export default function CreateTerminalRoute({ params }: Route.ComponentProps) {
  const { airport } = useAirportManagement();
  const navigate = useNavigate();

  const close = () => navigate(`/airports/${params.id}/terminals`, { viewTransition: true });

  return <CreateTerminalModal airport={airport} close={close} />;
}
