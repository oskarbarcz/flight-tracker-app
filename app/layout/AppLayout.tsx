"use client";

import React from "react";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import Sidebar from "~/components/shared/Sidebar/Sidebar";
import ProtectedRoute from "~/routes/common/ProtectedRoute";

export default function AppLayout() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen min-w-full flex flex-col md:flex-row pt-20 md:pt-0 dark:bg-gray-950">
        <Sidebar />
        <div className="flex-1 flex justify-center p-4 md:p-8 overflow-y-auto">
          <div className="w-full max-w-7xl">
            <Outlet />
          </div>
        </div>
      </div>
      <ToastContainer />
    </ProtectedRoute>
  );
}
