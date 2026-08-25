import { Badge, Select } from "flowbite-react";
import React, { useId, useMemo, useState } from "react";
import { LuChevronDown, LuChevronRight } from "react-icons/lu";
import { twMerge } from "tailwind-merge";
import { WaybillCard } from "~/features/cargo-manifest/components/WaybillCard";
import {
  applyFilters,
  coldChainRisksPresent,
  handlingCodesPresent,
  hazardClassesPresent,
  isFiltering,
  type LedgerFilters,
  NO_FILTERS,
  statusesPresent,
  transferRolesPresent,
} from "~/features/cargo-manifest/lib/ledgerFilters";
import type { IndexedShipment } from "~/features/cargo-manifest/lib/shipmentIndex";
import { ShipmentStatus } from "~/features/cargo-manifest/model";
import { toHuman } from "~/i18n/translate";

type Props = {
  entries: IndexedShipment[];
  id?: string;
};

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  const selectId = useId();

  if (options.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={selectId}
        className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400"
      >
        {label}
      </label>
      <Select id={selectId} sizing="sm" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">All</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
}

export function ShipmentLedger({ entries, id }: Props) {
  const [filters, setFilters] = useState<LedgerFilters>(NO_FILTERS);
  const [openAwb, setOpenAwb] = useState<string | null>(null);

  const matching = useMemo(() => applyFilters(entries, filters), [entries, filters]);
  const set = (key: keyof LedgerFilters) => (value: string) =>
    setFilters((current) => ({ ...current, [key]: value }) as LedgerFilters);

  return (
    <div className="flex flex-col gap-3" id={id}>
      <div className="flex flex-wrap items-end gap-3">
        <FilterSelect
          label="Handling"
          value={filters.handlingCode}
          onChange={set("handlingCode")}
          options={handlingCodesPresent(entries).map((code) => ({
            value: code,
            label: `${code} · ${toHuman.cargoManifest.specialHandling(code)}`,
          }))}
        />
        <FilterSelect
          label="Hazard class"
          value={filters.hazardClass}
          onChange={set("hazardClass")}
          options={hazardClassesPresent(entries).map((hazard) => ({
            value: hazard,
            label: `Class ${hazard} · ${toHuman.cargoManifest.hazardClass(hazard)}`,
          }))}
        />
        <FilterSelect
          label="On this flight"
          value={filters.transferRole}
          onChange={set("transferRole")}
          options={transferRolesPresent(entries).map((role) => ({
            value: role,
            label: toHuman.cargoManifest.transferRole(role),
          }))}
        />
        <FilterSelect
          label="Status"
          value={filters.status}
          onChange={set("status")}
          options={statusesPresent(entries).map((status) => ({
            value: status,
            label: toHuman.cargoManifest.shipmentStatus(status),
          }))}
        />
        <FilterSelect
          label="Cold chain"
          value={filters.coldChainRisk}
          onChange={set("coldChainRisk")}
          options={coldChainRisksPresent(entries).map((risk) => ({
            value: risk,
            label: `${toHuman.cargoManifest.coldChainRisk(risk)} risk`,
          }))}
        />
        <span className="pb-1.5 font-mono text-xs tabular-nums text-gray-500 dark:text-gray-400">
          {matching.length} of {entries.length}
        </span>
      </div>

      {matching.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-6 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-300">No shipment matches those filters.</p>
          {isFiltering(filters) && (
            <button
              type="button"
              onClick={() => setFilters(NO_FILTERS)}
              className="cursor-pointer text-sm text-indigo-600 underline dark:text-indigo-400"
            >
              Clear the filters
            </button>
          )}
        </div>
      ) : (
        <ul className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
          {matching.map((entry) => {
            const { shipment } = entry;
            const isOpen = openAwb === shipment.awb;

            return (
              <li key={shipment.awb} className="border-b border-gray-200 last:border-b-0 dark:border-gray-700">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenAwb(isOpen ? null : shipment.awb)}
                  className={twMerge(
                    "flex w-full cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 text-left transition-colors hover:bg-gray-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-500 dark:hover:bg-gray-800",
                    isOpen && "bg-gray-50 dark:bg-gray-800",
                  )}
                >
                  {isOpen ? (
                    <LuChevronDown aria-hidden={true} className="size-4 shrink-0 text-gray-400" />
                  ) : (
                    <LuChevronRight aria-hidden={true} className="size-4 shrink-0 text-gray-400" />
                  )}
                  <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">{shipment.awb}</span>
                  <span className="min-w-0 flex-1 truncate text-sm text-gray-700 dark:text-gray-200">
                    {shipment.description}
                  </span>
                  <span className="flex flex-wrap items-center gap-1.5">
                    {shipment.dangerousGoods !== null && (
                      <Badge color="warning">Class {shipment.dangerousGoods.hazardClass}</Badge>
                    )}
                    {shipment.dangerousGoods?.cargoAircraftOnly === true && <Badge color="failure">CAO</Badge>}
                    {shipment.coldChain !== null && (
                      <Badge color={shipment.coldChain.risk === "low" ? "success" : "warning"}>
                        {toHuman.cargoManifest.coldChainRisk(shipment.coldChain.risk)}
                      </Badge>
                    )}
                    {shipment.connectionAtRisk && <Badge color="warning">Connection at risk</Badge>}
                    {shipment.status === ShipmentStatus.Offloaded && <Badge color="gray">Offloaded</Badge>}
                  </span>
                  <span className="w-24 shrink-0 text-right font-mono text-sm tabular-nums text-gray-700 dark:text-gray-200">
                    {shipment.grossKg.toLocaleString()} kg
                  </span>
                </button>

                {isOpen && <WaybillCard entry={entry} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
