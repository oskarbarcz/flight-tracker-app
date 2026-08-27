import { Button } from "flowbite-react";
import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router";
import { PostcardCeremony } from "~/features/postcard/components/Ceremony/PostcardCeremony";
import { PostcardsBoxLoader } from "~/features/postcard/components/Dashboard/PostcardsBoxLoader";
import { usePostcards } from "~/features/postcard/hooks/usePostcards";
import type { CollectedPostcard } from "~/features/postcard/model";
import { FormattedIcaoDate } from "~/shared/ui/Date/FormattedIcaoDate";
import { MetaRow } from "~/shared/ui/Display/MetaRow";
import { BoxFooter } from "~/shared/ui/Layout/BoxFooter";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerEmptyState } from "~/shared/ui/Layout/ContainerEmptyState";

const NAMED_AT_MOST = 3;

function citiesWaiting(waiting: CollectedPostcard[]): string {
  const named = waiting.slice(0, NAMED_AT_MOST).map(({ city }) => city.name);
  const unnamed = waiting.length - named.length;

  return unnamed > 0 ? `${named.join(" · ")} and ${unnamed} more` : named.join(" · ");
}

export function PostcardsBox() {
  const { collection, total, waiting, acknowledge } = usePostcards();
  const [ceremony, setCeremony] = useState<CollectedPostcard[] | null>(null);

  if (collection === null) {
    return <PostcardsBoxLoader />;
  }

  const latest = collection[0];
  const isWaiting = waiting.length > 0;

  return (
    <>
      <Container padding="condensed" header={<CardHeader title="Postcards" />}>
        {collection.length === 0 ? (
          <ContainerEmptyState>The cities you reach send you a postcard.</ContainerEmptyState>
        ) : (
          <div className="flex flex-col gap-1.5">
            {isWaiting && (
              <>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {waiting.length === 1 ? "A postcard is waiting for you" : `${waiting.length} postcards are waiting`}
                </p>
                <p className="truncate text-sm text-gray-500 dark:text-gray-400" title={citiesWaiting(waiting)}>
                  {citiesWaiting(waiting)}
                </p>
              </>
            )}

            <MetaRow label="Collected" value={`${collection.length} of ${total}`} />

            {latest !== undefined && !isWaiting && (
              <MetaRow
                label="Most recent"
                value={
                  <span className="flex items-baseline gap-2">
                    <span className="truncate">{latest.city.name}</span>
                    <FormattedIcaoDate date={new Date(latest.awardedAt)} />
                  </span>
                }
              />
            )}
          </div>
        )}

        <BoxFooter>
          <Button color="alternative" as={Link} to="/my-postcards" viewTransition>
            See all
          </Button>
          {isWaiting && (
            <Button color="indigo" onClick={() => setCeremony(waiting)}>
              {waiting.length === 1 ? "Open it" : "Open them"}
              <FaArrowRight className="inline ml-2" aria-hidden="true" />
            </Button>
          )}
        </BoxFooter>
      </Container>

      {ceremony !== null && (
        <PostcardCeremony postcards={ceremony} close={() => setCeremony(null)} onPresented={acknowledge} />
      )}
    </>
  );
}
