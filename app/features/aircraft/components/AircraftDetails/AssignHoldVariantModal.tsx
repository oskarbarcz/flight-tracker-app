import { Badge, Modal, ModalBody, ModalHeader } from "flowbite-react";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import type { Aircraft } from "~/features/aircraft";
import { compartmentsOf, type HoldVariant, positionCountOf } from "~/features/cargo-hold/model";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type Props = {
  aircraft: Aircraft;
  variants: HoldVariant[];
  assign: (holdVariant: string) => void;
  cancel: () => void;
};

type OptionProps = {
  variant: HoldVariant;
  isSelected: boolean;
  isAssigned: boolean;
  onSelect: () => void;
};

function VariantOption({ variant, isSelected, isAssigned, onSelect }: OptionProps) {
  const positions = positionCountOf(variant);
  const compartments = compartmentsOf(variant);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className={twMerge(
        "flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left transition-colors",
        isSelected
          ? "border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-950"
          : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600",
      )}
    >
      <span className="min-w-0">
        <span className="block truncate font-mono text-sm font-semibold text-gray-900 dark:text-white">
          {variant.id}
        </span>
        <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
          {compartments.length} compartments ·{" "}
          {positions === 0 ? "loosely loaded throughout" : `${positions} positions`}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-1.5">
        {isAssigned && (
          <Badge color="indigo" size="xs">
            Assigned
          </Badge>
        )}
        {variant.isDefault && (
          <Badge color="gray" size="xs">
            Default
          </Badge>
        )}
      </span>
    </button>
  );
}

export function AssignHoldVariantModal({ aircraft, variants, assign, cancel }: Props) {
  const [selected, setSelected] = useState<string | null>(aircraft.holdVariant);

  return (
    <Modal size="md" className="text-gray-800 dark:text-white" show onClose={cancel}>
      <ModalHeader>
        <ModalTitle context="Cargo hold" action="Assign variant" />
      </ModalHeader>
      <ModalBody>
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
          Choose the hold {aircraft.registration} is loaded against.
        </p>
        <div className="flex flex-col gap-2">
          {variants.map((variant) => (
            <VariantOption
              key={variant.id}
              variant={variant}
              isSelected={selected === variant.id}
              isAssigned={aircraft.holdVariant === variant.id}
              onSelect={() => setSelected(variant.id)}
            />
          ))}
        </div>
      </ModalBody>
      <ModalActions
        cancel={{ onClick: cancel }}
        confirm={{
          label: "Assign variant",
          disabled: selected === null,
          onClick: () => selected !== null && assign(selected),
        }}
      />
    </Modal>
  );
}
