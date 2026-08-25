import React from "react";
import { useSearchParams } from "react-router";
import type { FlightPhase } from "~/features/flight";
import { FlightList } from "~/features/flight/components/List/FlightList";
import { type FlightListTrailingColumn, statusColumn } from "~/features/flight/components/List/FlightListColumns";
import { operationsLinks } from "~/features/flight/components/List/FlightListLinks";
import { FlightListEmptyState } from "~/features/flight/components/Table/FlightListEmptyState";
import { useFlightList } from "~/features/flight/hooks/useFlightList";

type Props = {
  phases: FlightPhase[];
  emptyMessage: string;
  trailingColumn?: FlightListTrailingColumn;
  showImportActions?: boolean;
  onImport?: () => void;
  importLoading?: boolean;
};

export function FlightListView({
  phases,
  emptyMessage,
  trailingColumn = statusColumn,
  showImportActions = false,
  onImport,
  importLoading,
}: Props) {
  const { flights, loading, totalCount, limit, reloadFlights } = useFlightList();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number.parseInt(searchParams.get("page") ?? "1", 10);

  React.useEffect(() => {
    reloadFlights(phases, currentPage);
  }, [reloadFlights, phases, currentPage]);

  const onPageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
  };

  if (flights.length === 0 && !loading) {
    return (
      <FlightListEmptyState
        message={emptyMessage}
        showImportActions={showImportActions}
        onImport={onImport}
        importLoading={importLoading}
      />
    );
  }

  return (
    <FlightList
      flights={flights}
      loading={loading}
      page={currentPage}
      totalPages={Math.ceil(totalCount / limit)}
      onPageChange={onPageChange}
      links={operationsLinks}
      trailingColumn={trailingColumn}
    />
  );
}
