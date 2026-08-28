import { createTheme } from "flowbite-react";
import type { DeepPartial, FlowbiteTheme } from "flowbite-react/types";

export default function theme(): DeepPartial<FlowbiteTheme> {
  return createTheme({
    drawer: {
      root: {
        position: {
          left: {
            on: "left-0 top-0 h-dvh w-80 transform-none",
            off: "left-0 top-0 h-dvh w-80 -translate-x-full",
          },
        },
      },
    },
    alert: {
      wrapper: "flex items-center w-full [&>div]:flex-1",
    },
    progress: {
      color: {
        indigo: "bg-indigo-500 dark:bg-indigo-600",
      },
    },
    modal: {
      root: {
        base: "fixed inset-x-0 top-0 z-50 h-dvh overflow-y-auto overflow-x-hidden md:inset-0 md:h-full",
        show: {
          on: "flex modal-scrim",
        },
      },
      content: {
        inner:
          "modal-panel rounded-xl border border-gray-200 bg-white text-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300",
      },
      header: {
        base: "flex items-center justify-between gap-4 rounded-t-xl border-b border-gray-200 bg-gray-50 px-6 py-3 dark:border-gray-800 dark:bg-gray-900",
        title: "min-w-0 text-base leading-tight text-gray-900 dark:text-white",
        close: {
          base: "ms-auto inline-flex cursor-pointer items-center justify-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 pointer-coarse:size-11 dark:hover:bg-gray-800 dark:hover:text-white",
        },
      },
      body: {
        base: "modal-body flex-1 overflow-auto px-6 py-5 text-gray-800 dark:text-gray-200",
      },
      footer: {
        base: "modal-actions flex items-center justify-end gap-2 rounded-b-xl border-t border-gray-200 bg-gray-50 px-6 py-3 dark:border-gray-800 dark:bg-gray-900",
      },
    },
    tabs: {
      tabpanel: "py-1",
      tablist: {
        base: "flex flex-nowrap overflow-x-auto text-center",
        variant: {
          default: "flex-nowrap overflow-x-auto border-b border-gray-200 dark:border-gray-700",
          underline: "flex-nowrap overflow-x-auto -mb-px border-b border-gray-200 dark:border-gray-700",
          pills: "flex-nowrap overflow-x-auto space-x-2 text-sm font-medium text-gray-500 dark:text-gray-400",
        },
        tabitem: {
          base: "cursor-pointer shrink-0 whitespace-nowrap",
          variant: {
            underline: {
              active: {
                on: "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400",
              },
            },
          },
        },
      },
    },
    table: {
      root: {
        shadow: "hidden",
      },
      head: {
        base: "border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200",
        cell: {
          base: "bg-gray-50 px-3 py-3 sm:px-6 dark:bg-gray-800/50",
        },
      },
      body: {
        cell: {
          base: "px-3 py-3 sm:px-6 sm:py-4",
        },
      },
      row: {
        base: "whitespace-nowrap border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800",
      },
    },
    tooltip: {
      base: "z-100",
    },
    toast: {
      root: {
        base: "flex w-full max-w-none items-center rounded-lg bg-white p-4 text-gray-500 shadow sm:max-w-xs dark:bg-gray-800 dark:text-gray-400",
      },
      toggle: {
        base: "-m-1.5 ml-auto inline-flex size-8 items-center justify-center rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 pointer-coarse:size-11 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-white",
      },
    },
    buttonGroup: {
      base: "shadow-none",
    },
    card: {
      root: {
        base: "flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900",
        children: "flex flex-col gap-4 p-5",
      },
    },
    badge: {
      root: {
        base: "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wide",
        color: {
          success:
            "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/40 dark:text-green-300 dark:hover:bg-green-900/40",
          warning:
            "bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/40 dark:text-amber-400 dark:hover:bg-amber-900/40",
          failure:
            "bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/40 dark:text-red-300 dark:hover:bg-red-900/40",
          info: "bg-sky-100 text-sky-700 hover:bg-sky-100 dark:bg-sky-900/40 dark:text-sky-300 dark:hover:bg-sky-900/40",
          gray: "bg-gray-100 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-800",
          indigo:
            "bg-indigo-100 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-300 dark:hover:bg-indigo-900/40",
        },
        size: {
          xs: "text-[11px]",
          sm: "text-xs",
        },
      },
      icon: {
        off: "",
      },
    },
    checkbox: {
      color: {
        default: "text-indigo-600 focus:ring-indigo-500 dark:ring-offset-gray-900 dark:focus:ring-indigo-500",
      },
    },
    toggleSwitch: {
      root: {
        label: "ms-3 mt-0.5 text-start text-sm font-medium text-gray-900 dark:text-gray-100",
      },
      toggle: {
        checked: {
          color: {
            indigo: "bg-indigo-600 group-focus:ring-indigo-300 dark:bg-indigo-500 dark:group-focus:ring-indigo-800",
          },
        },
      },
    },
    button: {
      base: "cursor-pointer transition-colors duration-200",
      color: {
        indigo:
          "bg-indigo-600 hover:bg-indigo-700 text-white dark:text-gray-100 border-0 focus:ring-indigo-500 dark:focus:ring-indigo-400",
        red: "dark:bg-red-900",
        alternative:
          "border border-gray-200 bg-white font-semibold text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 focus:ring-indigo-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-indigo-700 dark:hover:bg-indigo-950 dark:hover:text-indigo-300 dark:focus:ring-indigo-700",
        light:
          "border border-gray-200 bg-white font-semibold text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 focus:ring-indigo-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-indigo-700 dark:hover:bg-indigo-950 dark:hover:text-indigo-300 dark:focus:ring-indigo-700",
        lightDanger:
          "border border-gray-200 bg-white font-semibold text-gray-700 hover:border-red-300 hover:bg-red-50 hover:text-red-700 focus:ring-red-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-red-800 dark:hover:bg-red-950 dark:hover:text-red-300 dark:focus:ring-red-800",
        subtle:
          "bg-transparent hover:bg-indigo-50 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:bg-indigo-950 border-0 focus:ring-indigo-200 dark:focus:ring-indigo-800",
      },
      outlineColor: {
        indigo:
          "bg-indigo-100 border-indigo-100 dark:border-indigo-700 dark:bg-indigo-700 text-indigo-600 dark:text-indigo-100 hover:bg-indigo-200 hover:text-indigo-600 hover:border-indigo-200 dark:hover:border-indigo-500 dark:hover:bg-indigo-500 dark:hover:text-indigo-50 focus:ring-indigo-300 dark:focus:ring-indigo-700",
        gray: "bg-gray-200 text-gray-800 border-gray-200 hover:text-gray-800 hover:bg-gray-300 hover:border-gray-300 focus:ring-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-600 dark:hover:border-gray-600 dark:focus:ring-gray-500",
      },
    },
    pagination: {
      pages: {
        selector: {
          active:
            "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white",
        },
      },
    },
    textInput: {
      field: {
        input: {
          sizes: {
            sm: "h-11 p-2 text-base sm:h-9 sm:text-xs",
            md: "p-2.5 text-base sm:text-sm",
          },
          colors: {
            gray: "border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-indigo-500 dark:focus:ring-indigo-500",
          },
        },
      },
    },
    floatingLabel: {
      input: {
        default: {
          outlined: {
            sm: "px-2 pb-2 pt-3.5 text-base sm:text-xs disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-gray-700",
            md: "text-base sm:text-sm disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-gray-700",
          },
        },
        error: {
          outlined: {
            sm: "px-2 pb-2 pt-3.5 text-base sm:text-xs",
          },
        },
      },
      label: {
        default: {
          outlined: {
            sm: "left-1 px-1 text-sm peer-placeholder-shown:text-xs",
          },
        },
        error: {
          outlined: {
            sm: "left-1 px-1 text-sm peer-placeholder-shown:text-xs",
          },
        },
      },
    },
    textarea: {
      base: "block w-full rounded-lg border p-2.5 text-base focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm",
    },
    select: {
      field: {
        select: {
          sizes: {
            sm: "h-11 p-2 text-base sm:h-9 sm:text-xs",
            floating: "ps-2.5 pb-2.5 pt-4 text-base sm:text-sm",
            floatingSm: "ps-2 pb-2 pt-3.5 text-base sm:text-xs",
          },
          colors: {
            floating:
              "border-gray-300 bg-transparent text-gray-900 focus:border-indigo-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-500",
            floatingError:
              "border-red-600 bg-transparent text-gray-900 focus:border-red-600 focus:ring-0 dark:border-red-500 dark:bg-gray-800 dark:text-white dark:focus:border-red-500",
          },
        },
      },
    },
  });
}
