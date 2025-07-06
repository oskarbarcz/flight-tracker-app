"use client";

import React from "react";
import { Sidebar } from "~/components/Sidebar/Sidebar";
import { useSidebarState } from "~/state/hooks/useSidebarState";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import { ThemeConfig } from "flowbite-react";
import { Outlet } from "react-router";

export default function OldAppLayout() {
  const [isCollapsed, toggleCollapse] = useSidebarState();

  return (
    <>
      <ThemeConfig />
      <ProtectedRoute>
        <div className="min-h-full min-w-full bg-indigo-50 dark:bg-gray-900">
          <div className="md:container py-8 md:mx-auto">
            <div className="min-h-[200px] w-full flex gap-8">
              <div className="w-[300px] h-full">
                <Sidebar
                  isCollapsed={isCollapsed}
                  handleDesktopCollapse={toggleCollapse}
                />
              </div>
              <div className="w-full">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </ProtectedRoute>
    </>
  );
}
