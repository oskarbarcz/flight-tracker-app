import React, { createContext, useCallback, useContext, useState } from "react";

type DataRefreshContextType = {
  lastRefresh: Date | null;
  markRefreshed: () => void;
};

const DataRefreshContext = createContext<DataRefreshContextType | undefined>(undefined);

type Props = {
  children: React.ReactNode;
};

export function DataRefreshProvider({ children }: Props) {
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const markRefreshed = useCallback(() => {
    setLastRefresh(new Date());
  }, []);

  return <DataRefreshContext.Provider value={{ lastRefresh, markRefreshed }}>{children}</DataRefreshContext.Provider>;
}

export function useDataRefresh() {
  const ctx = useContext(DataRefreshContext);
  if (!ctx) {
    throw new Error("useDataRefresh must be used within a DataRefreshProvider");
  }
  return ctx;
}
