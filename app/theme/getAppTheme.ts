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
    tooltip: {
      base: "z-100",
    },
    buttonGroup: {
      base: "shadow-none",
    },
    button: {
      base: "cursor-pointer",
      color: {
        alternative:
          "bg-gray-200 hover:bg-gray-300 dark:bg-gray-900 dark:hover:bg-gray-800 text-sm text-gray-800 hover:text-gray-900 dark:text-gray-300 border-0",
      },
      outlineColor: {
        indigo:
          "bg-indigo-100 border-indigo-100 dark:border-indigo-700 dark:bg-indigo-700 text-indigo-600 dark:text-indigo-100 hover:bg-indigo-200 hover:text-indigo-600 hover:border-indigo-200 dark:hover:border-indigo-500 dark:hover:bg-indigo-500 dark:hover:text-indigo-50 focus:ring-indigo-300 dark:focus:ring-indigo-700",
        gray: "bg-gray-200 text-gray-800 border-gray-200 hover:text-gray-800 hover:bg-gray-300 hover:border-gray-300 focus:ring-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-600 dark:hover:border-gray-600 dark:focus:ring-gray-500",
      },
    },
  });
}
