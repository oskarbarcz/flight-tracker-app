"use client";

import React from "react";
import { HiPlus } from "react-icons/hi";
import { useLoaderData } from "react-router";
import { OperatorListTable } from "~/components/operator/Table/OperatorListTable";
import { Container } from "~/components/shared/Layout/Container";
import { SectionHeaderWithButton } from "~/components/shared/Section/SectionHeaderWithButton";
import type { Operator } from "~/models";
import { OperatorService } from "~/state/api/operator.service";
import { usePageTitle } from "~/state/app/hooks/usePageTitle";

export async function clientLoader(): Promise<Operator[]> {
  return new OperatorService().fetchAll();
}

export default function ListOperatorsRoute() {
  usePageTitle("Operator list");
  const operators = useLoaderData<Operator[]>();

  return (
    <>
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
    </>
  );
}
