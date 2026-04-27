"use client";

import React, { useState } from "react";
import { FaListCheck } from "react-icons/fa6";
import { HiInformationCircle } from "react-icons/hi";
import { FormattedIcaoDate } from "~/components/shared/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/components/shared/Date/FormattedIcaoTime";
import { toHuman } from "~/i18n/translate";
import { type FlightEvent, FlightEventScope } from "~/models";
import { useAuth } from "~/state/api/context/useAuth";

type Props = {
  events: FlightEvent[];
};

const SCOPE_FILTERS: { scope: FlightEventScope; label: string }[] = [
  { scope: FlightEventScope.User, label: "Pilot" },
  { scope: FlightEventScope.Operations, label: "Operations" },
  { scope: FlightEventScope.System, label: "System" },
];

const SCOPE_DOT: Record<FlightEventScope, string> = {
  [FlightEventScope.User]: "bg-blue-500 ring-blue-200 dark:ring-blue-900",
  [FlightEventScope.Operations]: "bg-indigo-500 ring-indigo-200 dark:ring-indigo-900",
  [FlightEventScope.System]: "bg-gray-400 ring-gray-200 dark:bg-gray-500 dark:ring-gray-700",
};

export function FlightEventsTimeline({ events }: Props) {
  const { user } = useAuth();
  const [activeScopes, setActiveScopes] = useState<Set<FlightEventScope>>(
    new Set([FlightEventScope.User, FlightEventScope.Operations, FlightEventScope.System]),
  );

  const toggleScope = (scope: FlightEventScope) => {
    setActiveScopes((prev) => {
      const next = new Set(prev);
      if (next.has(scope)) {
        next.delete(scope);
      } else {
        next.add(scope);
      }
      return next;
    });
  };

  const filtered = events.filter((e) => activeScopes.has(e.scope));

  return (
    <section className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="h-1 bg-linear-to-r from-indigo-500 via-indigo-400 to-indigo-300 dark:from-indigo-600 dark:via-indigo-500 dark:to-indigo-400" />

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <div className="flex items-center gap-2 text-indigo-500">
            <FaListCheck size={13} />
            <span className="text-xs font-bold uppercase tracking-widest">Events</span>
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Activity log for this flight.</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {SCOPE_FILTERS.map(({ scope, label }) => {
            const active = activeScopes.has(scope);
            return (
              <button
                type="button"
                key={scope}
                onClick={() => toggleScope(scope)}
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                  active
                    ? "border border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                    : "border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
              >
                <span
                  className={`size-1.5 rounded-full ${SCOPE_DOT[scope]
                    .split(" ")
                    .filter((c) => c.startsWith("bg-"))
                    .join(" ")}`}
                />
                {label}
              </button>
            );
          })}
        </div>

        {events.length === 0 ? (
          <EmptyState message="No events recorded yet." />
        ) : filtered.length === 0 ? (
          <EmptyState message="No events match the selected filters." />
        ) : (
          <ol className="relative space-y-5">
            {filtered.map((event, i) => (
              <li key={event.id} className="relative ps-6">
                <span
                  className={`absolute left-0.5 top-1.5 size-2.5 rounded-full border-2 border-white ring-1 dark:border-gray-900 ${SCOPE_DOT[event.scope]}`}
                />
                {i < filtered.length - 1 && (
                  <span className="absolute left-[5px] top-4 bottom-[-1.25rem] w-px bg-gray-200 dark:bg-gray-700" />
                )}
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {toHuman.flight.eventType(event.type)}
                </div>
                <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-mono">
                    <FormattedIcaoDate date={event.createdAt} /> <FormattedIcaoTime date={event.createdAt} />
                  </span>
                  {event.actor?.name && (
                    <>
                      <span aria-hidden>·</span>
                      <span>
                        {event.actor.name}
                        {user?.id && event.actor.id === user.id && <span className="ms-1 text-indigo-500">(you)</span>}
                      </span>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-dashed border-gray-300 bg-gray-50/40 px-4 py-5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-400">
      <HiInformationCircle className="size-5 shrink-0 text-gray-400" />
      <span>{message}</span>
    </div>
  );
}
