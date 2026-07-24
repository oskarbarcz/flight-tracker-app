import type { Route } from ".react-router/types/app/routes/operations/operators/rotations/+types/OperatorRotationsRoute";
import { Button, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { HiPlus, HiSearch } from "react-icons/hi";
import { useLoaderData } from "react-router";
import { RotationStatus } from "~/features/rotation";
import { RotationListTable } from "~/features/rotation/components/RotationListTable";
import { RotationModal } from "~/features/rotation/components/RotationModal";
import {
  RotationStatusFilter,
  type RotationStatusFilterValue,
} from "~/features/rotation/components/RotationStatusFilter";
import { RotationService } from "~/features/rotation/service";
import { UserService } from "~/features/user/service";
import { toHuman } from "~/i18n/translate";
import { TransparentContainer } from "~/shared/ui/Layout/TransparentContainer";

const FILTER_VALUES: RotationStatusFilterValue[] = ["all", ...Object.values(RotationStatus)];

function parseStatus(value: string | null): RotationStatusFilterValue {
  return FILTER_VALUES.includes(value as RotationStatusFilterValue)
    ? (value as RotationStatusFilterValue)
    : RotationStatus.Draft;
}

export async function clientLoader({ params, request }: Route.ClientLoaderArgs) {
  const status = parseStatus(new URL(request.url).searchParams.get("status"));
  const rotations = await new RotationService().listForOperator(
    params.operatorId,
    status === "all" ? undefined : status,
  );

  const userService = new UserService();
  const uniquePilotIds = [...new Set(rotations.map((rotation) => rotation.pilotId))];
  const pilots = await Promise.all(uniquePilotIds.map((id) => userService.fetchUserById(id).catch(() => null)));

  const pilotNames: Record<string, string> = {};
  pilots.forEach((pilot, index) => {
    if (pilot) {
      pilotNames[uniquePilotIds[index]] = pilot.name;
    }
  });

  return { rotations, pilotNames, operatorId: params.operatorId, status };
}

export default function OperatorRotationsRoute() {
  const { rotations, pilotNames, operatorId, status } = useLoaderData<typeof clientLoader>();
  const [creating, setCreating] = useState(false);
  const [query, setQuery] = useState("");

  const search = query.trim().toLowerCase();
  const filtered = search ? rotations.filter((rotation) => rotation.name.toLowerCase().includes(search)) : rotations;

  const emptyMessage = search
    ? `No rotations match “${query.trim()}”.`
    : status === "all"
      ? "No rotations yet."
      : `No ${toHuman.rotation.status(status).toLowerCase()} rotations.`;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="w-full sm:w-64">
          <TextInput
            type="search"
            icon={HiSearch}
            sizing="sm"
            placeholder="Search by name"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <RotationStatusFilter active={status} />
        <Button color="indigo" size="xs" className="ms-auto w-fit" onClick={() => setCreating(true)}>
          <HiPlus />
          <span className="ml-2">Create rotation</span>
        </Button>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl bg-gray-50 p-10 text-center text-sm text-gray-500 dark:bg-gray-900/40 dark:text-gray-400">
          {emptyMessage}
        </p>
      ) : (
        <TransparentContainer className="overflow-x-auto">
          <RotationListTable operatorId={operatorId} rotations={filtered} pilotNames={pilotNames} />
        </TransparentContainer>
      )}

      {creating && <RotationModal operatorId={operatorId} onClose={() => setCreating(false)} />}
    </div>
  );
}
