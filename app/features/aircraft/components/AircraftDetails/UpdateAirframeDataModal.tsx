import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { airframeSelectOptions } from "~/features/aircraft/components/Form/airframeSelectOptions";
import { etopsThresholdSelectOptions } from "~/features/aircraft/components/Form/etopsThresholdSelectOptions";
import { initAircraftFormValues } from "~/features/aircraft/form";
import type { Aircraft } from "~/features/aircraft/model";
import { type AircraftFormValues, aircraftSchema } from "~/features/aircraft/schema";
import type { Airframe } from "~/features/airframe";
import type { Airport } from "~/features/airport";
import { airportSelectOptions } from "~/features/airport/components/Airport/airportSelectOptions";
import { useApi } from "~/shared/api/useApi";
import { AdvancedSelect } from "~/shared/ui/Form/AdvancedSelect/AdvancedSelect";
import { Form } from "~/shared/ui/Form/Form";
import { ManagedFloatingInputBlock } from "~/shared/ui/Form/Managed/ManagedFloatingInputBlock";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type Props = {
  aircraft: Aircraft;
  save: (values: AircraftFormValues) => void;
  cancel: () => void;
};

const FORM_ID = "updateAirframeDataForm";

export function UpdateAirframeDataModal({ aircraft, save, cancel }: Props) {
  const { airframeService, airportService } = useApi();
  const [airframes, setAirframes] = useState<Airframe[]>([]);
  const [airports, setAirports] = useState<Airport[]>([]);

  useEffect(() => {
    airframeService.fetchAll().then(setAirframes);
    airportService.fetchAll().then(setAirports);
  }, [airframeService, airportService]);

  return (
    <Modal size="lg" className="text-gray-800 dark:text-white" show onClose={cancel}>
      <ModalHeader>
        <ModalTitle context="Aircraft" action="Update airframe data" />
      </ModalHeader>
      <ModalBody>
        <Form<AircraftFormValues>
          id={FORM_ID}
          initialValues={initAircraftFormValues(aircraft)}
          validationSchema={aircraftSchema}
          onSubmit={save}
        >
          <AdvancedSelect
            field="type"
            label="Airframe"
            placeholder="Select airframe"
            options={airframeSelectOptions(airframes)}
          />
          <ManagedFloatingInputBlock field="registration" label="Registration" />
          <ManagedFloatingInputBlock field="selcal" label="SELCAL" required={false} />
          <AdvancedSelect
            field="baseAirportId"
            label="Base airport"
            placeholder="Select base airport"
            options={airportSelectOptions(airports)}
          />
          <ManagedFloatingInputBlock field="livery" label="Livery name" required={false} />
          <AdvancedSelect
            field="etopsThresholdMinutes"
            label="ETOPS threshold"
            options={etopsThresholdSelectOptions}
            required={false}
            clearable={false}
          />
        </Form>
      </ModalBody>
      <ModalActions cancel={{ onClick: cancel }} confirm={{ label: "Save", type: "submit", form: FORM_ID }} />
    </Modal>
  );
}
