import React from "react";
import { SimpleStatDisplay } from "~/components/shared/Display/SimpleStatDisplay";
import { SimpleStatDisplayLoader } from "~/components/shared/Display/SimpleStatDisplayLoader";
import { TransparentContainer } from "~/components/shared/Layout/TransparentContainer";
import type { User } from "~/models/user.model";
import { useAuth } from "~/state/api/context/useAuth";
import { useUserStats } from "~/state/api/hooks/useUserStats";

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
      return <span className="text-green-400 font-bold">Ready for Duty</span>;
    case Status.OnDuty:
      return <span className="text-green-600 font-bold">On Duty</span>;
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
      <div>
        <h2 className="md:mt-4 text-4xl text-gray-700 dark:text-gray-300 font-bold">Welcome back, Captain {name}</h2>
        <div className="text-lg text-gray-500 pt-2">
          <span>Operational status: </span>
          {getStatusBox(getStatus(user))}
          <span>. Clear skies ahead!</span>
        </div>
      </div>
      <div className="flex items-center divide-x divide-gray-200 rounded-xl border border-gray-200 bg-white px-4 py-2 shadow-[0_1px_2px_rgb(15_23_42/0.04),0_6px_16px_-8px_rgb(15_23_42/0.12)] dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none">
        {loading || stats === null ? (
          <>
            <SimpleStatDisplayLoader />
            <SimpleStatDisplayLoader />
            <SimpleStatDisplayLoader />
          </>
        ) : (
          <>
            <SimpleStatDisplay title="Total flight time" value={minutesToHoursDisplay(stats.total.totalFlightTime)} />
            <SimpleStatDisplay title="Total fuel burned" value={fuelToDisplay(stats.total.totalFuelBurned)} />
            <SimpleStatDisplay
              title="Total distance flown"
              value={distanceToDisplay(stats.total.totalGreatCircleDistance)}
            />
          </>
        )}
      </div>
    </TransparentContainer>
  );
}
