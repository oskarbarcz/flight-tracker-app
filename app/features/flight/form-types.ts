import type { Loadsheet } from "~/features/flight";

export type FlatLoadsheetFormData = {
  pilots: number;
  reliefPilots: number;
  cabinCrew: number;
  passengers: number;
  cargo: number;
  payload: number;
  zeroFuelWeight: number;
  blockFuel: number;
  trip: number;
  taxi: number;
  alternate: number;
  reserve: number;
  contingencyAmount: number;
  contingencyType: string;
  mel: number;
  atc: number;
  wxx: number;
  extra: number;
  etops: number;
  tankering: number;
  averageFuelFlow: number;
  maxTanks: number;
};

export type FlatCloseFlightFormData = {
  actualFuelBurned: number | "";
};

export function initCloseFlightData(): FlatCloseFlightFormData {
  return { actualFuelBurned: "" };
}

export function closeFlightFormDataToActualFuelBurned(data: FlatCloseFlightFormData): number {
  return Number(data.actualFuelBurned);
}

function roundTons(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function toTons(value: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function flatLoadsheetToLoadsheet(data: FlatLoadsheetFormData): Loadsheet {
  const etops = toTons(data.etops);
  const averageFuelFlow = toTons(data.averageFuelFlow);
  const maxTanks = toTons(data.maxTanks);
  const minTakeoff = roundTons(
    data.trip + data.contingencyAmount + data.alternate + data.reserve + data.mel + data.atc + data.wxx + etops,
  );
  const planTakeoff = roundTons(data.blockFuel - data.taxi);
  const planLanding = roundTons(planTakeoff - data.trip);

  return {
    flightCrew: {
      pilots: data.pilots,
      reliefPilots: data.reliefPilots,
      cabinCrew: data.cabinCrew,
    },
    passengers: data.passengers,
    cargo: data.cargo,
    payload: data.payload,
    zeroFuelWeight: data.zeroFuelWeight,
    blockFuel: data.blockFuel,
    fuel: {
      block: data.blockFuel,
      taxi: data.taxi,
      trip: data.trip,
      alternate: data.alternate,
      reserve: data.reserve,
      contingencyType: data.contingencyType.trim() === "" ? null : data.contingencyType.trim(),
      contingencyAmount: data.contingencyAmount,
      mel: data.mel,
      atc: data.atc,
      wxx: data.wxx,
      extra: data.extra,
      tankering: data.tankering,
      etops,
      minTakeoff,
      planTakeoff,
      planLanding,
      averageFuelFlow,
      maxTanks,
    },
  };
}

export function loadsheetToFlatLoadsheet(loadsheet: Loadsheet): FlatLoadsheetFormData {
  const fuel = loadsheet.fuel;

  return {
    pilots: loadsheet.flightCrew.pilots,
    reliefPilots: loadsheet.flightCrew.reliefPilots,
    cabinCrew: loadsheet.flightCrew.cabinCrew,
    passengers: loadsheet.passengers,
    cargo: loadsheet.cargo,
    payload: loadsheet.payload,
    zeroFuelWeight: loadsheet.zeroFuelWeight,
    blockFuel: loadsheet.blockFuel,
    trip: fuel?.trip ?? 0,
    taxi: fuel?.taxi ?? 0,
    alternate: fuel?.alternate ?? 0,
    reserve: fuel?.reserve ?? 0,
    contingencyAmount: fuel?.contingencyAmount ?? 0,
    contingencyType: fuel?.contingencyType ?? "",
    mel: fuel?.mel ?? 0,
    atc: fuel?.atc ?? 0,
    wxx: fuel?.wxx ?? 0,
    extra: fuel?.extra ?? 0,
    etops: fuel?.etops ?? 0,
    tankering: fuel?.tankering ?? 0,
    averageFuelFlow: fuel?.averageFuelFlow ?? 0,
    maxTanks: fuel?.maxTanks ?? 0,
  };
}
