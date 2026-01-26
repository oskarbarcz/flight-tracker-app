export type Operator = {
  id: string;
  icaoCode: string;
  iataCode: string;
  shortName: string;
  fullName: string;
  callsign: string;
};

export type CreateOperatorDto = Omit<Operator, "id">;
export type EditOperatorDto = CreateOperatorDto;
