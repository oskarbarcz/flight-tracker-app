import { date, object, ObjectSchema, ref } from "yup";
import { FilledSchedule } from "~/models";

export const updateScheduleSchema: ObjectSchema<FilledSchedule> =
  object().shape({
    offBlockTime: date().required("Off-block time is required"),
    takeoffTime: date()
      .required("Takeoff time is required")
      .min(ref("offBlockTime"), "Takeoff must be after off-block"),
    arrivalTime: date()
      .required("Landing time is required")
      .min(ref("takeoffTime"), "Landing must be after takeoff"),
    onBlockTime: date()
      .required("On-block time is required")
      .min(ref("arrivalTime"), "On-block must be after landing"),
  });
