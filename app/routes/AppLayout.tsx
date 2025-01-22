import React from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { Flowbite } from "flowbite-react";
import SidebarLayout from "~/components/Layout/SidebarLayout";

const AppLayout: React.FC = () => {
  return (
    <Flowbite>
      <ProtectedRoute>
        <SidebarLayout />
      </ProtectedRoute>
    </Flowbite>
  );
};

export default AppLayout;
