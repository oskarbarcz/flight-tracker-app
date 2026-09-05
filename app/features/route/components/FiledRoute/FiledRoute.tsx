import React from "react";
import { FaArrowDown, FaArrowUp, FaPlaneArrival, FaPlaneDeparture } from "react-icons/fa6";
import type { IconType } from "react-icons/lib";
import { twMerge } from "tailwind-merge";
import {
  describeClearance,
  type RouteClearance,
  type RouteFigure,
  RouteLevelStep,
  RouteProcedure,
  type RouteToken,
  RouteTokenKind,
} from "~/features/route/lib/filedRoute";

const PROCEDURE_LABEL: Record<RouteProcedure, string> = {
  [RouteProcedure.Sid]: "SID",
  [RouteProcedure.Star]: "STAR",
};

const STEP_ICON: Record<RouteLevelStep, IconType> = {
  [RouteLevelStep.Climb]: FaArrowUp,
  [RouteLevelStep.Descent]: FaArrowDown,
};

function Figure({ figure }: { figure: RouteFigure }) {
  return (
    <span className="font-mono text-sm font-bold tabular-nums text-gray-700 dark:text-gray-200">
      {figure.value}
      {figure.unit !== null && (
        <span className="ms-0.5 text-[11px] font-normal text-gray-500 dark:text-gray-400">{figure.unit}</span>
      )}
    </span>
  );
}

function ClearanceTag({ clearance }: { clearance: RouteClearance }) {
  const Step = clearance.step === null ? null : STEP_ICON[clearance.step];
  const described = describeClearance(clearance);

  return (
    <span
      title={described}
      className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-gray-50 px-1.5 py-0.5 dark:border-gray-700 dark:bg-gray-800"
    >
      {Step !== null && <Step className="size-2.5 shrink-0 text-indigo-500 dark:text-indigo-400" aria-hidden={true} />}
      {clearance.speed !== null && <Figure figure={clearance.speed} />}
      {clearance.speed !== null && clearance.level !== null && (
        <span className="h-3 w-px bg-gray-200 dark:bg-gray-700" aria-hidden={true} />
      )}
      {clearance.level !== null && <Figure figure={clearance.level} />}
    </span>
  );
}

type AirportProps = {
  text: string;
  runway: string | null;
  isDestination: boolean;
  isSelected: boolean;
};

function AirportAnchor({ text, runway, isDestination, isSelected }: AirportProps) {
  const Icon = isDestination ? FaPlaneArrival : FaPlaneDeparture;

  return (
    <span
      className={twMerge(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-sm font-extrabold tracking-wide transition-colors",
        isSelected
          ? "bg-indigo-600 text-white dark:bg-indigo-500 dark:text-white"
          : "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900",
      )}
    >
      <Icon className="size-3 shrink-0 opacity-60" aria-hidden={true} />
      {text}
      {runway !== null && (
        <>
          <span className="font-normal opacity-40" aria-hidden={true}>
            |
          </span>
          <span className="font-bold opacity-80">RW{runway}</span>
        </>
      )}
    </span>
  );
}

function ProcedureTag({ text, procedure }: { text: string; procedure: RouteProcedure }) {
  return (
    <span className="inline-flex items-baseline gap-1.5 rounded-md border border-indigo-200 bg-indigo-50 px-2 py-1 dark:border-indigo-500/40 dark:bg-indigo-500/10">
      <span className="font-mono text-sm font-bold text-indigo-700 dark:text-indigo-300">{text}</span>
      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
        {PROCEDURE_LABEL[procedure]}
      </span>
    </span>
  );
}

function Waypoint({ text, isSelected }: { text: string; isSelected: boolean }) {
  return (
    <span
      className={twMerge(
        "rounded px-1 py-0.5 font-mono text-sm font-bold transition-colors",
        isSelected
          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200"
          : "text-gray-900 dark:text-white",
      )}
    >
      {text}
    </span>
  );
}

function Airway({ text }: { text: string }) {
  return <span className="font-mono text-xs tracking-wide text-gray-500 dark:text-gray-400">{text}</span>;
}

function TokenView({ token, selectedOrdinal }: { token: RouteToken; selectedOrdinal: number | null }) {
  switch (token.kind) {
    case RouteTokenKind.Airport:
      return (
        <AirportAnchor
          text={token.text}
          runway={token.runway}
          isDestination={token.isDestination}
          isSelected={token.ordinal !== null && token.ordinal === selectedOrdinal}
        />
      );
    case RouteTokenKind.Procedure:
      return <ProcedureTag text={token.text} procedure={token.procedure} />;
    case RouteTokenKind.Waypoint:
      return (
        <>
          <Waypoint text={token.text} isSelected={token.ordinal !== null && token.ordinal === selectedOrdinal} />
          {token.clearance !== null && <ClearanceTag clearance={token.clearance} />}
        </>
      );
    case RouteTokenKind.Airway:
      return <Airway text={token.text} />;
    case RouteTokenKind.Clearance:
      return <ClearanceTag clearance={token.clearance} />;
  }
}

function ordinalOf(token: RouteToken): number | null {
  return token.kind === RouteTokenKind.Airport || token.kind === RouteTokenKind.Waypoint ? token.ordinal : null;
}

type Props = {
  tokens: RouteToken[];
  selectedOrdinal: number | null;
  onSelect: (ordinal: number) => void;
};

export function FiledRoute({ tokens, selectedOrdinal, onSelect }: Props) {
  return (
    <ol aria-label="Filed route" className="flex flex-wrap items-center gap-x-2 gap-y-2">
      {tokens.map((token) => {
        const ordinal = ordinalOf(token);

        return (
          <li
            key={token.id}
            onMouseEnter={ordinal === null ? undefined : () => onSelect(ordinal)}
            className={twMerge("inline-flex items-center gap-1.5", ordinal !== null && "cursor-pointer")}
          >
            <TokenView token={token} selectedOrdinal={selectedOrdinal} />
          </li>
        );
      })}
    </ol>
  );
}
