"use client";

import { Badge } from "flowbite-react";
import React from "react";
import { HiOutlineTrash, HiPencil } from "react-icons/hi";
import { Link } from "react-router";
import type { Terminal } from "~/models";

type Props = {
  airportId: string;
  terminals: Terminal[];
  onDelete: (terminal: Terminal) => void;
};

function sortByShortName(terminals: Terminal[]): Terminal[] {
  return [...terminals].sort((a, b) => a.shortName.localeCompare(b.shortName, undefined, { numeric: true }));
}

export function TerminalList({ airportId, terminals, onDelete }: Props) {
  const sorted = sortByShortName(terminals);

  return (
    <div className="space-y-3">
      {sorted.map((terminal) => (
        <article
          key={terminal.id}
          className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
        >
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-1.5 px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-baseline gap-2">
              <h3 className="font-mono font-bold text-gray-900 dark:text-white">{terminal.shortName}</h3>
              <span className="text-sm text-gray-500">{terminal.fullName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Link
                to={`/airports/${airportId}/terminals/${terminal.id}/edit`}
                viewTransition
                aria-label={`Edit terminal ${terminal.shortName}`}
                className="p-2 rounded-md text-gray-500 hover:text-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <HiPencil className="size-4" />
              </Link>
              <button
                type="button"
                onClick={() => onDelete(terminal)}
                aria-label={`Delete terminal ${terminal.shortName}`}
                className="p-2 rounded-md text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
              >
                <HiOutlineTrash className="size-4" />
              </button>
            </div>
          </header>
          <div className="flex flex-col gap-2 px-4 py-2.5 text-sm">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-gray-800 dark:text-gray-200">
              <span className="text-gray-500">Average taxi time:</span>
              <span className="font-mono">{terminal.averageTaxiTime} min</span>
            </div>
            {terminal.operatorCodes.length > 0 ? (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-gray-500">Operators:</span>
                {terminal.operatorCodes.map((code) => (
                  <Badge key={code} color="gray" className="font-mono">
                    {code}
                  </Badge>
                ))}
              </div>
            ) : null}
            {terminal.text ? (
              <p className="whitespace-pre-line text-gray-600 dark:text-gray-300">{terminal.text}</p>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
