"use client";

import React from "react";
import { Navigate } from "react-router";
import { UserRole } from "~/models";
import PilotDashboardRoute from "~/routes/pilot/PilotDashboardRoute";
import { useAuth } from "~/state/api/context/useAuth";

export default function DashboardRoute() {
  const { user } = useAuth();

  if (user === null) {
    return <div>Loading...</div>;
  }

  if (user.role === UserRole.CabinCrew) {
    return <PilotDashboardRoute />;
  }

  if (user.role === UserRole.Operations) {
    return <Navigate to="/flights" replace />;
  }
}
