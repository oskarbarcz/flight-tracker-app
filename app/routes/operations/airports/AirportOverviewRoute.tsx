"use client";

import type { Route } from ".react-router/types/app/routes/operations/airports/+types/AirportOverviewRoute";
import React from "react";
import { useLoaderData } from "react-router";
import { AirportDetailsCard } from "~/components/airport/Overview/AirportDetailsCard";
import { AirportLocationMap } from "~/components/airport/Overview/AirportLocationMap";
import { AirportService } from "~/state/api/airport.service";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const airport = await new AirportService().fetchById(params.id);
  return { airport };
}

export default function AirportOverviewRoute() {
  const { airport } = useLoaderData<typeof clientLoader>();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
      <AirportDetailsCard airport={airport} />
      <AirportLocationMap airport={airport} />
    </div>
  );
}
