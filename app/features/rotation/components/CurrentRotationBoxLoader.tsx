import React from "react";
import { FaArrowsSpin } from "react-icons/fa6";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";

export function CurrentRotationBoxLoader() {
  return (
    <Container padding="condensed" className="animate-pulse">
      <ContainerTitle icon={FaArrowsSpin} title="Current rotation" />

      <div className="h-5 w-48 rounded bg-gray-200 dark:bg-gray-700" />

      <div className="flex flex-col gap-3">
        {[0, 1, 2].map((leg) => (
          <div key={leg} className="flex items-center gap-3">
            <span className="size-2.5 flex-none rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="ms-auto h-4 w-12 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        ))}
      </div>

      <div className="flex items-baseline justify-between gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
        <div className="h-3 w-12 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-10 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </Container>
  );
}
