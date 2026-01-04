"use client";

import React from "react";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import Sidebar from "~/components/shared/Sidebar/Sidebar";
import ProtectedRoute from "~/routes/common/ProtectedRoute";

export default function AppLayout() {
  return (
    <ProtectedRoute>
      <div className="min-h-full min-w-full flex pb-24 md:pb-0 dark:bg-gray-950">
        <Sidebar />
        <div className="container mx-auto">
          <Outlet />
        </div>
      </div>
      <ToastContainer />
    </ProtectedRoute>
  );
}
