"use client";

import ManagedDateTimeInputBlock from "~/components/Intrinsic/Form/Managed/ManagedDateTimeInputBlock";
import { useFormikContext } from "formik";
import { FilledSchedule } from "~/models";
import {
  getTimeDifferenceInHours,
  getTimeDifferenceInMinutes,
} from "~/functions/time";

export default function UpdateFlightScheduleForm() {
  const { values } = useFormikContext<FilledSchedule>();

  const taxiOutTime = getTimeDifferenceInMinutes(
    values.offBlockTime,
    values.takeoffTime,
  );
  const taxiOutColor = taxiOutTime < 0 ? "text-red-500" : "";

  const airTime = getTimeDifferenceInHours(
    values.takeoffTime,
    values.arrivalTime,
  );
  const airTimeColor = airTime.startsWith("-") ? "text-red-500" : "";

  const taxiInTime = getTimeDifferenceInMinutes(
    values.arrivalTime,
    values.onBlockTime,
  );
  const taxiInColor = taxiInTime < 0 ? "text-red-500" : "";

  const blockTime = getTimeDifferenceInHours(
    values.offBlockTime,
    values.onBlockTime,
  );

  return (
    <div className="space-y-4">
      <ManagedDateTimeInputBlock
        field="offBlockTime"
        label="Off-block time [zulu]"
        autoComplete="off"
        required
      />

      <p className=" text-sm">
        <span>Taxi out: </span>
        <span className={`font-bold ${taxiOutColor}`}>
          {taxiOutTime} minutes
        </span>
      </p>

      <ManagedDateTimeInputBlock
        field="takeoffTime"
        label="Takeoff time [zulu]"
        autoComplete="off"
        required
      />

      <p className="text-sm">
        <span>Air time: </span>
        <span className={`font-bold ${airTimeColor}`}>{airTime} hours</span>
      </p>

      <ManagedDateTimeInputBlock
        field="arrivalTime"
        label="Landing time [zulu]"
        autoComplete="off"
        required
      />

      <p className="text-sm">
        <span>Taxi in: </span>
        <span className={`font-bold ${taxiInColor}`}>{taxiInTime} minutes</span>
      </p>

      <ManagedDateTimeInputBlock
        field="onBlockTime"
        label="On-block time [zulu]"
        autoComplete="off"
        required
      />

      <p className="text-sm">
        <span>Block time: </span>
        <span className="font-bold">{blockTime} hours</span>
      </p>
    </div>
  );
}
