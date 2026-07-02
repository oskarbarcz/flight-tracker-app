import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { repositionSchema } from "~/features/aircraft/schema";
import { airportSelectOptions } from "~/features/airport/components/Airport/airportSelectOptions";
import type { CreateRepositionRequest } from "~/features/operator/request";
import type { Aircraft, Airport } from "~/models";
import { useApi } from "~/shared/api/useApi";
import { AdvancedSelect } from "~/shared/ui/Form/AdvancedSelect/AdvancedSelect";
import { Form } from "~/shared/ui/Form/Form";

type Props = {
  aircraft: Aircraft;
  reposition: (destinationAirportId: string) => void;
  cancel: () => void;
};

export function RepositionAircraftModal({ aircraft, reposition, cancel }: Props) {
  const { airportService } = useApi();
  const [airports, setAirports] = useState<Airport[]>([]);

  useEffect(() => {
    airportService.fetchAll().then(setAirports);
  }, [airportService]);

  const currentAirportId = aircraft.lastAirport?.id;
  const options = airportSelectOptions(airports.filter((airport) => airport.id !== currentAirportId));

  return (
    <Modal size="sm" className="text-gray-800 dark:text-white" show onClose={cancel}>
      <ModalHeader>Reposition aircraft</ModalHeader>
      <ModalBody>
        {aircraft.lastAirport && (
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            Repositioning from{" "}
            <span className="font-semibold text-gray-700 dark:text-gray-300">{aircraft.lastAirport.iataCode}</span> —{" "}
            {aircraft.lastAirport.name}.
          </p>
        )}
        <Form<CreateRepositionRequest>
          id="repositionForm"
          initialValues={{ destinationAirportId: "" }}
          validationSchema={repositionSchema}
          onSubmit={(data) => reposition(data.destinationAirportId)}
        >
          <AdvancedSelect
            field="destinationAirportId"
            label="Destination"
            placeholder="Select destination"
            options={options}
          />
        </Form>
      </ModalBody>
      <ModalFooter>
        <div className="ms-auto flex gap-2">
          <Button color="gray" outline onClick={cancel}>
            Cancel
          </Button>
          <Button color="indigo" type="submit" form="repositionForm" outline>
            Reposition
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
