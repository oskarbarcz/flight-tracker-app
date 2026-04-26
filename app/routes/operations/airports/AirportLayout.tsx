"use client";

import type { Route } from ".react-router/types/app/routes/operations/airports/+types/AirportLayout";
import React from "react";
import { Outlet, useLoaderData } from "react-router";
import { AirportHeader } from "~/components/airport/Header/AirportHeader";
import { AirportTabs } from "~/components/airport/Table/Tabs/AirportTabs";
import { Container } from "~/components/shared/Layout/Container";
import type { TopNavRouteHandle } from "~/components/shared/TopNav/types";
import type { Airport } from "~/models";
import { AirportService } from "~/state/api/airport.service";
import { usePageTitle } from "~/state/app/hooks/usePageTitle";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const airport = await new AirportService().fetchById(params.id);
  return { airport };
}

export const handle: TopNavRouteHandle = {
  breadcrumbs: (data) => {
    const { airport } = data as { airport: Airport };
    return [
      { label: "Airports", to: "/airports" },
      {
        label: (
          <>
            <span className="font-mono">{airport.iataCode}</span> · {airport.name}
          </>
        ),
      },
    ];
  },
};

export default function AirportLayout() {
  const { airport } = useLoaderData<typeof clientLoader>();
  usePageTitle(`${airport.iataCode} | Airport`);

  return (
    <>
      <Container className="mb-3">
        <AirportHeader airport={airport} />
      </Container>
      <AirportTabs id={airport.id} />
      <Outlet />
    </>
  );
}
