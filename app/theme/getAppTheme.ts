import { createTheme } from "flowbite-react";
import { DeepPartial, FlowbiteTheme } from "flowbite-react/types";

export default function getAppTheme(): DeepPartial<FlowbiteTheme> {
  return createTheme({
    modal: {
      content: {
        inner:
          "rounded-xl bg-white shadow-lg dark:bg-gray-800 border-indigo-500 dark:border-gray-700 text-gray-800 dark:text-gray-300 shadow-gray-500 dark:shadow-gray-900",
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
    buttonGroup: {
      base: "shadow-none",
    },
    button: {
      base: "cursor-pointer",
      color: {
        indigo:
          "bg-indigo-100 dark:bg-indigo-700 text-indigo-600 dark:text-indigo-100 hover:bg-indigo-200 hover:text-indigo-800 dark:hover:bg-indigo-500 dark:hover:text-indigo-50 focus:ring-indigo-200 dark:focus:ring-indigo-500",
      },
    },
  });
}
