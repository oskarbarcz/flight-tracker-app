import { Button, Spinner } from "flowbite-react";
import React, { useState } from "react";
import { useToast } from "~/app-state/useToast";
import type { CabinLayoutRefreshResult } from "~/features/cabin-layout/model";
import { useApi } from "~/shared/api/useApi";

type Props = {
  layoutId: string;
  onChanged: () => void;
};

function outcome(result: CabinLayoutRefreshResult): string {
  return result.changed
    ? `The cabin changed. Revision ${result.revision} is now in force.`
    : `The cabin is unchanged. Revision ${result.revision} remains in force.`;
}

export function RefreshCabinButton({ layoutId, onChanged }: Props) {
  const { cabinLayoutService } = useApi();
  const { success, error } = useToast();
  const [isRunning, setIsRunning] = useState(false);

  async function refresh() {
    setIsRunning(true);

    try {
      const result = await cabinLayoutService.refresh(layoutId);
      success(outcome(result));
      if (result.changed) {
        onChanged();
      }
    } catch {
      error("LOPA could not be reached. The layout still holds the revision shown.");
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <Button size="xs" color="alternative" className="shrink-0" disabled={isRunning} onClick={refresh}>
      {isRunning && <Spinner size="sm" className="mr-2" />}
      {isRunning ? "Re-reading…" : "Re-read from LOPA"}
    </Button>
  );
}
