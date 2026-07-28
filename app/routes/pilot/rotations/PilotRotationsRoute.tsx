import React from "react";
import { FaArrowsSpin } from "react-icons/fa6";
import { PilotRotationGroup } from "~/features/rotation/components/PilotRotationGroup";
import { PilotRotationSummaryCard } from "~/features/rotation/components/PilotRotationSummaryCard";
import { PilotRotationsLoader } from "~/features/rotation/components/PilotRotationsLoader";
import { useAssignedRotations } from "~/features/rotation/hooks/useAssignedRotations";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { TilePlaceholder } from "~/shared/ui/Layout/TilePlaceholder";
import { SectionHeader } from "~/shared/ui/Section/SectionHeader";

export default function PilotRotationsRoute() {
  const { active, completed, loading } = useAssignedRotations();
  usePageTitle("Rotations");

  return (
    <>
      <SectionHeader title="Rotations" />
      {loading ? (
        <PilotRotationsLoader />
      ) : active.length === 0 && completed.length === 0 ? (
        <TilePlaceholder
          icon={FaArrowsSpin}
          hint="Rotations assigned to you will appear here once operations releases one."
        />
      ) : (
        <div className="flex flex-col gap-6">
          {active.length > 0 && (
            <PilotRotationGroup title="Active">
              {active.map((rotation) => (
                <PilotRotationSummaryCard key={rotation.id} rotation={rotation} />
              ))}
            </PilotRotationGroup>
          )}
          {completed.length > 0 && (
            <PilotRotationGroup title="Completed">
              {completed.map((rotation) => (
                <PilotRotationSummaryCard key={rotation.id} rotation={rotation} />
              ))}
            </PilotRotationGroup>
          )}
        </div>
      )}
    </>
  );
}
