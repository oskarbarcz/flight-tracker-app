import React, { useMemo } from "react";
import { useCountries } from "~/features/country";
import { ManagedFloatingSelectBlock } from "~/shared/ui/Form/Managed/ManagedFloatingSelectBlock";

type Props = {
  className?: string;
};

export function AirportCountryField({ className }: Props) {
  const countries = useCountries();
  const isLoading = countries.length === 0;

  const options = useMemo(() => {
    if (countries.length === 0) {
      return [];
    }

    return [
      { value: "", label: "Select a country" },
      ...countries.map((country) => ({ value: country.code, label: `${country.flag} ${country.name}` })),
    ];
  }, [countries]);

  return (
    <ManagedFloatingSelectBlock
      className={className}
      field="country"
      label="Country"
      options={options}
      disabled={isLoading}
    />
  );
}
