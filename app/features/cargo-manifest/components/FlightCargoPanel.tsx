import React, { useMemo } from "react";
import { HoldDiagram } from "~/features/cargo-hold/components/HoldDiagram/HoldDiagram";
import { CargoUnavailableState } from "~/features/cargo-manifest/components/CargoUnavailableState";
import { ColdChainTimeline } from "~/features/cargo-manifest/components/ColdChainTimeline";
import { CompartmentLoadList } from "~/features/cargo-manifest/components/CompartmentLoadList";
import { LoadAdvisories } from "~/features/cargo-manifest/components/LoadAdvisories";
import { ManifestFigures } from "~/features/cargo-manifest/components/ManifestFigures";
import { OffloadStory } from "~/features/cargo-manifest/components/OffloadStory";
import { PositionlessLoad } from "~/features/cargo-manifest/components/PositionlessLoad";
import { ReconciliationStrip } from "~/features/cargo-manifest/components/ReconciliationStrip";
import { ShipmentLedger } from "~/features/cargo-manifest/components/ShipmentLedger";
import { UnloadSequence } from "~/features/cargo-manifest/components/UnloadSequence";
import { useFlightCargo } from "~/features/cargo-manifest/hooks/useFlightCargo";
import { loadAdvisories } from "~/features/cargo-manifest/lib/advisories";
import { coldChainEntries } from "~/features/cargo-manifest/lib/coldChain";
import { loadedReadings } from "~/features/cargo-manifest/lib/loadReadings";
import { reconcile } from "~/features/cargo-manifest/lib/reconciliation";
import { shipmentIndex } from "~/features/cargo-manifest/lib/shipmentIndex";
import { unloadSequence } from "~/features/cargo-manifest/lib/unloadSequence";
import type { Flight } from "~/features/flight";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";
import { LoadingData } from "~/shared/ui/Table/LoadingStates/LoadingData";

type Props = {
  flight: Flight;
};

export function FlightCargoPanel({ flight }: Props) {
  const cargo = useFlightCargo(flight);

  const derived = useMemo(() => {
    if (cargo.status !== "ready") {
      return null;
    }
    const { manifest, variant, holdDataNote } = cargo;
    const entries = shipmentIndex(manifest);

    return {
      manifest,
      variant,
      holdDataNote,
      looseUnits: manifest.units.filter((unit) => unit.positionDesignator === null),
      entries,
      reconciliation: reconcile(manifest),
      advisories: loadAdvisories({
        manifest,
        variant,
        serviceType: flight.serviceType,
        holdDataNote: holdDataNote ?? "",
      }),
      coldChain: coldChainEntries(entries),
      sequence: unloadSequence(manifest, variant),
      readings: loadedReadings(manifest, variant),
    };
  }, [cargo, flight.serviceType]);

  if (cargo.status === "loading") {
    return <LoadingData />;
  }

  if (cargo.status === "unavailable") {
    return <CargoUnavailableState gap={cargo.gap} />;
  }

  if (derived === null) {
    return <LoadingData />;
  }

  const {
    manifest,
    variant,
    holdDataNote,
    looseUnits,
    entries,
    reconciliation,
    advisories,
    coldChain,
    sequence,
    readings,
  } = derived;

  return (
    <div className="flex flex-col gap-4">
      <Container header={<CardHeader title="Cargo aboard" />} padding="spacious">
        <ManifestFigures manifest={manifest} />
      </Container>

      <Container header={<CardHeader title="Hold" />} padding="spacious">
        {variant === null ? (
          <PositionlessLoad units={manifest.units} note={holdDataNote} />
        ) : (
          <div className="flex flex-col gap-4">
            <HoldDiagram variant={variant} readings={readings} detail="none" />
            {looseUnits.length > 0 && (
              <section className="flex flex-col gap-2">
                <FieldLabel>Loose load, held against its compartment</FieldLabel>
                <PositionlessLoad units={looseUnits} note={null} />
              </section>
            )}
          </div>
        )}
      </Container>

      {variant !== null && (
        <Container header={<CardHeader title="Compartments" />} padding="spacious">
          <CompartmentLoadList manifest={manifest} variant={variant} />
        </Container>
      )}

      <Container header={<CardHeader title="Reconciliation" />} padding="spacious">
        <ReconciliationStrip reconciliation={reconciliation} />
      </Container>

      <Container header={<CardHeader title="Shipments" />} padding="spacious">
        <ShipmentLedger entries={entries} />
      </Container>

      <Container header={<CardHeader title="Load advisories" />} padding="spacious">
        <LoadAdvisories checks={advisories} />
      </Container>

      {coldChain.length > 0 && (
        <Container header={<CardHeader title="Cold chain" />} padding="spacious">
          <ColdChainTimeline entries={coldChain} />
        </Container>
      )}

      <Container header={<CardHeader title="Unload sequence" />} padding="spacious">
        <UnloadSequence sequence={sequence} holdDataNote={holdDataNote} />
      </Container>

      <Container header={<CardHeader title="Left behind" />} padding="spacious">
        <OffloadStory flightId={flight.id} />
      </Container>
    </div>
  );
}
