import React, { JSX } from "react";
import { FaGlobe, FaPlane, FaRegCalendarAlt } from "react-icons/fa";
import { MdOutlineHub } from "react-icons/md";
import RichStatDisplay from "~/components/shared/Display/RichStatDisplay";
import { continentToDisplayName, Operator } from "~/models";

type Props = {
  operator: Operator;
};

export function OperatorInsights({ operator }: Props): JSX.Element {
  const hubs =
    operator.hubs.length > 2
      ? operator.hubs.slice(0, 2).join(", ") + ", ..."
      : operator.hubs.join(", ");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      <RichStatDisplay
        icon={MdOutlineHub}
        color="indigo"
        title="Operator hubs"
        value={hubs}
        valueSmaller
      />
      <RichStatDisplay
        icon={FaPlane}
        color="green"
        title="Fleet size"
        value={String(operator.fleetSize)}
        valueSuffix="Aircraft"
      />
      <RichStatDisplay
        icon={FaRegCalendarAlt}
        color="orange"
        title="Avg fleet age"
        value={String(operator.avgFleetAge)}
        valueSuffix="Years"
      />
      <RichStatDisplay
        icon={FaGlobe}
        color="blue"
        title="Region"
        value={continentToDisplayName(operator.continent)}
        valueSmaller
      />
    </div>
  );
}
