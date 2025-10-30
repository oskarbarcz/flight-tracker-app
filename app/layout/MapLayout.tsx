"use client";

import React from "react";
import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router";
import { AdsbProvider } from "~/state/contexts/adsb.context";

export default function MapLayout() {
  return (
    <>
      <div className="w-screen h-screen-safe bg-gray-100 dark:bg-gray-950">
        <AdsbProvider>
          <Outlet />
        </AdsbProvider>
      </div>
      <ToastContainer />
    </>
  );
}
