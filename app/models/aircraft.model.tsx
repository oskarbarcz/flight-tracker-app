export type Aircraft = {
  id: string;
  icaoCode: string;
  shortName: string;
  fullName: string;
  registration: string;
  selcal: string;
  livery: string;
};

export type CreateAircraftRequest = Omit<Aircraft, "id">;
export type EditAircraftRequest = CreateAircraftRequest;
