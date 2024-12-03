import {useEffect} from "react";

export default function changePageTitle(title: string, suffix: string = ' | FlightModel Tracker') {

  useEffect(() => {
    document.title = title+suffix;
  }, [title]);
}