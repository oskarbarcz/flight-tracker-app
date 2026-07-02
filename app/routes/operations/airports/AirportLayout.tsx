import type { Route } from ".react-router/types/app/routes/operations/airports/+types/AirportLayout";
import React from "react";
import { Outlet, useLoaderData } from "react-router";
import { AirportHeader } from "~/features/airport/components/Header/AirportHeader";
import { AirportTabs } from "~/features/airport/components/Table/Tabs/AirportTabs";
import { AirportService } from "~/features/airport/service";
import { usePageTitle } from "~/shared/hooks/usePageTitle";

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
