import { Button } from "flowbite-react";
import React from "react";
import { FaRegCopy } from "react-icons/fa6";
import { useToast } from "~/app-state/useToast";
import {
  ABSENT,
  formatAltitude,
  formatDistance,
  formatElapsed,
  formatTonnesFromKilograms,
} from "~/features/route/lib/routeFigures";
import type { RouteSummary } from "~/features/route/lib/routeInsights";
import type { PlannedRoute } from "~/features/route/model";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";
import { StatBlock } from "~/shared/ui/Display/StatBlock";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";

type Props = {
  route: PlannedRoute;
  summary: RouteSummary;
};

function RouteString({ label, value }: { label: string; value: string | null }) {
  const { success, error } = useToast();

  const copy = () => {
    if (value === null) {
      return;
    }

    navigator.clipboard
      .writeText(value)
      .then(() => success(`${label} copied to clipboard.`))
      .catch(() => error(`Could not copy the ${label.toLowerCase()}.`));
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <FieldLabel>{label}</FieldLabel>
        {value !== null && (
          <Button size="xs" color="light" onClick={copy} title={`Copy ${label.toLowerCase()} to clipboard`}>
            <FaRegCopy className="me-1.5 size-3" />
            Copy
          </Button>
        )}
      </div>
      <p className="mt-1 break-words font-mono text-sm leading-relaxed text-gray-800 dark:text-gray-100">
        {value ?? ABSENT}
      </p>
    </div>
  );
}

export function RoutePlanStrings({ route, summary }: Props) {
  return (
    <Container header={<CardHeader title="Planned route" />} padding="spacious">
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatBlock label="Fixes" value={summary.fixCount} />
        <StatBlock
          label="Distance"
          value={summary.totalDistanceNm === null ? ABSENT : formatDistance(summary.totalDistanceNm)}
          unit={summary.totalDistanceNm === null ? undefined : " nm"}
        />
        <StatBlock
          label="Time en route"
          value={summary.totalElapsedSeconds === null ? ABSENT : formatElapsed(summary.totalElapsedSeconds)}
        />
        <StatBlock
          label="Top level"
          value={summary.topAltitudeFeet === null ? ABSENT : formatAltitude(summary.topAltitudeFeet)}
        />
        <StatBlock
          label="Planned burn"
          value={formatTonnesFromKilograms(summary.totalBurnKg)}
          unit={summary.totalBurnKg === null ? undefined : " t"}
        />
      </div>

      <div className="mt-1 flex flex-col gap-4 border-t border-gray-200 pt-4 dark:border-gray-800">
        <RouteString label="Route" value={route.route} />
        <RouteString label="ATC route" value={route.atcRoute} />
      </div>
    </Container>
  );
}
