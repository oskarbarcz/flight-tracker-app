"use client";

import { Alert, Button, Modal, ModalBody, ModalFooter, ModalHeader, Radio, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiInformationCircle } from "react-icons/hi";
import type { Runway } from "~/models";
import { useApi } from "~/state/api/context/useApi";

type Props = {
  airportId: string;
  kind: "departure" | "arrival";
  currentSelectionId?: string | null;
  select: (runwayId: string) => void;
  cancel: () => void;
};

export function SelectRunwayModal({ airportId, kind, currentSelectionId, select, cancel }: Props) {
  const { runwayService } = useApi();
  const [runways, setRunways] = useState<Runway[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(currentSelectionId ?? null);

  useEffect(() => {
    let cancelled = false;
    runwayService.fetchAll(airportId).then((rs) => {
      if (!cancelled) setRunways(rs);
    });
    return () => {
      cancelled = true;
    };
  }, [airportId, runwayService]);

  return (
    <Modal size="md" className="text-gray-800 dark:text-white" show onClose={cancel}>
      <ModalHeader>{kind === "departure" ? "Select departure runway" : "Select arrival runway"}</ModalHeader>
      <ModalBody className="text-gray-900 dark:text-gray-100">
        {runways === null ? (
          <div className="flex justify-center py-6">
            <Spinner color="indigo" />
          </div>
        ) : runways.length === 0 ? (
          <Alert color="warning" icon={HiInformationCircle}>
            No runways are configured for this airport.
          </Alert>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {runways.map((runway) => (
              <button
                type="button"
                key={runway.id}
                className={`flex w-full items-center gap-3 rounded-lg border p-3 text-start cursor-pointer transition-colors ${
                  selectedId === runway.id
                    ? "border-indigo-300 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-950"
                    : "border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
                }`}
                onClick={() => setSelectedId(runway.id)}
              >
                <Radio
                  id={`runway-${runway.id}`}
                  name="runway"
                  value={runway.id}
                  checked={selectedId === runway.id}
                  onChange={() => setSelectedId(runway.id)}
                  className="cursor-pointer"
                />
                <div className="flex-1">
                  <div className="font-mono text-base font-bold text-gray-900 dark:text-white">{runway.designator}</div>
                  <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    {runway.length.toLocaleString()} m · {runway.surfaceType}
                  </div>
                </div>
              </button>
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
            disabled={!selectedId || runways === null || runways.length === 0}
            onClick={() => selectedId && select(selectedId)}
          >
            Confirm
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
