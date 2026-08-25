import { LuArrowRight, LuLock, LuSnowflake, LuStar, LuTriangleAlert } from "react-icons/lu";
import { TbPlaneOff } from "react-icons/tb";
import { resolvePositionDesignator } from "~/features/cargo-hold/lib/designator";
import type {
  HoldReading,
  LegendEntry,
  PositionAppearance,
  PositionMarker,
} from "~/features/cargo-hold/lib/holdReading";
import { isRefrigeratedType } from "~/features/cargo-hold/lib/uldCode";
import type { HoldCompartment, HoldPosition, HoldVariant } from "~/features/cargo-hold/model";
import { compartmentsOf, positionsOf } from "~/features/cargo-hold/model";
import type { CargoUnitEntry, FlightCargoManifest } from "~/features/cargo-manifest/model";
import { ColdChainRisk, ContentClass, unitTotalKg } from "~/features/cargo-manifest/model";
import { toHuman } from "~/i18n/translate";

export type LoadedPosition = {
  unit: CargoUnitEntry | null;
  vacatedBy: string | null;
};

export type LoadIndex = {
  byDesignator: Map<string, LoadedPosition>;
  compartments: Map<number, HoldCompartment>;
};

type DetailRow = { label: string; value: string };

export type LoadReading = {
  key: string;
  label: string;
  appearanceOf: (position: HoldPosition, load: LoadIndex) => PositionAppearance;
  legendFor: (manifest: FlightCargoManifest) => LegendEntry[];
  distinguishes: (manifest: FlightCargoManifest) => boolean;
  nothingToShow: string;
};

const EMPTY = "border-dashed border-gray-300 bg-transparent dark:border-gray-600";
const VACATED =
  "border-gray-400 bg-[repeating-linear-gradient(135deg,transparent,transparent_3px,rgba(107,114,128,0.28)_3px,rgba(107,114,128,0.28)_6px)] dark:border-gray-500";

const CARGO = "border-gray-400 bg-gray-200 dark:border-gray-500 dark:bg-gray-600";
const BAGGAGE = "border-sky-400 bg-sky-100 dark:border-sky-500 dark:bg-sky-900";
const MAIL = "border-violet-400 bg-violet-100 dark:border-violet-500 dark:bg-violet-900";

const FILL_0 = "border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-700";
const FILL_1 = "border-gray-400 bg-gray-200 dark:border-gray-500 dark:bg-gray-600";
const FILL_2 = "border-gray-500 bg-gray-300 dark:border-gray-400 dark:bg-gray-500";
const FILL_3 = "border-gray-600 bg-gray-400 dark:border-gray-300 dark:bg-gray-400";
const OVER = "border-red-500 bg-red-100 dark:border-red-400 dark:bg-red-900";

const HAZARD_PLAIN = "border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-700";
const HAZARD_DG = "border-amber-500 bg-amber-100 dark:border-amber-400 dark:bg-amber-900";
const HAZARD_CAO = "border-red-500 bg-red-100 dark:border-red-400 dark:bg-red-900";

const COLD_NONE = "border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-700";
const COLD_LOW = "border-green-500 bg-green-100 dark:border-green-400 dark:bg-green-900";
const COLD_ELEVATED = "border-amber-500 bg-amber-100 dark:border-amber-400 dark:bg-amber-900";
const COLD_HIGH = "border-red-500 bg-red-100 dark:border-red-400 dark:bg-red-900";

export function loadIndexOf(manifest: FlightCargoManifest, variant: HoldVariant | null): LoadIndex {
  const published = new Set(variant === null ? [] : positionsOf(variant).map((position) => position.designator));
  const byDesignator = new Map<string, LoadedPosition>();

  for (const unit of manifest.units) {
    if (unit.positionDesignator === null) {
      continue;
    }
    const designator = resolvePositionDesignator(unit.positionDesignator, unit.compartment, published);
    if (designator !== null) {
      byDesignator.set(designator, { unit, vacatedBy: null });
    }
  }

  for (const unit of manifest.units) {
    for (const shipment of unit.shipments) {
      if (shipment.offloadedFrom === null) {
        continue;
      }
      const designator = resolvePositionDesignator(shipment.offloadedFrom, unit.compartment, published);
      if (designator !== null && !byDesignator.has(designator)) {
        byDesignator.set(designator, { unit: null, vacatedBy: shipment.awb });
      }
    }
  }

  return {
    byDesignator,
    compartments: new Map(variant === null ? [] : compartmentsOf(variant).map((c) => [c.number, c])),
  };
}

function markersOf(unit: CargoUnitEntry): PositionMarker[] {
  const markers: PositionMarker[] = [];
  const dangerous = unit.shipments.filter((shipment) => shipment.dangerousGoods !== null);

  if (dangerous.length > 0) {
    markers.push({ key: "dg", label: "Dangerous goods", icon: LuTriangleAlert });
  }
  if (dangerous.some((shipment) => shipment.dangerousGoods?.cargoAircraftOnly === true)) {
    markers.push({ key: "cao", label: "Cargo aircraft only", icon: TbPlaneOff });
  }
  if (unit.uldType !== null && isRefrigeratedType(unit.uldType)) {
    markers.push({ key: "reefer", label: "Refrigerated device", icon: LuSnowflake });
  }
  if (unit.priority) {
    markers.push({ key: "priority", label: "Premium cabin baggage, off first", icon: LuStar });
  }
  if (unit.sealed) {
    markers.push({ key: "sealed", label: "Transfers intact, stays aboard", icon: LuLock });
  }
  if (unit.beyondDestination !== null) {
    markers.push({ key: "beyond", label: `Built for ${unit.beyondDestination}`, icon: LuArrowRight });
  }

  return markers;
}

function detailOf(unit: CargoUnitEntry): DetailRow[] {
  const rows: DetailRow[] = [{ label: "Device", value: unit.uldCode ?? toHuman.cargoManifest.unitKind(unit.kind) }];

  if (unit.uldType !== null) {
    rows.push({ label: "Type", value: unit.uldType });
  }
  if (unit.deck !== null) {
    rows.push({ label: "Deck", value: toHuman.cargoHold.deck(unit.deck) });
  }

  rows.push(
    { label: "Contents", value: `${unit.grossKg.toLocaleString()} kg` },
    { label: "Tare", value: `${unit.tareKg.toLocaleString()} kg` },
    { label: "Volume", value: `${unit.volumeM3} m³` },
    { label: "Carries", value: toHuman.cargoManifest.contentClass(unit.contentClass) },
  );

  if (unit.contentClass === ContentClass.Baggage) {
    rows.push({ label: "Bags", value: unit.bagCount === null ? "—" : String(unit.bagCount) });
    return rows;
  }

  rows.push({ label: "Shipments", value: String(unit.shipments.length) });
  for (const shipment of unit.shipments) {
    rows.push({ label: shipment.awb, value: toHuman.cargoManifest.commodity(shipment.commodity) });
  }
  return rows;
}

function loaded(position: HoldPosition, unit: CargoUnitEntry, fill: string, detail: string): PositionAppearance {
  return {
    fill,
    description: describe(position, unit, detail),
    markers: markersOf(unit),
    detail: detailOf(unit),
  };
}

function describe(position: HoldPosition, unit: CargoUnitEntry | null, detail: string): string {
  if (unit === null) {
    return `Position ${position.designator}, ${detail}`;
  }
  return `Position ${position.designator}, ${unit.uldCode ?? "loose load"}, ${detail}`;
}

function baseState(position: HoldPosition, load: LoadIndex): PositionAppearance | null {
  const entry = load.byDesignator.get(position.designator);

  if (entry === undefined) {
    return { fill: EMPTY, description: describe(position, null, "empty") };
  }
  if (entry.unit === null) {
    return {
      fill: VACATED,
      description: describe(position, null, `vacated, air waybill ${entry.vacatedBy} offloaded`),
    };
  }
  return null;
}

function unitAt(position: HoldPosition, load: LoadIndex): CargoUnitEntry | null {
  return load.byDesignator.get(position.designator)?.unit ?? null;
}

function saturationFill(fraction: number): string {
  if (fraction > 1) {
    return OVER;
  }
  if (fraction >= 0.75) {
    return FILL_3;
  }
  if (fraction >= 0.5) {
    return FILL_2;
  }
  if (fraction >= 0.25) {
    return FILL_1;
  }
  return FILL_0;
}

const SATURATION_LEGEND: LegendEntry[] = [
  { key: "q1", fill: FILL_0, label: "Under 25%" },
  { key: "q2", fill: FILL_1, label: "25–50%" },
  { key: "q3", fill: FILL_2, label: "50–75%" },
  { key: "q4", fill: FILL_3, label: "75–100%" },
  { key: "over", fill: OVER, label: "Over 100%" },
];

export const contentClassReading: LoadReading = {
  key: "content",
  label: "Content",
  appearanceOf: (position, load) => {
    const base = baseState(position, load);
    if (base !== null) {
      return base;
    }
    const unit = unitAt(position, load) as CargoUnitEntry;
    const fill =
      unit.contentClass === ContentClass.Baggage ? BAGGAGE : unit.contentClass === ContentClass.Mail ? MAIL : CARGO;
    return loaded(position, unit, fill, toHuman.cargoManifest.contentClass(unit.contentClass));
  },
  legendFor: (manifest) => {
    const present = new Set(manifest.units.map((unit) => unit.contentClass));
    return [
      present.has(ContentClass.Cargo) ? { key: "cargo", fill: CARGO, label: "Cargo" } : null,
      present.has(ContentClass.Baggage) ? { key: "baggage", fill: BAGGAGE, label: "Baggage" } : null,
      present.has(ContentClass.Mail) ? { key: "mail", fill: MAIL, label: "Mail" } : null,
    ].filter((entry): entry is LegendEntry => entry !== null);
  },
  distinguishes: () => true,
  nothingToShow: "",
};

export const weightReading: LoadReading = {
  key: "weight",
  label: "Weight",
  appearanceOf: (position, load) => {
    const base = baseState(position, load);
    if (base !== null) {
      return base;
    }
    const unit = unitAt(position, load) as CargoUnitEntry;
    const total = unitTotalKg(unit);
    const fraction = position.maxWeightKg === 0 ? 0 : total / position.maxWeightKg;
    return loaded(
      position,
      unit,
      saturationFill(fraction),
      `${total.toLocaleString()} kg of ${position.maxWeightKg.toLocaleString()} kg, ${Math.round(fraction * 100)}%`,
    );
  },
  legendFor: () => SATURATION_LEGEND,
  distinguishes: () => true,
  nothingToShow: "",
};

export const volumeReading: LoadReading = {
  key: "volume",
  label: "Volume",
  appearanceOf: (position, load) => {
    const base = baseState(position, load);
    if (base !== null) {
      return base;
    }
    const unit = unitAt(position, load) as CargoUnitEntry;
    const compartment = unit.compartment === null ? undefined : load.compartments.get(unit.compartment);
    const share = compartment === undefined || compartment.volumeM3 === 0 ? 0 : unit.volumeM3 / compartment.volumeM3;
    return loaded(
      position,
      unit,
      saturationFill(share * (compartment?.positions.length || 1)),
      `${unit.volumeM3} m³ of contents`,
    );
  },
  legendFor: () => SATURATION_LEGEND,
  distinguishes: () => true,
  nothingToShow: "",
};

export const hazardReading: LoadReading = {
  key: "hazard",
  label: "Hazard",
  appearanceOf: (position, load) => {
    const base = baseState(position, load);
    if (base !== null) {
      return base;
    }
    const unit = unitAt(position, load) as CargoUnitEntry;
    const dangerous = unit.shipments.filter((shipment) => shipment.dangerousGoods !== null);

    if (dangerous.length === 0) {
      return loaded(position, unit, HAZARD_PLAIN, "no dangerous goods");
    }

    const restricted = dangerous.some((shipment) => shipment.dangerousGoods?.cargoAircraftOnly === true);
    const classes = dangerous.map((shipment) => `class ${shipment.dangerousGoods?.hazardClass}`).join(", ");

    return loaded(
      position,
      unit,
      restricted ? HAZARD_CAO : HAZARD_DG,
      `${classes}${restricted ? ", cargo aircraft only" : ""}`,
    );
  },
  legendFor: (manifest) => {
    const entries: LegendEntry[] = [{ key: "plain", fill: HAZARD_PLAIN, label: "No dangerous goods" }];
    if (manifest.dangerousGoodsCount > 0) {
      entries.push({ key: "dg", fill: HAZARD_DG, label: "Dangerous goods" });
    }
    if (manifest.cargoAircraftOnlyCount > 0) {
      entries.push({ key: "cao", fill: HAZARD_CAO, label: "Cargo aircraft only" });
    }
    return entries;
  },
  distinguishes: (manifest) => manifest.dangerousGoodsCount > 0,
  nothingToShow: "This flight carries no dangerous goods.",
};

const COLD_FILLS: Record<ColdChainRisk, string> = {
  [ColdChainRisk.Low]: COLD_LOW,
  [ColdChainRisk.Elevated]: COLD_ELEVATED,
  [ColdChainRisk.High]: COLD_HIGH,
};

export const coldChainReading: LoadReading = {
  key: "cold-chain",
  label: "Cold chain",
  appearanceOf: (position, load) => {
    const base = baseState(position, load);
    if (base !== null) {
      return base;
    }
    const unit = unitAt(position, load) as CargoUnitEntry;
    const controlled = unit.shipments.filter((shipment) => shipment.coldChain !== null);

    if (controlled.length === 0) {
      const reefer = unit.uldType !== null && isRefrigeratedType(unit.uldType);
      return loaded(
        position,
        unit,
        COLD_NONE,
        reefer ? "refrigerated device, no controlled load" : "no temperature control",
      );
    }

    const worst = controlled.reduce((carried, shipment) => {
      const risk = shipment.coldChain?.risk ?? ColdChainRisk.Low;
      const order = [ColdChainRisk.Low, ColdChainRisk.Elevated, ColdChainRisk.High];
      return order.indexOf(risk) > order.indexOf(carried) ? risk : carried;
    }, ColdChainRisk.Low);

    return loaded(
      position,
      unit,
      COLD_FILLS[worst],
      `${toHuman.cargoManifest.coldChainRisk(worst).toLowerCase()} cold chain risk`,
    );
  },
  legendFor: () => [
    { key: "none", fill: COLD_NONE, label: "No temperature control" },
    { key: "low", fill: COLD_LOW, label: "Low risk" },
    { key: "elevated", fill: COLD_ELEVATED, label: "Elevated risk" },
    { key: "high", fill: COLD_HIGH, label: "High risk" },
  ],
  distinguishes: (manifest) => manifest.worstColdChainRisk !== null,
  nothingToShow: "This flight carries no temperature-controlled load.",
};

export const LOAD_READINGS: LoadReading[] = [
  contentClassReading,
  weightReading,
  volumeReading,
  hazardReading,
  coldChainReading,
];

export function asHoldReading(reading: LoadReading, load: LoadIndex, manifest: FlightCargoManifest): HoldReading {
  const distinguishes = reading.distinguishes(manifest);

  return {
    key: reading.key,
    label: reading.label,
    appearanceOf: (position) => reading.appearanceOf(position, load),
    legendFor: () => reading.legendFor(manifest),
    note: distinguishes ? null : reading.nothingToShow,
  };
}

export function loadedReadings(manifest: FlightCargoManifest, variant: HoldVariant | null): HoldReading[] {
  const load = loadIndexOf(manifest, variant);
  return LOAD_READINGS.map((reading) => asHoldReading(reading, load, manifest));
}
