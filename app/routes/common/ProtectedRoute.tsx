"use client";

import React, { ReactNode, useContext } from "react";
import { AuthContext } from "~/state/contexts/auth.context";
import { Navigate } from "react-router";
import { UserRole } from "~/models/user.model";
import Splash from "~/layout/Splash";

interface ProtectedRouteProps {
  expectedRole?: UserRole;
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  expectedRole,
  children,
}: ProtectedRouteProps) => {
  const { user, isLoading, accessToken } = useContext(AuthContext);

  if (isLoading) {
    return <Splash />;
  }

  if (!user || !accessToken) {
    return <Navigate to="/sign-in" replace />;
  }

  if (expectedRole && user.role !== expectedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
