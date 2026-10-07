import React from "react";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { twMerge } from "tailwind-merge";
import { type Runway, surfaceTypeOptions } from "~/features/runway";
import { groupRunwaysByPair } from "~/features/runway/lib/runwayPairs";
import { formatDegrees } from "~/shared/lib/geo";
import { RowActionButton, RowActionLink } from "~/shared/ui/Button/RowAction";

type Props = {
  airportId: string;
  runways: Runway[];
  onDelete?: (runway: Runway) => void;
  readOnly?: boolean;
};

function surfaceLabel(value: string): string {
  return surfaceTypeOptions.find((o) => o.value === value)?.label ?? value;
}

function formatHeading(value: number | null): string {
  if (value === null || value === undefined) return "—";
  return formatDegrees(value);
}

export function RunwayList({ airportId, runways, onDelete, readOnly }: Props) {
  const pairs = groupRunwaysByPair(runways);

  return (
    <div className="space-y-2">
      {pairs.map((pair) => (
        <article
          key={pair.key}
          className="@container overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
        >
          {pair.ends.length > 1 ? (
            <>
              <header className="flex flex-col gap-y-0.5 border-b border-gray-200 bg-gray-50 px-3 py-1.5 @md:flex-row @md:items-baseline @md:justify-between dark:border-gray-800 dark:bg-gray-950">
                <h3 className="flex items-center gap-1 font-mono text-base font-bold text-gray-900 dark:text-white">
                  {pair.ends.map((end, index) => (
                    <React.Fragment key={end.id}>
                      {index > 0 ? (
                        <span className="font-sans font-normal text-gray-500 dark:text-gray-400">·</span>
                      ) : null}
                      <span>{end.designator}</span>
                    </React.Fragment>
                  ))}
                </h3>
                <RunwaySpec runway={pair.ends[0]} className="text-sm" />
              </header>
              <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                {pair.ends.map((end) => (
                  <li key={end.id} className="flex items-center gap-2 px-3 py-1">
                    <RunwayDesignator designator={end.designator} />
                    <RunwayEndFigures end={end} />
                    <RunwayEndActions airportId={airportId} end={end} onDelete={onDelete} readOnly={readOnly} />
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5">
              <RunwayDesignator designator={pair.ends[0].designator} className="text-base" />
              <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-3 gap-y-0.5">
                <RunwayEndFigures end={pair.ends[0]} className="text-sm" />
                <RunwaySpec runway={pair.ends[0]} className="text-sm @lg:ms-auto" />
              </div>
              <RunwayEndActions airportId={airportId} end={pair.ends[0]} onDelete={onDelete} readOnly={readOnly} />
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

function RunwaySpec({ runway, className }: { runway: Runway; className?: string }) {
  return (
    <span
      className={twMerge("flex flex-wrap items-baseline gap-x-1.5 text-xs text-gray-500 dark:text-gray-400", className)}
    >
      <span className="font-mono">
        {runway.length} × {runway.width}m
      </span>
      <span aria-hidden>·</span>
      <span>{surfaceLabel(runway.surfaceType)}</span>
      <span aria-hidden>·</span>
      <span className="font-mono">{runway.lightingType}</span>
    </span>
  );
}

function RunwayDesignator({ designator, className }: { designator: string; className?: string }) {
  return (
    <span className={twMerge("w-11 shrink-0 font-mono text-sm font-bold text-gray-900 dark:text-white", className)}>
      {designator}
    </span>
  );
}

function RunwayEndFigures({ end, className }: { end: Runway; className?: string }) {
  return (
    <div
      className={twMerge(
        "flex min-w-0 flex-wrap items-baseline gap-x-1.5 text-xs text-gray-500 dark:text-gray-400",
        className,
      )}
    >
      <span>
        <span className="font-mono text-gray-800 dark:text-gray-200">{formatHeading(end.magneticHeading)}</span>
        <span> M / </span>
        <span className="font-mono text-gray-800 dark:text-gray-200">{formatHeading(end.trueHeading)}</span>
        <span> T</span>
      </span>
      {end.displace ? <span>· displaced {end.displace}m</span> : null}
      {end.elevation !== null && end.elevation !== undefined ? <span>· elev {end.elevation}m</span> : null}
    </div>
  );
}

function RunwayEndActions({
  airportId,
  end,
  onDelete,
  readOnly,
}: {
  airportId: string;
  end: Runway;
  onDelete?: (runway: Runway) => void;
  readOnly?: boolean;
}) {
  if (readOnly) return null;

  return (
    <div className="ms-auto flex shrink-0 items-center">
      <RowActionLink
        to={`/airports/${airportId}/runways/${end.id}/edit`}
        icon={LuPencil}
        label={`Edit runway ${end.designator}`}
      />
      <RowActionButton
        onClick={() => onDelete?.(end)}
        icon={LuTrash2}
        label={`Remove runway ${end.designator}`}
        tone="danger"
      />
    </div>
  );
}
