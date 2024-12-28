import React, {ReactNode, useContext} from 'react';
import {AuthContext} from "~/state/contexts/auth.context";
import {Navigate} from "react-router";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const auth = useContext(AuthContext);

  if (!auth) {
    return null;
  }

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  console.log(auth);

  if (!auth.user || !auth.token) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};

export default ProtectedRoute;
