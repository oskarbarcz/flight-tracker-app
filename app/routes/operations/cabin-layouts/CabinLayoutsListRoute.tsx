import { Button, Pagination } from "flowbite-react";
import React, { useCallback, useEffect, useState } from "react";
import { FaCircleInfo } from "react-icons/fa6";
import { useSearchParams } from "react-router";
import { CabinLayoutListTable } from "~/features/cabin-layout/components/Catalogue/CabinLayoutListTable";
import { CatalogueRefreshResult } from "~/features/cabin-layout/components/Catalogue/CatalogueRefreshResult";
import { CatalogueToolbar } from "~/features/cabin-layout/components/Catalogue/CatalogueToolbar";
import type { CabinLayoutList, CabinLayoutSyncResult } from "~/features/cabin-layout/model";
import { useApi } from "~/shared/api/useApi";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";
import { TransparentContainer } from "~/shared/ui/Layout/TransparentContainer";
import { SectionHeaderWithButton } from "~/shared/ui/Section/SectionHeaderWithButton";
import { EmptyStateIcon } from "~/shared/ui/Table/LoadingStates/EmptyStateIcon";
import { EmptyStateText } from "~/shared/ui/Table/LoadingStates/EmptyStateText";
import { LoadingData } from "~/shared/ui/Table/LoadingStates/LoadingData";
import { TableEmptyState } from "~/shared/ui/Table/LoadingStates/TableEmptyState";

const PAGE_SIZE = 25;
const AIRLINE_LENGTH = 2;
const MIN_AIRCRAFT_TYPE_LENGTH = 2;

const FILTER_PARAMS = { airline: "airline", aircraftType: "type", status: "status" } as const;

type RefreshState =
  | { status: "idle" }
  | { status: "running" }
  | { status: "done"; result: CabinLayoutSyncResult }
  | { status: "failed" };

export default function CabinLayoutsListRoute() {
  usePageTitle("Cabin layout catalogue");

  const { cabinLayoutService } = useApi();
  const [searchParams, setSearchParams] = useSearchParams();
  const [layouts, setLayouts] = useState<CabinLayoutList | null>(null);
  const [refresh, setRefresh] = useState<RefreshState>({ status: "idle" });

  const filters = {
    airline: searchParams.get(FILTER_PARAMS.airline) ?? "",
    aircraftType: searchParams.get(FILTER_PARAMS.aircraftType) ?? "",
    status: searchParams.get(FILTER_PARAMS.status) ?? "",
  };
  const page = Number(searchParams.get("page") ?? 1);
  const offset = (page - 1) * PAGE_SIZE;

  const isFiltering = filters.airline !== "" || filters.aircraftType !== "" || filters.status !== "";

  const setFilter = useCallback(
    (name: keyof typeof FILTER_PARAMS, value: string) => {
      const next = new URLSearchParams(searchParams);
      if (value === "") {
        next.delete(FILTER_PARAMS[name]);
      } else {
        next.set(FILTER_PARAMS[name], value);
      }
      next.delete("page");
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const goToPage = useCallback(
    (value: number) => {
      const next = new URLSearchParams(searchParams);
      if (value === 1) {
        next.delete("page");
      } else {
        next.set("page", String(value));
      }
      setSearchParams(next);
    },
    [searchParams, setSearchParams],
  );

  const load = useCallback(() => {
    let cancelled = false;
    setLayouts(null);

    const airline = filters.airline.trim();
    const aircraftType = filters.aircraftType.trim();

    cabinLayoutService
      .list({
        airlineIata: airline.length === AIRLINE_LENGTH ? airline : undefined,
        aircraftIata: aircraftType.length >= MIN_AIRCRAFT_TYPE_LENGTH ? aircraftType : undefined,
        retired: filters.status === "" ? undefined : filters.status === "true",
        limit: PAGE_SIZE,
        offset,
      })
      .then((response) => {
        if (!cancelled) {
          setLayouts(response);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLayouts({ items: [], total: 0, limit: PAGE_SIZE, offset });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [cabinLayoutService, filters.airline, filters.aircraftType, filters.status, offset]);

  useEffect(load, [load]);

  async function refreshCatalogue() {
    setRefresh({ status: "running" });

    try {
      const result = await cabinLayoutService.sync();
      setRefresh({ status: "done", result });
      goToPage(1);
      load();
    } catch {
      setRefresh({ status: "failed" });
    }
  }

  const totalPages = layouts === null ? 1 : Math.max(1, Math.ceil(layouts.total / PAGE_SIZE));

  return (
    <>
      <SectionHeaderWithButton
        sectionTitle="Cabin layouts"
        primaryButton={{
          text: refresh.status === "running" ? "Refreshing…" : "Refresh catalogue",
          color: "indigo",
          disabled: refresh.status === "running",
          onClick: refreshCatalogue,
        }}
      />

      {refresh.status !== "idle" && refresh.status !== "running" && (
        <div className="mb-5">
          <CatalogueRefreshResult result={refresh.status === "done" ? refresh.result : null} />
        </div>
      )}

      <CatalogueToolbar
        filters={filters}
        isFiltering={isFiltering}
        onChange={setFilter}
        onClear={() => setSearchParams({}, { replace: true })}
      />

      {layouts === null && <LoadingData />}

      {layouts !== null && (
        <>
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <FieldLabel>
              {isFiltering ? "Matching layouts" : "All layouts"}
              <span className="ms-2 font-mono tracking-normal tabular-nums text-gray-400 dark:text-gray-500">
                {layouts.total}
              </span>
            </FieldLabel>
            {totalPages > 1 && (
              <span className="font-mono text-xs tabular-nums text-gray-500 dark:text-gray-400">
                Showing {offset + 1}–{Math.min(offset + PAGE_SIZE, layouts.total)} of {layouts.total}
              </span>
            )}
          </div>

          {layouts.total === 0 && isFiltering && (
            <TableEmptyState>
              <EmptyStateIcon icon={FaCircleInfo} color="blue" />
              <EmptyStateText
                title="No cabin layouts match your filters."
                paragraph="Try a different airline code, aircraft type or status."
              />
              <Button
                color="light"
                className="mx-auto w-fit cursor-pointer"
                onClick={() => setSearchParams({}, { replace: true })}
              >
                Clear filters
              </Button>
            </TableEmptyState>
          )}

          {layouts.total === 0 && !isFiltering && (
            <TableEmptyState>
              <EmptyStateIcon icon={FaCircleInfo} color="blue" />
              <EmptyStateText
                title="The catalogue is empty."
                paragraph="Refresh it against LOPA to read the layouts it publishes."
              />
            </TableEmptyState>
          )}

          {layouts.items.length > 0 && (
            <TransparentContainer className="overflow-x-auto">
              <CabinLayoutListTable layouts={layouts.items} />
            </TransparentContainer>
          )}

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={goToPage} showIcons />
            </div>
          )}
        </>
      )}
    </>
  );
}
