import { useField } from "formik";
import React, { useMemo } from "react";
import { timezoneOptions } from "~/features/airport/components/Forms/timezoneOptions";
import { ManagedFloatingSelectBlock } from "~/shared/ui/Form/Managed/ManagedFloatingSelectBlock";

type Props = {
  className?: string;
};

export function AirportTimezoneField({ className }: Props) {
  const [{ value }] = useField<string>("timezone");
  const options = useMemo(() => timezoneOptions(value), [value]);

  return <ManagedFloatingSelectBlock className={className} field="timezone" label="Timezone" options={options} />;
}
