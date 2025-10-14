import { Form } from "react-router";
import React, { useEffect, useState } from "react";
import { Loadsheet } from "~/models";
import { FloatingLabel } from "flowbite-react";

type UpdateFlightLoadsheetFormProps = {
  loadsheet: Loadsheet;
  setLoadsheet: (loadsheet: Loadsheet) => void;
};

export default function FlightLoadsheetForm({
  loadsheet,
  setLoadsheet,
}: UpdateFlightLoadsheetFormProps) {
  const [pilots, setPilots] = useState<number>(loadsheet.flightCrew.pilots);
  const [reliefPilots, setReliefPilots] = useState<number>(
    loadsheet.flightCrew.reliefPilots,
  );
  const [cabinCrew, setCabinCrew] = useState<number>(
    loadsheet.flightCrew.cabinCrew,
  );
  const [passengers, setPassengers] = useState<number>(loadsheet.passengers);
  const [zeroFuelWeight, setZeroFuelWeight] = useState<number>(
    loadsheet.zeroFuelWeight,
  );
  const [cargo, setCargo] = useState<number>(loadsheet.cargo);
  const [payload, setPayload] = useState<number>(loadsheet.payload);
  const [blockFuel, setBlockFuel] = useState<number>(loadsheet.blockFuel);

  useEffect(() => {
    setLoadsheet({
      flightCrew: { pilots, reliefPilots, cabinCrew },
      passengers,
      zeroFuelWeight,
      cargo,
      payload,
      blockFuel,
    });
  }, [
    pilots,
    reliefPilots,
    cabinCrew,
    passengers,
    zeroFuelWeight,
    cargo,
    payload,
    blockFuel,
    setLoadsheet,
  ]);

  return (
    <Form method="post">
      <h3 className="mb-6 text-xl font-bold text-gray-700 dark:text-gray-300">
        Souls on board
      </h3>
      <div className="flex gap-4">
        <FloatingLabel
          variant="outlined"
          label="Pilots"
          className="dark:bg-gray-800"
          type="number"
          value={pilots}
          onChange={(e) => setPilots(Number(e.target.value))}
        />
        <FloatingLabel
          variant="outlined"
          label="Relief pilots"
          className="dark:bg-gray-800"
          type="number"
          value={reliefPilots}
          onChange={(e) => setReliefPilots(Number(e.target.value))}
        />
      </div>
      <div className="my-4 flex gap-4">
        <FloatingLabel
          variant="outlined"
          label="Cabin crew"
          className="dark:bg-gray-800"
          type="number"
          value={cabinCrew}
          onChange={(e) => setCabinCrew(Number(e.target.value))}
        />
        <FloatingLabel
          variant="outlined"
          label="Passengers"
          className="dark:bg-gray-800"
          type="number"
          value={passengers}
          onChange={(e) => setPassengers(Number(e.target.value))}
        />
      </div>
      <h3 className="mb-4 text-xl font-bold text-gray-700 dark:text-gray-300">
        Weights
      </h3>
      <div className="flex gap-4">
        <FloatingLabel
          variant="outlined"
          label="Zero-fuel weight [tons]"
          className="dark:bg-gray-800"
          type="number"
          value={zeroFuelWeight}
          onChange={(e) => setZeroFuelWeight(Number(e.target.value))}
        />
        <FloatingLabel
          variant="outlined"
          label="Cargo [tons]"
          className="dark:bg-gray-800"
          type="number"
          value={cargo}
          onChange={(e) => setCargo(Number(e.target.value))}
        />
      </div>
      <div className="mt-4 flex gap-4">
        <FloatingLabel
          variant="outlined"
          label="Payload [tons]"
          className="dark:bg-gray-800"
          type="number"
          value={payload}
          onChange={(e) => setPayload(Number(e.target.value))}
        />
        <FloatingLabel
          variant="outlined"
          label="Block fuel [tons]"
          className="dark:bg-gray-800"
          type="number"
          value={blockFuel}
          onChange={(e) => setBlockFuel(Number(e.target.value))}
        />
      </div>
    </Form>
  );
}
