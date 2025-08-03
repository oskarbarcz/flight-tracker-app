import { createTheme } from "flowbite-react";
import { DeepPartial, FlowbiteTheme } from "flowbite-react/types";

export default function getAppTheme(): DeepPartial<FlowbiteTheme> {
  return createTheme({
    modal: {
      content: {
        inner:
          "rounded-3xl bg-white shadow-lg dark:bg-gray-800 border-indigo-500 dark:border-gray-700 text-gray-800 dark:text-gray-300 shadow-gray-500 dark:shadow-gray-900",
      },
      header: {
        base: "border-gray-200",
      },
      body: {
        base: "text-gray-800 dark:text-gray-200",
      },
    },
    tabs: {
      tablist: {
        tabitem: {
          base: "cursor-pointer",
        },
      },
    },
    table: {
      row: {
        base: "border-gray-300 dark:border-gray-700 dark:bg-gray-800",
      },
    },
  });
}
