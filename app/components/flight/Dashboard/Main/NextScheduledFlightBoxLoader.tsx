import React from "react";
import Container from "~/components/shared/Layout/Container";
import ContainerTitle from "~/components/shared/Layout/ContainerTitle";

export default function NextScheduledFlightBoxLoader() {
  return (
    <Container padding="condensed" className="animate-pulse">
      <ContainerTitle>
        <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
      </ContainerTitle>

      <article className="flex flex-row justify-between gap-3 mt-2 mb-6">
        <div className="w-full">
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="w-full flex flex-col items-end">
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </article>

      <article className="flex items-center bg-gray-50 dark:bg-gray-950 justify-evenly border border-dashed border-gray-200 dark:border-gray-800 mb-6 rounded-xl p-3">
        <div className="basis-64 flex flex-col items-center p-3">
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="h-6 w-6 bg-gray-100 dark:bg-gray-800 rounded-full" />
        <div className="basis-64 flex flex-col items-center p-3">
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </article>

      <div className="flex justify-end">
        <div className="h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    </Container>
  );
}
