import React from "react";
import Container from "~/components/shared/Layout/Container";
import ContainerTitle from "~/components/shared/Layout/ContainerTitle";

export default function CurrentFlightBoxLoader() {
  return (
    <Container padding="condensed" className="animate-pulse">
      <ContainerTitle>
        <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
      </ContainerTitle>

      <article className="flex flex-row justify-between gap-3 mt-2 mb-6">
        <div>
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="text-right">
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded ml-auto mb-1" />
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded ml-auto" />
        </div>
      </article>

      <article className="flex items-center justify-between mb-8 gap-3">
        <div className="basis-1/3">
          <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="basis-1/3 flex gap-3 flex-col items-center">
          <div className="h-5 w-5 bg-gray-100 dark:bg-gray-800 rounded-full" />
          <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="basis-1/3 flex flex-col items-end">
          <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </article>

      <div className="flex justify-between items-center">
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    </Container>
  );
}
