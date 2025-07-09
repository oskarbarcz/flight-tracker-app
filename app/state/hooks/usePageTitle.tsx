import { useEffect } from "react";

export const usePageTitle = (
  title: string,
  suffix: string = " | FlightTracker",
) => {
  useEffect(() => {
    document.title = title + suffix;
  }, [title, suffix]);
};
