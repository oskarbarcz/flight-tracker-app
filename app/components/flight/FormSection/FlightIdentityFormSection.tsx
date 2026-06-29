import { useFormikContext } from "formik";
import React, { useEffect, useState } from "react";
import { FaIdCard } from "react-icons/fa6";
import { AdvancedSelect, type AdvancedSelectOption } from "~/components/shared/Form/AdvancedSelect/AdvancedSelect";
import { FormSection } from "~/components/shared/Form/FormSection";
import { ManagedFloatingInputBlock } from "~/components/shared/Form/Managed/ManagedFloatingInputBlock";
import { ManagedSelectBlock } from "~/components/shared/Form/Managed/ManagedSelectBlock";
import { type Aircraft, allianceLabel, type Operator } from "~/models";
import type { CreateFlightFormData } from "~/models/form/flight.form";
import { useApi } from "~/state/api/context/useApi";
import { newFlightIdentitySchema } from "~/validator/form/flight.schema";

type FormData = CreateFlightFormData["identity"];

type Props = {
  data: FormData;
  onSubmit: (data: FormData) => void;
};

function operatorSecondaryLine(operator: Operator): string {
  const parts: string[] = [];
  const alliance = allianceLabel(operator.alliance);
  if (alliance) {
    parts.push(alliance);
  }
  if (operator.hubs.length > 0) {
    parts.push(`Hubs: ${operator.hubs.join(", ")}`);
  }
  return parts.length > 0 ? parts.join(" · ") : operator.fullName;
}

function operatorSelectOptions(operators: Operator[]): AdvancedSelectOption[] {
  return operators.map((operator) => ({
    value: operator.id,
    keywords: [operator.iataCode, operator.icaoCode, operator.shortName],
    avatar: operator.iataCode,
    title: operator.shortName,
    subtitle: operatorSecondaryLine(operator),
  }));
}

function optionsFromAircrafts(aircrafts: Aircraft[]) {
  return aircrafts.map((aircraft) => ({
    label: `${aircraft.registration} - ${aircraft.airframe.type}`,
    value: aircraft.id,
  }));
}

function AircraftSelectBlock({ disabled }: { disabled: boolean }) {
  const { aircraftService } = useApi();
  const { values, setFieldValue } = useFormikContext<FormData>();
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);
  const operatorId = values.operatorId;

  useEffect(() => {
    if (!operatorId) {
      setAircrafts([]);
      return;
    }
    aircraftService.fetchAll(operatorId).then(setAircrafts);
    setFieldValue("aircraftId", "");
  }, [operatorId, aircraftService, setFieldValue]);

  return (
    <ManagedSelectBlock
      className="basis-[calc(50%-0.5rem)]"
      field="aircraftId"
      label="Aircraft"
      disabled={disabled || !operatorId}
      options={optionsFromAircrafts(aircrafts)}
    />
  );
}

export function FlightIdentityFormSection({ data, onSubmit }: Props) {
  const [initialValues, setInitialValues] = useState<FormData>(data);
  const [isEditable, setIsEditable] = useState<boolean>(true);
  const [operators, setOperators] = useState<Operator[]>([]);
  const { operatorService } = useApi();

  useEffect(() => {
    setInitialValues(data);
  }, [data]);

  useEffect(() => {
    operatorService.fetchAll().then(setOperators);
  }, [operatorService]);

  return (
    <FormSection<FormData>
      initialValues={initialValues}
      validationSchema={newFlightIdentitySchema}
      isEditable={isEditable}
      setIsEditable={setIsEditable}
      icon={FaIdCard}
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

        <AdvancedSelect
          className="basis-[calc(50%-0.5rem)]"
          field="operatorId"
          label="Operator"
          placeholder="Select operator"
          disabled={!isEditable}
          options={operatorSelectOptions(operators)}
        />
        <AircraftSelectBlock disabled={!isEditable} />
      </div>
    </FormSection>
  );
}
