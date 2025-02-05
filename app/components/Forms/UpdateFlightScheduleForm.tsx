import { Form } from "react-router";
import React, { useEffect, useState } from "react";
import {
  formatDate,
  getTimeDifferenceInHours,
  getTimeDifferenceInMinutes,
} from "~/functions/time";
import { FilledSchedule } from "~/models";
import { FloatingLabel } from "flowbite-react";

type UpdateFlightScheduleFormProps = {
  schedule: FilledSchedule;
  setSchedule: (schedule: FilledSchedule) => void;
};

export default function UpdateFlightScheduleForm({
  schedule,
  setSchedule,
}: UpdateFlightScheduleFormProps) {
  const [offBlockTime, setOffBlockTime] = useState<string>(
    formatDate(new Date(schedule.offBlockTime)),
  );
  const [takeoffTime, setTakeoffTime] = useState<string>(
    formatDate(new Date(schedule.takeoffTime)),
  );
  const [arrivalTime, setArrivalTime] = useState<string>(
    formatDate(new Date(schedule.arrivalTime)),
  );
  const [onBlockTime, setOnBlockTime] = useState<string>(
    formatDate(new Date(schedule.onBlockTime)),
  );

  useEffect(() => {
    setSchedule({ offBlockTime, takeoffTime, arrivalTime, onBlockTime });
  }, [offBlockTime, takeoffTime, arrivalTime, onBlockTime, setSchedule]);

  const taxiOutTime = getTimeDifferenceInMinutes(
    new Date(offBlockTime),
    new Date(takeoffTime),
  );
  const taxiOutColor = taxiOutTime < 0 ? "text-red-500" : "";

  const airTime = getTimeDifferenceInHours(
    new Date(takeoffTime),
    new Date(arrivalTime),
  );
  const airTimeColor = airTime.startsWith("-") ? "text-red-500" : "";

  const taxiInTime = getTimeDifferenceInMinutes(
    new Date(arrivalTime),
    new Date(onBlockTime),
  );
  const taxiInColor = taxiInTime < 0 ? "text-red-500" : "";

  const blockTime = getTimeDifferenceInHours(
    new Date(offBlockTime),
    new Date(onBlockTime),
  );

  return (
    <Form method="post">
      <h2 className="mb-4 text-xl font-bold">New schedule</h2>
      <FloatingLabel
        variant="outlined"
        label="Off-block time"
        className="dark:bg-gray-800"
        value={offBlockTime}
        onChange={(e) => setOffBlockTime(e.target.value)}
      />
      <p className="my-3 text-sm">
        <span>Taxi out: </span>
        {}
        <span className={`font-bold ${taxiOutColor}`}>
          {taxiOutTime} minutes
        </span>
      </p>
      <FloatingLabel
        variant="outlined"
        label="Takeoff time"
        className="dark:bg-gray-800"
        value={takeoffTime}
        onChange={(e) => setTakeoffTime(e.target.value)}
      />
      <p className="my-3 text-sm">
        <span>Air time: </span>
        <span className={`font-bold ${airTimeColor}`}>{airTime} hours</span>
      </p>
      <FloatingLabel
        variant="outlined"
        label="Landing time"
        className="dark:bg-gray-800"
        value={arrivalTime}
        onChange={(e) => setArrivalTime(e.target.value)}
      />
      <p className="my-3 text-sm">
        <span>Taxi in: </span>
        <span className={`font-bold ${taxiInColor}`}>{taxiInTime} minutes</span>
      </p>
      <FloatingLabel
        variant="outlined"
        label="On-block time"
        className="dark:bg-gray-800"
        value={onBlockTime}
        onChange={(e) => setOnBlockTime(e.target.value)}
      />
      <p className="my-3 text-sm">
        <span>Block time: </span>
        <span className="font-bold">{blockTime} hours</span>
      </p>
    </Form>
  );
}
