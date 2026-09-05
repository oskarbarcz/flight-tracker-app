import React, { createContext, type ReactNode, useContext } from "react";
import { useLocalStorage } from "~/shared/hooks/useLocalStorage";

export type DisplayMode = "all" | "assigned" | "none";

export type MapMode = "auto" | "manual";

export type MapView = {
  centerOn: "aircraft" | "route" | "departure" | "destination";
  autoCenter: boolean;
  parkingPositionDisplay: DisplayMode;
  terminalDisplay: DisplayMode;
  gateDisplay: DisplayMode;
  runwayDisplay: DisplayMode;
};

export type MapSettings = MapView & {
  mode: MapMode;
};

export type MapIntent = {
  label: string;
  view: MapView;
};

const defaultMapSettings: MapSettings = {
  mode: "auto",
  centerOn: "route",
  autoCenter: false,
  parkingPositionDisplay: "assigned",
  terminalDisplay: "assigned",
  gateDisplay: "none",
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
  intent?: MapIntent | null;
};

type MapSettingsContextType = {
  mapSettings: MapSettings;
  updateMapSettings: (settings: MapSettings) => void;
  intent: MapIntent | null;
  setMode: (mode: MapMode) => void;
};

const UseMapSettings = createContext<MapSettingsContextType>({
  mapSettings: defaultMapSettings,
  updateMapSettings: async () => {},
  intent: null,
  setMode: async () => {},
});

export function MapSettingsProvider({ children, intent = null }: ProviderProps) {
  const [settings, setSettings] = useLocalStorage<MapSettings>("map-settings", defaultMapSettings);
  const stored = migrate(settings as Partial<MapSettings> & Record<string, unknown>);
  const followsIntent = stored.mode === "auto" && intent !== null;
  const mapSettings: MapSettings = followsIntent ? { ...intent.view, mode: "auto" } : stored;

  const setMode = (mode: MapMode) => setSettings({ ...mapSettings, mode });

  return (
    <UseMapSettings.Provider value={{ mapSettings, updateMapSettings: setSettings, intent, setMode }}>
      {children}
    </UseMapSettings.Provider>
  );
}

export const useMapSettings = () => {
  const ctx = useContext(UseMapSettings);
  if (!ctx) throw new Error("useMapSettings must be used within a MapSettingsProvider");
  return ctx;
};
