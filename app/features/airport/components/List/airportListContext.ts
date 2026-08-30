import { useOutletContext } from "react-router";

export type AirportListContext = {
  reload: () => void;
  listPath: string;
};

export function useAirportList(): AirportListContext {
  return useOutletContext<AirportListContext>();
}
