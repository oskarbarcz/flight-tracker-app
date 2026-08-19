import React, { useMemo, useState } from "react";
import { BlockTimeChart } from "~/features/stats/components/Activity/BlockTimeChart";
import { BlockTimeSummary } from "~/features/stats/components/Activity/BlockTimeSummary";
import { CustomRange } from "~/features/stats/components/Activity/CustomRange";
import { FirstVisits } from "~/features/stats/components/Activity/FirstVisits";
import { LogbookRail } from "~/features/stats/components/Activity/LogbookRail";
import { ladderHasDetails, MetricLadder } from "~/features/stats/components/Activity/MetricLadder";
import { PeriodStrip } from "~/features/stats/components/Activity/PeriodStrip";
import { SpanExtent } from "~/features/stats/components/Activity/SpanExtent";
import { SpanSegments } from "~/features/stats/components/Activity/SpanSegments";
import { SpanStepper } from "~/features/stats/components/Activity/SpanStepper";
import { StatsPanel } from "~/features/stats/components/Activity/StatsPanel";
import type { Stats } from "~/features/stats/hooks/useStats";
import { bucketsFor, granularityFor } from "~/features/stats/lib/buckets";
import { compareToPrevious } from "~/features/stats/lib/delta";
import { typesFirstFlownIn } from "~/features/stats/lib/firstVisits";
import type { MetricKey, MetricReading } from "~/features/stats/lib/metrics";
import { buildRail } from "~/features/stats/lib/rail";
import {
  addUtcDays,
  customSpan,
  dayDifference,
  earliestOffset,
  fromIsoDate,
  offsetContaining,
  presetSpan,
  type Span,
  type SpanKind,
  secondaryBaseline,
  toIsoDate,
} from "~/features/stats/lib/span";
import type { PeriodComparison } from "~/features/stats/model";
import { CardDescription } from "~/shared/ui/Layout/CardDescription";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";

const COMPARISON: Record<Exclude<SpanKind, "custom">, string> = {
  week: "Week to week comparison",
  month: "Year on year comparison",
  year: "Year to year comparison",
};

const GRANULARITY_NOTE = {
  day: "One bar per day.",
  week: "One bar per week.",
  month: "One bar per month.",
};

function comparisonLabel(span: Span): string {
  if (span.kind === "custom") {
    return `Compared with the previous ${dayDifference(span.from, span.to) + 1} days`;
  }
  return COMPARISON[span.kind];
}

type Props = {
  stats: Stats;
};

export function ActivityPanel({ stats }: Props) {
  const { activity, periods, aircraftTypes, airframesByType, airportsByIcao, firstFlightAt, today } = stats;

  const [kind, setKind] = useState<SpanKind>("month");
  const [offset, setOffset] = useState(0);
  const [range, setRange] = useState({ from: toIsoDate(addUtcDays(today, -89)), to: toIsoDate(today) });

  const span: Span = useMemo(() => {
    if (kind === "custom") {
      return customSpan(fromIsoDate(range.from), fromIsoDate(range.to), today);
    }
    return presetSpan(kind, offset, today);
  }, [kind, offset, range, today]);

  const earliest = kind === "custom" || firstFlightAt === null ? 0 : earliestOffset(kind, firstFlightAt, today);

  const currentEnd = span.to > today ? today : span.to;
  const current = activity.between(span.from, currentEnd);
  const previous = activity.between(span.prevFrom, span.prevTo);
  const hasBaselineData = firstFlightAt !== null && span.prevTo >= firstFlightAt;

  const buckets = useMemo(() => bucketsFor(span, activity, today), [span, activity, today]);

  const rail = useMemo(
    () => (firstFlightAt === null ? null : buildRail(firstFlightAt, today, activity)),
    [firstFlightAt, today, activity],
  );

  function pickDate(date: Date) {
    if (kind === "custom") {
      return;
    }
    const next = offsetContaining(kind, date, today);
    setOffset(Math.min(0, Math.max(earliest, next)));
  }

  function stepBy(direction: -1 | 1) {
    if (kind === "custom") {
      const length = dayDifference(span.from, span.to);
      const shifted = addUtcDays(span.from, direction * (length + 1));
      const shiftedEnd = addUtcDays(shifted, length);
      if (shiftedEnd <= today && shifted >= (firstFlightAt ?? shifted)) {
        setRange({ from: toIsoDate(shifted), to: toIsoDate(shiftedEnd) });
      }
      return;
    }
    setOffset(Math.min(0, Math.max(earliest, offset + direction)));
  }

  const presetPeriod: PeriodComparison | null =
    kind !== "custom" && offset === 0 && periods !== null ? periods[kind] : null;

  const unavailable = kind === "custom" ? "Not available for a custom range" : "Only available for the current period";
  const comparableApiBaseline = kind !== "month";
  const unavailableNote =
    presetPeriod === null
      ? kind === "custom"
        ? "Distance and fuel are not available for a custom range."
        : "Distance and fuel are only reported for the current week, month and year."
      : kind === "month"
        ? "Distance and fuel cannot be compared year on year, so no change is shown for them."
        : null;

  const readings: Record<MetricKey, MetricReading> = {
    flights: { available: true, current: current.flights, previous: previous.flights },
    airborneMinutes: { available: true, current: current.airborneMinutes, previous: previous.airborneMinutes },
    distanceNm: presetPeriod
      ? {
          available: true,
          current: presetPeriod.current.distanceNm,
          previous: comparableApiBaseline ? presetPeriod.previous.distanceNm : null,
        }
      : { available: false, reason: unavailable },
    fuelBurned: presetPeriod
      ? {
          available: true,
          current: presetPeriod.current.fuelBurned,
          previous: comparableApiBaseline ? presetPeriod.previous.fuelBurned : null,
        }
      : { available: false, reason: unavailable },
  };

  const blockDelta = compareToPrevious(current.blockMinutes, previous.blockMinutes, {
    floor: 120,
    hasBaselineData,
  });

  const yearOverYear = useMemo(() => {
    const shifted = secondaryBaseline(span);
    if (shifted === null || firstFlightAt === null || shifted.to < firstFlightAt) {
      return null;
    }

    const totals = activity.between(shifted.from, shifted.to > today ? today : shifted.to);
    return {
      label: shifted.label,
      blockMinutes: totals.blockMinutes,
      delta: compareToPrevious(current.blockMinutes, totals.blockMinutes, { floor: 120, hasBaselineData: true }),
    };
  }, [span, firstFlightAt, activity, today, current.blockMinutes]);

  const newAirports = presetPeriod?.unlocked.airports ?? [];
  const newTypes = useMemo(() => typesFirstFlownIn(aircraftTypes, span, today), [aircraftTypes, span, today]);

  const heroHasDetails = hasBaselineData || yearOverYear !== null;
  const measuresHaveDetails = ladderHasDetails(readings, hasBaselineData, unavailableNote);

  function selectKind(next: SpanKind) {
    setKind(next);
    setOffset(0);
  }

  function changeRange(next: { from: string; to: string }) {
    const from = fromIsoDate(next.from);
    const to = fromIsoDate(next.to);

    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || to < from) {
      return;
    }

    setRange(next);
  }

  const chartNote = [
    GRANULARITY_NOTE[granularityFor(span)],
    blockDelta.kind === "noBaseline"
      ? `Nothing to compare against: ${span.prevLabel} falls before your first logged flight.`
      : blockDelta.kind === "absolute"
        ? `A percentage would not carry meaning against ${span.prevLabel}, so the change is shown as hours.`
        : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Container padding="normal" header={<CardHeader title="Your activity" />}>
      <CardDescription>{comparisonLabel(span)}</CardDescription>
      <PeriodStrip
        segments={<SpanSegments selected={kind} onSelect={selectKind} />}
        position={
          kind === "custom" ? (
            <CustomRange
              from={range.from}
              to={range.to}
              min={firstFlightAt ? toIsoDate(firstFlightAt) : toIsoDate(today)}
              max={toIsoDate(today)}
              onChange={changeRange}
            />
          ) : (
            <SpanStepper
              label={span.label}
              canGoEarlier={offset > earliest}
              canGoLater={offset < 0}
              isAtPresent={offset === 0}
              onEarlier={() => setOffset(offset - 1)}
              onLater={() => setOffset(offset + 1)}
              onReturnToPresent={() => setOffset(0)}
            />
          )
        }
        extent={
          <SpanExtent
            elapsedDays={span.inProgress && today < span.to ? dayDifference(span.from, today) + 1 : null}
            totalDays={dayDifference(span.from, span.to) + 1}
          />
        }
        rail={
          rail !== null && rail.months.length > 2 ? (
            <LogbookRail
              rail={rail}
              span={span}
              isCustom={kind === "custom"}
              onPick={pickDate}
              onRange={(from, to) => setRange({ from: toIsoDate(from), to: toIsoDate(to) })}
              onStep={stepBy}
            />
          ) : undefined
        }
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(200px,250px)_1fr] lg:gap-6">
        <div className="flex flex-col gap-3">
          <StatsPanel hasDetails={heroHasDetails} detailsLabel="Compare">
            {(detailed) => (
              <BlockTimeSummary
                blockMinutes={current.blockMinutes}
                previousBlockMinutes={previous.blockMinutes}
                previousLabel={span.prevLabel}
                hasBaselineData={hasBaselineData}
                delta={blockDelta}
                yearOverYear={yearOverYear}
                detailed={detailed}
              />
            )}
          </StatsPanel>

          <StatsPanel hasDetails={measuresHaveDetails} detailsLabel="Compare">
            {(detailed) => (
              <MetricLadder
                readings={readings}
                previousLabel={span.prevLabel}
                hasBaselineData={hasBaselineData}
                unavailableNote={unavailableNote}
                detailed={detailed}
              />
            )}
          </StatsPanel>
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex min-h-8 flex-wrap items-center gap-3.5 text-[11px] leading-4 text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <span
                className="size-2.5 rounded-sm border border-indigo-500 bg-indigo-500/15 dark:border-indigo-400 dark:bg-indigo-400/15"
                aria-hidden={true}
              />
              {span.label}
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="size-2.5 rounded-sm border border-gray-400/90 bg-gray-400/10 dark:border-gray-500/90 dark:bg-gray-500/10"
                aria-hidden={true}
              />
              {span.prevLabel}
            </span>
            <span>{chartNote}</span>
          </div>
          <div
            key={granularityFor(span)}
            className="flex min-h-56 flex-1 animate-in fade-in duration-200 motion-reduce:animate-none"
          >
            <BlockTimeChart buckets={buckets} currentLabel={span.label} previousLabel={span.prevLabel} />
          </div>
        </div>
      </div>

      <StatsPanel>
        <FirstVisits
          spanLabel={span.label}
          airports={newAirports}
          aircraftTypes={newTypes}
          airframesByType={airframesByType}
          airportsByIcao={airportsByIcao}
          airportsUnavailable={presetPeriod === null}
        />
      </StatsPanel>
    </Container>
  );
}
