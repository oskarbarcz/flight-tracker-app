import ModernControlledInputBlock from "~/components/Form/ModernControlledInputBlock";
import { Form } from "react-router";
import React, { useEffect, useState } from "react";
import {
  formatDate,
  getTimeDifferenceInHours,
  getTimeDifferenceInMinutes,
} from "~/functions/time";
import { FilledSchedule } from "~/models";

type CheckInFlightFormProps = {
  estimation: FilledSchedule;
  setEstimation: (estimation: FilledSchedule) => void;
};

export default function CheckInFlightForm({
  estimation,
  setEstimation,
}: CheckInFlightFormProps) {
  const [offBlockTime, setOffBlockTime] = useState<string>(
    formatDate(new Date(estimation.offBlockTime)),
  );
  const [takeoffTime, setTakeoffTime] = useState<string>(
    formatDate(new Date(estimation.takeoffTime)),
  );
  const [arrivalTime, setArrivalTime] = useState<string>(
    formatDate(new Date(estimation.arrivalTime)),
  );
  const [onBlockTime, setOnBlockTime] = useState<string>(
    formatDate(new Date(estimation.onBlockTime)),
  );

  useEffect(() => {
    setEstimation({
      offBlockTime,
      takeoffTime,
      arrivalTime,
      onBlockTime,
    });
  }, [offBlockTime, takeoffTime, arrivalTime, onBlockTime, setEstimation]);

  const taxiOutTime = getTimeDifferenceInMinutes(
    new Date(offBlockTime),
    new Date(takeoffTime),
  );
  const taxiOutColor = taxiOutTime < 0 ? "text-red-500" : "";

  const blockTime = getTimeDifferenceInHours(
    new Date(takeoffTime),
    new Date(arrivalTime),
  );
  const blockTimeColor = blockTime.startsWith("-") ? "text-red-500" : "";

  const taxiInTime = getTimeDifferenceInMinutes(
    new Date(arrivalTime),
    new Date(onBlockTime),
  );
  const taxiInColor = taxiInTime < 0 ? "text-red-500" : "";

  return (
    <Form method="post">
      <h2 className="mb-4 text-xl font-bold">Estimation</h2>
      <ModernControlledInputBlock
        htmlName="offBlockTime"
        label="Off-block time"
        value={offBlockTime}
        changeValue={setOffBlockTime}
      />
      <div className="my-3 text-sm">
        <span>Taxi out: </span>
        {}
        <span className={`font-bold ${taxiOutColor}`}>
          {taxiOutTime} minutes
        </span>
      </div>
      <ModernControlledInputBlock
        htmlName="takeoffTime"
        label="Takeoff time"
        value={takeoffTime}
        changeValue={setTakeoffTime}
      />
      <div className="my-3 text-sm">
        <span>Air time: </span>
        <span className={`font-bold ${blockTimeColor}`}>{blockTime} hours</span>
      </div>
      <ModernControlledInputBlock
        htmlName="arrivalTime"
        label="Landing time"
        value={arrivalTime}
        changeValue={setArrivalTime}
      />
      <div className="my-3 text-sm">
        <span>Taxi in: </span>
        <span className={`font-bold ${taxiInColor}`}>{taxiInTime} minutes</span>
      </div>
      <ModernControlledInputBlock
        htmlName="onBlockTime"
        label="On-block time"
        value={onBlockTime}
        changeValue={setOnBlockTime}
      />
    </Form>
  );
}
