import { Button, Label, Modal, ModalBody, ModalFooter, ModalHeader, Radio } from "flowbite-react";
import React, { useState } from "react";
import { type Flight, FlightServiceType } from "~/features/flight";

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
      <ModalHeader>Change service type</ModalHeader>
      <ModalBody className="text-gray-900 dark:text-gray-100">
        <div className="space-y-3">
          {serviceTypeOptions.map((option) => (
            <button
              type="button"
              key={option.value}
              className="flex items-start text-start gap-3 select-none rounded-lg p-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => setSelectedServiceType(option.value)}
            >
              <Radio
                id={`service-type-${flight.id}-${option.value}`}
                name="serviceType"
                value={option.value}
                checked={selectedServiceType === option.value}
                onChange={() => setSelectedServiceType(option.value)}
                className="mt-1.5 cursor-pointer"
              />
              <div className="flex-1">
                <Label
                  htmlFor={`service-type-${flight.id}-${option.value}`}
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
          <Button color="indigo" outline onClick={() => update(flight.id, selectedServiceType)}>
            Save changes
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
