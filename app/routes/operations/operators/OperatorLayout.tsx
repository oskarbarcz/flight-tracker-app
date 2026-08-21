import type { Route } from ".react-router/types/app/routes/operations/operators/+types/OperatorLayout";
import { Button } from "flowbite-react";
import React from "react";
import { HiPencil } from "react-icons/hi";
import { Link, Outlet, useLoaderData, useLocation, useNavigate, useSearchParams } from "react-router";
import { UpdateOperatorModal } from "~/features/operator/components/Forms/UpdateOperatorModal";
import { OperatorHeader } from "~/features/operator/components/Header/OperatorHeader";
import { OperatorTabs } from "~/features/operator/components/Table/Tabs/OperatorTabs";
import { isOperatorEditRequested, operatorEditPath } from "~/features/operator/navigation";
import { OperatorService } from "~/features/operator/service";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { Breadcrumbs } from "~/shared/ui/Section/Breadcrumbs";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const operator = await new OperatorService().fetchById(params.operatorId);
  return { operator };
}

export default function OperatorLayout() {
  const { operator } = useLoaderData<typeof clientLoader>();
  usePageTitle(`${operator.shortName} | Operator`);

  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  return (
    <>
      <div className="mb-4 mt-2 flex items-center justify-between gap-4">
        <Breadcrumbs items={[{ label: "Operators", to: "/operators" }, { label: operator.shortName }]} />
        <Button
          as={Link}
          color="alternative"
          to={operatorEditPath(pathname)}
          className="shrink-0 space-x-1.5"
          size="xs"
        >
          <HiPencil />
          <span>Edit operator</span>
        </Button>
      </div>

      <OperatorHeader operator={operator} />

      <OperatorTabs id={operator.id} />

      <Outlet />

      {isOperatorEditRequested(searchParams) && (
        <UpdateOperatorModal operator={operator} close={() => navigate(pathname)} />
      )}
    </>
  );
}
