import { Button, Pagination, Select } from "flowbite-react";
import React, { useMemo, useState } from "react";
import { FaCircleInfo } from "react-icons/fa6";
import { LuX } from "react-icons/lu";
import { allContinents, type Continent } from "~/features/airport";
import { Alliance, continentLabel, type Operator, OperatorServiceType } from "~/features/operator";
import { OperatorCard } from "~/features/operator/components/List/OperatorCard";
import { OperatorRecentCard } from "~/features/operator/components/List/OperatorRecentCard";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";
import { FilterInput } from "~/shared/ui/Filter/FilterInput";
import { EmptyStateIcon } from "~/shared/ui/Table/LoadingStates/EmptyStateIcon";
import { EmptyStateText } from "~/shared/ui/Table/LoadingStates/EmptyStateText";
import { TableEmptyState } from "~/shared/ui/Table/LoadingStates/TableEmptyState";

const PAGE_SIZE = 24;

type AllianceFilter = "all" | "unaligned" | Alliance;
type ContinentFilter = "all" | Continent;
type ServiceTypeFilter = "all" | OperatorServiceType.Passenger | OperatorServiceType.Cargo;

const SERVICE_TYPE_OPTIONS: { value: ServiceTypeFilter; label: string }[] = [
  { value: "all", label: "All service types" },
  { value: OperatorServiceType.Passenger, label: "Passenger only" },
  { value: OperatorServiceType.Cargo, label: "Cargo only" },
];

function matchesServiceType(operator: Operator, traffic: ServiceTypeFilter): boolean {
  if (traffic === "all") {
    return true;
  }
  return operator.serviceType === traffic;
}

const ALLIANCE_OPTIONS: { value: AllianceFilter; label: string }[] = [
  { value: "all", label: "All alliances" },
  { value: Alliance.StarAlliance, label: "Star Alliance" },
  { value: Alliance.SkyTeam, label: "SkyTeam" },
  { value: Alliance.Oneworld, label: "Oneworld" },
  { value: Alliance.VanillaAlliance, label: "Vanilla Alliance" },
  { value: "unaligned", label: "Unaligned" },
];

function matchesSearch(operator: Operator, query: string): boolean {
  return [operator.shortName, operator.icaoCode, operator.iataCode].some((value) =>
    value.toLowerCase().includes(query),
  );
}

type Props = {
  operators: Operator[];
  recent: Operator[];
};

export function OperatorList({ operators, recent }: Props) {
  const [search, setSearch] = useState("");
  const [alliance, setAlliance] = useState<AllianceFilter>("all");
  const [continent, setContinent] = useState<ContinentFilter>("all");
  const [serviceType, setServiceType] = useState<ServiceTypeFilter>("all");
  const [page, setPage] = useState(1);

  const isFiltering = search.trim() !== "" || alliance !== "all" || continent !== "all" || serviceType !== "all";
  const showRecent = recent.length > 0 && !isFiltering;

  const listed = useMemo(() => {
    if (!showRecent) {
      return operators;
    }
    const recentIds = new Set(recent.map((operator) => operator.id));
    return operators.filter((operator) => !recentIds.has(operator.id));
  }, [operators, recent, showRecent]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return listed.filter((operator) => {
      if (query !== "" && !matchesSearch(operator, query)) {
        return false;
      }
      if (alliance === "unaligned" && operator.alliance) {
        return false;
      }
      if (alliance !== "all" && alliance !== "unaligned" && operator.alliance !== alliance) {
        return false;
      }
      if (continent !== "all" && operator.continent !== continent) {
        return false;
      }
      if (!matchesServiceType(operator, serviceType)) {
        return false;
      }
      return true;
    });
  }, [listed, search, alliance, continent, serviceType]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(totalPages, 1));
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  function resetPage<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      setPage(1);
    };
  }

  function clearFilters() {
    setSearch("");
    setAlliance("all");
    setContinent("all");
    setServiceType("all");
    setPage(1);
  }

  return (
    <div className="flex flex-col">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full sm:w-64">
          <FilterInput value={search} onChange={resetPage(setSearch)} placeholder="Search name, IATA or ICAO" />
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:ms-auto">
          <Select
            sizing="sm"
            className="w-40"
            aria-label="Filter by service type"
            value={serviceType}
            onChange={(event) => resetPage(setServiceType)(event.target.value as ServiceTypeFilter)}
          >
            {SERVICE_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          <Select
            sizing="sm"
            className="w-44"
            aria-label="Filter by alliance"
            value={alliance}
            onChange={(event) => resetPage(setAlliance)(event.target.value as AllianceFilter)}
          >
            {ALLIANCE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          <Select
            sizing="sm"
            className="w-44"
            aria-label="Filter by continent"
            value={continent}
            onChange={(event) => resetPage(setContinent)(event.target.value as ContinentFilter)}
          >
            <option value="all">All continents</option>
            {allContinents().map((value) => (
              <option key={value} value={value}>
                {continentLabel(value)}
              </option>
            ))}
          </Select>

          {isFiltering && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <LuX className="size-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {showRecent && (
        <section className="mb-6">
          <FieldLabel className="mb-2">Recently used</FieldLabel>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {recent.map((operator) => (
              <OperatorRecentCard key={operator.id} operator={operator} />
            ))}
          </div>
        </section>
      )}

      <div className="mb-3 flex items-baseline justify-between gap-3">
        <FieldLabel>
          {isFiltering ? "Matching operators" : "All operators"}
          <span className="ms-2 font-mono tracking-normal tabular-nums text-gray-400 dark:text-gray-500">
            {filtered.length}
          </span>
        </FieldLabel>
        {totalPages > 1 && (
          <span className="font-mono text-xs tabular-nums text-gray-500 dark:text-gray-400">
            Showing {start + 1}–{Math.min(start + PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
        )}
      </div>

      {filtered.length === 0 ? (
        <TableEmptyState>
          <EmptyStateIcon icon={FaCircleInfo} color="blue" />
          <EmptyStateText
            title="No operators match your filters."
            paragraph="Try a different search term, traffic type, alliance, or continent."
          />
          <Button color="light" className="mx-auto w-fit cursor-pointer" onClick={clearFilters}>
            Clear filters
          </Button>
        </TableEmptyState>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pageItems.map((operator) => (
              <OperatorCard key={operator.id} operator={operator} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} showIcons />
            </div>
          )}
        </>
      )}
    </div>
  );
}
