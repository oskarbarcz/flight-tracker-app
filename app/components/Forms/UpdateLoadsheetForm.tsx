import React from "react";
import ManagedFloatingInputBlock from "~/components/Intrinsic/Form/Managed/ManagedFloatingInputBlock";

export default function UpdateLoadsheetForm() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">
        Souls on board
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <ManagedFloatingInputBlock
          field="pilots"
          label="Pilots"
          type="number"
          autoComplete="off"
        />
        <ManagedFloatingInputBlock
          field="reliefPilots"
          label="Relief pilots"
          type="number"
          autoComplete="off"
        />
        <ManagedFloatingInputBlock
          field="cabinCrew"
          label="Cabin crew"
          type="number"
          autoComplete="off"
        />
        <ManagedFloatingInputBlock
          field="passengers"
          label="Passengers"
          type="number"
          autoComplete="off"
        />
      </div>
      <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">
        Weights
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <ManagedFloatingInputBlock
          field="zeroFuelWeight"
          label="Zero-fuel weight [tons]"
          type="number"
          autoComplete="off"
        />
        <ManagedFloatingInputBlock
          field="cargo"
          label="Cargo [tons]"
          type="number"
          autoComplete="off"
        />
        <ManagedFloatingInputBlock
          field="payload"
          label="Payload [tons]"
          type="number"
          autoComplete="off"
        />
        <ManagedFloatingInputBlock
          field="blockFuel"
          label="Block fuel [tons]"
          type="number"
          autoComplete="off"
        />
      </div>
    </div>
  );
}
