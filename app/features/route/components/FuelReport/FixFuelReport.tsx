import { Button } from "flowbite-react";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { FIX_GRID, FixFigure } from "~/features/route/components/Chart/FixFigure";
import { BelowMinimumIcon } from "~/features/route/components/FuelReport/BelowMinimumIcon";
import { FixFuelReportModal } from "~/features/route/components/FuelReport/FixFuelReportModal";
import { fixName } from "~/features/route/lib/fixName";
import { fuelReportTone } from "~/features/route/lib/fuelReportStanding";
import { ABSENT, formatSignedTonnesFromKilograms, formatTonnesFromKilograms } from "~/features/route/lib/routeFigures";
import type { PlannedRouteFix } from "~/features/route/model";

type Props = {
  fix: PlannedRouteFix;
  canReport: boolean;
  onReport?: (ordinal: number, actualOnBoard: number) => Promise<void>;
};

export function FixFuelReport({ fix, canReport, onReport }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const actualOnBoard = fix.fuelReport?.actualOnBoard ?? null;
  const plannedOnBoard = fix.fuel.plannedOnBoard;
  const canEdit = canReport && onReport !== undefined;
  const action = actualOnBoard === null ? "Report" : "Update";
  const tone = fuelReportTone(fix);

  if (actualOnBoard === null && !canEdit) {
    return null;
  }

  return (
    <div className={twMerge(FIX_GRID, "items-center")}>
      <dl aria-live="polite" className="col-span-2 grid grid-cols-subgrid min-[360px]:col-span-3">
        <FixFigure
          label="Actual"
          value={formatTonnesFromKilograms(actualOnBoard)}
          suffix="t"
          icon={<BelowMinimumIcon fix={fix} />}
          valueClassName={tone}
        />
        {plannedOnBoard !== null && (
          <FixFigure
            label="Against EFOB"
            value={actualOnBoard === null ? ABSENT : formatSignedTonnesFromKilograms(actualOnBoard - plannedOnBoard)}
            suffix="t"
            valueClassName={tone}
            className="min-[360px]:col-span-2"
          />
        )}
      </dl>
      {canEdit && (
        <>
          <Button
            type="button"
            size="xs"
            color="alternative"
            aria-label={`${action} actual fuel at ${fixName(fix.ident)}`}
            className="col-span-2 justify-self-end pointer-coarse:h-11 min-[360px]:col-span-1"
            onClick={() => setIsModalOpen(true)}
          >
            {action}
          </Button>
          {isModalOpen && <FixFuelReportModal fix={fix} onReport={onReport} close={() => setIsModalOpen(false)} />}
        </>
      )}
    </div>
  );
}
