"use client";

import React from "react";
import { FaPlane } from "react-icons/fa";
import { Fa1 } from "react-icons/fa6";
import { HiPlus } from "react-icons/hi";
import { useLoaderData } from "react-router";
import { OperatorHeader } from "~/components/operator/Header/OperatorHeader";
import { OperatorNavigation } from "~/components/operator/Header/OperatorNavigation";
import RichStatDisplay from "~/components/shared/Display/RichStatDisplay";
import Container from "~/components/shared/Layout/Container";
import SectionHeaderWithLink from "~/components/shared/Section/SectionHeaderWithLink";
import { continentToDisplayName, Operator } from "~/models";
import { UserRole } from "~/models/user.model";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { OperatorService } from "~/state/api/operator.service";
import { usePageTitle } from "~/state/hooks/usePageTitle";
import { Route } from "../../../../.react-router/types/app/routes/operations/operators/+types/EditOperatorRoute";

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs): Promise<Operator> {
  return new OperatorService().fetchById(params.id);
}

export default function OperatorRoute() {
  const operator = useLoaderData<Operator>();

  usePageTitle("Operator");

  const hubs =
    operator.hubs.length > 2
      ? operator.hubs.slice(0, 2).join(", ") + ", ..."
      : operator.hubs.join(", ");

  return (
    <ProtectedRoute expectedRole={UserRole.Operations}>
      <OperatorNavigation id={operator.id} />
      <OperatorHeader operator={operator} />

      <div className="grid grid-cols-4 gap-3">
        <RichStatDisplay
          icon={<FaPlane />}
          color="indigo"
          title="Operator hubs"
          value={hubs}
          valueSmaller
        />
        <RichStatDisplay
          icon={<FaPlane />}
          color="indigo"
          title="Fleet size"
          value={String(operator.fleetSize)}
          valueSuffix="Aircraft"
        />
        <RichStatDisplay
          icon={<FaPlane />}
          color="indigo"
          title="Avg fleet age"
          value={String(operator.avgFleetAge)}
          valueSuffix="Years"
        />
        <RichStatDisplay
          icon={<FaPlane />}
          color="indigo"
          title="Region"
          value={continentToDisplayName(operator.continent)}
          valueSmaller
        />
      </div>

      <div className="min-h-96"></div>
      <SectionHeaderWithLink
        sectionTitle="Operators"
        primaryButton={{
          text: "Create new",
          url: "/operators/new",
          icon: <HiPlus />,
          color: "indigo",
        }}
      />
      <Container className="overflow-x-auto" padding="none">
        HI OPERATOR
      </Container>
    </ProtectedRoute>
  );
}
