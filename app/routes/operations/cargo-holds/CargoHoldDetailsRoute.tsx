import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { VariantSwitcher } from "~/features/cargo-hold/components/Catalogue/VariantSwitcher";
import { HoldDiagram } from "~/features/cargo-hold/components/HoldDiagram/HoldDiagram";
import { HoldUnavailableState } from "~/features/cargo-hold/components/HoldDiagram/HoldUnavailableState";
import { type AircraftHoldLayout, defaultVariantOf, variantById } from "~/features/cargo-hold/model";
import { useApi } from "~/shared/api/useApi";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";
import { Breadcrumbs } from "~/shared/ui/Section/Breadcrumbs";
import { LoadingData } from "~/shared/ui/Table/LoadingStates/LoadingData";

type LayoutState =
  | { status: "loading" }
  | { status: "uncurated" }
  | { status: "failed" }
  | { status: "ready"; layout: AircraftHoldLayout };

const NOT_FOUND = 404;

function statusCodeOf(reason: unknown): number | undefined {
  return (reason as { statusCode?: number }).statusCode;
}

export default function CargoHoldDetailsRoute() {
  const { type = "" } = useParams();
  usePageTitle(`Cargo hold ${type}`);

  const { cargoHoldService } = useApi();
  const [state, setState] = useState<LayoutState>({ status: "loading" });
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    setSelected(null);

    cargoHoldService
      .fetchByType(type)
      .then((layout) => {
        if (!cancelled) {
          setState({ status: "ready", layout });
          setSelected(defaultVariantOf(layout)?.id ?? null);
        }
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setState({ status: statusCodeOf(reason) === NOT_FOUND ? "uncurated" : "failed" });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [cargoHoldService, type]);

  const variant = state.status === "ready" && selected !== null ? variantById(state.layout, selected) : null;

  return (
    <div className="pb-8">
      <div className="mb-5 mt-2 flex items-center justify-between gap-4">
        <Breadcrumbs
          items={[
            { label: "Cargo holds", to: "/cargo-holds" },
            { label: type, mono: true },
          ]}
        />
      </div>

      {state.status === "loading" && <LoadingData />}

      {(state.status === "uncurated" || state.status === "failed") && (
        <HoldUnavailableState gap={state.status === "uncurated" ? "uncurated" : "failed"} type={type} />
      )}

      {state.status === "ready" && variant !== null && (
        <div className="flex flex-col gap-4">
          <Container header={<CardHeader title={`${state.layout.type} hold configuration`} />} padding="spacious">
            <VariantSwitcher variants={state.layout.variants} selected={variant.id} onSelect={setSelected} />
            <HoldDiagram key={variant.id} variant={variant} variants={state.layout.variants} />
          </Container>
        </div>
      )}
    </div>
  );
}
