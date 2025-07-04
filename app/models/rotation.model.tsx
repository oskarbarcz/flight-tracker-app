type Pilot = {
  id: string;
  name: string;
  pilotLicenseId: string;
};

type RotationFlight = {
  id: string,
  flightNumber: string,
}

export type Rotation = {
  id: string;
  name: string;
  pilotId: string;
  pilot: Pilot;
  flights: RotationFlight[];
  createdAt: string;
  updatedAt: string | null;
};

export type CreateRotationRequest = Omit<Rotation, "id" | "pilot">;
export type EditRotationRequest = CreateRotationRequest;
export type RotationResponse = Omit<Rotation, "pilotId">;
