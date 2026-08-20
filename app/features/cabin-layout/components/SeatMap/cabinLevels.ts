import { CabinClass } from "~/features/cabin-layout/model";

export const CABIN_FILLS: Record<CabinClass, string> = {
  [CabinClass.First]: "bg-indigo-800 dark:bg-indigo-200",
  [CabinClass.Business]: "bg-indigo-600 dark:bg-indigo-400",
  [CabinClass.PremiumEconomy]: "bg-indigo-400 dark:bg-indigo-600",
  [CabinClass.Economy]: "bg-indigo-200 dark:bg-indigo-800",
};

export const CABIN_SHORT_LABELS: Record<CabinClass, string> = {
  [CabinClass.First]: "First",
  [CabinClass.Business]: "Business",
  [CabinClass.PremiumEconomy]: "Premium",
  [CabinClass.Economy]: "Economy",
};

export const CABIN_ORDER: CabinClass[] = [
  CabinClass.First,
  CabinClass.Business,
  CabinClass.PremiumEconomy,
  CabinClass.Economy,
];
