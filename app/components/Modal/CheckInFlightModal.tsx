"use client";

import React, { useCallback, useState } from "react";
import { FilledSchedule, FilledScheduleWithoutTypes, Flight } from "~/models";
import { formatDate } from "~/functions/time";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import CheckInFlightForm from "~/components/Forms/CheckInFlightForm";

type CheckInFlightModalProps = {
  flight: Flight;
  checkIn: (estimation: FilledSchedule) => void;
  close: () => void;
};

export default function CheckInFlightModal({
  flight,
  checkIn,
  close,
}: CheckInFlightModalProps) {
  const schedule = flight.timesheet.scheduled;
  const [estimation, setEstimation] =
    useState<FilledScheduleWithoutTypes>(schedule);

  return (
    <Modal show onClose={close}>
      <ModalHeader>Check in for flight</ModalHeader>
      <ModalBody>
        <div className="flex flex-col gap-4 text-gray-800 dark:text-white md:flex-row">
          <div className="w-full md:w-1/2">
            <h2 className="mb-4 text-xl font-bold">Schedule</h2>
            <div className="mb-3">
              <span className="block text-xs font-bold uppercase">
                Off-block time
              </span>
              <span className="block text-lg text-gray-600 dark:text-gray-400">
                {formatDate(new Date(schedule.offBlockTime))}
              </span>
            </div>
            <div className="mb-3">
              <span className="block text-xs font-bold uppercase">
                Takeoff time
              </span>
              <span className="block text-lg text-gray-600 dark:text-gray-400">
                {formatDate(new Date(schedule.takeoffTime))}
              </span>
            </div>
            <div className="mb-3">
              <span className="block text-xs font-bold uppercase">
                Landing time
              </span>
              <span className="block text-lg text-gray-600 dark:text-gray-400">
                {formatDate(new Date(schedule.arrivalTime))}
              </span>
            </div>
            <div className="mb-3">
              <span className="block text-xs font-bold uppercase">
                On-block time
              </span>
              <span className="block text-lg text-gray-600 dark:text-gray-400">
                {formatDate(new Date(schedule.onBlockTime))}
              </span>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <CheckInFlightForm
              estimation={estimation}
              setEstimation={useCallback(
                (estimation: FilledScheduleWithoutTypes) => {
                  setEstimation(estimation);
                },
                [],
              )}
            />
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <span className="font-bold">Caution!</span>{" "}
          <span>All times must be provided in UTC.</span>
        </p>
      </ModalBody>
      <ModalFooter>
        <div className="ms-auto flex gap-2">
          <Button color="gray" outline onClick={close}>
            Back to preview
          </Button>
          <Button
            type="submit"
            color="indigo"
            outline
            onClick={() =>
              checkIn({
                offBlockTime: new Date(estimation.offBlockTime),
                takeoffTime: new Date(estimation.takeoffTime),
                arrivalTime: new Date(estimation.arrivalTime),
                onBlockTime: new Date(estimation.onBlockTime),
              })
            }
          >
            Check in for flight
            <span className="font-mono font-bold ms-2">
              {flight.flightNumberWithoutSpaces}
            </span>
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
