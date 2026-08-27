import React, { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { CitiesWithoutPostcard } from "~/features/postcard/components/CitiesWithoutPostcard";
import { ContinentSelector } from "~/features/postcard/components/ContinentSelector";
import { DrawMissingResult } from "~/features/postcard/components/DrawMissingResult";
import { PostcardArtModal } from "~/features/postcard/components/PostcardArtModal";
import { PostcardAttentionStrip } from "~/features/postcard/components/PostcardAttentionStrip";
import { PostcardCountryGroup } from "~/features/postcard/components/PostcardCountryGroup";
import { PostcardToolbar } from "~/features/postcard/components/PostcardToolbar";
import { RedrawPostcardModal } from "~/features/postcard/components/RedrawPostcardModal";
import { usePostcardCatalogue } from "~/features/postcard/hooks/usePostcardCatalogue";
import { filterPostcards, isFiltering, UNSETTLED } from "~/features/postcard/lib/filterPostcards";
import { continentKey, groupPostcards, summariseContinents } from "~/features/postcard/lib/groupPostcards";
import {
  type DrawMissingResult as DrawMissingOutcome,
  type PlacedPostcard,
  PostcardStatus,
} from "~/features/postcard/model";
import { useApi } from "~/shared/api/useApi";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";
import { ContainerEmptyState } from "~/shared/ui/Layout/ContainerEmptyState";
import { SectionHeaderWithButton } from "~/shared/ui/Section/SectionHeaderWithButton";
import { LoadingData } from "~/shared/ui/Table/LoadingStates/LoadingData";

const FILTER_PARAMS = { search: "q", continent: "continent", country: "country", status: "status" } as const;

const MISSING_PARAM = "missing";

type DrawState =
  | { status: "idle" }
  | { status: "running" }
  | { status: "done"; result: DrawMissingOutcome }
  | { status: "failed" };

export default function PostcardsRoute() {
  usePageTitle("Postcards");

  const { postcardService } = useApi();
  const { postcards, citiesWithoutPostcard, reload } = usePostcardCatalogue();
  const [searchParams, setSearchParams] = useSearchParams();
  const [draw, setDraw] = useState<DrawState>({ status: "idle" });
  const [replacing, setReplacing] = useState<PlacedPostcard | null>(null);
  const [zoomed, setZoomed] = useState<PlacedPostcard | null>(null);

  const search = searchParams.get(FILTER_PARAMS.search) ?? "";
  const continent = searchParams.get(FILTER_PARAMS.continent) ?? "";
  const country = searchParams.get(FILTER_PARAMS.country) ?? "";
  const showingCitiesWithoutPostcard = searchParams.has(MISSING_PARAM);
  const chosen = searchParams.get(FILTER_PARAMS.status);
  const statuses = useMemo(() => {
    if (chosen === null) {
      return UNSETTLED;
    }

    const known = Object.values(PostcardStatus);

    return chosen.split(",").filter((value): value is PostcardStatus => known.includes(value as PostcardStatus));
  }, [chosen]);

  const filters = useMemo(() => ({ search, country, statuses }), [search, country, statuses]);

  const toggleStatus = useCallback(
    (status: PostcardStatus) => {
      const next = new URLSearchParams(searchParams);
      const wanted = statuses.includes(status) ? statuses.filter((held) => held !== status) : [...statuses, status];

      next.set(FILTER_PARAMS.status, wanted.join(","));
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams, statuses],
  );

  const setFilter = useCallback(
    (name: keyof typeof FILTER_PARAMS, value: string) => {
      const next = new URLSearchParams(searchParams);
      next.set(FILTER_PARAMS[name], value);

      if (name !== "status" && value === "") {
        next.delete(FILTER_PARAMS[name]);
      }

      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const toggleCitiesWithoutPostcard = useCallback(() => {
    const next = new URLSearchParams(searchParams);

    if (showingCitiesWithoutPostcard) {
      next.delete(MISSING_PARAM);
    } else {
      next.set(MISSING_PARAM, "");
    }

    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams, showingCitiesWithoutPostcard]);

  const showEverything = useCallback(() => {
    setSearchParams({ [FILTER_PARAMS.status]: "" }, { replace: true });
  }, [setSearchParams]);

  const matching = useMemo(() => (postcards === null ? [] : filterPostcards(postcards, filters)), [postcards, filters]);

  const continents = useMemo(() => summariseContinents(matching), [matching]);
  const selected =
    continents.find((summary) => summary.key === continent) ??
    continents.find((summary) => summary.postcardCount > 0) ??
    continents[0];

  const onContinent = useMemo(
    () => matching.filter((postcard) => continentKey(postcard.continent) === selected?.key),
    [matching, selected],
  );

  const groups = useMemo(() => groupPostcards(onContinent), [onContinent]);
  const signature = `${search}|${selected?.key ?? ""}|${country}|${statuses.join(",")}`;

  async function drawMissingArt() {
    setDraw({ status: "running" });

    try {
      const result = await postcardService.drawMissing();
      setDraw({ status: "done", result });
      reload();
    } catch {
      setDraw({ status: "failed" });
    }
  }

  return (
    <>
      <SectionHeaderWithButton
        sectionTitle="Postcards"
        primaryButton={{
          text: draw.status === "running" ? "Queueing…" : "Draw missing art",
          color: "indigo",
          disabled: draw.status === "running",
          onClick: drawMissingArt,
        }}
      />

      <p className="mb-4 max-w-prose text-sm text-gray-500 dark:text-gray-400">
        Every city's postcard and the art drawn for it. Drawing the missing art also retries the postcards whose art
        failed, so a city that has never been drawn and one that could not be drawn are both picked up.
      </p>

      {draw.status !== "idle" && draw.status !== "running" && (
        <div className="mb-5">
          <DrawMissingResult result={draw.status === "done" ? draw.result : null} />
        </div>
      )}

      {postcards === null && <LoadingData />}

      {postcards !== null && (
        <>
          <PostcardAttentionStrip
            postcards={postcards}
            citiesWithoutPostcard={citiesWithoutPostcard.length}
            statuses={statuses}
            showingCitiesWithoutPostcard={showingCitiesWithoutPostcard}
            onToggleStatus={toggleStatus}
            onToggleCitiesWithoutPostcard={toggleCitiesWithoutPostcard}
          />

          {showingCitiesWithoutPostcard ? (
            <CitiesWithoutPostcard cities={citiesWithoutPostcard} />
          ) : (
            <>
              <ContinentSelector
                continents={continents}
                selected={selected?.key ?? ""}
                onSelect={(key) => setFilter("continent", key)}
              />

              <PostcardToolbar
                filters={filters}
                postcards={postcards}
                isFiltering={isFiltering(filters)}
                onChange={setFilter}
                onClear={showEverything}
              />

              <div className="mb-3 flex items-baseline justify-between gap-3">
                <FieldLabel>
                  {isFiltering(filters) ? "Matching postcards" : "All postcards"}
                  <span className="ms-2 font-mono tracking-normal tabular-nums text-gray-400 dark:text-gray-500">
                    {onContinent.length}
                  </span>
                </FieldLabel>
                <span className="font-mono text-xs tabular-nums text-gray-500 dark:text-gray-400">
                  {groups.length} {groups.length === 1 ? "country" : "countries"} · {matching.length} matching ·{" "}
                  {postcards.length} in total
                </span>
              </div>

              {groups.length === 0 && (
                <ContainerEmptyState>
                  {isFiltering(filters)
                    ? "No postcard here matches. Try another continent, city, country or state of the art."
                    : "This continent holds no postcard at all."}
                </ContainerEmptyState>
              )}

              {groups.length > 0 && (
                <div className="flex flex-col gap-3">
                  {groups.map((group, index) => (
                    <PostcardCountryGroup
                      key={`${signature}:${group.code}`}
                      group={group}
                      defaultOpen={index === 0}
                      onZoom={setZoomed}
                      onReplace={setReplacing}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}

      {zoomed !== null && replacing === null && (
        <PostcardArtModal
          postcard={zoomed}
          close={() => setZoomed(null)}
          onReplace={(postcard) => {
            setZoomed(null);
            setReplacing(postcard);
          }}
        />
      )}

      {replacing !== null && (
        <RedrawPostcardModal postcard={replacing} close={() => setReplacing(null)} onReplaced={reload} />
      )}
    </>
  );
}
