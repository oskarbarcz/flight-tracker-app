import React, { useEffect } from "react";
import { HiPlus } from "react-icons/hi";
import { useLoaderData } from "react-router";
import { OperatorList } from "~/components/operator/List/OperatorList";
import { SectionHeaderWithButton } from "~/components/shared/Section/SectionHeaderWithButton";
import type { Operator } from "~/models";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { OperatorService } from "~/state/api/operator.service";
import { useDataRefresh } from "~/state/app/context/useDataRefresh";

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
