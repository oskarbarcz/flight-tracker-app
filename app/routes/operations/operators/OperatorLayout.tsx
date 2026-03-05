"use client";

import { Route } from ".react-router/types/app/routes/operations/operators/+types/OperatorLayout";
import React, { JSX } from "react";
import { Outlet, useLoaderData } from "react-router";
import { OperatorHeader } from "~/components/operator/Header/OperatorHeader";
import { OperatorInsights } from "~/components/operator/Header/OperatorInsights";
import { OperatorNavigation } from "~/components/operator/Header/OperatorNavigation";
import { OperatorTabs } from "~/components/operator/Table/Tabs/OperatorTabs";
import { OperatorService } from "~/state/api/operator.service";
import { usePageTitle } from "~/state/hooks/usePageTitle";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const operator = await new OperatorService().fetchById(params.operatorId);
  return { operator };
}

export default function OperatorLayout(): JSX.Element {
  const { operator } = useLoaderData<typeof clientLoader>();
  usePageTitle(`${operator.shortName} | Operator`);

  return (
    <>
      <OperatorNavigation id={operator.id} />
      <OperatorHeader operator={operator} />
      <OperatorInsights operator={operator} />

      <OperatorTabs id={operator.id} />

      <Outlet />
    </>
  );
}
