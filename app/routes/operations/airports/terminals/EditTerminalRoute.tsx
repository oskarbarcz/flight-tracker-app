import type { Route } from ".react-router/types/app/routes/operations/airports/terminals/+types/EditTerminalRoute";
import React from "react";
import { Navigate, useNavigate } from "react-router";
import { useAirportManagement } from "~/features/airport/components/Management/airportManagementContext";
import { EditTerminalModal } from "~/features/terminal/components/EditTerminalModal";

export default function EditTerminalRoute({ params }: Route.ComponentProps) {
  const { airport, terminals } = useAirportManagement();
  const navigate = useNavigate();

  const listPath = `/airports/${params.id}/terminals`;
  const terminal = terminals.find((candidate) => candidate.id === params.terminalId);

  if (!terminal) {
    return <Navigate to={listPath} replace />;
  }

  return (
    <EditTerminalModal
      airport={airport}
      terminal={terminal}
      close={() => navigate(listPath, { viewTransition: true })}
    />
  );
}
