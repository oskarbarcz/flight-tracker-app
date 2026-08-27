import React from "react";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";

export function PostcardsBoxLoader() {
  return (
    <Container padding="condensed" className="animate-pulse" header={<CardHeader title="Postcards" />}>
      <div className="flex flex-col gap-2">
        <div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-28 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="flex justify-end border-t border-gray-100 pt-4 dark:border-gray-800">
        <div className="h-7 w-24 rounded-lg bg-gray-200 dark:bg-gray-700" />
      </div>
    </Container>
  );
}
