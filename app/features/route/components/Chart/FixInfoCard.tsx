import React, { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { FaArrowLeft, FaArrowRight, FaChevronDown, FaLocationCrosshairs, FaXmark } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import { useFirName } from "~/features/airspace/hooks/useFirName";
import { FIX_GRID, FIXED_FIGURE, FIXED_SUFFIX, FixFigure } from "~/features/route/components/Chart/FixFigure";
import { FixFuelReport } from "~/features/route/components/FuelReport/FixFuelReport";
import { fixName } from "~/features/route/lib/fixName";
import {
  ABSENT,
  formatAltitude,
  formatBearing,
  formatCelsius,
  formatDistance,
  formatElapsed,
  formatFeet,
  formatTonnesFromKilograms,
  formatWind,
} from "~/features/route/lib/routeFigures";
import type { FixInsight } from "~/features/route/lib/routeInsights";
import type { PlannedRouteWindLevel } from "~/features/route/model";
import { formatCoordinates } from "~/shared/lib/formatGeo";

type SectionProps = {
  title: string;
  source?: string;
  defaultOpen?: boolean;
  hidden?: boolean;
  children: React.ReactNode;
};

function FixSection({ title, source, defaultOpen = true, hidden, children }: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const sectionRef = useRef<HTMLElement>(null);

  function toggle() {
    flushSync(() => setIsOpen(!isOpen));

    if (!isOpen) {
      sectionRef.current?.scrollIntoView({ block: "nearest" });
    }
  }

  return (
    <section
      ref={sectionRef}
      hidden={hidden}
      className={twMerge(
        "border-t border-gray-200 first:border-t-0 dark:border-gray-800",
        !isOpen && "last:sticky last:bottom-0",
      )}
    >
      <h3 className="sticky top-0">
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={toggle}
          className="flex w-full cursor-pointer items-center justify-between gap-3 bg-gray-50 px-4 py-1 text-2xs font-bold uppercase tracking-wider text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 pointer-coarse:min-h-11 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <span>
            {title}
            {source && (
              <>
                {" · "}
                <span className="font-normal">{source}</span>
              </>
            )}
          </span>
          <FaChevronDown
            size={10}
            aria-hidden={true}
            className={twMerge(
              "transition-transform duration-150 motion-reduce:transition-none",
              isOpen && "rotate-180",
            )}
          />
        </button>
      </h3>
      {isOpen && <div className="px-4 py-1.5">{children}</div>}
    </section>
  );
}

function FixHeightFigure({ label, height }: { label: string; height: string }) {
  const [value, unit] = height.split(" ");

  return <FixFigure label={label} value={value} suffix={unit} />;
}

function WindLevels({ levels }: { levels: PlannedRouteWindLevel[] }) {
  const highestFirst = [...levels].sort((a, b) => b.altitude - a.altitude);

  return (
    <table className="w-full">
      <thead className="sr-only">
        <tr>
          <th scope="col">Level</th>
          <th scope="col">Wind</th>
          <th scope="col">Temperature</th>
        </tr>
      </thead>
      <tbody>
        {highestFirst.map((level) => (
          <tr key={level.altitude}>
            <th
              scope="row"
              className="py-px text-left font-mono text-xs font-normal tabular-nums text-gray-500 dark:text-gray-400"
            >
              {formatAltitude(level.altitude)}
            </th>
            <td className={twMerge(FIXED_FIGURE, "py-px text-right")}>{formatWind(level.direction, level.speed)}</td>
            <td className={twMerge(FIXED_FIGURE, "w-[9ch] py-px text-right")}>
              {formatCelsius(level.oat)}
              <span className={FIXED_SUFFIX}>°C</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

type HeaderButtonProps = {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
};

function HeaderButton({ label, onClick, children }: HeaderButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={onClick === undefined}
      onClick={onClick}
      className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50 pointer-coarse:size-11 dark:text-gray-400 dark:enabled:hover:bg-gray-800 dark:enabled:hover:text-white"
    >
      {children}
    </button>
  );
}

type Props = {
  insight: FixInsight;
  onClose: () => void;
  onCenter: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  canReportFuel?: boolean;
  onReportFuel?: (ordinal: number, actualOnBoard: number) => Promise<void>;
  className?: string;
};

export function FixInfoCard({
  insight,
  onClose,
  onCenter,
  onPrevious,
  onNext,
  canReportFuel = false,
  onReportFuel,
  className,
}: Props) {
  const { fix } = insight;
  const name = fixName(fix.ident);
  const leg = fix.viaAirway === null ? fix.stage : `${fix.viaAirway} · ${fix.stage}`;
  const firName = useFirName(fix.fir);

  return (
    <section
      aria-label={`Fix ${name}`}
      className={twMerge(
        "flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900",
        className,
      )}
    >
      <header className="flex items-start justify-between gap-3 border-b border-gray-200 py-2.5 pl-4 pr-2.5 dark:border-gray-800">
        <div className="min-w-0" aria-live="polite">
          <h2 className="truncate font-mono text-base font-bold text-gray-900 dark:text-white">{name}</h2>
          <p className="truncate font-mono text-xs text-gray-500 dark:text-gray-400">{leg}</p>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <HeaderButton label="Previous fix" onClick={onPrevious}>
            <FaArrowLeft className="size-3.5" aria-hidden={true} />
          </HeaderButton>
          <HeaderButton label="Next fix" onClick={onNext}>
            <FaArrowRight className="size-3.5" aria-hidden={true} />
          </HeaderButton>
          <HeaderButton label={`Center on ${name}`} onClick={onCenter}>
            <FaLocationCrosshairs className="size-3.5" aria-hidden={true} />
          </HeaderButton>
          <HeaderButton label={`Close ${name}`} onClick={onClose}>
            <FaXmark className="size-4" aria-hidden={true} />
          </HeaderButton>
        </div>
      </header>

      <div className="min-h-0 overflow-y-auto overscroll-contain">
        <FixSection title="Meta">
          <dl className={FIX_GRID}>
            <FixFigure
              label="Position"
              value={formatCoordinates(fix.latitude, fix.longitude)}
              className="col-span-2 min-[360px]:col-span-3"
            />
            <FixFigure label="Track mag" value={formatBearing(fix.trackMag)} />
            <FixFigure
              label="FIR"
              value={fix.fir ?? ABSENT}
              suffix={firName}
              valueClassName="whitespace-normal"
              className="col-span-2"
            />
            <FixHeightFigure label="MORA" height={formatFeet(fix.mora)} />
            <FixFigure label="Track true" value={formatBearing(fix.trackTrue)} />
          </dl>
        </FixSection>

        <FixSection title="Flight fix">
          <dl className={FIX_GRID}>
            <FixHeightFigure
              label="Tropopause"
              height={fix.tropopause === null ? ABSENT : formatAltitude(fix.tropopause)}
            />
            <FixFigure label="ISA dev" value={formatCelsius(fix.isaDeviation)} suffix="°C" />
            <FixHeightFigure label="Altitude" height={formatAltitude(fix.altitude)} />
            <FixFigure label="Wind" value={formatWind(fix.wind.direction, fix.wind.speed)} />
            <FixFigure label="ETE" value={formatElapsed(fix.elapsedSeconds)} />
            <FixFigure label="From last fix" value={formatDistance(fix.distanceNm)} suffix="nm" />
            <FixFigure label="From start" value={formatDistance(insight.cumulativeDistanceNm)} suffix="nm" />
          </dl>
        </FixSection>

        <FixSection title="Fuel" source="Flight plan">
          <dl className={FIX_GRID}>
            <FixFigure label="EFOB" value={formatTonnesFromKilograms(fix.fuel.plannedOnBoard)} suffix="t" />
            <FixFigure label="MFOB" value={formatTonnesFromKilograms(fix.fuel.minimumOnBoard)} suffix="t" />
            <FixFigure label="Burn to here" value={formatTonnesFromKilograms(fix.fuel.used)} suffix="t" />
            <FixFigure label="Leg burn" value={formatTonnesFromKilograms(fix.fuel.leg)} suffix="t" />
          </dl>
          <div className="-mx-4 mt-1.5 border-t border-gray-200 px-4 pt-1.5 empty:hidden dark:border-gray-800">
            <FixFuelReport key={fix.ordinal} fix={fix} canReport={canReportFuel} onReport={onReportFuel} />
          </div>
        </FixSection>

        <FixSection title="Wind and environment" defaultOpen={false} hidden={fix.wind.levels.length === 0}>
          <WindLevels levels={fix.wind.levels} />
        </FixSection>
      </div>
    </section>
  );
}
