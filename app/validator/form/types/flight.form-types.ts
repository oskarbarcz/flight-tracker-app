import { Loadsheet } from "~/models";

export type FlatLoadsheetFormData = {
  pilots: number;
  reliefPilots: number;
  cabinCrew: number;
  passengers: number;
  cargo: number;
  payload: number;
  zeroFuelWeight: number;
  blockFuel: number;
};

export function flatLoadsheetToLoadsheet(
  data: FlatLoadsheetFormData,
): Loadsheet {
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
  };
}

export function loadsheetToFlatLoadsheet(
  loadsheet: Loadsheet,
): FlatLoadsheetFormData {
  return {
    pilots: loadsheet.flightCrew.pilots,
    reliefPilots: loadsheet.flightCrew.reliefPilots,
    cabinCrew: loadsheet.flightCrew.cabinCrew,
    passengers: loadsheet.passengers,
    cargo: loadsheet.cargo,
    payload: loadsheet.payload,
    zeroFuelWeight: loadsheet.zeroFuelWeight,
    blockFuel: loadsheet.blockFuel,
  };
}
