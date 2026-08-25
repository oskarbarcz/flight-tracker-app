import { Button } from "flowbite-react";
import React, { useCallback, useState } from "react";
import { useToast } from "~/app-state/useToast";
import { AssignHoldVariantModal } from "~/features/aircraft/components/AircraftDetails/AssignHoldVariantModal";
import { useAircraftDetails } from "~/features/aircraft/components/AircraftDetails/aircraftDetailsContext";
import { AircraftHoldPanel, type HoldPanelState } from "~/features/cargo-hold/components/HoldDiagram/AircraftHoldPanel";
import { useApi } from "~/shared/api/useApi";

export default function AircraftHoldLayoutTab() {
  const { aircraft, operatorId, refresh } = useAircraftDetails();
  const { aircraftService } = useApi();
  const { success, error } = useToast();

  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [panel, setPanel] = useState<HoldPanelState>({ status: "loading" });

  const onLoaded = useCallback((state: HoldPanelState) => setPanel(state), []);

  const layout = panel.status === "ready" ? panel.layout : null;

  const assign = async (holdVariant: string) => {
    try {
      await aircraftService.assignHoldVariant(operatorId, aircraft.id, holdVariant);
      setIsAssignOpen(false);
      success(`${aircraft.registration} is now planned against ${holdVariant}.`);
      refresh();
    } catch (reason) {
      error(reason instanceof Error ? reason.message : "The hold layout was not assigned. Try again.");
    }
  };

  const actions =
    layout === null ? undefined : (
      <Button size="xs" color="alternative" className="cursor-pointer" onClick={() => setIsAssignOpen(true)}>
        Change layout
      </Button>
    );

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
    </>
  );
}
