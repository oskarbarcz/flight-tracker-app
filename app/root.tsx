"use client";

import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { Route } from "./+types/root";
import stylesheet from "./app.css?url";
import React from "react";
import { Button, ThemeModeScript, ThemeProvider } from "flowbite-react";
import { AuthProvider } from "~/state/contexts/auth.context";
import getAppTheme from "~/theme/getAppTheme";
import { ApiProvider } from "~/state/contexts/api.context";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeModeScript />
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1 viewport-fit=cover"
        />
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
    <ApiProvider>
      <AuthProvider>
        <ThemeProvider theme={appTheme}>
          <Outlet />
        </ThemeProvider>
      </AuthProvider>
    </ApiProvider>
  );
}

export function NotFoundError() {
  return (
    <main className="container mx-auto p-8 pt-24 md:pt-48 xl:pt-64">
      <h1 className="text-9xl font-bold text-center text-indigo-500 mb-4">
        404
      </h1>
      <div className="w-24 h-1 mx-auto bg-gray-600 dark:bg-gray-400 my-6"></div>
      <h2 className="text-3xl font-semibold text-center text-indigo-500 mb-4">
        Page not found
      </h2>
      <p className="text-gray-600 mx-auto text-center dark:text-gray-400 max-w-md mb-8">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <Link to="/" viewTransition replace className="text-center">
        <Button color="indigo" className="mx-auto">
          Return to homepage
        </Button>
      </Link>
    </main>
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

    if (error.status === 404) {
      return <NotFoundError />;
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
      <h1 className="text-gray-800">{message}</h1>
      <p className="text-gray-800">{details}</p>
      {stack && (
        <pre className="text-gray-800 w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
