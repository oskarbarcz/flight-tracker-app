import { Modal, ModalBody, ModalHeader, Radio } from "flowbite-react";
import React, { useState } from "react";
import { type Flight, FlightServiceType } from "~/features/flight";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type Props = {
  flight: Flight;
  update: (flightId: string, serviceType: FlightServiceType) => void;
  cancel: () => void;
};

type ServiceTypeOption = {
  value: FlightServiceType;
  label: string;
  description: string;
};

const serviceTypeOptions: ServiceTypeOption[] = [
  {
    value: FlightServiceType.Passenger,
    label: "Passenger",
    description: "Flight carries passengers. Turnaround is described as boarding and offboarding.",
  },
  {
    value: FlightServiceType.Cargo,
    label: "Cargo",
    description: "Flight carries freight only. Turnaround is described as loading and unloading.",
  },
];

export function UpdateServiceTypeModal({ flight, update, cancel }: Props) {
  const [selectedServiceType, setSelectedServiceType] = useState<FlightServiceType>(flight.serviceType);

  return (
    <Modal size="sm" className="text-gray-800 dark:text-white" show onClose={cancel}>
      <ModalHeader>
        <ModalTitle context="Service type" action="Change" />
      </ModalHeader>
      <ModalBody className="text-gray-900 dark:text-gray-100">
        <div className="space-y-3">
          {serviceTypeOptions.map((option) => {
            const radioId = `service-type-${flight.id}-${option.value}`;

            return (
              <label
                key={option.value}
                htmlFor={radioId}
                className="flex items-start text-start gap-3 select-none rounded-lg p-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              >
                <Radio
                  id={radioId}
                  name="serviceType"
                  value={option.value}
                  checked={selectedServiceType === option.value}
                  onChange={() => setSelectedServiceType(option.value)}
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
        confirm={{ label: "Save changes", onClick: () => update(flight.id, selectedServiceType) }}
      />
    </Modal>
  );
}
