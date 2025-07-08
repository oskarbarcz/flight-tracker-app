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
            <div className="min-h-[200px] ease-in-out transition-all duration-500 w-full flex gap-8">
              <div className={isCollapsed ? "w-[76px] h-full transition-[width] ease-in-out" : "w-[300px] transition-[width] ease-in-out"}>
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
