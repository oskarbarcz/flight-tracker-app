export type CreateFlightFormData = {
  isIdentitySubmitted: boolean;
  isRouteSubmitted: boolean;
  isScheduleSubmitted: boolean;
  identity: {
    flightNumber: string;
    callsign: string;
    aircraftId: string;
    operatorId: string;
  };
  route: {
    departureAirportId: string;
    destinationAirportId: string;
  };
  schedule: {
    offBlockTime: Date;
    takeoffTime: Date;
    arrivalTime: Date;
    onBlockTime: Date;
  };
};

export function initCreateFlightData(): CreateFlightFormData {
  const currentDate = new Date();
  currentDate.setSeconds(0, 0);

  return {
    isIdentitySubmitted: false,
    isRouteSubmitted: false,
    isScheduleSubmitted: false,
    identity: {
      flightNumber: "",
      callsign: "",
      aircraftId: "",
      operatorId: "",
    },
    route: {
      departureAirportId: "",
      destinationAirportId: "",
    },
    schedule: {
      offBlockTime: currentDate,
      takeoffTime: currentDate,
      arrivalTime: currentDate,
      onBlockTime: currentDate,
    },
  };
}
