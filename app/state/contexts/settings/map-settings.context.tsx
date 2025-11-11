import React, { createContext, ReactNode, useContext } from "react";
import { useLocalStorage } from "~/state/hooks/useLocalStorage";

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

const MapSettingsContext = createContext<MapSettingsContextType>({
  mapSettings: defaultMapSettings,
  updateMapSettings: async () => {},
});

export default function MapSettingsProvider({ children }: ProviderProps) {
  const [settings, setSettings] = useLocalStorage<MapSettings>(
    "map-settings",
    defaultMapSettings,
  );

  return (
    <MapSettingsContext.Provider
      value={{ mapSettings: settings, updateMapSettings: setSettings }}
    >
      {children}
    </MapSettingsContext.Provider>
  );
}

export const useMapSettings = () => {
  const ctx = useContext(MapSettingsContext);
  if (!ctx)
    throw new Error("useMapSettings must be used within a MapSettingsProvider");
  return ctx;
};
