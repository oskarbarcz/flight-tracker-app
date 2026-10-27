import "../app/styles/index.css";
import type { Preview } from "@storybook/react-vite";
import { ThemeProvider, useThemeMode } from "flowbite-react";
import React, { type ReactNode, useEffect } from "react";
import { MemoryRouter } from "react-router";
import { ToastProvider } from "~/app-state/useToast";
import type { FlightPathElement } from "~/features/flight";
import { ApiProvider } from "~/shared/api/useApi";
import theme from "~/styles/theme";
import { serveAdsbTrack } from "../stories/support/adsb";

type ThemeName = "light" | "dark";

function ThemeMode({ mode, children }: { mode: ThemeName; children: ReactNode }) {
  const { setMode } = useThemeMode();

  useEffect(() => {
    setMode(mode);
  }, [mode, setMode]);

  return children;
}

const preview: Preview = {
  tags: ["autodocs"],
  globalTypes: {
    theme: {
      description: "Colour theme",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
  },
  parameters: {
    layout: "padded",
    controls: { expanded: true, sort: "requiredFirst" },
    docs: { toc: true },
    options: {
      storySort: { order: ["Introduction", "Dashboard", "Tracking", "Maps", "Shared"] },
    },
  },
  beforeEach: ({ parameters }) => serveAdsbTrack((parameters.adsbTrack as FlightPathElement[] | undefined) ?? []),
  decorators: [
    (Story, { globals }) => (
      <MemoryRouter>
        <ToastProvider>
          <ApiProvider>
            <ThemeProvider theme={theme()}>
              <ThemeMode mode={globals.theme as ThemeName}>
                <div className="rounded-2xl bg-gray-100 p-4 font-sans text-gray-700 dark:bg-gray-950 dark:text-gray-200">
                  <Story />
                </div>
              </ThemeMode>
            </ThemeProvider>
          </ApiProvider>
        </ToastProvider>
      </MemoryRouter>
    ),
  ],
};

export default preview;
