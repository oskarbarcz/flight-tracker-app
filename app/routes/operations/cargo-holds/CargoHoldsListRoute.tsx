import React, { useEffect, useState } from "react";
import { LuContainer } from "react-icons/lu";
import { useSearchParams } from "react-router";
import { HoldCatalogueTable } from "~/features/cargo-hold/components/Catalogue/HoldCatalogueTable";
import type { AircraftHoldLayout } from "~/features/cargo-hold/model";
import { useApi } from "~/shared/api/useApi";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { FilterInput } from "~/shared/ui/Filter/FilterInput";
import { SectionHeaderWithButton } from "~/shared/ui/Section/SectionHeaderWithButton";
import { EmptyStateIcon } from "~/shared/ui/Table/LoadingStates/EmptyStateIcon";
import { EmptyStateText } from "~/shared/ui/Table/LoadingStates/EmptyStateText";
import { LoadingData } from "~/shared/ui/Table/LoadingStates/LoadingData";
import { TableEmptyState } from "~/shared/ui/Table/LoadingStates/TableEmptyState";

type CatalogueState = { status: "loading" } | { status: "failed" } | { status: "ready"; layouts: AircraftHoldLayout[] };

export default function CargoHoldsListRoute() {
  usePageTitle("Cargo hold catalogue");

  const { cargoHoldService } = useApi();
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState<CatalogueState>({ status: "loading" });

  const filter = searchParams.get("type") ?? "";

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    cargoHoldService
      .fetchCatalogue()
      .then((layouts) => {
        if (!cancelled) {
          setState({ status: "ready", layouts });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({ status: "failed" });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [cargoHoldService]);

  const setFilter = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === "") {
      next.delete("type");
    } else {
      next.set("type", value.toUpperCase());
    }
    setSearchParams(next, { replace: true });
  };

  const matching =
    state.status === "ready" ? state.layouts.filter((layout) => layout.type.includes(filter.toUpperCase())) : [];

  return (
    <>
      <SectionHeaderWithButton sectionTitle="Cargo hold catalogue" />

      <p className="mb-4 max-w-prose text-sm text-gray-500 dark:text-gray-400">
        Hold configurations for every curated airframe type. Volumes and device counts follow published airframe
        figures; compartment limits are derived from the positions each compartment holds.
      </p>

      <div className="mb-4">
        <FilterInput className="w-56" placeholder="Filter by ICAO type" value={filter} onChange={setFilter} />
      </div>

      {state.status === "loading" && <LoadingData />}

      {state.status === "failed" && (
        <TableEmptyState>
          <EmptyStateIcon icon={LuContainer} color="blue" />
          <EmptyStateText
            title="Catalogue unavailable"
            paragraph="The hold catalogue did not load. Reload to try again."
          />
        </TableEmptyState>
      )}

      {state.status === "ready" && matching.length === 0 && (
        <TableEmptyState>
          <EmptyStateIcon icon={LuContainer} color="blue" />
          <EmptyStateText
            title="No type matches that filter"
            paragraph="Filter by ICAO designator — B77W, B74F, A320."
          />
          <button
            type="button"
            onClick={() => setFilter("")}
            className="mx-auto block cursor-pointer text-sm text-indigo-600 underline dark:text-indigo-400"
          >
            Clear the filter
          </button>
        </TableEmptyState>
      )}

      {state.status === "ready" && matching.length > 0 && <HoldCatalogueTable layouts={matching} />}
    </>
  );
}
