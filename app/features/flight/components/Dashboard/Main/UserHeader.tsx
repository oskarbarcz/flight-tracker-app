import React from "react";
import { useAuth } from "~/app-state/useAuth";
import type { User } from "~/features/user/model";
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
        <span className="h-2 w-2 rounded-full bg-indigo-500" aria-hidden={true} />
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

export function UserHeader() {
  const { user } = useAuth() as { user: User };

  const [name] = user.name.split(" ");
  const greeting = greetingForHour(new Date().getHours());

  return (
    <TransparentContainer chromeless className="pt-4 md:pt-0">
      <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-start sm:gap-6">
        <h1>
          <span className="block text-sm font-medium text-gray-600 dark:text-gray-400">{greeting},</span>{" "}
          <span className="mt-1 block text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{name}</span>
        </h1>
        <StatusPill status={getStatus(user)} />
      </div>
    </TransparentContainer>
  );
}
