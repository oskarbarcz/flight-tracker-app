import {useEffect} from "react";

export default function changePageTitle(title: string, suffix: string = ' | Flight Tracker') {

  useEffect(() => {
    document.title = title+suffix;
  }, [title]);
}