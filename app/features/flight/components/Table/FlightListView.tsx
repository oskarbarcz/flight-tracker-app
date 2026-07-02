import React from "react";
import { useSearchParams } from "react-router";
import { FlightListEmptyState } from "~/features/flight/components/Table/FlightListEmptyState";
import { FlightListTable } from "~/features/flight/components/Table/FlightListTable";
import { useFlightList } from "~/features/flight/hooks/useFlightList";
import type { FlightPhase } from "~/models";
import { TransparentContainer } from "~/shared/ui/Layout/TransparentContainer";

type Props = {
  phases: FlightPhase[];
  emptyMessage: string;
  showImportActions?: boolean;
  onImport?: () => void;
  importLoading?: boolean;
};

export function FlightListView({ phases, emptyMessage, showImportActions = false, onImport, importLoading }: Props) {
  const { flights, loading, reloadFlights } = useFlightList();
  const [searchParams] = useSearchParams();
  const currentPage = Number.parseInt(searchParams.get("page") ?? "1", 10);

  React.useEffect(() => {
    reloadFlights(phases, currentPage);
  }, [reloadFlights, phases, currentPage]);

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
    <TransparentContainer>
      <FlightListTable />
    </TransparentContainer>
  );
}
