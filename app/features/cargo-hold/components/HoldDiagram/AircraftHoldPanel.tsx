import { Badge } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { HoldDiagram } from "~/features/cargo-hold/components/HoldDiagram/HoldDiagram";
import { HoldUnavailableState } from "~/features/cargo-hold/components/HoldDiagram/HoldUnavailableState";
import { type AircraftHoldLayout, defaultVariantOf, type HoldVariant, variantById } from "~/features/cargo-hold/model";
import { useApi } from "~/shared/api/useApi";
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
      <Container header={<CardHeader title="Cargo hold" actions={actions} />} padding="spacious">
        <HoldUnavailableState gap={state.status === "uncurated" ? "uncurated" : "failed"} type={airframeType} />
      </Container>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Container header={<CardHeader title="Cargo hold" actions={actions} />} padding="spacious">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">{state.variant.id}</span>
          {state.isDefault ? <Badge color="gray">Type default</Badge> : <Badge color="indigo">Assigned</Badge>}
          <Link
            to={`/cargo-holds/${state.layout.type}`}
            viewTransition
            className="text-xs text-indigo-600 underline dark:text-indigo-400"
          >
            View {state.layout.type} in the catalogue
          </Link>
        </div>
        <HoldDiagram key={state.variant.id} variant={state.variant} variants={state.layout.variants} />
      </Container>
    </div>
  );
}
