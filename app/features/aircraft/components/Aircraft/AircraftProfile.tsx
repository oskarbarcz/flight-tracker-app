import React from "react";
import { twMerge } from "tailwind-merge";
import { AircraftImage } from "~/features/aircraft/components/Aircraft/AircraftImage";

type Props = {
  type: string;
  name?: string;
  className?: string;
};

export function AircraftProfile({ type, name, className }: Props) {
  return (
    <div className={twMerge("overflow-hidden", className)}>
      <AircraftImage type={type} name={name} size="hero" className="-mt-[8.44%] -mb-[12.94%] dark:brightness-90" />
    </div>
  );
}
