export type FlightProgressTone = "indigo" | "warning" | "alternative";

export type FlightProgressButtonProps = {
  tone: FlightProgressTone;
  label?: string;
  confirmNote?: string;
};
