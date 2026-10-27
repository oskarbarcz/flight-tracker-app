import React from "react";
import { twMerge } from "tailwind-merge";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";

type Props = {
  expectsFlight: boolean;
};

export function CurrentFlightBoxLoader({ expectsFlight }: Props) {
  return (
    <Container
      padding="none"
      className={twMerge("animate-pulse motion-reduce:animate-none", !expectsFlight && "hidden sm:flex")}
      header={<CardHeader title="Current flight" />}
      footer={
        <div className="flex items-center justify-between gap-3 px-3 py-2.5">
          <div className="h-4 w-36 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-10 w-28 rounded-lg bg-gray-200 dark:bg-gray-700" />
        </div>
      }
    >
      <div className="@container">
        <div className="h-40 border-b border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800 @2xl:h-48" />

        <div className="flex flex-col gap-4 p-3">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-6 gap-y-4 @2xl:gap-x-8 [grid-template-areas:'identity_time'_'route_route'] @2xl:grid-cols-[auto_minmax(0,1fr)_auto] @2xl:items-center @2xl:[grid-template-areas:'identity_route_time']">
            <div className="flex items-center gap-3 [grid-area:identity]">
              <div className="size-12 rounded-lg bg-gray-200 dark:bg-gray-700" />
              <div>
                <div className="mb-1.5 h-7 w-28 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-3.5 w-16 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>

            <div className="flex items-center gap-3 [grid-area:route]">
              <div>
                <div className="mb-1.5 h-7 w-14 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
              <div className="flex flex-col items-end">
                <div className="mb-1.5 h-7 w-14 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5 [grid-area:time]">
              <div className="h-3 w-14 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-5 w-16 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="h-5 w-32 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </div>
    </Container>
  );
}
