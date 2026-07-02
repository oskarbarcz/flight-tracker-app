import { useEffect } from "react";
import { PAGE_TITLE_SUFFIX } from "~/consts";

export const usePageTitle = (title: string, suffix: string = PAGE_TITLE_SUFFIX) => {
  useEffect(() => {
    document.title = title + suffix;
  }, [title, suffix]);
};
