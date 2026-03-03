"use client";

import React from "react";
import {Outlet, useLoaderData} from "react-router";
import { OperatorHeader } from "~/components/operator/Header/OperatorHeader";
import { OperatorNavigation } from "~/components/operator/Header/OperatorNavigation";
import { UserRole } from "~/models/user.model";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { OperatorService } from "~/state/api/operator.service";
import { Route } from ".react-router/types/app/layout/operations/operators/+types/OperatorLayout";
import {OperatorInsights} from "~/components/operator/Header/OperatorInsights";
import {usePageTitle} from "~/state/hooks/usePageTitle";
import OperatorTabs from "~/components/operator/Table/OperatorTabs";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const operator = await new OperatorService().fetchById(params.id);
  return { operator };
}

export default function OperatorLayout() {
  const { operator } = useLoaderData<typeof clientLoader>();
  usePageTitle(`${operator.shortName} | Operator`);

  return (
    <ProtectedRoute expectedRole={UserRole.Operations}>
      <OperatorNavigation id={operator.id} />
      <OperatorHeader operator={operator} />
      <OperatorInsights operator={operator} />

      <OperatorTabs id={operator.id} />

      <Outlet />
    </ProtectedRoute>
  );
}
