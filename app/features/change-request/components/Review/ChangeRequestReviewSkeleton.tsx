import React from "react";
import { Container } from "~/shared/ui/Layout/Container";

const ROWS = ["first", "second", "third"];

export function ChangeRequestReviewSkeleton() {
  return (
    <div role="status" aria-busy={true} className="flex flex-col gap-4 motion-safe:animate-pulse">
      <span className="sr-only">Loading proposal</span>
      <div aria-hidden={true} className="flex flex-col gap-3">
        <span className="h-7 w-40 rounded bg-gray-200 dark:bg-gray-700" />
        <span className="flex items-center gap-3">
          <span className="size-10 rounded-lg bg-gray-200 dark:bg-gray-700" />
          <span className="flex flex-col gap-1.5">
            <span className="h-3.5 w-48 rounded bg-gray-200 dark:bg-gray-700" />
            <span className="h-3 w-32 rounded bg-gray-100 dark:bg-gray-800" />
          </span>
        </span>
        <span className="h-3.5 w-64 rounded bg-gray-100 dark:bg-gray-800" />
      </div>
      <Container padding="none">
        <div aria-hidden={true} className="divide-y divide-gray-100 dark:divide-gray-800">
          {ROWS.map((row) => (
            <div key={row} className="grid grid-cols-[9rem_1fr_1fr] gap-3 px-3.5 py-3.5">
              <span className="h-3.5 w-20 rounded bg-gray-200 dark:bg-gray-700" />
              <span className="h-3.5 w-28 rounded bg-gray-100 dark:bg-gray-800" />
              <span className="h-3.5 w-32 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
