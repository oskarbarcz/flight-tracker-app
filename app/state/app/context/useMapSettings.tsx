import React, { createContext, type ReactNode, useContext } from "react";
import { useLocalStorage } from "~/state/app/hooks/useLocalStorage";

export type MapSettings = {
  centerOn: "aircraft" | "route";
  autoCenter: boolean;
};

const defaultMapSettings: MapSettings = {
  centerOn: "route",
  autoCenter: true,
};

type ProviderProps = {
  children: ReactNode;
};

type MapSettingsContextType = {
  mapSettings: MapSettings;
  updateMapSettings: (settings: MapSettings) => void;
};

const UseMapSettings = createContext<MapSettingsContextType>({
  mapSettings: defaultMapSettings,
  updateMapSettings: async () => {},
});

export function MapSettingsProvider({ children }: ProviderProps) {
  const [settings, setSettings] = useLocalStorage<MapSettings>("map-settings", defaultMapSettings);

  return (
    <UseMapSettings.Provider value={{ mapSettings: settings, updateMapSettings: setSettings }}>
      {children}
    </UseMapSettings.Provider>
  );
}

export const useMapSettings = () => {
  const ctx = useContext(UseMapSettings);
  if (!ctx) throw new Error("useMapSettings must be used within a MapSettingsProvider");
  return ctx;
};
