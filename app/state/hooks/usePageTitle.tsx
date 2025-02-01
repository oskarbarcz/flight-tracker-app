import { useEffect } from "react";

export const usePageTitle = (
  title: string,
  suffix: string = " | Flight Tracker",
) => {
  useEffect(() => {
    document.title = title + suffix;
  }, [title, suffix]);
};
