import { Form } from "react-router";
import React, { useEffect, useState } from "react";
import {
  getTimeDifferenceInHours,
  getTimeDifferenceInMinutes,
} from "~/functions/time";
import { FilledSchedule } from "~/models";
import { FloatingLabel } from "flowbite-react";

type CheckInFlightFormProps = {
  estimation: FilledSchedule;
  setEstimation: (estimation: FilledSchedule) => void;
};

export default function CheckInFlightForm({
  estimation,
  setEstimation,
}: CheckInFlightFormProps) {
  const [offBlockTime, setOffBlockTime] = useState<string>(
    estimation.offBlockTime.toISOString(),
  );
  const [takeoffTime, setTakeoffTime] = useState<string>(
    estimation.takeoffTime.toISOString(),
  );
  const [arrivalTime, setArrivalTime] = useState<string>(
    estimation.arrivalTime.toISOString(),
  );
  const [onBlockTime, setOnBlockTime] = useState<string>(
    estimation.onBlockTime.toISOString(),
  );

  useEffect(() => {
    setEstimation({
      offBlockTime: new Date(offBlockTime),
      takeoffTime: new Date(takeoffTime),
      arrivalTime: new Date(arrivalTime),
      onBlockTime: new Date(onBlockTime),
    });
  }, [offBlockTime, takeoffTime, arrivalTime, onBlockTime, setEstimation]);

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
      <h2 className="mb-4 text-xl font-bold">Estimation</h2>
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
