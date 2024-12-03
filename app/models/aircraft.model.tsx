export interface Aircraft {
  icaoCode: string;
  shortName: string;
  fullName: string;
  registration: string;
  selcal: string|null;
  livery: string|null;
}