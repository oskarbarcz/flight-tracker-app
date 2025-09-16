"use client";

import React from "react";
import { ToastContainer } from "react-toastify";
import {Outlet} from "react-router";
import {AdsbProvider} from "~/state/contexts/adsb.context";

export default function MapLayout() {
  return (
    <>
      <div className="min-h-full min-w-full bg-indigo-50 dark:bg-gray-900">
        <AdsbProvider>
          <Outlet />
        </AdsbProvider>
      </div>
      <ToastContainer />
    </>
  );
}
