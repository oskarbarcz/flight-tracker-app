import type { Loadsheet } from "~/features/flight";

export type FlatLoadsheetFormData = {
  pilots: number;
  reliefPilots: number;
  cabinCrew: number;
  passengers: number;
  cargo: number;
  payload: number;
  zeroFuelWeight: number;
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

function toNumber(value: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function flatLoadsheetToLoadsheet(data: FlatLoadsheetFormData): Loadsheet {
  const taxi = toNumber(data.taxi);
  const trip = toNumber(data.trip);
  const alternate = toNumber(data.alternate);
  const reserve = toNumber(data.reserve);
  const contingencyAmount = toNumber(data.contingencyAmount);
  const mel = toNumber(data.mel);
  const atc = toNumber(data.atc);
  const wxx = toNumber(data.wxx);
  const extra = toNumber(data.extra);
  const etops = toNumber(data.etops);
  const tankering = toNumber(data.tankering);

  const block = roundTons(
    taxi + trip + alternate + reserve + contingencyAmount + mel + atc + wxx + extra + etops + tankering,
  );
  const minTakeoff = roundTons(trip + contingencyAmount + alternate + reserve);
  const planTakeoff = roundTons(block - taxi);
  const planLanding = roundTons(planTakeoff - trip);

  return {
    flightCrew: {
      pilots: toNumber(data.pilots),
      reliefPilots: toNumber(data.reliefPilots),
      cabinCrew: toNumber(data.cabinCrew),
    },
    passengers: toNumber(data.passengers),
    cargo: roundTons(toNumber(data.cargo)),
    payload: roundTons(toNumber(data.payload)),
    zeroFuelWeight: roundTons(toNumber(data.zeroFuelWeight)),
    blockFuel: block,
    fuel: {
      block,
      taxi,
      trip,
      alternate,
      reserve,
      contingencyType: data.contingencyType.trim() === "" ? null : data.contingencyType.trim(),
      contingencyAmount,
      mel,
      atc,
      wxx,
      extra,
      tankering,
      etops,
      minTakeoff,
      planTakeoff,
      planLanding,
      averageFuelFlow: toNumber(data.averageFuelFlow),
      maxTanks: toNumber(data.maxTanks),
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
