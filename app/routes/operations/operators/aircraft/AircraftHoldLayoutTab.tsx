import { Button } from "flowbite-react";
import React, { useCallback, useState } from "react";
import { useToast } from "~/app-state/useToast";
import { AssignHoldVariantModal } from "~/features/aircraft/components/AircraftDetails/AssignHoldVariantModal";
import { useAircraftDetails } from "~/features/aircraft/components/AircraftDetails/aircraftDetailsContext";
import { RemoveHoldVariantModal } from "~/features/aircraft/components/AircraftDetails/RemoveHoldVariantModal";
import { AircraftHoldPanel, type HoldPanelState } from "~/features/cargo-hold/components/HoldDiagram/AircraftHoldPanel";
import { defaultVariantOf } from "~/features/cargo-hold/model";
import { useApi } from "~/shared/api/useApi";

export default function AircraftHoldLayoutTab() {
  const { aircraft, operatorId, refresh } = useAircraftDetails();
  const { aircraftService } = useApi();
  const { success, error } = useToast();

  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [panel, setPanel] = useState<HoldPanelState>({ status: "loading" });

  const onLoaded = useCallback((state: HoldPanelState) => setPanel(state), []);

  const layout = panel.status === "ready" ? panel.layout : null;
  const canAssign = layout !== null;

  const assign = async (holdVariant: string) => {
    try {
      await aircraftService.assignHoldVariant(operatorId, aircraft.id, holdVariant);
      setIsAssignOpen(false);
      success(`${aircraft.registration} is now planned against ${holdVariant}.`);
      refresh();
    } catch (reason) {
      error(reason instanceof Error ? reason.message : "The hold variant was not assigned. Try again.");
    }
  };

  const remove = async () => {
    try {
      await aircraftService.removeHoldVariant(operatorId, aircraft.id);
      setIsRemoveOpen(false);
      success(`${aircraft.registration} falls back to the default variant for its type.`);
      refresh();
    } catch (reason) {
      error(reason instanceof Error ? reason.message : "The hold variant was not removed. Try again.");
    }
  };

  const actions = canAssign ? (
    <div className="flex items-center gap-2">
      <Button size="xs" color="light" className="cursor-pointer" onClick={() => setIsAssignOpen(true)}>
        {aircraft.holdVariant === null ? "Assign variant" : "Change variant"}
      </Button>
      {aircraft.holdVariant !== null && (
        <Button size="xs" color="light" className="cursor-pointer" onClick={() => setIsRemoveOpen(true)}>
          Remove
        </Button>
      )}
    </div>
  ) : undefined;

  return (
    <>
      <AircraftHoldPanel
        airframeType={aircraft.airframe.type}
        holdVariant={aircraft.holdVariant}
        actions={actions}
        onLoaded={onLoaded}
      />

      {isAssignOpen && layout !== null && (
        <AssignHoldVariantModal
          aircraft={aircraft}
          variants={layout.variants}
          assign={assign}
          cancel={() => setIsAssignOpen(false)}
        />
      )}

      {isRemoveOpen && (
        <RemoveHoldVariantModal
          aircraft={aircraft}
          defaultVariantId={layout === null ? null : (defaultVariantOf(layout)?.id ?? null)}
          remove={remove}
          cancel={() => setIsRemoveOpen(false)}
        />
      )}
    </>
  );
}
