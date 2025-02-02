import React, { ReactNode, useContext } from "react";
import { AuthContext } from "~/state/contexts/auth.context";
import { Navigate } from "react-router";
import { UserRole } from "~/models/user.model";

interface ProtectedRouteProps {
  expectedRole?: UserRole;
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  expectedRole,
  children,
}: ProtectedRouteProps) => {
  const auth = useContext(AuthContext);

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (!auth.user || !auth.accessToken) {
    return <Navigate to="/sign-in" replace />;
  }
  const { user } = auth;

  if (expectedRole && user.role !== expectedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
