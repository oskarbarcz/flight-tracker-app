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

function getStatusBox(status: Status): React.ReactNode {
  switch (status) {
    case Status.ReadyForDuty:
      return <span className="text-green-700 dark:text-green-400 font-bold">Ready for Duty</span>;
    case Status.OnDuty:
      return <span className="text-green-700 dark:text-green-400 font-bold">On Duty</span>;
  }
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

  return (
    <TransparentContainer
      chromeless
      className="flex items-start lg:items-center flex-col justify-between lg:flex-row gap-4"
    >
      <div className="flex min-h-32 w-full flex-col items-center justify-center text-center sm:block sm:min-h-0 sm:w-auto sm:text-left">
        <h2 className="md:mt-4 text-2xl sm:text-4xl text-gray-700 dark:text-gray-300 font-bold">
          Welcome back, <span className="block sm:inline">{name}</span>
        </h2>
        <div className="hidden text-lg text-gray-500 pt-2 sm:block">
          <span>Operational status: </span>
          {getStatusBox(getStatus(user))}
        </div>
      </div>
      <div className="hidden items-center divide-x divide-gray-200 rounded-xl border border-gray-200 bg-white px-4 py-2 sm:flex dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
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
