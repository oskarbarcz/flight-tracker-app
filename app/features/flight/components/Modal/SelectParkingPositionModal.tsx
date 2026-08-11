import { Alert, Modal, ModalBody, ModalHeader, Spinner } from "flowbite-react";
import React, { useEffect, useMemo, useState } from "react";
import { HiInformationCircle } from "react-icons/hi";
import type { ParkingPosition } from "~/features/parking-position";
import { parkingPositionSelectOptions } from "~/features/parking-position/components/parkingPositionSelectOptions";
import { selectParkingPositionSchema } from "~/features/parking-position/schema";
import type { Terminal } from "~/features/terminal";
import { useApi } from "~/shared/api/useApi";
import { AdvancedSelect } from "~/shared/ui/Form/AdvancedSelect/AdvancedSelect";
import { Form } from "~/shared/ui/Form/Form";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type Props = {
  airportId: string;
  kind: "departure" | "arrival";
  currentSelectionId?: string | null;
  select: (parkingPositionId: string) => void;
  cancel: () => void;
};

const FORM_ID = "selectParkingPositionForm";

export function SelectParkingPositionModal({ airportId, kind, currentSelectionId, select, cancel }: Props) {
  const { parkingPositionService, terminalService } = useApi();
  const [parkingPositions, setParkingPositions] = useState<ParkingPosition[] | null>(null);
  const [terminals, setTerminals] = useState<Terminal[]>([]);

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

  const options = useMemo(
    () => (parkingPositions ? parkingPositionSelectOptions(parkingPositions, terminals) : []),
    [parkingPositions, terminals],
  );

  const hasParkingPositions = parkingPositions !== null && parkingPositions.length > 0;

  return (
    <Modal size="md" className="text-gray-800 dark:text-white" show onClose={cancel}>
      <ModalHeader>
        <ModalTitle context="Parking stand" action={kind === "departure" ? "Select departure" : "Select arrival"} />
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
          <Form<{ parkingPositionId: string }>
            id={FORM_ID}
            initialValues={{ parkingPositionId: currentSelectionId ?? "" }}
            validationSchema={selectParkingPositionSchema}
            onSubmit={(data) => select(data.parkingPositionId)}
          >
            <AdvancedSelect
              field="parkingPositionId"
              label="Parking position"
              placeholder="Search by name, terminal or type"
              options={options}
              maxResults={8}
            />
          </Form>
        )}
      </ModalBody>
      <ModalActions
        cancel={{ label: "Back", onClick: cancel }}
        confirm={{ label: "Confirm", type: "submit", form: FORM_ID, disabled: !hasParkingPositions }}
      />
    </Modal>
  );
}
