import { translateContinent } from "~/features/airport/i18n";
import { allContinents } from "~/features/airport/model";

export const continentOptions = allContinents().map((continent) => ({
  label: translateContinent(continent),
  value: continent,
}));
