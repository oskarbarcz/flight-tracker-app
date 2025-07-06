"use client";

import React from "react";
import { Sidebar } from "~/components/Sidebar/Sidebar";
import { useSidebarState } from "~/state/hooks/useSidebarState";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { ToastContainer } from "react-toastify";

export default function OldAppLayout() {
  const [isCollapsed, toggleCollapse] = useSidebarState();

  return (
    <>
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
    </>
  );
}
