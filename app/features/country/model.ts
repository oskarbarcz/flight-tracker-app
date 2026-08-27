export type CountryRef = {
  code: string;
  name: string;
};

export type Country = CountryRef & {
  flag: string;
  continent: string;
};
