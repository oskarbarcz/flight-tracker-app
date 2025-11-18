"use client";

import { ThemeConfig } from "flowbite-react";
import React from "react";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import { MobileSidebar } from "~/components/shared/Sidebar/MobileSidebar";
import ProtectedRoute from "~/routes/common/ProtectedRoute";

export default function FormLayout() {
  return (
    <>
      <ThemeConfig />
      <ProtectedRoute>
        <div className="min-h-full min-w-full bg-indigo-50 dark:bg-gray-900 md:container p-2 md:px-0 md:py-8 mx-auto">
          <div className="flex-1 max-w-full min-w-0">
            <Outlet />
          </div>
        </div>
        <MobileSidebar />
        <ToastContainer />
      </ProtectedRoute>
    </>
  );
}
