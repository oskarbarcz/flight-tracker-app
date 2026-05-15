"use client";

import { Label, Textarea } from "flowbite-react";
import { useField } from "formik";
import React from "react";
import { DangerousGoodsCheckboxes } from "~/components/flight/Dashboard/Emergency/DangerousGoodsCheckboxes";
import { InputErrorList } from "~/components/shared/Form/InputErrorList";
import { ManagedInputBlock } from "~/components/shared/Form/Managed/ManagedInputBlock";
import { ManagedSelectBlock } from "~/components/shared/Form/Managed/ManagedSelectBlock";
import {
  emergencyCategoryOptions,
  emergencyIntentionOptions,
  emergencySquawkOptions,
  emergencyThreatLevelOptions,
  emergencyUrgencyOptions,
} from "~/models";

function FreeTextField() {
  const [fieldProps, meta] = useField<string>("freeText");
  const isError = meta.touched && meta.error;

  return (
    <div className="mb-4 w-full">
      <div className="mb-2 block">
        <Label htmlFor="freeText" color={isError ? "failure" : undefined}>
          Description
        </Label>
      </div>
      <Textarea
        id="freeText"
        rows={3}
        color={isError ? "failure" : undefined}
        placeholder="Engine #2 fire warning, ECAM actions completed, returning to FRA."
        {...fieldProps}
      />
      <InputErrorList errorFocus={Boolean(isError)} errors={isError ? [meta.error as string] : []} />
    </div>
  );
}

export function EmergencyFormFields() {
  return (
    <div className="flex flex-col">
      <div className="flex gap-4">
        <ManagedSelectBlock className="basis-1/2" field="urgency" label="Urgency" options={emergencyUrgencyOptions} />
        <ManagedSelectBlock
          className="basis-1/2"
          field="threatLevel"
          label="Threat level"
          options={emergencyThreatLevelOptions}
        />
      </div>

      <ManagedSelectBlock field="category" label="Category" options={emergencyCategoryOptions} />

      <div className="flex gap-4">
        <ManagedSelectBlock
          className="basis-1/2"
          field="squawk"
          label="Squawk"
          required={false}
          options={emergencySquawkOptions}
        />
        <ManagedSelectBlock
          className="basis-1/2"
          field="intention"
          label="Pilot intention"
          options={emergencyIntentionOptions}
        />
      </div>

      <ManagedInputBlock field="fuelEnduranceMinutes" label="Fuel endurance [minutes]" type="number" />

      <DangerousGoodsCheckboxes field="dangerousGoodsOnBoard" />

      <FreeTextField />
    </div>
  );
}
