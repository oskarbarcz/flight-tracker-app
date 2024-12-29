import React from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { Outlet } from "react-router";
import { AppNavigation } from "~/components/AppNavigation/AppNavigation";
import { Flowbite } from "flowbite-react";

const AppLayout: React.FC = () => {
  return (
    <ProtectedRoute>
      <Flowbite>
        <AppNavigation></AppNavigation>
        <div className="container mx-auto py-4 text-gray-800 dark:text-white">
          <Outlet />
        </div>
      </Flowbite>
    </ProtectedRoute>
  );
};

export default AppLayout;
