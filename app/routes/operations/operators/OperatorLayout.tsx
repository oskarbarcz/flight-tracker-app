"use client";

import type { Route } from ".react-router/types/app/routes/operations/operators/+types/OperatorLayout";
import { Button } from "flowbite-react";
import React from "react";
import { HiPencil } from "react-icons/hi";
import { Link, Outlet, useLoaderData } from "react-router";
import { OperatorHeader } from "~/components/operator/Header/OperatorHeader";
import { OperatorInsights } from "~/components/operator/Header/OperatorInsights";
import { OperatorTabs } from "~/components/operator/Table/Tabs/OperatorTabs";
import type { TopNavRouteHandle } from "~/components/shared/TopNav/types";
import type { Operator } from "~/models";
import { OperatorService } from "~/state/api/operator.service";
import { usePageTitle } from "~/state/app/hooks/usePageTitle";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const operator = await new OperatorService().fetchById(params.operatorId);
  return { operator };
}

export const handle: TopNavRouteHandle = {
  breadcrumbs: (data) => {
    const { operator } = data as { operator: Operator };
    return [
      { label: "Operators", to: "/operators" },
      {
        label: (
          <>
            <span className="font-mono">{operator.iataCode}</span> · {operator.shortName}
          </>
        ),
      },
    ];
  },
};

export default function OperatorLayout() {
  const { operator } = useLoaderData<typeof clientLoader>();
  usePageTitle(`${operator.shortName} | Operator`);

  return (
    <>
      <OperatorHeader
        operator={operator}
        actions={
          <Button
            as={Link}
            color="indigo"
            to={`/operators/${operator.id}/edit`}
            className="space-x-1.5"
            size="sm"
            viewTransition
          >
            <HiPencil />
            <span>Edit operator</span>
          </Button>
        }
      />
      <OperatorInsights operator={operator} />

      <OperatorTabs id={operator.id} />

      <Outlet />
    </>
  );
}
