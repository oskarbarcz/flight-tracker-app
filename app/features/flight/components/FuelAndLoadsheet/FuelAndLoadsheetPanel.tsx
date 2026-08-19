import { Button } from "flowbite-react";
import React, { useState } from "react";
import { HiInformationCircle, HiPencil } from "react-icons/hi";
import type { Loadsheet, Timesheet } from "~/features/flight";
import { CrewColumn } from "~/features/flight/components/FuelAndLoadsheet/CrewColumn";
import { FuelPlan } from "~/features/flight/components/FuelAndLoadsheet/FuelPlan";
import { LoadsheetFigures } from "~/features/flight/components/FuelAndLoadsheet/LoadsheetFigures";
import { type LoadsheetVariant, VariantSwitch } from "~/features/flight/components/FuelAndLoadsheet/VariantSwitch";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";

type Props = {
  flightId: string;
  preliminary: Loadsheet | null;
  final: Loadsheet | null;
  timesheet: Timesheet;
  canEditPreliminary?: boolean;
  onEditPreliminary?: () => void;
};

export function FuelAndLoadsheetPanel({
  flightId,
  preliminary,
  final,
  timesheet,
  canEditPreliminary,
  onEditPreliminary,
}: Props) {
  const hasPreliminary = preliminary !== null;
  const hasFinal = final !== null;
  const defaultVariant: LoadsheetVariant = hasFinal ? "final" : "preliminary";

  const [fuelVariant, setFuelVariant] = useState<LoadsheetVariant>(defaultVariant);
  const [loadVariant, setLoadVariant] = useState<LoadsheetVariant>(defaultVariant);

  const fuelLoadsheet = fuelVariant === "final" ? final : preliminary;
  const loadLoadsheet = loadVariant === "final" ? final : preliminary;
  const hasAny = hasPreliminary || hasFinal;
  const showEditPreliminary =
    loadVariant === "preliminary" && Boolean(canEditPreliminary) && Boolean(onEditPreliminary);

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
      <Container
        className="lg:col-span-1"
        header={
          <CardHeader
            title="Fuel"
            actions={
              hasAny && (
                <VariantSwitch
                  value={fuelVariant}
                  onChange={setFuelVariant}
                  hasPreliminary={hasPreliminary}
                  hasFinal={hasFinal}
                />
              )
            }
          />
        }
      >
        {fuelLoadsheet ? <FuelPlan fuel={fuelLoadsheet.fuel} timesheet={timesheet} /> : <EmptyState />}
      </Container>

      <Container
        className="lg:col-span-2"
        header={
          <CardHeader
            title="Loadsheet"
            actions={
              hasAny && (
                <VariantSwitch
                  value={loadVariant}
                  onChange={setLoadVariant}
                  hasPreliminary={hasPreliminary}
                  hasFinal={hasFinal}
                />
              )
            }
          />
        }
      >
        {loadLoadsheet ? <LoadsheetFigures loadsheet={loadLoadsheet} /> : <EmptyState />}

        {showEditPreliminary && (
          <div className="mt-auto flex justify-end border-t border-gray-200 pt-3 dark:border-gray-800">
            <Button color="gray" outline size="xs" onClick={onEditPreliminary}>
              <HiPencil className="me-1.5" />
              {hasPreliminary ? "Update" : "Fill"}
            </Button>
          </div>
        )}
      </Container>

      <CrewColumn flightId={flightId} />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-dashed border-gray-300 bg-gray-50/40 px-4 py-5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-400">
      <HiInformationCircle className="size-5 shrink-0 text-gray-400" />
      <span>No loadsheet has been issued yet.</span>
    </div>
  );
}
