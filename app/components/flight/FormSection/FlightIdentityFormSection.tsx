import { useFormikContext } from "formik";
import React, { useEffect, useState } from "react";
import { FaIdCard } from "react-icons/fa6";
import { OperatorFin } from "~/components/operator/OperatorFin";
import { AircraftIcon } from "~/components/shared/Aircraft/AircraftIcon";
import { type Aircraft, allianceLabel, type Operator } from "~/models";
import type { CreateFlightFormData } from "~/models/form/flight.form";
import { AdvancedSelect, type AdvancedSelectOption } from "~/shared/ui/Form/AdvancedSelect/AdvancedSelect";
import { OptionAvatarFrame } from "~/shared/ui/Form/AdvancedSelect/OptionAvatarFrame";
import { FormSection } from "~/shared/ui/Form/FormSection";
import { ManagedFloatingInputBlock } from "~/shared/ui/Form/Managed/ManagedFloatingInputBlock";
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
    avatar: (
      <OptionAvatarFrame>
        <OperatorFin operator={operator} className="mix-blend-multiply" />
      </OptionAvatarFrame>
    ),
    title: operator.shortName,
    subtitle: operatorSecondaryLine(operator),
    selectedSubtitle: (
      <>
        IATA: <span className="font-semibold">{operator.iataCode}</span>, ICAO:{" "}
        <span className="font-semibold">{operator.icaoCode}</span>
      </>
    ),
  }));
}

function aircraftSecondaryLine(aircraft: Aircraft): string {
  const parts: string[] = [aircraft.airframe.name];
  if (aircraft.lastAirport) {
    parts.push(`At: ${aircraft.lastAirport.iataCode}`);
  } else if (aircraft.baseAirport) {
    parts.push(`Base: ${aircraft.baseAirport.iataCode}`);
  }
  return parts.join(" · ");
}

function aircraftSelectOptions(aircrafts: Aircraft[]): AdvancedSelectOption[] {
  return aircrafts.map((aircraft) => ({
    value: aircraft.id,
    keywords: [aircraft.registration, aircraft.airframe.type, aircraft.airframe.name],
    avatar: <AircraftIcon type={aircraft.airframe.type} name={aircraft.airframe.name} className="rounded-md" />,
    title: aircraft.registration,
    subtitle: aircraftSecondaryLine(aircraft),
    selectedSubtitle: aircraft.airframe.name,
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
    <AdvancedSelect
      className="basis-[calc(50%-0.5rem)]"
      field="aircraftId"
      label="Aircraft"
      placeholder="Select aircraft"
      disabled={disabled || !operatorId}
      options={aircraftSelectOptions(aircrafts)}
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
