import { array, date, number, type ObjectSchema, object, ref, string } from "yup";
import type { FilledSchedule } from "~/features/flight";
import type { CreateFlightFormData } from "~/features/flight/form";

export const newFlightIdentitySchema: ObjectSchema<CreateFlightFormData["identity"]> = object({
  flightNumber: string().required("Flight number is required"),
  callsign: string().required("Callsign is required"),
  aircraftId: string().uuid("Invalid aircraft").required("Aircraft is required"),
  operatorId: string().uuid("Invalid operators").required("Operator is required"),
});

export const newFlightRouteSchema: ObjectSchema<CreateFlightFormData["route"]> = object({
  departureAirportId: string().uuid("Invalid departure airport").required("Departure airport is required"),

  destinationAirportId: string()
    .uuid("Invalid destination airport")
    .required("Destination airport is required")
    .notOneOf([ref("departureAirportId")], "Departure and destination must be different"),

  destinationAlternates: array()
    .of(
      object({
        id: string().defined(),
        airportId: string().uuid("Invalid alternate airport").required("Select an alternate airport"),
      }),
    )
    .defined()
    .default([]),

  etopsEntryAirportId: string().defined().default(""),
  etopsExitAirportId: string()
    .defined()
    .default("")
    .when("etopsEntryAirportId", ([etopsEntryAirportId], schema) =>
      etopsEntryAirportId ? schema.required("ETOPS exit is required when ETOPS entry is set") : schema,
    ),
  enrouteAlternateAirportId: string().defined().default(""),
});

export const newFlightScheduleSchema: ObjectSchema<CreateFlightFormData["schedule"]> = object({
  offBlockTime: date().required("Off-block time is required"),
  takeoffTime: date().required("Takeoff time is required").min(ref("offBlockTime"), "Takeoff must be after off-block"),
  arrivalTime: date().required("Landing time is required").min(ref("takeoffTime"), "Landing must be after takeoff"),
  onBlockTime: date().required("On-block time is required").min(ref("arrivalTime"), "On-block must be after landing"),
});

export const updateScheduleSchema: ObjectSchema<FilledSchedule> = object().shape({
  offBlockTime: date().required("Off-block time is required"),
  takeoffTime: date().required("Takeoff time is required").min(ref("offBlockTime"), "Takeoff must be after off-block"),
  arrivalTime: date().required("Landing time is required").min(ref("takeoffTime"), "Landing must be after takeoff"),
  onBlockTime: date().required("On-block time is required").min(ref("arrivalTime"), "On-block must be after landing"),
});

const maxThreeDecimals = (value: number | undefined): boolean =>
  value === undefined || Math.round(Number(value) * 1000) / 1000 === Number(value);

const nonNegativeTons = (label: string) =>
  number()
    .required(`${label} is required`)
    .min(0, "Cannot be negative")
    .test("max-decimals", "Maximum 3 decimal places allowed", maxThreeDecimals);

const optionalNonNegativeTons = () =>
  number()
    .transform((value, original) => (original === "" ? undefined : value))
    .default(0)
    .min(0, "Cannot be negative")
    .test("max-decimals", "Maximum 3 decimal places allowed", maxThreeDecimals);

export const updatePreliminaryLoadsheetSchema = object().shape({
  pilots: number()
    .required("Number of pilots is required")
    .integer("Must be a whole number")
    .min(1, "At least 1 pilot is required")
    .max(4, "Maximum 4 pilots allowed"),

  reliefPilots: number()
    .required("Number of relief pilots is required")
    .integer("Must be a whole number")
    .min(0, "Cannot be negative")
    .max(8, "Maximum 8 relief pilots allowed"),

  cabinCrew: number()
    .required("Number of cabin crew is required")
    .integer("Must be a whole number")
    .min(0, "Cannot be negative")
    .max(40, "Maximum 40 cabin crew allowed"),

  passengers: number()
    .required("Number of passengers is required")
    .integer("Must be a whole number")
    .min(0, "Cannot be negative")
    .max(1000, "Maximum 1000 passengers allowed"),

  cargo: number()
    .required("Cargo weight is required")
    .min(0, "Cannot be negative")
    .test(
      "max-decimals",
      "Maximum 3 decimal places allowed",
      (value) => value === undefined || Math.round(Number(value) * 1000) / 1000 === Number(value),
    ),

  payload: number()
    .required("Payload is required")
    .min(0, "Cannot be negative")
    .test(
      "max-decimals",
      "Maximum 3 decimal places allowed",
      (value) => value === undefined || Math.round(Number(value) * 1000) / 1000 === Number(value),
    ),

  zeroFuelWeight: number()
    .required("Zero fuel weight is required")
    .positive("Must be a positive number")
    .test(
      "max-decimals",
      "Maximum 3 decimal places allowed",
      (value) => value === undefined || Math.round(Number(value) * 1000) / 1000 === Number(value),
    ),

  blockFuel: number()
    .required("Block fuel is required")
    .positive("Must be a positive number")
    .test(
      "max-decimals",
      "Maximum 3 decimal places allowed",
      (value) => value === undefined || Math.round(Number(value) * 1000) / 1000 === Number(value),
    ),

  trip: nonNegativeTons("Trip fuel"),
  taxi: nonNegativeTons("Taxi fuel"),
  alternate: nonNegativeTons("Alternate fuel"),
  reserve: nonNegativeTons("Final reserve"),
  contingencyAmount: nonNegativeTons("Contingency fuel"),
  contingencyType: string().defined(),
  mel: nonNegativeTons("MEL fuel"),
  atc: nonNegativeTons("ATC fuel"),
  wxx: nonNegativeTons("Weather fuel"),
  extra: nonNegativeTons("Extra fuel"),
  etops: optionalNonNegativeTons(),
  tankering: nonNegativeTons("Tankering fuel"),
  averageFuelFlow: optionalNonNegativeTons(),
  maxTanks: optionalNonNegativeTons(),
});
