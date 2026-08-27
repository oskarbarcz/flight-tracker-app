import React, { useEffect, useMemo, useRef, useState } from "react";
import { PostcardCeremony } from "~/features/postcard/components/Ceremony/PostcardCeremony";
import { PostcardCollectionGrid } from "~/features/postcard/components/Collection/PostcardCollectionGrid";
import { PostcardCountryFilter } from "~/features/postcard/components/Collection/PostcardCountryFilter";
import { PostcardModal } from "~/features/postcard/components/Collection/PostcardModal";
import { usePostcards } from "~/features/postcard/hooks/usePostcards";
import { inCountry } from "~/features/postcard/lib/collection";
import type { CollectedPostcard } from "~/features/postcard/model";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";
import { ContainerEmptyState } from "~/shared/ui/Layout/ContainerEmptyState";
import { SectionHeader } from "~/shared/ui/Section/SectionHeader";
import { LoadingData } from "~/shared/ui/Table/LoadingStates/LoadingData";

export default function MyPostcardsRoute() {
  usePageTitle("Postcards");

  const { collection, total, waiting, acknowledge } = usePostcards();
  const [country, setCountry] = useState("");
  const [opened, setOpened] = useState<CollectedPostcard | null>(null);
  const [ceremony, setCeremony] = useState<CollectedPostcard[] | null>(null);
  const offered = useRef(new Set<string>());

  useEffect(() => {
    if (collection === null) {
      return;
    }

    const unoffered = waiting.filter(({ id }) => !offered.current.has(id));

    if (unoffered.length === 0) {
      return;
    }

    for (const { id } of waiting) {
      offered.current.add(id);
    }

    setCeremony(unoffered);
  }, [collection, waiting]);

  const shown = useMemo(() => (collection === null ? [] : inCountry(collection, country)), [collection, country]);

  return (
    <>
      <SectionHeader title="Postcards" />

      {collection === null ? (
        <LoadingData />
      ) : collection.length === 0 ? (
        <ContainerEmptyState>No postcard has arrived yet. The cities you reach send you one.</ContainerEmptyState>
      ) : (
        <>
          <PostcardCountryFilter postcards={collection} selected={country} onSelect={setCountry} />

          <div className="mb-3 flex items-baseline justify-between gap-3">
            <FieldLabel>
              {country === "" ? "Collected" : "Collected here"}
              <span className="ms-2 font-mono tracking-normal tabular-nums text-gray-400 dark:text-gray-500">
                {shown.length}
              </span>
            </FieldLabel>
            <span className="font-mono text-xs tabular-nums text-gray-500 dark:text-gray-400">
              {collection.length} of {total}
            </span>
          </div>

          {shown.length === 0 ? (
            <ContainerEmptyState>No postcard from this country yet.</ContainerEmptyState>
          ) : (
            <PostcardCollectionGrid postcards={shown} onOpen={setOpened} />
          )}
        </>
      )}

      {opened !== null && ceremony === null && <PostcardModal postcard={opened} close={() => setOpened(null)} />}

      {ceremony !== null && (
        <PostcardCeremony postcards={ceremony} close={() => setCeremony(null)} onPresented={acknowledge} />
      )}
    </>
  );
}
