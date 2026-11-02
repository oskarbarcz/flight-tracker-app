import { Button, Radio } from "flowbite-react";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import type { IconType } from "react-icons";
import {
  LuBuilding2,
  LuCircleDashed,
  LuDoorOpen,
  LuHexagon,
  LuRoute,
  LuSlidersHorizontal,
  LuSpline,
  LuSquareParking,
  LuTrainTrack,
} from "react-icons/lu";
import { twMerge } from "tailwind-merge";
import {
  type AirspaceSettings,
  type DisplayMode,
  type FlightDataDisplay,
  type FlightDataSettings,
  type MapMode,
  type MapSettings,
  useMapSettings,
} from "~/app-state/useMapSettings";
import { MapProjectionSwitch } from "~/features/flight/components/Map/Element/MapProjectionSwitch";
import { SegmentedControl } from "~/features/flight/components/Map/Element/SegmentedControl";
import type { MapProjection } from "~/features/flight/hooks/useMapProjection";
import { VATSPY_DATA_PROJECT } from "~/shared/ui/Map/MapAttribution";

type Props = {
  size?: "sm" | "md";
  triggerClassName?: string;
  placement?: "above" | "below";
  projection?: MapProjection;
  onProjectionChange?: (projection: MapProjection) => void;
  hasFiledRoute?: boolean;
  hasEtopsRings?: boolean;
};

type FollowValue = MapSettings["centerOn"] | "off";
type LayerKey = "runwayDisplay" | "terminalDisplay" | "gateDisplay" | "parkingPositionDisplay";
type FlightDataKey = keyof FlightDataSettings;
type AirspaceKey = keyof AirspaceSettings;

const POPOVER_WIDTH = 352;
const POPOVER_ESTIMATED_HEIGHT = 360;
const GAP = 8;

const followOptions: { value: FollowValue; label: string }[] = [
  { value: "route", label: "Route" },
  { value: "aircraft", label: "Aircraft" },
  { value: "departure", label: "Departure" },
  { value: "destination", label: "Destination" },
  { value: "off", label: "Off" },
];

const layerRows: { key: LayerKey; label: string; icon: IconType }[] = [
  { key: "runwayDisplay", label: "Runways", icon: LuTrainTrack },
  { key: "terminalDisplay", label: "Terminals", icon: LuBuilding2 },
  { key: "gateDisplay", label: "Gates", icon: LuDoorOpen },
  { key: "parkingPositionDisplay", label: "Parking", icon: LuSquareParking },
];

const airspaceRows: MatrixRow<AirspaceKey>[] = [{ key: "firDisplay", label: "FIRs", icon: LuHexagon }];

const flightDataOptions: { value: FlightDataDisplay; label: string }[] = [
  { value: "show", label: "Yes" },
  { value: "dim", label: "Dim" },
  { value: "hide", label: "No" },
];

const modeOptions: { value: MapMode; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "manual", label: "Manual" },
];

const displayOptions: { value: DisplayMode; label: string }[] = [
  { value: "all", label: "All" },
  { value: "assigned", label: "Assigned" },
  { value: "none", label: "Off" },
];

const sectionLabel = "text-2xs font-bold uppercase tracking-[0.08em] text-gray-500 dark:text-gray-400";

function tabbableControls(container: HTMLElement | null): HTMLElement[] {
  return Array.from(
    container?.querySelectorAll<HTMLElement>("button:not(:disabled), input[type=radio]:checked:not(:disabled)") ?? [],
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <p className={sectionLabel}>{label}</p>
      {children}
    </div>
  );
}

type MatrixRow<K extends string> = {
  key: K;
  label: string;
  icon: IconType;
  unavailable?: string;
};

type OptionMatrixProps<K extends string, V extends string> = {
  title: string;
  name: string;
  rows: MatrixRow<K>[];
  options: { value: V; label: string }[];
  selected: (key: K) => V;
  onChange: (key: K, value: V) => void;
};

function OptionMatrix<K extends string, V extends string>({
  title,
  name,
  rows,
  options,
  selected,
  onChange,
}: OptionMatrixProps<K, V>) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_repeat(3,4.25rem)] items-center">
      <p className={sectionLabel}>{title}</p>
      {options.map((option) => (
        <p key={option.value} aria-hidden={true} className={twMerge(sectionLabel, "text-center")}>
          {option.label}
        </p>
      ))}

      {rows.map((row) => {
        const disabled = row.unavailable !== undefined;

        return (
          <div
            key={row.key}
            role="radiogroup"
            aria-label={row.label}
            aria-disabled={disabled || undefined}
            title={row.unavailable}
            className={twMerge("col-span-4 grid grid-cols-subgrid items-center", disabled && "opacity-50")}
          >
            <span className="flex min-w-0 items-center gap-2 text-sm text-gray-800 dark:text-gray-100">
              <row.icon className="size-3.5 shrink-0 text-gray-500 dark:text-gray-400" aria-hidden={true} />
              <span className="truncate">{row.label}</span>
            </span>
            {options.map((option) => {
              const radioId = `${name}-${row.key}-${option.value}`;

              return (
                <label
                  key={option.value}
                  htmlFor={radioId}
                  className={twMerge(
                    "flex h-8 items-center justify-center rounded-md transition-colors duration-150 pointer-coarse:h-11",
                    disabled ? "cursor-not-allowed" : "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800",
                  )}
                >
                  <Radio
                    id={radioId}
                    name={`${name}-${row.key}`}
                    value={option.value}
                    checked={selected(row.key) === option.value}
                    disabled={disabled}
                    onChange={() => onChange(row.key, option.value)}
                    aria-label={`${row.label}: ${option.label}`}
                  />
                </label>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export function MapOptionsControl({
  size = "md",
  triggerClassName = "bottom-3 left-3",
  placement = "above",
  projection,
  onProjectionChange,
  hasFiledRoute = false,
  hasEtopsRings = false,
}: Props) {
  const { mapSettings, updateMapSettings, intent, setMode } = useMapSettings();
  const [open, setOpen] = useState(false);
  const [portalTarget, setPortalTarget] = useState<Element | null>(null);
  const [position, setPosition] = useState<{ left: number; top?: number; bottom?: number; maxHeight?: number }>({
    left: 0,
    bottom: 0,
  });
  const triggerRef = useRef<HTMLDivElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const closeAndFocusTrigger = useCallback(() => {
    setOpen(false);
    triggerButtonRef.current?.focus();
  }, []);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const left = Math.max(GAP, Math.min(rect.left, window.innerWidth - POPOVER_WIDTH - GAP));
    const height = popoverRef.current?.offsetHeight ?? POPOVER_ESTIMATED_HEIGHT;
    const spaceAbove = rect.top - GAP * 2;
    const spaceBelow = window.innerHeight - rect.bottom - GAP * 2;
    const preferred = placement === "above" ? spaceAbove : spaceBelow;
    const alternative = placement === "above" ? spaceBelow : spaceAbove;
    const keepsPlacement = preferred >= height || preferred >= alternative;
    const above = placement === "above" ? keepsPlacement : !keepsPlacement;

    if (above) {
      setPosition({ left, bottom: window.innerHeight - rect.top + GAP, maxHeight: spaceAbove });
    } else {
      setPosition({ left, top: rect.bottom + GAP, maxHeight: spaceBelow });
    }
  }, [placement]);

  useEffect(() => {
    if (!open) return;

    updatePosition();

    const reposition = () => updatePosition();
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || popoverRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeAndFocusTrigger();
    };

    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, updatePosition, closeAndFocusTrigger]);

  useEffect(() => {
    if (!open || !portalTarget) return;
    (tabbableControls(headerRef.current)[0] ?? tabbableControls(popoverRef.current)[0])?.focus();
  }, [open, portalTarget]);

  const onPanelKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const controls = tabbableControls(popoverRef.current);
    const boundary = event.shiftKey ? controls[0] : controls[controls.length - 1];
    if (document.activeElement !== boundary) return;
    event.preventDefault();
    closeAndFocusTrigger();
  };

  const toggle = () => {
    if (!open) {
      updatePosition();
      setPortalTarget(document.fullscreenElement ?? document.body);
    }
    setOpen((previous) => !previous);
  };

  const follow: FollowValue = mapSettings.autoCenter ? mapSettings.centerOn : "off";
  const modeAfterEdit: MapMode = intent === null ? mapSettings.mode : "manual";
  const followsIntent = intent !== null && mapSettings.mode === "auto";
  const hasProjection = projection !== undefined && onProjectionChange !== undefined;
  const opensAbove = position.bottom !== undefined;

  const selectFollow = (value: FollowValue) => {
    if (value === "off") {
      updateMapSettings({ ...mapSettings, mode: modeAfterEdit, autoCenter: false });
      return;
    }
    updateMapSettings({ ...mapSettings, mode: modeAfterEdit, centerOn: value, autoCenter: true });
  };

  const setFlightData = (key: FlightDataKey, value: FlightDataDisplay) => {
    updateMapSettings({ ...mapSettings, [key]: value });
  };

  const flightDataRows: MatrixRow<FlightDataKey>[] = [
    { key: "greatCircleDisplay", label: "Great circle", icon: LuSpline },
    {
      key: "routeDisplay",
      label: "Flight route",
      icon: LuRoute,
      unavailable: hasFiledRoute ? undefined : "This flight has no filed route waypoints",
    },
    {
      key: "etopsDisplay",
      label: "ETP rings",
      icon: LuCircleDashed,
      unavailable: hasEtopsRings ? undefined : "This flight has no ETOPS plan",
    },
  ];

  const setAirspace = (key: AirspaceKey, value: FlightDataDisplay) => {
    updateMapSettings({ ...mapSettings, [key]: value });
  };

  const setLayer = (key: LayerKey, value: DisplayMode) => {
    updateMapSettings({ ...mapSettings, mode: modeAfterEdit, [key]: value });
  };

  const header = (hasProjection || intent !== null) && (
    <div ref={headerRef} key="header" className="flex flex-col gap-2 p-2.5">
      <div className={twMerge("grid gap-3", hasProjection && intent !== null ? "grid-cols-2" : "grid-cols-1")}>
        {hasProjection && (
          <Field label="Projection">
            <MapProjectionSwitch value={projection} onChange={onProjectionChange} stretch={true} />
          </Field>
        )}
        {intent !== null && (
          <Field label="Mode">
            <SegmentedControl
              ariaLabel="Map mode"
              value={mapSettings.mode}
              onChange={setMode}
              options={modeOptions}
              stretch={true}
            />
          </Field>
        )}
      </div>
      {followsIntent && (
        <p className="text-xs text-gray-500 dark:text-gray-400">Follows the flight phase: {intent.label}</p>
      )}
    </div>
  );

  const manualSections = !followsIntent && [
    <div key="follow" className="p-2.5">
      <Field label="Follow">
        <SegmentedControl
          ariaLabel="Follow"
          value={follow}
          onChange={selectFollow}
          options={followOptions}
          stretch={true}
        />
      </Field>
    </div>,
    <div key="flight-data" className="p-2.5">
      <OptionMatrix
        title="Flight data"
        name={`${panelId}-flight`}
        rows={flightDataRows}
        options={flightDataOptions}
        selected={(key) => mapSettings[key]}
        onChange={setFlightData}
      />
    </div>,
    <div key="static-data" className="p-2.5">
      <OptionMatrix
        title="Static data"
        name={`${panelId}-static`}
        rows={layerRows}
        options={displayOptions}
        selected={(key) => mapSettings[key]}
        onChange={setLayer}
      />
    </div>,
    <div key="airspace" className="flex flex-col gap-1.5 p-2.5">
      <OptionMatrix
        title="Airspace"
        name={`${panelId}-airspace`}
        rows={airspaceRows}
        options={flightDataOptions}
        selected={(key) => mapSettings[key]}
        onChange={setAirspace}
      />
      {mapSettings.firDisplay !== "hide" && (
        <p className="text-2xs text-gray-500 dark:text-gray-400">
          FIRs from{" "}
          <a href={VATSPY_DATA_PROJECT.href} target="_blank" rel="noreferrer" className="underline">
            {VATSPY_DATA_PROJECT.label}
          </a>
          , {VATSPY_DATA_PROJECT.license}
        </p>
      )}
    </div>,
  ];

  const blocks = opensAbove ? [manualSections, header] : [header, manualSections];

  return (
    <div ref={triggerRef} className={twMerge("absolute z-20", triggerClassName)}>
      <Button
        ref={triggerButtonRef}
        color="light"
        size={size === "sm" ? "xs" : "sm"}
        className="space-x-2 font-semibold"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
      >
        <LuSlidersHorizontal className="size-3.5" aria-hidden={true} />
        <span>Map options</span>
      </Button>

      {open &&
        portalTarget &&
        createPortal(
          <div
            ref={popoverRef}
            id={panelId}
            role="dialog"
            aria-label="Map options"
            onKeyDown={onPanelKeyDown}
            style={{
              position: "fixed",
              left: position.left,
              top: position.top,
              bottom: position.bottom,
              maxHeight: position.maxHeight,
            }}
            className={twMerge(
              "z-[1000] flex w-[22rem] max-w-[calc(100vw-1rem)] flex-col divide-y divide-gray-200 overflow-y-auto overscroll-contain rounded-xl border border-gray-200 bg-white motion-safe:animate-in motion-safe:fade-in motion-safe:duration-150 dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-900",
              opensAbove ? "motion-safe:slide-in-from-bottom-1" : "motion-safe:slide-in-from-top-1",
            )}
          >
            {blocks}
          </div>,
          portalTarget,
        )}
    </div>
  );
}
