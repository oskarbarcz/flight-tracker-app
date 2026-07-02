import { Alert, Badge, Button, Modal, ModalBody, ModalFooter, ModalHeader, Radio, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiInformationCircle } from "react-icons/hi";
import { groupParkingPositionsByTerminal } from "~/functions/parkingPositionGroups";
import { gateLocationOptions, NoiseSensitivity, type ParkingPosition, type Terminal } from "~/models";
import { useApi } from "~/shared/api/useApi";

type Props = {
  airportId: string;
  kind: "departure" | "arrival";
  currentSelectionId?: string | null;
  select: (parkingPositionId: string) => void;
  cancel: () => void;
};

function labelOf(options: { value: string; label: string }[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

export function SelectParkingPositionModal({ airportId, kind, currentSelectionId, select, cancel }: Props) {
  const { parkingPositionService, terminalService } = useApi();
  const [parkingPositions, setParkingPositions] = useState<ParkingPosition[] | null>(null);
  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(currentSelectionId ?? null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([parkingPositionService.fetchAll(airportId), terminalService.fetchAll(airportId)]).then(([p, t]) => {
      if (cancelled) return;
      setParkingPositions(p);
      setTerminals(t);
    });
    return () => {
      cancelled = true;
    };
  }, [airportId, parkingPositionService, terminalService]);

  const groups = parkingPositions ? groupParkingPositionsByTerminal(parkingPositions, terminals) : [];

  return (
    <Modal size="md" className="text-gray-800 dark:text-white" show onClose={cancel}>
      <ModalHeader>
        {kind === "departure" ? "Select departure parking position" : "Select arrival parking position"}
      </ModalHeader>
      <ModalBody className="text-gray-900 dark:text-gray-100">
        {parkingPositions === null ? (
          <div className="flex justify-center py-6">
            <Spinner color="indigo" />
          </div>
        ) : parkingPositions.length === 0 ? (
          <Alert color="warning" icon={HiInformationCircle}>
            No parking positions are configured for this airport.
          </Alert>
        ) : (
          <div className="max-h-[28rem] space-y-4 overflow-y-auto">
            {groups.map((group) => (
              <section key={group.terminal?.id ?? "orphan"} className="space-y-2">
                <header className="flex items-baseline gap-2 px-1">
                  <h4 className="font-mono text-sm font-bold text-gray-900 dark:text-white">
                    {group.terminal?.shortName ?? "Unassigned"}
                  </h4>
                  {group.terminal && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">{group.terminal.fullName}</span>
                  )}
                </header>
                <div className="space-y-2">
                  {group.parkingPositions.map((parkingPosition) => (
                    <button
                      type="button"
                      key={parkingPosition.id}
                      className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border p-3 text-start transition-colors ${
                        selectedId === parkingPosition.id
                          ? "border-indigo-300 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-950"
                          : "border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
                      }`}
                      onClick={() => setSelectedId(parkingPosition.id)}
                    >
                      <Radio
                        id={`parking-position-${parkingPosition.id}`}
                        name="parking-position"
                        value={parkingPosition.id}
                        checked={selectedId === parkingPosition.id}
                        onChange={() => setSelectedId(parkingPosition.id)}
                        className="cursor-pointer"
                      />
                      <div className="grid flex-1 grid-cols-[auto_1fr] items-center gap-x-4 min-w-0">
                        <div>
                          <div className="font-mono text-base font-bold text-gray-900 dark:text-white">
                            {parkingPosition.name}
                          </div>
                          <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                            {labelOf(gateLocationOptions, parkingPosition.location)}
                          </div>
                        </div>
                        <div>
                          {parkingPosition.noiseSensitivity === NoiseSensitivity.Yes ? (
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge color="yellow">Noise sensitive</Badge>
                                {parkingPosition.noiseSensitivityStartTime &&
                                  parkingPosition.noiseSensitivityEndTime && (
                                    <span className="font-mono text-xs text-gray-700 dark:text-gray-300">
                                      {parkingPosition.noiseSensitivityStartTime}–
                                      {parkingPosition.noiseSensitivityEndTime} UTC
                                    </span>
                                  )}
                              </div>
                              {parkingPosition.noiseSensitivityText && (
                                <p className="text-xs text-gray-600 dark:text-gray-300">
                                  {parkingPosition.noiseSensitivityText}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 dark:text-gray-500">No noise restrictions</span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <div className="ms-auto flex gap-2">
          <Button color="gray" outline onClick={cancel}>
            Back
          </Button>
          <Button
            color="indigo"
            outline
            disabled={!selectedId || parkingPositions === null || parkingPositions.length === 0}
            onClick={() => selectedId && select(selectedId)}
          >
            Confirm
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
