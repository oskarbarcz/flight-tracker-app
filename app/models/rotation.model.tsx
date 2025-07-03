export type Pilot = {
  id: string;
  name: string;
  pilotLicenseId: string;
};

export type Rotation = {
  id: string;
  name: string;
  pilotId: string;
  pilot: Pilot;
};

export type CreateRotationRequest = Omit<Rotation, "id" | "pilot">;
export type EditRotationRequest = CreateRotationRequest;
export type RotationResponse = Omit<Rotation, "pilotId">;
