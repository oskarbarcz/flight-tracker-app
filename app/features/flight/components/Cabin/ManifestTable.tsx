import { Badge, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import React, { useMemo, useState } from "react";
import { ManifestNoMatches } from "~/features/flight/components/Cabin/ManifestNoMatches";
import { matchesQuery } from "~/features/flight/lib/manifest";
import { type ManifestPassenger, PassengerStatus } from "~/features/flight/model";
import { toHuman } from "~/i18n/translate";
import { FilterChoice } from "~/shared/ui/Filter/FilterChoice";
import { FilterInput } from "~/shared/ui/Filter/FilterInput";

type Props = {
  passengers: ManifestPassenger[];
};

const manifestTableTheme = {
  head: {
    cell: {
      base: "sticky top-0 z-10 bg-gray-50 px-3 py-2 dark:bg-gray-800",
    },
  },
};

type StatusChoice = PassengerStatus | "all";

const STATUS_CHOICES: { key: StatusChoice; label: string }[] = [
  { key: "all", label: "Everyone" },
  { key: PassengerStatus.Boarded, label: "Boarded" },
  { key: PassengerStatus.NoShow, label: "No-show" },
];

export function ManifestTable({ passengers }: Props) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusChoice>("all");
  const [specialServiceOnly, setSpecialServiceOnly] = useState(false);

  const wanted = query.trim().toUpperCase();
  const hasUpperDeck = useMemo(() => new Set(passengers.map((passenger) => passenger.deck)).size > 1, [passengers]);

  const shown = useMemo(
    () =>
      passengers.filter(
        (passenger) =>
          (wanted === "" || matchesQuery(passenger, wanted)) &&
          (status === "all" || passenger.status === status) &&
          (!specialServiceOnly || passenger.ssr !== null),
      ),
    [passengers, wanted, status, specialServiceOnly],
  );

  function clearFilters() {
    setQuery("");
    setStatus("all");
    setSpecialServiceOnly(false);
  }

  function keepOnlySearch() {
    setStatus("all");
    setSpecialServiceOnly(false);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="w-full sm:w-64">
          <FilterInput value={query} onChange={setQuery} placeholder="Search name, seat or booking" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {STATUS_CHOICES.map((choice) => (
            <FilterChoice
              key={choice.key}
              label={choice.label}
              isSelected={status === choice.key}
              onSelect={() => setStatus(status === choice.key ? "all" : choice.key)}
            />
          ))}
          <FilterChoice
            label="Special service"
            isSelected={specialServiceOnly}
            onSelect={() => setSpecialServiceOnly(!specialServiceOnly)}
          />
        </div>
      </div>

      {shown.length > 0 && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {`Showing ${shown.length} of ${passengers.length} passengers`}
        </p>
      )}

      {shown.length === 0 ? (
        <ManifestNoMatches
          passengers={passengers}
          query={query.trim()}
          status={status}
          specialServiceOnly={specialServiceOnly}
          onClear={clearFilters}
          onSearchOnly={keepOnlySearch}
        />
      ) : (
        <div className="max-h-128 overflow-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <Table theme={manifestTableTheme}>
            <TableHead>
              <TableRow>
                <TableHeadCell>Seat</TableHeadCell>
                <TableHeadCell>Passenger</TableHeadCell>
                <TableHeadCell>Booking</TableHeadCell>
                <TableHeadCell>Cabin</TableHeadCell>
                {hasUpperDeck && <TableHeadCell>Deck</TableHeadCell>}
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell>Special service</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {shown.map((passenger) => (
                <TableRow key={`${passenger.deck}-${passenger.designator}`}>
                  <TableCell className="whitespace-nowrap px-3 py-2 font-mono font-bold text-gray-900 dark:text-white">
                    {passenger.designator}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-3 py-2 font-medium text-gray-900 dark:text-white">
                    {passenger.name}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-3 py-2 font-mono">{passenger.pnr}</TableCell>
                  <TableCell className="whitespace-nowrap px-3 py-2">
                    {toHuman.cabinLayout.cabinClass(passenger.cabin)}
                  </TableCell>
                  {hasUpperDeck && (
                    <TableCell className="whitespace-nowrap px-3 py-2">
                      {toHuman.cabinLayout.deck(passenger.deck)}
                    </TableCell>
                  )}
                  <TableCell className="whitespace-nowrap px-3 py-2">
                    {passenger.status === PassengerStatus.NoShow ? (
                      <Badge color="warning" size="xs" className="w-fit">
                        No-show
                      </Badge>
                    ) : (
                      toHuman.flight.passengerStatus(passenger.status)
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-3 py-2">
                    {passenger.ssr === null ? (
                      <span className="text-gray-400 dark:text-gray-500">—</span>
                    ) : (
                      <span className="flex items-baseline gap-1.5">
                        <span className="font-mono font-bold text-gray-900 dark:text-white">{passenger.ssr}</span>
                        <span>{toHuman.flight.specialServiceRequest(passenger.ssr)}</span>
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
