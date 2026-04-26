"use client";

import type { Route } from ".react-router/types/app/routes/operations/airports/+types/AirportLayout";
import React from "react";
import { Outlet, useLoaderData } from "react-router";
import { AirportHeader } from "~/components/airport/Header/AirportHeader";
import { AirportNavigation } from "~/components/airport/Header/AirportNavigation";
import { AirportTabs } from "~/components/airport/Table/Tabs/AirportTabs";
import { Container } from "~/components/shared/Layout/Container";
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
      <Container className="mb-3">
        <AirportNavigation />
        <AirportHeader airport={airport} />
      </Container>
      <AirportTabs id={airport.id} />
      <Outlet />
    </>
  );
}
