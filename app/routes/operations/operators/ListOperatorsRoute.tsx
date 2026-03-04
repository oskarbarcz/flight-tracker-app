"use client";

import React, { JSX } from "react";
import { HiPlus } from "react-icons/hi";
import { useLoaderData } from "react-router";
import OperatorListTable from "~/components/operator/Table/OperatorListTable";
import Container from "~/components/shared/Layout/Container";
import SectionHeaderWithButton from "~/components/shared/Section/SectionHeaderWithButton";
import { Operator } from "~/models";
import { UserRole } from "~/models/user.model";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { OperatorService } from "~/state/api/operator.service";
import { usePageTitle } from "~/state/hooks/usePageTitle";

export async function clientLoader(): Promise<Operator[]> {
  return new OperatorService().fetchAll();
}

export default function ListOperatorsRoute(): JSX.Element {
  usePageTitle("Operator list");
  const operators = useLoaderData<Operator[]>();

  return (
    <ProtectedRoute expectedRole={UserRole.Operations}>
      <SectionHeaderWithButton
        sectionTitle="Operators"
        primaryButton={{
          text: "Create new",
          url: "/operators/new",
          icon: <HiPlus />,
          color: "indigo",
        }}
      />
      <Container className="overflow-x-auto" padding="none">
        <OperatorListTable operators={operators} />
      </Container>
    </ProtectedRoute>
  );
}
