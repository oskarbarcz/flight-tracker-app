"use client";

import React from "react";
import { HiPlus } from "react-icons/hi";
import { useLoaderData } from "react-router";
import { OperatorHeader } from "~/components/operator/Header/OperatorHeader";
import { OperatorNavigation } from "~/components/operator/Header/OperatorNavigation";
import Container from "~/components/shared/Layout/Container";
import SectionHeaderWithLink from "~/components/shared/Section/SectionHeaderWithLink";
import { Operator } from "~/models";
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

  return (
    <ProtectedRoute expectedRole={UserRole.Operations}>
      <OperatorNavigation id={operator.id} />
      <OperatorHeader operator={operator} />
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
