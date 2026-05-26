"use client";

import React from "react";
import { DangerousGoodsCheckboxes } from "~/components/flight/Dashboard/Emergency/DangerousGoodsCheckboxes";
import { ManagedInputBlock } from "~/components/shared/Form/Managed/ManagedInputBlock";
import { ManagedSelectBlock } from "~/components/shared/Form/Managed/ManagedSelectBlock";
import { ManagedTextareaBlock } from "~/components/shared/Form/Managed/ManagedTextareaBlock";
import {
  emergencyCategoryOptions,
  emergencyIntentionOptions,
  emergencySquawkOptions,
  emergencyThreatLevelOptions,
  emergencyUrgencyOptions,
} from "~/models";

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

      <ManagedTextareaBlock
        field="freeText"
        label="Description"
        placeholder="Engine #2 fire warning, ECAM actions completed, returning to FRA."
      />
    </div>
  );
}
