import { JSX } from "react";
import { Outlet } from "react-router";
import { UserRole } from "~/models";
import ProtectedRoute from "~/routes/common/ProtectedRoute";

export default function OperationsRoute(): JSX.Element {
  return (
    <ProtectedRoute allowedRole={UserRole.Operations}>
      <Outlet />
    </ProtectedRoute>
  );
}
