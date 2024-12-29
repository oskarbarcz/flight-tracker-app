export interface Aircraft {
  id: string;
  icaoCode: string;
  shortName: string;
  fullName: string;
  registration: string;
  selcal: string | null;
  livery: string | null;
}
