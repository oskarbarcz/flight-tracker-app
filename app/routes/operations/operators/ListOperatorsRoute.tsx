import React, { useEffect } from "react";
import { HiPlus } from "react-icons/hi";
import { Outlet, useLoaderData } from "react-router";
import { useDataRefresh } from "~/app-state/useDataRefresh";
import { OperatorList } from "~/features/operator/components/List/OperatorList";
import { OperatorService } from "~/features/operator/service";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { SectionHeaderWithButton } from "~/shared/ui/Section/SectionHeaderWithButton";

export async function clientLoader() {
  const operatorService = new OperatorService();
  const [operators, recent] = await Promise.all([operatorService.fetchAll(), operatorService.fetchRecent()]);
  return { operators, recent };
}

export default function ListOperatorsRoute() {
  usePageTitle("Operator list");
  const { operators, recent } = useLoaderData<typeof clientLoader>();
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
          viewTransition: false,
        }}
      />
      <OperatorList operators={operators} recent={recent} />

      <Outlet />
    </>
  );
}
