"use client";

import { Button, Label, Modal, ModalBody, ModalFooter, ModalHeader, Radio } from "flowbite-react";
import React, { useState } from "react";
import { type Flight, Tracking } from "~/models";

type Props = {
  flight: Flight;
  update: (flightId: string, tracking: Tracking) => void;
  cancel: () => void;
};

type TrackingOption = {
  value: Tracking;
  label: string;
  description: string;
};

const trackingOptions: TrackingOption[] = [
  {
    value: Tracking.Disabled,
    label: "Disabled",
    description: "Flight is visible only to you and cannot be tracked by third parties.",
  },
  {
    value: Tracking.Private,
    label: "Private",
    description: "Flight is visible only to you and people you share tracking link with.",
  },
  {
    value: Tracking.Public,
    label: "Public",
    description: "Flight is visible for anyone on the internet.",
  },
];

export function UpdateTrackingModal({ flight, update, cancel }: Props) {
  const [selectedTracking, setSelectedTracking] = useState<Tracking>(flight.tracking);

  return (
    <Modal size="sm" className="text-gray-800 dark:text-white" show onClose={cancel}>
      <ModalHeader>Change flight visibility</ModalHeader>
      <ModalBody className="text-gray-900 dark:text-gray-100">
        <div className="space-y-3">
          {trackingOptions.map((option) => (
            <button
              type="button"
              key={option.value}
              className="flex items-start text-start gap-3 select-none rounded-lg p-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => setSelectedTracking(option.value)}
            >
              <Radio
                id={`tracking-${flight.id}-${option.value}`}
                name="tracking"
                value={option.value}
                checked={selectedTracking === option.value}
                onChange={() => setSelectedTracking(option.value)}
                className="mt-1.5 cursor-pointer"
              />
              <div className="flex-1">
                <Label
                  htmlFor={`tracking-${flight.id}-${option.value}`}
                  className="cursor-pointer text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  {option.label}
                </Label>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{option.description}</p>
              </div>
            </button>
          ))}
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="ms-auto flex gap-2">
          <Button color="gray" outline onClick={cancel}>
            Back
          </Button>
          <Button color="indigo" outline onClick={() => update(flight.id, selectedTracking)}>
            Save changes
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
