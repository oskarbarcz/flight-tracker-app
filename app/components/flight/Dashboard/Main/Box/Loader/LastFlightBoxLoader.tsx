import React from "react";
import Container from "~/components/shared/Layout/Container";
import ContainerTitle from "~/components/shared/Layout/ContainerTitle";

export default function LastFlightBoxLoader() {
  return (
    <Container padding="condensed" className="animate-pulse">
      <ContainerTitle>
        <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
      </ContainerTitle>

      <article className="mt-2 mb-6 rounded-xl">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-1/2 mb-4 inline-block align-top">
            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </article>

      <div className="flex justify-end">
        <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    </Container>
  );
}
