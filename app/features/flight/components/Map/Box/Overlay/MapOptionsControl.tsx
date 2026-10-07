import { Button } from "flowbite-react";
import { type KeyboardEvent as ReactKeyboardEvent, useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { IconType } from "react-icons";
import {
  LuBan,
  LuBuilding2,
  LuCheck,
  LuDoorOpen,
  LuInfo,
  LuPlane,
  LuPlaneLanding,
  LuPlaneTakeoff,
  LuRoute,
  LuSlidersHorizontal,
  LuSquareParking,
  LuTrainTrack,
} from "react-icons/lu";
import { twMerge } from "tailwind-merge";
import { type DisplayMode, type MapMode, type MapSettings, useMapSettings } from "~/app-state/useMapSettings";
import { SegmentedControl } from "~/features/flight/components/Map/Element/SegmentedControl";

type Props = {
  size?: "sm" | "md";
  triggerClassName?: string;
  placement?: "above" | "below";
};

type FollowValue = MapSettings["centerOn"] | "off";
type LayerKey = "runwayDisplay" | "terminalDisplay" | "gateDisplay" | "parkingPositionDisplay";

const POPOVER_WIDTH = 288;
const POPOVER_ESTIMATED_HEIGHT = 420;
const GAP = 8;

const followOptions: { value: FollowValue; label: string; icon: IconType }[] = [
  { value: "route", label: "Route", icon: LuRoute },
  { value: "aircraft", label: "Aircraft", icon: LuPlane },
  { value: "departure", label: "Departure", icon: LuPlaneTakeoff },
  { value: "destination", label: "Destination", icon: LuPlaneLanding },
  { value: "off", label: "Don’t follow", icon: LuBan },
];

const layerRows: { key: LayerKey; label: string; icon: IconType }[] = [
  { key: "runwayDisplay", label: "Runways", icon: LuTrainTrack },
  { key: "terminalDisplay", label: "Terminals", icon: LuBuilding2 },
  { key: "gateDisplay", label: "Gates", icon: LuDoorOpen },
  { key: "parkingPositionDisplay", label: "Parking", icon: LuSquareParking },
];

const modeOptions: { value: MapMode; label: string }[] = [
  { value: "auto", label: "AUTO" },
  { value: "manual", label: "MAN" },
];

const displayOptions: { value: DisplayMode; label: string }[] = [
  { value: "all", label: "All" },
  { value: "assigned", label: "Assigned" },
  { value: "none", label: "Off" },
];

const LAYER_LIMIT = 4;

const sectionLabel = "text-2xs font-bold uppercase tracking-[0.08em] text-gray-500 dark:text-gray-400";

function focusableButtons(container: HTMLElement | null): HTMLButtonElement[] {
  return Array.from(container?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") ?? []);
}

export function MapOptionsControl({ size = "md", triggerClassName = "bottom-3 left-3", placement = "above" }: Props) {
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
    focusableButtons(popoverRef.current)[0]?.focus();
  }, [open, portalTarget]);

  const onPanelKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const buttons = focusableButtons(popoverRef.current);
    const boundary = event.shiftKey ? buttons[0] : buttons[buttons.length - 1];
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
  const shownLayers = layerRows.filter((row) => mapSettings[row.key] === "all").length;
  const layersAtLimit = shownLayers >= LAYER_LIMIT;

  const selectFollow = (value: FollowValue) => {
    if (value === "off") {
      updateMapSettings({ ...mapSettings, mode: modeAfterEdit, autoCenter: false });
      return;
    }
    updateMapSettings({ ...mapSettings, mode: modeAfterEdit, centerOn: value, autoCenter: true });
  };

  const setLayer = (key: LayerKey, value: DisplayMode) => {
    updateMapSettings({ ...mapSettings, mode: modeAfterEdit, [key]: value });
  };

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
              "z-[1000] w-72 max-w-[calc(100vw-1rem)] overflow-y-auto overscroll-contain rounded-xl border border-gray-200 bg-white p-1.5 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-150 dark:border-gray-700 dark:bg-gray-900",
              placement === "below" ? "motion-safe:slide-in-from-top-1" : "motion-safe:slide-in-from-bottom-1",
            )}
          >
            {intent !== null && (
              <div className="px-1">
                <p className={twMerge(sectionLabel, "px-2 pb-0.5 pt-1")}>Mode</p>
                <div className="px-2 py-1">
                  <SegmentedControl
                    ariaLabel="Map mode"
                    value={mapSettings.mode}
                    onChange={setMode}
                    options={modeOptions}
                  />
                </div>
                {followsIntent && (
                  <p className="flex items-start gap-2 px-2 pb-1 pt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    <LuInfo className="mt-0.5 size-3 shrink-0 text-gray-500 dark:text-gray-400" />
                    <span>Follow selected tab (currently: {intent.label})</span>
                  </p>
                )}
              </div>
            )}

            {!followsIntent && intent !== null && (
              <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
            )}

            {!followsIntent && (
              <>
                <div className="px-1">
                  <p className={twMerge(sectionLabel, "px-2 pb-0.5 pt-1")}>Follow</p>
                  {followOptions.map((option) => {
                    const active = follow === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={active}
                        onClick={() => selectFollow(option.value)}
                        className={twMerge(
                          "flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors",
                          active
                            ? "font-semibold text-indigo-700 dark:text-indigo-300"
                            : "text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800",
                        )}
                      >
                        <option.icon
                          className={twMerge(
                            "size-3.5 shrink-0",
                            active ? "text-indigo-500" : "text-gray-500 dark:text-gray-400",
                          )}
                        />
                        <span>{option.label}</span>
                        {active && <LuCheck className="ml-auto size-3 text-indigo-500" />}
                      </button>
                    );
                  })}
                </div>

                <div className="my-1 border-t border-gray-200 dark:border-gray-700" />

                <div className="px-1">
                  <div className="flex items-baseline justify-between gap-2 px-2 pb-0.5 pt-1">
                    <p className={sectionLabel}>Data layers</p>
                    <span className="font-mono text-2xs tabular-nums text-gray-500 dark:text-gray-400">
                      {shownLayers}/{LAYER_LIMIT}
                    </span>
                  </div>
                  {layerRows.map((row) => (
                    <div key={row.key} className="flex items-center justify-between gap-2 px-2 py-1">
                      <span className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-100">
                        <row.icon className="size-3.5 shrink-0 text-gray-500 dark:text-gray-400" />
                        {row.label}
                      </span>
                      <SegmentedControl
                        ariaLabel={row.label}
                        value={mapSettings[row.key]}
                        onChange={(value) => setLayer(row.key, value)}
                        options={displayOptions}
                        disabledValues={layersAtLimit ? ["all"] : []}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>,
          portalTarget,
        )}
    </div>
  );
}
