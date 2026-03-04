"use client";

import React, { JSX } from "react";
import { Navigate } from "react-router";

export default function OperationsDashboardRoute(): JSX.Element {
  return <Navigate to="/flights" replace />;
}
