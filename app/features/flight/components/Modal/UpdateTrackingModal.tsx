import { Modal, ModalBody, ModalHeader, Radio } from "flowbite-react";
import React, { useState } from "react";
import { type Flight, Tracking } from "~/features/flight";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

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
      <ModalHeader>
        <ModalTitle context="Flight" action="Change visibility" />
      </ModalHeader>
      <ModalBody className="text-gray-900 dark:text-gray-100">
        <div className="space-y-3">
          {trackingOptions.map((option) => {
            const radioId = `tracking-${flight.id}-${option.value}`;

            return (
              <label
                key={option.value}
                htmlFor={radioId}
                className="flex items-start text-start gap-3 select-none rounded-lg p-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              >
                <Radio
                  id={radioId}
                  name="tracking"
                  value={option.value}
                  checked={selectedTracking === option.value}
                  onChange={() => setSelectedTracking(option.value)}
                  aria-labelledby={`${radioId}-label`}
                  aria-describedby={`${radioId}-description`}
                  className="mt-1.5 cursor-pointer"
                />
                <span className="flex-1">
                  <span
                    id={`${radioId}-label`}
                    className="cursor-pointer text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    {option.label}
                  </span>
                  <span id={`${radioId}-description`} className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                    {option.description}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </ModalBody>
      <ModalActions
        cancel={{ onClick: cancel }}
        confirm={{ label: "Save changes", onClick: () => update(flight.id, selectedTracking) }}
      />
    </Modal>
  );
}
