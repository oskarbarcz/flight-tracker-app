import React from "react";

const ROWS = ["first", "second", "third", "fourth", "fifth"];

export function ChangeRequestQueueSkeleton() {
  return (
    <ul aria-hidden={true} className="divide-y divide-gray-100 motion-safe:animate-pulse dark:divide-gray-800">
      {ROWS.map((row) => (
        <li key={row} className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-x-3 px-3.5 py-3">
          <span className="size-8 rounded-lg bg-gray-100 dark:bg-gray-800" />
          <span className="flex flex-col gap-1.5 pt-0.5">
            <span className="h-3.5 w-28 rounded bg-gray-200 dark:bg-gray-700" />
            <span className="h-3 w-36 rounded bg-gray-100 dark:bg-gray-800" />
            <span className="h-3 w-20 rounded bg-gray-100 dark:bg-gray-800" />
          </span>
          <span className="h-3 w-6 rounded bg-gray-100 dark:bg-gray-800" />
        </li>
      ))}
    </ul>
  );
}
