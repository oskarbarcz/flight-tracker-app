import { Label, TextInput } from "flowbite-react";
import React from "react";

type Props = {
  from: string;
  to: string;
  min: string;
  max: string;
  onChange: (next: { from: string; to: string }) => void;
};

export function CustomRange({ from, to, min, max, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="stats-range-from" className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
          From
        </Label>
        <TextInput
          id="stats-range-from"
          type="date"
          sizing="sm"
          value={from}
          min={min}
          max={max}
          onChange={(event) => onChange({ from: event.target.value, to })}
        />
      </div>
      <div className="flex items-center gap-2">
        <Label htmlFor="stats-range-to" className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
          To
        </Label>
        <TextInput
          id="stats-range-to"
          type="date"
          sizing="sm"
          value={to}
          min={min}
          max={max}
          onChange={(event) => onChange({ from, to: event.target.value })}
        />
      </div>
    </div>
  );
}
