import { useEffect, useState } from "react";
import type { Country } from "~/features/country/model";
import { useApi } from "~/shared/api/useApi";

export function useCountries(): Country[] {
  const { countryService } = useApi();
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    let active = true;

    countryService.fetchAll().then((fetched) => {
      if (active) {
        setCountries(fetched);
      }
    });

    return () => {
      active = false;
    };
  }, [countryService]);

  return countries;
}
