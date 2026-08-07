import { Badge } from "flowbite-react";
import React from "react";
import { HiOutlineTrash, HiPencil } from "react-icons/hi";
import { Link } from "react-router";
import type { Terminal } from "~/features/terminal";
import { FactRow } from "~/shared/ui/Fact/FactRow";

type Props = {
  airportId: string;
  terminals: Terminal[];
  onDelete?: (terminal: Terminal) => void;
  readOnly?: boolean;
};

function sortByShortName(terminals: Terminal[]): Terminal[] {
  return [...terminals].sort((a, b) => a.shortName.localeCompare(b.shortName, undefined, { numeric: true }));
}

export function TerminalList({ airportId, terminals, onDelete, readOnly }: Props) {
  const sorted = sortByShortName(terminals);

  return (
    <div className="space-y-2">
      {sorted.map((terminal) => (
        <article
          key={terminal.id}
          className="@container overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
        >
          <header className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-3 py-1.5 dark:border-gray-800 dark:bg-gray-950">
            <h3 className="shrink-0 font-mono text-base font-bold text-gray-900 dark:text-white">
              {terminal.shortName}
            </h3>
            <span className="h-4 w-px shrink-0 bg-gray-300 dark:bg-gray-700" />
            <span className="min-w-0 flex-1 truncate text-sm text-gray-500 dark:text-gray-400">
              {terminal.fullName}
            </span>
            {!readOnly && (
              <div className="flex shrink-0 items-center">
                <Link
                  to={`/airports/${airportId}/terminals/${terminal.id}/edit`}
                  viewTransition
                  aria-label={`Edit terminal ${terminal.shortName}`}
                  className="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-indigo-500 @lg:p-1 dark:hover:bg-gray-800"
                >
                  <HiPencil className="size-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete?.(terminal)}
                  aria-label={`Delete terminal ${terminal.shortName}`}
                  className="cursor-pointer rounded-md p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-500 @lg:p-1 dark:hover:bg-red-950/40"
                >
                  <HiOutlineTrash className="size-3.5" />
                </button>
              </div>
            )}
          </header>

          <dl className="divide-y divide-gray-100 dark:divide-gray-800/60">
            <FactRow label="Taxi time">
              <span className="font-mono">{terminal.averageTaxiTime}</span> min
            </FactRow>
            {terminal.operatorCodes.length > 0 ? (
              <FactRow label="Operators">
                <span className="flex flex-wrap items-center gap-1.5">
                  {terminal.operatorCodes.map((code) => (
                    <Badge key={code} color="gray" className="font-mono">
                      {code}
                    </Badge>
                  ))}
                </span>
              </FactRow>
            ) : null}
            {terminal.text ? (
              <FactRow label="Notes">
                <span className="whitespace-pre-line text-gray-500 dark:text-gray-400">{terminal.text}</span>
              </FactRow>
            ) : null}
          </dl>
        </article>
      ))}
    </div>
  );
}
