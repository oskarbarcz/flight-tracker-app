import React, { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { FaArrowLeft, FaArrowRight, FaChevronDown, FaLocationCrosshairs, FaXmark } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import { useFirName } from "~/features/airspace/hooks/useFirName";
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

const FIGURE = "font-mono text-sm font-medium tabular-nums text-gray-800 dark:text-gray-100";
const SUFFIX = "ms-1 text-2xs font-normal text-gray-500 dark:text-gray-400";

type SectionProps = {
  title: string;
  defaultOpen?: boolean;
  hidden?: boolean;
  children: React.ReactNode;
};

function FixSection({ title, defaultOpen = true, hidden, children }: SectionProps) {
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
          {title}
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

type RowProps = {
  label: string;
  value: string;
  suffix?: string | null;
};

function FixRow({ label, value, suffix }: RowProps) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-px">
      <dt className="shrink-0 text-xs text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className={twMerge(FIGURE, "min-w-0 text-right")}>
        {value}
        {suffix && value !== ABSENT && <span className={SUFFIX}>{suffix}</span>}
      </dd>
    </div>
  );
}

function FixHeightRow({ label, height }: { label: string; height: string }) {
  const [value, unit] = height.split(" ");

  return <FixRow label={label} value={value} suffix={unit} />;
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
            <td className={twMerge(FIGURE, "py-px text-right")}>{formatWind(level.direction, level.speed)}</td>
            <td className={twMerge(FIGURE, "w-[9ch] py-px text-right")}>
              {formatCelsius(level.oat)}
              <span className={SUFFIX}>°C</span>
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
  className?: string;
};

export function FixInfoCard({ insight, onClose, onCenter, onPrevious, onNext, className }: Props) {
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
          <dl>
            <FixRow label="Position" value={formatCoordinates(fix.latitude, fix.longitude)} />
            <FixRow label="FIR" value={fix.fir ?? ABSENT} suffix={firName} />
            <FixHeightRow label="MORA" height={formatFeet(fix.mora)} />
            <FixRow label="Track mag" value={formatBearing(fix.trackMag)} />
            <FixRow label="Track true" value={formatBearing(fix.trackTrue)} />
          </dl>
        </FixSection>

        <FixSection title="Flight fix">
          <dl>
            <FixHeightRow
              label="Tropopause"
              height={fix.tropopause === null ? ABSENT : formatAltitude(fix.tropopause)}
            />
            <FixRow label="ISA deviation" value={formatCelsius(fix.isaDeviation)} suffix="°C" />
            <FixRow label="Wind" value={formatWind(fix.wind.direction, fix.wind.speed)} />
            <FixHeightRow label="Altitude" height={formatAltitude(fix.altitude)} />
            <FixRow label="ETE" value={formatElapsed(fix.elapsedSeconds)} />
            <FixRow label="Distance from last fix" value={formatDistance(fix.distanceNm)} suffix="nm" />
            <FixRow label="Distance from start" value={formatDistance(insight.cumulativeDistanceNm)} suffix="nm" />
          </dl>
        </FixSection>

        <FixSection title="Fuel">
          <dl>
            <FixRow label="EFOB" value={formatTonnesFromKilograms(fix.fuel.plannedOnBoard)} suffix="t" />
            <FixRow label="MFOB" value={formatTonnesFromKilograms(fix.fuel.minimumOnBoard)} suffix="t" />
            <FixRow label="Burn to this point" value={formatTonnesFromKilograms(fix.fuel.used)} suffix="t" />
            <FixRow label="Leg burn" value={formatTonnesFromKilograms(fix.fuel.leg)} suffix="t" />
          </dl>
        </FixSection>

        <FixSection title="Wind and environment" defaultOpen={false} hidden={fix.wind.levels.length === 0}>
          <WindLevels levels={fix.wind.levels} />
        </FixSection>
      </div>
    </section>
  );
}
