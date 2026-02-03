"use client";

import React from "react";
import { FaClock } from "react-icons/fa6";
import SimpleStatDisplay from "~/components/shared/Display/SimpleStatDisplay";
import SimpleStatDisplayLoader from "~/components/shared/Display/SimpleStatDisplayLoader";
import Container from "~/components/shared/Layout/Container";
import { User } from "~/models/user.model";
import { useAuth } from "~/state/contexts/session/auth.context";
import useUserStats from "~/state/hooks/resources/useUserStats";

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
  return hours.toLocaleString("en-US") + "h";
}

export default function UserHeader() {
  const { user } = useAuth() as { user: User };
  const { stats, loading } = useUserStats();

  const [name] = user.name.split(" ");

  return (
    <Container
      invisible
      padding="none"
      className="flex items-start lg:items-center flex-col justify-between lg:flex-row gap-4"
    >
      <div>
        <h2 className="md:mt-4 text-4xl text-gray-700 dark:text-gray-300 font-bold">
          Welcome back, Captain {name}
        </h2>
        <div className="text-lg text-gray-500 pt-2">
          <span>Operational status: </span>
          {getStatusBox(getStatus(user))}
          <span>. Clear skies ahead!</span>
        </div>
      </div>
      <div className="flex gap-4">
        {(loading || stats === null) && <SimpleStatDisplayLoader />}
        {stats !== null && (
          <SimpleStatDisplay
            icon={<FaClock className="text-indigo-500 my-1 text-2xl" />}
            title="Total flight time"
            value={minutesToHoursDisplay(stats.total.blockTime)}
          />
        )}
      </div>
    </Container>
  );
}
