import React, { createContext, type ReactNode, useContext } from "react";
import { useLocalStorage } from "~/shared/hooks/useLocalStorage";

export type DisplayMode = "all" | "assigned" | "none";

export type MapSettings = {
  centerOn: "aircraft" | "route" | "departure" | "destination";
  autoCenter: boolean;
  parkingPositionDisplay: DisplayMode;
  terminalDisplay: DisplayMode;
  runwayDisplay: DisplayMode;
};

const defaultMapSettings: MapSettings = {
  centerOn: "route",
  autoCenter: true,
  parkingPositionDisplay: "assigned",
  terminalDisplay: "all",
  runwayDisplay: "all",
};

function migrate(raw: Partial<MapSettings> & Record<string, unknown>): MapSettings {
  const merged = { ...defaultMapSettings, ...raw };
  const legacyDisplay = raw.parkingPositionDisplay ?? (raw.gateDisplay as DisplayMode | "selected" | undefined);
  merged.parkingPositionDisplay =
    legacyDisplay === "selected" || legacyDisplay === undefined ? "assigned" : legacyDisplay;
  return merged;
}

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
  const merged = migrate(settings as Partial<MapSettings> & Record<string, unknown>);

  return (
    <UseMapSettings.Provider value={{ mapSettings: merged, updateMapSettings: setSettings }}>
      {children}
    </UseMapSettings.Provider>
  );
}

export const useMapSettings = () => {
  const ctx = useContext(UseMapSettings);
  if (!ctx) throw new Error("useMapSettings must be used within a MapSettingsProvider");
  return ctx;
};
