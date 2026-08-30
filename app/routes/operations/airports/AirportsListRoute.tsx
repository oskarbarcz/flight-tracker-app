import React, { useCallback, useEffect, useMemo, useState } from "react";
import { HiPlus } from "react-icons/hi";
import { Outlet, useSearchParams } from "react-router";
import { useDataRefresh } from "~/app-state/useDataRefresh";
import { type Airport, allContinents, type Continent, DataQuality } from "~/features/airport";
import { EnrichAirportDataModal } from "~/features/airport/components/Enrichment/EnrichAirportDataModal";
import { AirportContinentPills } from "~/features/airport/components/List/AirportContinentPills";
import { AirportList } from "~/features/airport/components/List/AirportList";
import { AirportListToolbar } from "~/features/airport/components/List/AirportListToolbar";
import { AirportQualityChips } from "~/features/airport/components/List/AirportQualityChips";
import type { AirportListContext } from "~/features/airport/components/List/airportListContext";
import {
  type AirportFilters,
  filterAirports,
  isFiltering,
  isSearching,
  sortAirports,
} from "~/features/airport/lib/filterAirports";
import { summariseContinents, summariseQualities } from "~/features/airport/lib/summariseAirports";
import { useApi } from "~/shared/api/useApi";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";
import { ContainerEmptyState } from "~/shared/ui/Layout/ContainerEmptyState";
import { SectionHeaderWithButton } from "~/shared/ui/Section/SectionHeaderWithButton";
import { LoadingData } from "~/shared/ui/Table/LoadingStates/LoadingData";

const PARAM = { search: "q", quality: "quality", continent: "continent", country: "country" } as const;
const ENRICH_PARAM = "enrich";
const PAGE_SIZE = 25;
const DEFAULT_QUALITIES = [DataQuality.Low];

export default function AirportsListRoute() {
  usePageTitle("Airport list");

  const { airportService } = useApi();
  const { markRefreshed } = useDataRefresh();
  const [airports, setAirports] = useState<Airport[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState<number>(1);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setAirports(await airportService.fetchAll());
    setIsLoading(false);
    markRefreshed();
  }, [airportService, markRefreshed]);

  useEffect(() => {
    reload();
  }, [reload]);

  const chosenQualities = searchParams.get(PARAM.quality);
  const qualities = useMemo(() => {
    if (chosenQualities === null) {
      return DEFAULT_QUALITIES;
    }

    const known = Object.values(DataQuality);

    return chosenQualities.split(",").filter((value): value is DataQuality => known.includes(value as DataQuality));
  }, [chosenQualities]);

  const chosenContinent = searchParams.get(PARAM.continent);
  const continent = allContinents().includes(chosenContinent as Continent) ? (chosenContinent as Continent) : "";

  const filters: AirportFilters = useMemo(
    () => ({
      search: searchParams.get(PARAM.search) ?? "",
      qualities,
      continent,
      country: searchParams.get(PARAM.country) ?? "",
    }),
    [searchParams, qualities, continent],
  );

  const applyParams = useCallback(
    (next: URLSearchParams) => {
      setPage(1);
      setSearchParams(next, { replace: true });
    },
    [setSearchParams],
  );

  const setFilter = useCallback(
    (name: keyof typeof PARAM, value: string) => {
      const next = new URLSearchParams(searchParams);
      next.set(PARAM[name], value);

      if (name !== "quality" && value === "") {
        next.delete(PARAM[name]);
      }

      applyParams(next);
    },
    [applyParams, searchParams],
  );

  const toggleQuality = useCallback(
    (quality: DataQuality) => {
      const wanted = qualities.includes(quality)
        ? qualities.filter((held) => held !== quality)
        : [...qualities, quality];

      const next = new URLSearchParams(searchParams);
      next.set(PARAM.quality, wanted.join(","));
      applyParams(next);
    },
    [applyParams, qualities, searchParams],
  );

  const showEverything = useCallback(() => {
    applyParams(new URLSearchParams({ [PARAM.quality]: "" }));
  }, [applyParams]);

  const openEnrichment = useCallback(
    (airport: Airport) => {
      const next = new URLSearchParams(searchParams);
      next.set(ENRICH_PARAM, airport.id);
      setSearchParams(next);
    },
    [searchParams, setSearchParams],
  );

  const closeEnrichment = useCallback(() => {
    const next = new URLSearchParams(searchParams);
    next.delete(ENRICH_PARAM);
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  const held = airports ?? [];
  const qualitySummaries = useMemo(() => summariseQualities(held), [held]);
  const continentSummaries = useMemo(() => summariseContinents(held, allContinents()), [held]);
  const matching = useMemo(() => sortAirports(filterAirports(held, filters)), [held, filters]);

  const totalPages = Math.max(1, Math.ceil(matching.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const offset = (currentPage - 1) * PAGE_SIZE;
  const visible = matching.slice(offset, offset + PAGE_SIZE);

  const searching = isSearching(filters);
  const filtering = isFiltering(filters);
  const enriching = held.find((airport) => airport.id === searchParams.get(ENRICH_PARAM)) ?? null;

  const isBacklogClear =
    !searching &&
    filters.continent === "" &&
    filters.country === "" &&
    qualities.length === 1 &&
    qualities[0] === DataQuality.Low &&
    (qualitySummaries.find(({ quality }) => quality === DataQuality.Low)?.count ?? 0) === 0;

  const listPath = `/airports?${searchParams.toString()}`;
  const context: AirportListContext = { reload, listPath };

  return (
    <>
      <SectionHeaderWithButton
        sectionTitle="Airports"
        primaryButton={{
          text: "Create new",
          url: `/airports/new?${searchParams.toString()}`,
          color: "indigo",
          icon: <HiPlus />,
          viewTransition: false,
        }}
      />

      {airports === null && <LoadingData />}

      {airports !== null && (
        <>
          <AirportQualityChips
            summaries={qualitySummaries}
            active={qualities}
            searching={searching}
            onToggle={toggleQuality}
          />

          <AirportListToolbar
            filters={filters}
            airports={held}
            isFiltering={filtering}
            onChange={setFilter}
            onClear={showEverything}
          />

          <AirportContinentPills
            summaries={continentSummaries}
            total={held.length}
            selected={filters.continent}
            onSelect={(value) => setFilter("continent", value)}
          />

          <div className="mb-3 flex items-baseline justify-between gap-3">
            <FieldLabel>
              {filtering ? "Matching airports" : "All airports"}
              <span className="ms-2 font-mono tracking-normal tabular-nums text-gray-400 dark:text-gray-500">
                {matching.length}
              </span>
            </FieldLabel>
            <span className="font-mono text-xs tabular-nums text-gray-500 dark:text-gray-400">
              {matching.length} matching · {held.length} in total
            </span>
          </div>

          {matching.length === 0 && isBacklogClear && (
            <ContainerEmptyState>Every airport is enriched.</ContainerEmptyState>
          )}

          {matching.length === 0 && !isBacklogClear && (
            <ContainerEmptyState>
              <span>
                No airport matches.
                <button
                  type="button"
                  onClick={showEverything}
                  className="ms-2 cursor-pointer font-medium text-primary-500 underline-offset-2 hover:underline"
                >
                  Show every airport
                </button>
              </span>
            </ContainerEmptyState>
          )}

          {matching.length > 0 && (
            <AirportList
              airports={visible}
              loading={isLoading}
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
              onEnrich={openEnrichment}
            />
          )}
        </>
      )}

      {enriching !== null && <EnrichAirportDataModal airport={enriching} close={closeEnrichment} onApplied={reload} />}

      <Outlet context={context} />
    </>
  );
}
