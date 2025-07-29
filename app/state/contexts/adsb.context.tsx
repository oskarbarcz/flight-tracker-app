import React, { createContext, useContext, useMemo } from "react";
import { AdsbService } from "~/state/api/adsb.service";

type ApiProviderProps = {
  children: React.ReactNode;
};

const AdsbContext = createContext<AdsbService | null>(null);

export function AdsbProvider({ children }: ApiProviderProps) {
  const service = useMemo(() => new AdsbService(), []);

  return (
    <AdsbContext.Provider value={service}>{children}</AdsbContext.Provider>
  );
}

export function useAdsbApi(): AdsbService {
  const context = useContext(AdsbContext);
  if (!context) throw new Error("useApi must be used within a ApiProvider");
  return context;
}
