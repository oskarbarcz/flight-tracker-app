"use client";

import React, { useEffect, useState } from "react";
import FormSection from "~/components/shared/Form/FormSection";
import ManagedFloatingInputBlock from "~/components/shared/Form/Managed/ManagedFloatingInputBlock";
import ManagedSelectBlock from "~/components/shared/Form/Managed/ManagedSelectBlock";
import { Aircraft, Operator } from "~/models";
import { CreateFlightFormData } from "~/models/form/flight.form";
import { useApi } from "~/state/contexts/content/api.context";
import { newFlightIdentitySchema } from "~/validator/form/flight.schema";

type FormData = CreateFlightFormData["identity"];

type Props = {
  data: FormData;
  onSubmit: (data: FormData) => void;
};

function optionsFromOperators(operators: Operator[]) {
  return operators.map((operator) => ({
    label: operator.shortName,
    value: operator.id,
  }));
}

function optionsFromAircrafts(aircrafts: Aircraft[]) {
  return aircrafts.map((aircraft) => ({
    label: `${aircraft.registration} - ${aircraft.icaoCode}`,
    value: aircraft.id,
  }));
}

export default function FlightIdentityFormSection({ data, onSubmit }: Props) {
  const [initialValues, setInitialValues] = useState<FormData>(data);
  const [isEditable, setIsEditable] = useState<boolean>(true);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);
  const { operatorService, aircraftService } = useApi();

  useEffect(() => {
    setInitialValues(data);
  }, [data]);

  useEffect(() => {
    operatorService.fetchAll().then(setOperators);
    aircraftService.fetchAll().then(setAircrafts);
  }, [operatorService, aircraftService]);

  return (
    <FormSection<FormData>
      initialValues={initialValues}
      validationSchema={newFlightIdentitySchema}
      isEditable={isEditable}
      setIsEditable={setIsEditable}
      title="Identity"
      onSubmit={onSubmit}
    >
      <div className="flex flex-wrap gap-4">
        <ManagedFloatingInputBlock
          className="basis-[calc(50%-0.5rem)]"
          field="flightNumber"
          label="Flight number"
          helperText="e.g. LH123"
          disabled={!isEditable}
        />
        <ManagedFloatingInputBlock
          className="basis-[calc(50%-0.5rem)]"
          field="callsign"
          label="ATC callsign"
          helperText="e.g. DLH5PA"
          disabled={!isEditable}
        />

        <ManagedSelectBlock
          className="basis-[calc(50%-0.5rem)]"
          field="operatorId"
          label="Operator"
          disabled={!isEditable}
          options={optionsFromOperators(operators)}
        />
        <ManagedSelectBlock
          className="basis-[calc(50%-0.5rem)]"
          field="aircraftId"
          label="Aircraft"
          disabled={!isEditable}
          options={optionsFromAircrafts(aircrafts)}
        />
      </div>
    </FormSection>
  );
}
