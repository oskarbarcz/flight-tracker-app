"use client";

import React from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import SectionHeaderWithLink from "~/components/SectionHeaderWithLink";
import { Operator } from "~/models";
import { useLoaderData } from "react-router";
import { OperatorService } from "~/state/api/operator.service";
import { UserRole } from "~/models/user.model";
import { usePageTitle } from "~/state/hooks/usePageTitle";
import OperatorListTable from "~/components/Tables/OperatorListTable";
import Container from "~/components/Container";

export async function clientLoader(): Promise<Operator[]> {
  return new OperatorService().fetchAll();
}

export default function OperatorsListRoute() {
  usePageTitle("Operator list");
  const operators = useLoaderData<Operator[]>();

  return (
    <ProtectedRoute expectedRole={UserRole.Operations}>
      <SectionHeaderWithLink
        sectionTitle="Operators"
        linkText="Create new"
        linkUrl="/operators/new"
      />
      <Container className="overflow-x-auto" noPadding>
        <OperatorListTable operators={operators} />
      </Container>
    </ProtectedRoute>
  );
}
