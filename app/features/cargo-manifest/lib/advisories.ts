import { resolvePositionDesignator } from "~/features/cargo-hold/lib/designator";
import { compartmentsOf, type HoldCompartment, type HoldVariant, positionsOf } from "~/features/cargo-hold/model";
import type { FlightCargoManifest } from "~/features/cargo-manifest/model";
import { unitTotalKg } from "~/features/cargo-manifest/model";
import { FlightServiceType } from "~/features/flight";

export enum AdvisoryOutcome {
  Raised = "raised",
  Clear = "clear",
  NotApplicable = "not_applicable",
}

export type AdvisoryFinding = {
  headline: string;
  basis: string[];
};

export type AdvisoryCheck = {
  key: string;
  label: string;
  outcome: AdvisoryOutcome;
  reason: string | null;
  findings: AdvisoryFinding[];
};

export type AdvisoryInput = {
  manifest: FlightCargoManifest;
  variant: HoldVariant | null;
  serviceType: FlightServiceType;
  holdDataNote: string;
};

const LIVE_ANIMAL_CODE = "AVI";

function kg(value: number): string {
  return `${value.toLocaleString()} kg`;
}

function compartmentsByNumber(variant: HoldVariant | null): Map<number, HoldCompartment> {
  if (variant === null) {
    return new Map();
  }
  return new Map(compartmentsOf(variant).map((compartment) => [compartment.number, compartment]));
}

function resolve(key: string, label: string, findings: AdvisoryFinding[]): AdvisoryCheck {
  return {
    key,
    label,
    outcome: findings.length > 0 ? AdvisoryOutcome.Raised : AdvisoryOutcome.Clear,
    reason: null,
    findings,
  };
}

function notApplicable(key: string, label: string, reason: string): AdvisoryCheck {
  return { key, label, outcome: AdvisoryOutcome.NotApplicable, reason, findings: [] };
}

function dryIceVentilation({ manifest, variant, holdDataNote }: AdvisoryInput): AdvisoryCheck {
  const key = "dry-ice-ventilation";
  const label = "Dry ice in a ventilated compartment";

  if (variant === null) {
    return notApplicable(key, label, holdDataNote);
  }

  const compartments = compartmentsByNumber(variant);
  const findings = manifest.compartmentLoad
    .filter((entry) => entry.dryIceKg > 0 && compartments.get(entry.compartment)?.ventilated === false)
    .map((entry) => ({
      headline: `Compartment ${entry.compartment} carries ${kg(entry.dryIceKg)} of dry ice and is not ventilated`,
      basis: [`Dry ice ${kg(entry.dryIceKg)}`, "Compartment ventilated: no"],
    }));

  return resolve(key, label, findings);
}

function liveAnimalConditions({ manifest, variant, holdDataNote }: AdvisoryInput): AdvisoryCheck {
  const key = "live-animal-conditions";
  const label = "Live animals in a heated and ventilated compartment";

  if (variant === null) {
    return notApplicable(key, label, holdDataNote);
  }

  const compartments = compartmentsByNumber(variant);
  const findings: AdvisoryFinding[] = [];

  for (const unit of manifest.units) {
    for (const shipment of unit.shipments) {
      if (!shipment.shc.includes(LIVE_ANIMAL_CODE) || unit.compartment === null) {
        continue;
      }
      const compartment = compartments.get(unit.compartment);
      if (compartment === undefined || (compartment.heated && compartment.ventilated)) {
        continue;
      }
      const lacking = [compartment.heated ? null : "not heated", compartment.ventilated ? null : "not ventilated"]
        .filter((entry) => entry !== null)
        .join(" and ");
      findings.push({
        headline: `${shipment.description} sits in compartment ${unit.compartment}, which is ${lacking}`,
        basis: [`AWB ${shipment.awb}`, `Handling codes ${shipment.shc.join(", ")}`, `Compartment ${lacking}`],
      });
    }
  }

  return resolve(key, label, findings);
}

function cargoAircraftOnly({ manifest, serviceType }: AdvisoryInput): AdvisoryCheck {
  const key = "cargo-aircraft-only";
  const label = "Cargo-aircraft-only load kept off passenger flights";

  if (serviceType !== FlightServiceType.Passenger) {
    return notApplicable(key, label, "This flight carries no passengers, so the restriction does not apply.");
  }

  const findings = manifest.units.flatMap((unit) =>
    unit.shipments
      .filter((shipment) => shipment.dangerousGoods?.cargoAircraftOnly === true)
      .map((shipment) => ({
        headline: `${shipment.description} is restricted to cargo aircraft and this flight carries passengers`,
        basis: [
          `AWB ${shipment.awb}`,
          `UN${shipment.dangerousGoods?.unNumber} class ${shipment.dangerousGoods?.hazardClass}`,
          unit.positionDesignator === null ? "Loose load" : `Position ${unit.positionDesignator}`,
        ],
      })),
  );

  return resolve(key, label, findings);
}

function positionWeight({ manifest, variant, holdDataNote }: AdvisoryInput): AdvisoryCheck {
  const key = "position-weight";
  const label = "Unit weight within its position limit";

  if (variant === null) {
    return notApplicable(key, label, holdDataNote);
  }

  const positions = positionsOf(variant);
  const published = new Set(positions.map((position) => position.designator));
  const limits = new Map(positions.map((position) => [position.designator, position.maxWeightKg]));

  const findings = manifest.units.flatMap((unit) => {
    if (unit.positionDesignator === null) {
      return [];
    }
    const designator = resolvePositionDesignator(unit.positionDesignator, unit.compartment, published);
    const limit = designator === null ? undefined : limits.get(designator);
    const total = unitTotalKg(unit);
    if (limit === undefined || total <= limit) {
      return [];
    }
    return [
      {
        headline: `${unit.uldCode ?? "Unit"} at ${designator} carries ${kg(total)} against a ${kg(limit)} limit`,
        basis: [`Contents ${kg(unit.grossKg)}`, `Tare ${kg(unit.tareKg)}`, `Position limit ${kg(limit)}`],
      },
    ];
  });

  return resolve(key, label, findings);
}

function compartmentLimits({ manifest, variant, holdDataNote }: AdvisoryInput): AdvisoryCheck {
  const key = "compartment-limits";
  const label = "Compartment load within its weight and volume limits";

  if (variant === null) {
    return notApplicable(key, label, holdDataNote);
  }

  const compartments = compartmentsByNumber(variant);
  const findings: AdvisoryFinding[] = [];

  for (const entry of manifest.compartmentLoad) {
    const compartment = compartments.get(entry.compartment);
    if (compartment === undefined) {
      continue;
    }

    if (entry.weightKg > compartment.maxWeightKg) {
      findings.push({
        headline: `Compartment ${entry.compartment} carries ${kg(entry.weightKg)} against a ${kg(compartment.maxWeightKg)} limit`,
        basis: [`Load ${kg(entry.weightKg)}`, `Compartment limit ${kg(compartment.maxWeightKg)}`],
      });
    }

    const volume = manifest.units
      .filter((unit) => unit.compartment === entry.compartment)
      .reduce((sum, unit) => sum + unit.volumeM3, 0);

    if (volume > compartment.volumeM3) {
      findings.push({
        headline: `Compartment ${entry.compartment} holds ${volume.toFixed(1)} m³ against ${compartment.volumeM3} m³ usable`,
        basis: [`Contents ${volume.toFixed(1)} m³`, `Usable volume ${compartment.volumeM3} m³`],
      });
    }
  }

  return resolve(key, label, findings);
}

const CHECKS = [dryIceVentilation, liveAnimalConditions, cargoAircraftOnly, positionWeight, compartmentLimits];

export function loadAdvisories(input: AdvisoryInput): AdvisoryCheck[] {
  return CHECKS.map((check) => check(input));
}
