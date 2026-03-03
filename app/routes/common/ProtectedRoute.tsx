"use client";

import React, {JSX, ReactNode, useContext} from "react";
import { Navigate, useNavigate } from "react-router";
import Splash from "~/layout/common/Splash";
import { UserRole } from "~/models/user.model";
import { AuthContext } from "~/state/contexts/session/auth.context";

type Props = {
  expectedRole?: UserRole;
  children: ReactNode;
}

export default function ProtectedRoute({ expectedRole, children, }: Props): JSX.Element {
  const { user, isLoading, accessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  if (isLoading) {
    return <Splash />;
  }

  if (!user || !accessToken) {
    // navigate("/sign-in", { replace: true, viewTransition: true });
    return <Navigate to="/sign-in" replace />;
  }

  if (expectedRole && user.role !== expectedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children as JSX.Element;
};
