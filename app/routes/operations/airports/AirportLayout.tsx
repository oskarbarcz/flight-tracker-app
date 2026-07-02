import type { Route } from ".react-router/types/app/routes/operations/airports/+types/AirportLayout";
import React from "react";
import { Outlet, useLoaderData } from "react-router";
import { AirportHeader } from "~/components/airport/Header/AirportHeader";
import { AirportTabs } from "~/components/airport/Table/Tabs/AirportTabs";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { AirportService } from "~/state/api/airport.service";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const airport = await new AirportService().fetchById(params.id);
  return { airport };
}

export default function AirportLayout() {
  const { airport } = useLoaderData<typeof clientLoader>();
  usePageTitle(`${airport.iataCode} | Airport`);

  return (
    <>
      <div className="mb-3">
        <AirportHeader airport={airport} />
      </div>
      <AirportTabs id={airport.id} />
      <Outlet />
    </>
  );
}
