import { Badge, Button, Label, Modal, ModalBody, ModalHeader, Spinner, TextInput } from "flowbite-react";
import React, { useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import type { Aircraft } from "~/features/aircraft";
import type { CabinLayout, CabinLayoutSuggestion } from "~/features/cabin-layout/model";
import { LayoutMatch } from "~/features/cabin-layout/model";
import { toHuman } from "~/i18n/translate";
import { useApi } from "~/shared/api/useApi";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type Props = {
  aircraft: Aircraft;
  operatorId: string;
  airlineIata: string;
  assign: (cabinLayout: string) => void;
  cancel: () => void;
};

const MATCH_ORDER = [LayoutMatch.Exact, LayoutMatch.Airline, LayoutMatch.AircraftType];
const PAGE_SIZE = 24;

function layoutName(layout: CabinLayout): string {
  return layout.variant
    ? `${layout.airlineIata} ${layout.aircraftIata} · variant ${layout.variant}`
    : `${layout.airlineIata} ${layout.aircraftIata}`;
}

type OptionProps = {
  layout: CabinLayout;
  isSelected: boolean;
  isAssigned: boolean;
  onSelect: () => void;
};

function LayoutOption({ layout, isSelected, isAssigned, onSelect }: OptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className={twMerge(
        "flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left transition-colors",
        isSelected
          ? "border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-950"
          : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600",
      )}
    >
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-gray-900 dark:text-white">{layoutName(layout)}</span>
        <span className="block truncate font-mono text-xs text-gray-500 dark:text-gray-400">{layout.id}</span>
      </span>
      <span className="flex shrink-0 items-center gap-1.5">
        {isAssigned && (
          <Badge color="indigo" size="xs">
            Assigned
          </Badge>
        )}
        {layout.retiredAt !== null && (
          <Badge color="warning" size="xs">
            Retired
          </Badge>
        )}
      </span>
    </button>
  );
}

export function AssignCabinLayoutModal({ aircraft, operatorId, airlineIata, assign, cancel }: Props) {
  const { aircraftService, cabinLayoutService } = useApi();
  const assignedId = aircraft.cabinLayout?.id ?? null;

  const [selected, setSelected] = useState<string | null>(assignedId);
  const [suggestions, setSuggestions] = useState<CabinLayoutSuggestion[] | null>(null);
  const [airlineFilter, setAirlineFilter] = useState(airlineIata);
  const [typeFilter, setTypeFilter] = useState(aircraft.airframe.iataType ?? "");
  const [offset, setOffset] = useState(0);
  const [results, setResults] = useState<{ items: CabinLayout[]; total: number } | null>(null);
  const [isBrowsing, setIsBrowsing] = useState(false);

  useEffect(() => {
    aircraftService
      .fetchCabinLayoutSuggestions(operatorId, aircraft.id)
      .then((response) => setSuggestions(response.items))
      .catch(() => setSuggestions([]));
  }, [aircraftService, operatorId, aircraft.id]);

  useEffect(() => {
    if (!isBrowsing) {
      return;
    }

    let cancelled = false;
    const airline = airlineFilter.trim().toUpperCase();
    const aircraftType = typeFilter.trim().toUpperCase();

    cabinLayoutService
      .list({
        airlineIata: airline.length === 2 ? airline : undefined,
        aircraftIata: aircraftType.length >= 2 ? aircraftType : undefined,
        limit: PAGE_SIZE,
        offset,
      })
      .then((response) => {
        if (!cancelled) {
          setResults({ items: response.items, total: response.total });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setResults({ items: [], total: 0 });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [cabinLayoutService, isBrowsing, airlineFilter, typeFilter, offset]);

  const grouped = useMemo(() => {
    if (suggestions === null) {
      return [];
    }
    return MATCH_ORDER.map((match) => ({
      match,
      items: suggestions.filter((item) => item.match === match),
    })).filter((group) => group.items.length > 0);
  }, [suggestions]);

  const hasIataType = aircraft.airframe.iataType !== null;

  return (
    <Modal size="lg" className="text-gray-800 dark:text-white" show onClose={cancel}>
      <ModalHeader>
        <ModalTitle context="Cabin layout" action={assignedId ? "Change" : "Assign"} />
      </ModalHeader>
      <ModalBody className="flex flex-col gap-4">
        <section className="flex flex-col gap-2">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Suggested for {aircraft.registration}
          </h3>

          {suggestions === null && (
            <span className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Spinner size="sm" />
              Looking for matching layouts…
            </span>
          )}

          {suggestions !== null && grouped.length === 0 && (
            <p className="rounded-lg bg-gray-50 px-3 py-2.5 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              No catalogued layout matches this operator or aircraft type. Browse the catalogue below to pick one
              anyway.
            </p>
          )}

          {!hasIataType && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {aircraft.airframe.name} has no IATA type code, so no layout can be matched on aircraft type.
            </p>
          )}

          {grouped.map((group) => (
            <div key={group.match} className="flex flex-col gap-1.5">
              <span className="text-xs text-gray-500 dark:text-gray-400">{toHuman.cabinLayout.match(group.match)}</span>
              {group.items.map((layout) => (
                <LayoutOption
                  key={layout.id}
                  layout={layout}
                  isSelected={selected === layout.id}
                  isAssigned={assignedId === layout.id}
                  onSelect={() => setSelected(layout.id)}
                />
              ))}
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
          {!isBrowsing && (
            <Button color="light" size="sm" onClick={() => setIsBrowsing(true)}>
              Browse the whole catalogue
            </Button>
          )}

          {isBrowsing && (
            <>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Browse the catalogue
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="airlineFilter">Airline code</Label>
                  <TextInput
                    id="airlineFilter"
                    value={airlineFilter}
                    maxLength={2}
                    placeholder="LH"
                    onChange={(event) => {
                      setAirlineFilter(event.target.value);
                      setOffset(0);
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="typeFilter">Aircraft type code</Label>
                  <TextInput
                    id="typeFilter"
                    value={typeFilter}
                    maxLength={6}
                    placeholder="77W"
                    onChange={(event) => {
                      setTypeFilter(event.target.value);
                      setOffset(0);
                    }}
                  />
                </div>
              </div>

              {results === null && (
                <span className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Spinner size="sm" />
                  Loading layouts…
                </span>
              )}

              {results !== null && results.items.length === 0 && (
                <p className="rounded-lg bg-gray-50 px-3 py-2.5 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  No layout matches these codes.
                </p>
              )}

              {results !== null && results.items.length > 0 && (
                <>
                  <div className="flex max-h-64 flex-col gap-1.5 overflow-y-auto">
                    {results.items.map((layout) => (
                      <LayoutOption
                        key={layout.id}
                        layout={layout}
                        isSelected={selected === layout.id}
                        isAssigned={assignedId === layout.id}
                        onSelect={() => setSelected(layout.id)}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>
                      {offset + 1}–{Math.min(offset + PAGE_SIZE, results.total)} of {results.total}
                    </span>
                    <span className="flex gap-2">
                      <Button
                        color="light"
                        size="xs"
                        disabled={offset === 0}
                        onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
                      >
                        Previous
                      </Button>
                      <Button
                        color="light"
                        size="xs"
                        disabled={offset + PAGE_SIZE >= results.total}
                        onClick={() => setOffset(offset + PAGE_SIZE)}
                      >
                        Next
                      </Button>
                    </span>
                  </div>
                </>
              )}
            </>
          )}
        </section>
      </ModalBody>
      <ModalActions
        cancel={{ onClick: cancel }}
        confirm={{
          label: assignedId ? "Change layout" : "Assign layout",
          disabled: selected === null || selected === assignedId,
          onClick: () => selected && assign(selected),
        }}
      />
    </Modal>
  );
}
