import React, { useState } from "react";
import { useToast } from "~/app-state/useToast";
import { AircraftBaseAirportCard } from "~/features/aircraft/components/AircraftDetails/AircraftBaseAirportCard";
import { AircraftCurrentStatusCard } from "~/features/aircraft/components/AircraftDetails/AircraftCurrentStatusCard";
import { AircraftFlightHistoryCard } from "~/features/aircraft/components/AircraftDetails/AircraftFlightHistoryCard";
import { AircraftTechnicalStatusCard } from "~/features/aircraft/components/AircraftDetails/AircraftTechnicalStatusCard";
import { useAircraftDetails } from "~/features/aircraft/components/AircraftDetails/aircraftDetailsContext";
import { RepositionAircraftModal } from "~/features/aircraft/components/AircraftDetails/RepositionAircraftModal";
import { useApi } from "~/shared/api/useApi";

export default function AircraftFlightsTab() {
  const { aircraft, history, repositions, operatorId, refresh } = useAircraftDetails();
  const { aircraftService } = useApi();
  const { success, error } = useToast();
  const [isRepositionOpen, setIsRepositionOpen] = useState(false);

  async function handleReposition(destinationAirportId: string) {
    try {
      await aircraftService.createReposition(operatorId, aircraft.id, { destinationAirportId });
      success("Aircraft reposition scheduled.");
      setIsRepositionOpen(false);
      refresh();
    } catch {
      error("Failed to reposition aircraft.");
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AircraftFlightHistoryCard history={history} repositions={repositions} />
        </div>
        <div className="flex flex-col gap-3">
          <AircraftBaseAirportCard baseAirport={aircraft.baseAirport} />
          <AircraftCurrentStatusCard
            aircraft={aircraft}
            history={history}
            onReposition={() => setIsRepositionOpen(true)}
          />
          <AircraftTechnicalStatusCard etopsThresholdMinutes={aircraft.etopsThresholdMinutes} />
        </div>
      </div>

      {isRepositionOpen && (
        <RepositionAircraftModal
          aircraft={aircraft}
          reposition={handleReposition}
          cancel={() => setIsRepositionOpen(false)}
        />
      )}
    </>
  );
}
