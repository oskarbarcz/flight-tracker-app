"use client";

import React from "react";
import { Sidebar } from "~/components/Sidebar/Sidebar";
import { useSidebarState } from "~/state/hooks/useSidebarState";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import { ThemeConfig } from "flowbite-react";
import { Outlet } from "react-router";
import { MobileSidebar } from "~/components/Sidebar/MobileSidebar";

export default function OldAppLayout() {
  const [isCollapsed, toggleCollapse] = useSidebarState();

  return (
    <>
      <ThemeConfig />
      <ProtectedRoute>
        <div className="min-h-full min-w-full pb-24 md:pb-0 bg-indigo-50 dark:bg-gray-900">
          <div className="md:container p-2 md:px-0 md:py-4 md:mx-auto">
            <div className="flex min-h-[200px] ease-in-out transition-all duration-500 w-full gap-4">
              <div
                className={`
                transition-[width] ease-in-out hidden md:flex
                ${isCollapsed ? " w-[80px] h-full" : " w-[300px]"}
              `}
              >
                <Sidebar
                  isCollapsed={isCollapsed}
                  handleDesktopCollapse={toggleCollapse}
                />
              </div>
              <div className="flex-1 max-w-full min-w-0">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
        <MobileSidebar />
        <ToastContainer />
      </ProtectedRoute>
    </>
  );
}
