"use client";

import React, { useState } from "react";
import { Outlet } from "react-router";
import { Sidebar } from "~/components/Sidebar/Sidebar";
import MobileSidebarExpander from "~/components/Sidebar/MobileSidebarExpander";
import { useSidebarState } from "~/state/hooks/useSidebarState";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { ToastContainer } from "react-toastify";

function getSidebarClasses(isMobileOpen: boolean, isCollapsed: boolean) {
  const classes = [
    "fixed",
    "top-0",
    "left-0",
    "z-40",
    "flex",
    "h-screen",
    "flex-col",
    "border-gray-50",
    "bg-indigo-500",
    "transition-transform",
    "duration-300",
    "md:translate-x-0",
  ];

  if (isMobileOpen) {
    classes.push("translate-x-0");
  } else {
    classes.push("-translate-x-full");
  }

  if (isCollapsed) {
    classes.push("w-16");
  } else {
    classes.push("w-64");
  }

  return classes.join(" ");
}

function getContentClasses(isCollapsed: boolean) {
  const classes = [
    "flex-1",
    "md:p-3",
    "md:ps-0",
    "transition-all",
    "duration-300",
    "text-gray-800",
    "dark:text-white",
    "bg-indigo-500",
  ];

  if (isCollapsed) {
    classes.push("md:ml-16");
  } else {
    classes.push("md:ml-64");
  }

  return classes.join(" ");
}

export default function OldAppLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, toggleCollapse] = useSidebarState();

  const handleMobileToggle = () => setIsMobileOpen((prev) => !prev);

  return (
    <>
      <ProtectedRoute>
        <div className="flex min-h-screen flex-col md:flex-row">
          <div className={getSidebarClasses(isMobileOpen, isCollapsed)}>
            <Sidebar
              isCollapsed={isCollapsed}
              handleDesktopCollapse={toggleCollapse}
            />
          </div>

          {isMobileOpen && (
            <div
              className="fixed inset-0 z-30 bg-black/50 md:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
          )}

          <div className="p-2 md:hidden">
            <MobileSidebarExpander handleMobileToggle={handleMobileToggle} />
          </div>
          <div className={getContentClasses(isCollapsed)}>
            <div className="size-full rounded-t-2xl bg-white p-4 text-gray-700 dark:bg-gray-900 dark:text-gray-300 md:rounded-3xl md:p-8">
              <Outlet />
            </div>
          </div>
        </div>
        <ToastContainer />
      </ProtectedRoute>
    </>
  );
}
