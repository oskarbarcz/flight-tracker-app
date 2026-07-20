import React from "react";
import { useAuth } from "~/app-state/useAuth";
import { useUserStats } from "~/features/user/hooks/useUserStats";
import type { User } from "~/features/user/model";
import { SimpleStatDisplay } from "~/shared/ui/Display/SimpleStatDisplay";
import { SimpleStatDisplayLoader } from "~/shared/ui/Display/SimpleStatDisplayLoader";
import { TransparentContainer } from "~/shared/ui/Layout/TransparentContainer";

enum Status {
  ReadyForDuty,
  OnDuty,
}

function getStatus(user: User): Status {
  return user.currentFlightId ? Status.OnDuty : Status.ReadyForDuty;
}

function greetingForHour(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function StatusPill({ status }: { status: Status }) {
  if (status === Status.OnDuty) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
        <span className="h-2 w-2 rounded-full bg-indigo-500 motion-safe:animate-pulse" aria-hidden={true} />
        On Duty
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-400">
      <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden={true} />
      Ready for Duty
    </span>
  );
}

function HeroBackdrop() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full text-indigo-500 opacity-[0.12] md:hidden dark:opacity-25"
      viewBox="0 0 900 140"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden={true}
    >
      <g stroke="currentColor" strokeWidth={1.4}>
        <path d="M-20 42 C200 2 500 84 940 14" />
        <path d="M-20 66 C220 18 520 104 940 36" />
        <path d="M-20 90 C240 44 540 126 940 60" />
        <path d="M-20 114 C260 70 560 148 940 84" />
      </g>
    </svg>
  );
}

function minutesToHoursDisplay(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  return `${hours.toLocaleString("en-US")}h`;
}

function fuelToDisplay(kilograms: number): string {
  return `${(kilograms / 1000).toLocaleString("en-US", { maximumFractionDigits: 1 })} t`;
}

function distanceToDisplay(nauticalMiles: number): string {
  return `${nauticalMiles.toLocaleString("en-US")} nm`;
}

export function UserHeader() {
  const { user } = useAuth() as { user: User };
  const { stats, loading } = useUserStats();

  const [name] = user.name.split(" ");
  const greeting = greetingForHour(new Date().getHours());

  return (
    <TransparentContainer
      chromeless
      className="relative flex flex-col items-start justify-between gap-4 pt-8 md:pt-0 lg:flex-row lg:items-center"
    >
      <HeroBackdrop />
      <div className="relative flex w-full items-center justify-between gap-4 sm:w-auto sm:gap-6">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{greeting},</p>
          <h2 className="mt-1 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{name}</h2>
        </div>
        <StatusPill status={getStatus(user)} />
      </div>
      <div className="relative hidden items-center divide-x divide-gray-200 rounded-xl border border-gray-200 bg-white px-4 py-2 sm:flex dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
        {loading || stats === null ? (
          <>
            <SimpleStatDisplayLoader />
            <SimpleStatDisplayLoader />
            <SimpleStatDisplayLoader />
          </>
        ) : (
          <>
            <SimpleStatDisplay title="Total time" value={minutesToHoursDisplay(stats.total.totalFlightTime)} />
            <SimpleStatDisplay title="Total fuel burned" value={fuelToDisplay(stats.total.totalFuelBurned)} />
            <SimpleStatDisplay title="Total distance" value={distanceToDisplay(stats.total.totalGreatCircleDistance)} />
          </>
        )}
      </div>
    </TransparentContainer>
  );
}
