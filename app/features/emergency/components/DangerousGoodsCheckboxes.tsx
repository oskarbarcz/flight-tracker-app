import { Checkbox, Label } from "flowbite-react";
import { useField } from "formik";
import React from "react";
import { type DangerousGoodsClass, dangerousGoodsOptions } from "~/features/emergency";

type Props = {
  field: string;
};

export function DangerousGoodsCheckboxes({ field }: Props) {
  const [fieldProps, , helpers] = useField<DangerousGoodsClass[]>(field);
  const selected = new Set(fieldProps.value ?? []);

  const toggle = (value: DangerousGoodsClass) => {
    const next = new Set(selected);
    if (next.has(value)) {
      next.delete(value);
    } else {
      next.add(value);
    }
    helpers.setValue(Array.from(next));
  };

  return (
    <div className="mb-4 w-full">
      <div className="mb-2 block">
        <Label>Dangerous goods on board</Label>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {dangerousGoodsOptions.map((option) => {
          const id = `${field}-${option.value}`;
          return (
            <div className="flex items-center gap-2" key={option.value}>
              <Checkbox id={id} checked={selected.has(option.value)} onChange={() => toggle(option.value)} />
              <Label htmlFor={id} className="text-sm font-normal">
                {option.label}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
