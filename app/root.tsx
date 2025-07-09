import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { Route } from "./+types/root";
import stylesheet from "./app.css?url";
import React from "react";
import { ThemeModeScript, ThemeProvider } from "flowbite-react";
import { AuthProvider } from "~/state/contexts/auth.context";
import getAppTheme from "~/theme/getAppTheme";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,200;0,300;0,400;0,700;1,400&display=swap",
  },
  { rel: "stylesheet", href: stylesheet },
  {
    rel: "icon",
    type: "image/png",
    href: "/favicon-96x96.png",
    sizes: "96x96",
  },
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
  { rel: "shortcut icon", type: "shortcut icon", href: "/favicon.ico" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
  { rel: "manifest", href: "/site.webmanifest" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ThemeModeScript />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="apple-mobile-web-app-title" content="FlightTracker" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const appTheme = getAppTheme();

  return (
    <AuthProvider>
      <ThemeProvider theme={appTheme}>
        <Outlet />
      </ThemeProvider>
    </AuthProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;
  console.error(error);

  if (isRouteErrorResponse(error)) {
    if (error.status === 401) {
      return error;
    }

    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
