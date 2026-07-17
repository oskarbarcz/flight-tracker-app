import { Button } from "flowbite-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { IconType } from "react-icons";
import { FaBan, FaPlane, FaRoad } from "react-icons/fa";
import { FaCheck, FaPlaneArrival, FaPlaneDeparture, FaRoute, FaSliders } from "react-icons/fa6";
import { HiLocationMarker, HiOutlineOfficeBuilding } from "react-icons/hi";
import { MdMeetingRoom } from "react-icons/md";
import { twMerge } from "tailwind-merge";
import { type DisplayMode, type MapSettings, useMapSettings } from "~/app-state/useMapSettings";
import { SegmentedControl } from "~/features/flight/components/Map/Element/SegmentedControl";

type Props = {
  size?: "sm" | "md";
  triggerClassName?: string;
  placement?: "above" | "below";
};

type FollowValue = MapSettings["centerOn"] | "off";
type LayerKey = "runwayDisplay" | "terminalDisplay" | "gateDisplay" | "parkingPositionDisplay";

const POPOVER_WIDTH = 288;
const GAP = 8;

const followOptions: { value: FollowValue; label: string; icon: IconType; iconClassName?: string }[] = [
  { value: "route", label: "Route", icon: FaRoute },
  { value: "aircraft", label: "Aircraft", icon: FaPlane, iconClassName: "-rotate-45" },
  { value: "departure", label: "Departure", icon: FaPlaneDeparture },
  { value: "destination", label: "Destination", icon: FaPlaneArrival },
  { value: "off", label: "Don't follow", icon: FaBan },
];

const layerRows: { key: LayerKey; label: string; icon: IconType }[] = [
  { key: "runwayDisplay", label: "Runways", icon: FaRoad },
  { key: "terminalDisplay", label: "Terminals", icon: HiOutlineOfficeBuilding },
  { key: "gateDisplay", label: "Gates", icon: MdMeetingRoom },
  { key: "parkingPositionDisplay", label: "Parking", icon: HiLocationMarker },
];

const displayOptions: { value: DisplayMode; label: string }[] = [
  { value: "all", label: "All" },
  { value: "assigned", label: "Assigned" },
  { value: "none", label: "Off" },
];

const sectionLabel =
  "px-2 pb-0.5 pt-1 text-[10px] font-bold uppercase tracking-[0.08em] text-gray-500 dark:text-gray-400";

export function MapOptionsControl({ size = "md", triggerClassName = "bottom-3 left-3", placement = "above" }: Props) {
  const { mapSettings, updateMapSettings } = useMapSettings();
  const [open, setOpen] = useState(false);
  const [portalTarget, setPortalTarget] = useState<Element | null>(null);
  const [position, setPosition] = useState<{ left: number; top?: number; bottom?: number }>({ left: 0, bottom: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const left = Math.max(GAP, Math.min(rect.left, window.innerWidth - POPOVER_WIDTH - GAP));
    if (placement === "below") {
      setPosition({ left, top: rect.bottom + GAP });
    } else {
      setPosition({ left, bottom: window.innerHeight - rect.top + GAP });
    }
  }, [placement]);

  useEffect(() => {
    if (!open) return;

    const reposition = () => updatePosition();
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || popoverRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
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
  }, [open, updatePosition]);

  const toggle = () => {
    if (!open) {
      updatePosition();
      setPortalTarget(document.fullscreenElement ?? document.body);
    }
    setOpen((previous) => !previous);
  };

  const follow: FollowValue = mapSettings.autoCenter ? mapSettings.centerOn : "off";

  const selectFollow = (value: FollowValue) => {
    if (value === "off") {
      updateMapSettings({ ...mapSettings, autoCenter: false });
      return;
    }
    updateMapSettings({ ...mapSettings, centerOn: value, autoCenter: true });
  };

  const setLayer = (key: LayerKey, value: DisplayMode) => {
    updateMapSettings({ ...mapSettings, [key]: value });
  };

  return (
    <div ref={triggerRef} className={twMerge("absolute z-20", triggerClassName)}>
      <Button
        color="light"
        size={size === "sm" ? "xs" : "sm"}
        className="space-x-2 font-semibold"
        onClick={toggle}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <FaSliders className="size-3.5" />
        <span>Map options</span>
      </Button>

      {open &&
        portalTarget &&
        createPortal(
          <div
            ref={popoverRef}
            style={{ position: "fixed", left: position.left, top: position.top, bottom: position.bottom }}
            className={twMerge(
              "z-[1000] w-72 max-w-[calc(100vw-1rem)] rounded-xl border border-gray-200 bg-white p-1.5 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-150 dark:border-gray-700 dark:bg-gray-900",
              placement === "below" ? "motion-safe:slide-in-from-top-1" : "motion-safe:slide-in-from-bottom-1",
            )}
          >
            <div className="px-1">
              <p className={sectionLabel}>Follow</p>
              {followOptions.map((option) => {
                const active = follow === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => selectFollow(option.value)}
                    className={twMerge(
                      "flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors",
                      active
                        ? "font-semibold text-indigo-700 dark:text-indigo-300"
                        : "text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800",
                    )}
                  >
                    <option.icon
                      className={twMerge(
                        "size-3.5 shrink-0",
                        active ? "text-indigo-500" : "text-gray-400",
                        option.iconClassName,
                      )}
                    />
                    <span>{option.label}</span>
                    {active && <FaCheck className="ml-auto size-3 text-indigo-500" />}
                  </button>
                );
              })}
            </div>

            <div className="my-1 border-t border-gray-200 dark:border-gray-700" />

            <div className="px-1">
              <p className={sectionLabel}>Data layers</p>
              {layerRows.map((row) => (
                <div key={row.key} className="flex items-center justify-between gap-2 px-2 py-1">
                  <span className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-100">
                    <row.icon className="size-3.5 shrink-0 text-gray-400" />
                    {row.label}
                  </span>
                  <SegmentedControl
                    ariaLabel={row.label}
                    value={mapSettings[row.key]}
                    onChange={(value) => setLayer(row.key, value)}
                    options={displayOptions}
                  />
                </div>
              ))}
            </div>
          </div>,
          portalTarget,
        )}
    </div>
  );
}
