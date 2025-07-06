"use client";

import React, { useState } from "react";
import { Outlet } from "react-router";
import { Sidebar } from "~/components/Sidebar/Sidebar";
import MobileSidebarExpander from "~/components/Sidebar/MobileSidebarExpander";
import { useSidebarState } from "~/state/hooks/useSidebarState";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { Flowbite } from "flowbite-react";
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
    <Flowbite>
      <ProtectedRoute>
        <div className="min-h-full min-w-full bg-white">
          <div className="md:container md:mx-auto">
            <div className="min-h-[200px] w-full bg-red-800">
              <div className="w-[300px] h-full">
                <Sidebar isCollapsed={isCollapsed} handleDesktopCollapse={toggleCollapse} />
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </ProtectedRoute>
    </Flowbite>
  );
}
