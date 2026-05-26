import { Button, Tooltip } from "flowbite-react";
import type { ReactNode } from "react";
import { FaChevronRight, FaEyeSlash } from "react-icons/fa6";
import type { DisplayMode } from "~/state/app/context/useMapSettings";

type Props = {
  size?: "sm" | "md";
  value: DisplayMode;
  onChange: (mode: DisplayMode) => void;
  expanded: boolean;
  onToggleExpanded: () => void;
  masterIcon: ReactNode;
  assignedIcon: ReactNode;
  labels: { all: string; assigned: string; none: string };
  tooltips: {
    masterExpand: string;
    masterCollapse: string;
    all: string;
    assigned: string;
    none: string;
  };
};

function sizeToButtonSize(size: "sm" | "md") {
  switch (size) {
    case "sm":
      return "xs";
    case "md":
      return "sm";
  }
}

export function DisplayModeToggle({
  size = "md",
  value,
  onChange,
  expanded,
  onToggleExpanded,
  masterIcon,
  assignedIcon,
  labels,
  tooltips,
}: Props) {
  const isAll = value === "all";
  const isAssigned = value === "assigned";
  const isNone = value === "none";

  const masterButton = (
    <Button color={isNone ? "alternative" : "indigo"} size={sizeToButtonSize(size)} onClick={onToggleExpanded}>
      {isNone ? <FaEyeSlash /> : masterIcon}
    </Button>
  );

  const allButton = (
    <Button
      color={isAll ? "indigo" : "alternative"}
      onClick={() => onChange("all")}
      size={sizeToButtonSize(size)}
      className="space-x-2 font-bold"
    >
      {masterIcon}
      <span>{labels.all}</span>
    </Button>
  );

  const assignedButton = (
    <Button
      color={isAssigned ? "indigo" : "alternative"}
      onClick={() => onChange("assigned")}
      size={sizeToButtonSize(size)}
      className="space-x-2 font-bold"
    >
      {assignedIcon}
      <span>{labels.assigned}</span>
    </Button>
  );

  const noneButton = (
    <Button
      color={isNone ? "indigo" : "alternative"}
      onClick={() => onChange("none")}
      size={sizeToButtonSize(size)}
      className="space-x-2 font-bold"
    >
      <FaEyeSlash />
      <span>{labels.none}</span>
    </Button>
  );

  return (
    <div className="flex gap-3 items-center pointer-events-auto">
      <div className="hidden md:block">
        <Tooltip content={expanded ? tooltips.masterCollapse : tooltips.masterExpand} style="auto" placement="top">
          {masterButton}
        </Tooltip>
      </div>
      <div className="md:hidden">{masterButton}</div>

      {expanded && (
        <div className="flex gap-3 items-center animate-in fade-in slide-in-from-left-4 duration-300">
          <FaChevronRight className="text-gray-500 w-2 h-4" />
          <div className="hidden md:block">
            <Tooltip content={tooltips.all} style="auto" placement="top">
              {allButton}
            </Tooltip>
          </div>
          <div className="md:hidden">{allButton}</div>
          <div className="hidden md:block">
            <Tooltip content={tooltips.assigned} style="auto" placement="top">
              {assignedButton}
            </Tooltip>
          </div>
          <div className="md:hidden">{assignedButton}</div>
          <div className="hidden md:block">
            <Tooltip content={tooltips.none} style="auto" placement="top">
              {noneButton}
            </Tooltip>
          </div>
          <div className="md:hidden">{noneButton}</div>
        </div>
      )}
    </div>
  );
}
