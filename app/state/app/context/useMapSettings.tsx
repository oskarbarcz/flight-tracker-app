import React, { createContext, type ReactNode, useContext } from "react";
import { useLocalStorage } from "~/state/app/hooks/useLocalStorage";

export type DisplayMode = "all" | "assigned" | "none";

export type MapSettings = {
  centerOn: "aircraft" | "route" | "departure" | "destination";
  autoCenter: boolean;
  gateDisplay: DisplayMode;
  terminalDisplay: DisplayMode;
  runwayDisplay: DisplayMode;
};

const defaultMapSettings: MapSettings = {
  centerOn: "route",
  autoCenter: true,
  gateDisplay: "assigned",
  terminalDisplay: "all",
  runwayDisplay: "all",
};

function migrate(raw: Partial<MapSettings> & Record<string, unknown>): MapSettings {
  const merged = { ...defaultMapSettings, ...raw };
  // Pre-rename value carried over from earlier builds.
  if ((raw.gateDisplay as unknown) === "selected") {
    merged.gateDisplay = "assigned";
  }
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
