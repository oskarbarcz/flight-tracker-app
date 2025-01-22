import React, { useState } from "react";
import { Button } from "flowbite-react";
import { HiMenu } from "react-icons/hi";
import { Outlet } from "react-router";
import { AppSidebar } from "~/components/Layout/AppSidebar";

function getSidebarClasses(isMobileOpen: boolean, isCollapsed: boolean) {
  const classes = [
    "fixed",
    "top-0",
    "left-0",
    "z-40",
    "flex",
    "h-screen",
    "flex-col",
    "border-r",
    "border-gray-50",
    "bg-gray-100",
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
    "p-4",
    "transition-all",
    "duration-300",
    "text-gray-800",
    "dark:text-white",
    "bg-white",
  ];

  if (isCollapsed) {
    classes.push("md:ml-16");
  } else {
    classes.push("md:ml-64");
  }

  return classes.join(" ");
}

export default function SidebarLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleMobileToggle = () => setIsMobileOpen((prev) => !prev);
  const handleDesktopCollapse = () => setIsCollapsed((prev) => !prev);

  return (
    <div className="flex min-h-screen">
      <div className={getSidebarClasses(isMobileOpen, isCollapsed)}>
        <AppSidebar
          isCollapsed={isCollapsed}
          handleDesktopCollapse={handleDesktopCollapse}
        />
      </div>

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div className="p-2 md:hidden">
        <Button color="light" onClick={handleMobileToggle}>
          <HiMenu className="size-6" />
        </Button>
      </div>
      <div className={getContentClasses(isCollapsed)}>
        <Outlet />
      </div>
    </div>
  );
}
