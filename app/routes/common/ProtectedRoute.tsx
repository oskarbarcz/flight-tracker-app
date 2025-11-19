"use client";

import React, { ReactNode, useContext } from "react";
import { Navigate, useNavigate } from "react-router";
import Splash from "~/layout/Splash";
import { UserRole } from "~/models/user.model";
import { AuthContext } from "~/state/contexts/session/auth.context";

interface ProtectedRouteProps {
  expectedRole?: UserRole;
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  expectedRole,
  children,
}: ProtectedRouteProps) => {
  const { user, isLoading, accessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  if (isLoading) {
    return <Splash />;
  }

  if (!user || !accessToken) {
    navigate("/sign-in", { replace: true, viewTransition: true });
    return;
    // return <Navigate to="/sign-in" replace />;
  }

  if (expectedRole && user.role !== expectedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
