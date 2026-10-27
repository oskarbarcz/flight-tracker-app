import React from "react";
import { Navigate } from "react-router";

export default function DashboardRedirectRoute() {
  return <Navigate to="/" replace />;
}
