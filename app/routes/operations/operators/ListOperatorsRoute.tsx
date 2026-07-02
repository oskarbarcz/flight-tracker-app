import React, { useEffect } from "react";
import { HiPlus } from "react-icons/hi";
import { useLoaderData } from "react-router";
import { useDataRefresh } from "~/app-state/useDataRefresh";
import type { Operator } from "~/features/operator";
import { OperatorList } from "~/features/operator/components/List/OperatorList";
import { OperatorService } from "~/features/operator/service";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { SectionHeaderWithButton } from "~/shared/ui/Section/SectionHeaderWithButton";

export async function clientLoader(): Promise<Operator[]> {
  return new OperatorService().fetchAll();
}

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
      <OperatorList operators={operators} />
    </>
  );
}
