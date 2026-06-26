import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import { Container } from "~/components/shared/Layout/Container";
import { ContainerTitle } from "~/components/shared/Layout/ContainerTitle";

export function CurrentLocationBoxLoader() {
  return (
    <Container padding="condensed" className="animate-pulse">
      <ContainerTitle icon={FaLocationDot} title="Current location" />

      <article className="flex flex-col items-center bg-gray-50 dark:bg-gray-950 border border-dashed border-gray-200 dark:border-gray-800 mt-2 mb-6 rounded-xl p-6">
        <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
      </article>

      <div className="flex justify-end">
        <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    </Container>
  );
}
