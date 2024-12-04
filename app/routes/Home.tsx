import type { Route } from "./+types/Home";
import {AppNavigation} from "~/components/AppNavigation/AppNavigation";
import {Flowbite} from "flowbite-react";
import React from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home | FlightModel Tracker" },
    { name: "description", content: "This is flight tracker app." },
  ];
}

export default function Home() {
  return <Flowbite>
    <AppNavigation></AppNavigation>
    <div className="container mx-auto py-4 text-gray-950 dark:text-white">
    </div>
  </Flowbite>;
}
