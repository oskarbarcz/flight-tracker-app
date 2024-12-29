"use client";

import { AppNavigation } from "~/components/AppNavigation/AppNavigation";
import { Flowbite } from "flowbite-react";
import React from "react";
import ProtectedRoute from "~/routes/ProtectedRoute";

export function meta() {
  return [
    { title: "HomeRoute | FlightModel Tracker" },
    { name: "description", content: "This is flight tracker app." },
  ];
}

export default function HomeRoute() {
  return (
    <ProtectedRoute>
      <Flowbite>
        <AppNavigation></AppNavigation>
        <div className="container mx-auto py-4 text-gray-950 dark:text-white"></div>
      </Flowbite>
    </ProtectedRoute>
  );
}
