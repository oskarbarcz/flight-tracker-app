import { Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { HoldDiagram } from "~/features/cargo-hold/components/HoldDiagram/HoldDiagram";
import { HoldUnavailableState } from "~/features/cargo-hold/components/HoldDiagram/HoldUnavailableState";
import {
  type AircraftHoldLayout,
  compartmentsOf,
  defaultVariantOf,
  type HoldVariant,
  positionCountOf,
  variantById,
  volumeOf,
} from "~/features/cargo-hold/model";
import { useApi } from "~/shared/api/useApi";
import { DataField } from "~/shared/ui/Display/DataField";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";
import { LoadingData } from "~/shared/ui/Table/LoadingStates/LoadingData";

export type HoldPanelState =
  | { status: "loading" }
  | { status: "uncurated" }
  | { status: "failed" }
  | { status: "ready"; layout: AircraftHoldLayout; variant: HoldVariant; isDefault: boolean };

type Props = {
  airframeType: string;
  holdVariant: string | null;
  actions?: React.ReactNode;
  onLoaded?: (state: HoldPanelState) => void;
};

const NOT_FOUND = 404;

function statusCodeOf(reason: unknown): number | undefined {
  return (reason as { statusCode?: number }).statusCode;
}

export function useAircraftHold(airframeType: string, holdVariant: string | null): HoldPanelState {
  const { cargoHoldService } = useApi();
  const [state, setState] = useState<HoldPanelState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    cargoHoldService
      .fetchByType(airframeType)
      .then((layout) => {
        if (cancelled) {
          return;
        }
        const assigned = holdVariant === null ? null : variantById(layout, holdVariant);
        const variant = assigned ?? defaultVariantOf(layout);
        setState(
          variant === null
            ? { status: "uncurated" }
            : { status: "ready", layout, variant, isDefault: assigned === null },
        );
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setState({ status: statusCodeOf(reason) === NOT_FOUND ? "uncurated" : "failed" });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [cargoHoldService, airframeType, holdVariant]);

  return state;
}

export function AircraftHoldPanel({ airframeType, holdVariant, actions, onLoaded }: Props) {
  const state = useAircraftHold(airframeType, holdVariant);

  useEffect(() => {
    onLoaded?.(state);
  }, [state, onLoaded]);

  if (state.status === "loading") {
    return <LoadingData />;
  }

  if (state.status !== "ready") {
    return (
      <Container header={<CardHeader title="Cargo hold" />} padding="spacious">
        <HoldUnavailableState gap={state.status === "uncurated" ? "uncurated" : "failed"} type={airframeType} />
      </Container>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Container header={<CardHeader title="Cargo hold" />} padding="spacious">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-5">
            <DataField label="Layout" value={state.variant.id} mono />
            <DataField label="Aircraft type" value={state.layout.type} mono />
            <DataField label="Compartments" value={String(compartmentsOf(state.variant).length)} mono />
            <DataField label="Positions" value={String(positionCountOf(state.variant))} mono />
            <DataField label="Cargo space" value={`${Math.round(volumeOf(state.variant) * 10) / 10} m³`} mono />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link to={`/cargo-holds/${state.layout.type}`} viewTransition>
              <Button size="xs" color="indigo">
                Open in catalogue
              </Button>
            </Link>
            {actions}
          </div>
        </div>
        <HoldDiagram
          key={state.variant.id}
          variant={state.variant}
          variants={state.layout.variants}
          detail="compartments"
        />
      </Container>
    </div>
  );
}
