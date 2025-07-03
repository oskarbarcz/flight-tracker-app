export type Rotation = {
  id: string;
  name: string;
  pilotId: string;
};

export type CreateRotationDto = Omit<Rotation, "id">;
export type EditRotationDto = CreateRotationDto;
