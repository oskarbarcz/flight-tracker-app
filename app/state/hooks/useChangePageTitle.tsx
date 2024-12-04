import { useEffect } from "react";

export const useChangePageTitle = (
  title: string,
  suffix: string = " | FlightModel Tracker",
) => {
  useEffect(() => {
    document.title = title + suffix;
  }, [title, suffix]);
};
