"use client";

import type { Route } from ".react-router/types/app/routes/operations/airports/+types/AirportLayout";
import React from "react";
import { Outlet, useLoaderData } from "react-router";
import { AirportHeader } from "~/components/airport/Header/AirportHeader";
import { AirportInsights } from "~/components/airport/Header/AirportInsights";
import { AirportNavigation } from "~/components/airport/Header/AirportNavigation";
import { AirportTabs } from "~/components/airport/Table/Tabs/AirportTabs";
import { AirportService } from "~/state/api/airport.service";
import { usePageTitle } from "~/state/app/hooks/usePageTitle";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const airport = await new AirportService().fetchById(params.id);
  return { airport };
}

export default function AirportLayout() {
  const { airport } = useLoaderData<typeof clientLoader>();
  usePageTitle(`${airport.iataCode} | Airport`);

  return (
    <>
      <AirportNavigation id={airport.id} />
      <AirportHeader airport={airport} />
      <AirportInsights airport={airport} />

      <AirportTabs id={airport.id} />

      <Outlet />
    </>
  );
}
