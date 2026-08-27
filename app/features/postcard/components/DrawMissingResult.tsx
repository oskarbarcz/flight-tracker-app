import React from "react";
import type { DrawMissingResult as DrawMissingOutcome } from "~/features/postcard/model";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";

type Props = {
  result: DrawMissingOutcome | null;
};

export function DrawMissingResult({ result }: Props) {
  return (
    <Container padding="condensed" header={<CardHeader title="Last run" />}>
      <div aria-live="polite">
        {result === null ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            The generator could not be reached, so nothing was queued.
          </p>
        ) : result.queued === 0 ? (
          <p className="text-sm font-semibold text-gray-900 dark:text-white">Every city already has art.</p>
        ) : (
          <>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Queued {result.queued} {result.queued === 1 ? "city" : "cities"}. The art appears as it is drawn.
            </p>
            <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300">
              {result.cities.map((city) => city.name).join(", ")}
            </p>
          </>
        )}
      </div>
    </Container>
  );
}
