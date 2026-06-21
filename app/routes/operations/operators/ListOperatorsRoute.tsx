import React, { useEffect } from "react";
import { HiPlus } from "react-icons/hi";
import { useLoaderData } from "react-router";
import { OperatorListTable } from "~/components/operator/Table/OperatorListTable";
import { TransparentContainer } from "~/components/shared/Layout/TransparentContainer";
import { SectionHeaderWithButton } from "~/components/shared/Section/SectionHeaderWithButton";
import type { TopNavRouteHandle } from "~/components/shared/TopNav/types";
import type { Operator } from "~/models";
import { OperatorService } from "~/state/api/operator.service";
import { useDataRefresh } from "~/state/app/context/useDataRefresh";
import { usePageTitle } from "~/state/app/hooks/usePageTitle";

export async function clientLoader(): Promise<Operator[]> {
  return new OperatorService().fetchAll();
}

export const handle: TopNavRouteHandle = {
  breadcrumbs: () => [{ label: "Operators" }],
};

export default function ListOperatorsRoute() {
  usePageTitle("Operator list");
  const operators = useLoaderData<Operator[]>();
  const { markRefreshed } = useDataRefresh();

  useEffect(() => {
    markRefreshed();
  }, [markRefreshed]);

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
      <TransparentContainer className="overflow-x-auto">
        <OperatorListTable operators={operators} />
      </TransparentContainer>
    </>
  );
}
