import { Button, Pagination, Select, TextInput } from "flowbite-react";
import React, { useMemo, useState } from "react";
import { FaCircleInfo, FaMagnifyingGlass } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import { allianceDot } from "~/components/operator/List/allianceStyle";
import { OperatorCard } from "~/components/operator/List/OperatorCard";
import { Alliance, allContinents, type Continent, continentLabel, type Operator } from "~/models";
import { EmptyStateIcon } from "~/shared/ui/Table/LoadingStates/EmptyStateIcon";
import { EmptyStateText } from "~/shared/ui/Table/LoadingStates/EmptyStateText";
import { TableEmptyState } from "~/shared/ui/Table/LoadingStates/TableEmptyState";

const PAGE_SIZE = 24;

type AllianceFilter = "all" | "unaligned" | Alliance;
type ContinentFilter = "all" | Continent;

const ALLIANCE_CHIPS: { value: AllianceFilter; label: string; dot: string | null }[] = [
  { value: "all", label: "All alliances", dot: null },
  { value: Alliance.StarAlliance, label: "Star Alliance", dot: allianceDot(Alliance.StarAlliance) },
  { value: Alliance.SkyTeam, label: "SkyTeam", dot: allianceDot(Alliance.SkyTeam) },
  { value: Alliance.Oneworld, label: "Oneworld", dot: allianceDot(Alliance.Oneworld) },
  { value: Alliance.VanillaAlliance, label: "Vanilla Alliance", dot: allianceDot(Alliance.VanillaAlliance) },
  { value: "unaligned", label: "Unaligned", dot: allianceDot(null) },
];

function matchesSearch(operator: Operator, query: string): boolean {
  return [operator.shortName, operator.icaoCode, operator.iataCode].some((value) =>
    value.toLowerCase().includes(query),
  );
}

type Props = {
  operators: Operator[];
};

export function OperatorList({ operators }: Props) {
  const [search, setSearch] = useState("");
  const [alliance, setAlliance] = useState<AllianceFilter>("all");
  const [continent, setContinent] = useState<ContinentFilter>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return operators.filter((operator) => {
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
      return true;
    });
  }, [operators, search, alliance, continent]);

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
    setPage(1);
  }

  return (
    <div className="flex flex-col">
      <div className="mb-5 flex flex-wrap items-center gap-2.5">
        <div className="w-full sm:w-72">
          <TextInput
            icon={FaMagnifyingGlass}
            placeholder="Search by name, IATA or ICAO code"
            value={search}
            onChange={(event) => resetPage(setSearch)(event.target.value)}
          />
        </div>
        {ALLIANCE_CHIPS.map((chip) => (
          <button
            key={chip.value}
            type="button"
            onClick={() => resetPage(setAlliance)(chip.value)}
            className={twMerge(
              "inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition",
              alliance === chip.value
                ? "border-indigo-500 bg-indigo-500 text-white"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700",
            )}
          >
            {chip.dot && (
              <span className={twMerge("size-2 rounded-full", alliance === chip.value ? "bg-white/80" : chip.dot)} />
            )}
            {chip.label}
          </button>
        ))}
        <Select
          className="w-44 sm:ml-auto"
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
      </div>

      <div className="mb-3 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>
          {filtered.length} {filtered.length === 1 ? "operator" : "operators"}
        </span>
        {totalPages > 1 && (
          <span className="font-mono text-xs tabular-nums">
            Showing {start + 1}–{Math.min(start + PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
        )}
      </div>

      {filtered.length === 0 ? (
        <TableEmptyState>
          <EmptyStateIcon icon={FaCircleInfo} color="blue" />
          <EmptyStateText
            title="No operators match your filters."
            paragraph="Try a different search term, alliance, or continent."
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
