import React from "react";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import { DataRefreshProvider } from "~/app-state/useDataRefresh";
import { PinnedAirportsProvider } from "~/features/airport/lib/usePinnedAirports";
import { CurrentFlightProvider } from "~/features/flight/hooks/useCurrentFlight";
import { AuthGuard } from "~/routes/auth/AuthGuard";
import { Sidebar, SidebarDrawerProvider, SidebarMobileTrigger } from "~/shared/ui/Sidebar/Sidebar";
import { TopBarLogo } from "~/shared/ui/TopBar/TopBarLogo";

export default function AppLayout() {
  return (
    <AuthGuard>
      <CurrentFlightProvider>
        <DataRefreshProvider>
          <PinnedAirportsProvider>
            <SidebarDrawerProvider>
              <div className="relative h-screen flex flex-col overflow-hidden dark:bg-gray-950">
                <div className="md:hidden pointer-events-none absolute inset-x-0 top-0 z-30 bg-gradient-to-b from-gray-200/95 via-gray-200/60 to-transparent px-3 pb-10 pt-3 dark:from-gray-950/95 dark:via-gray-950/50">
                  <div className="relative flex items-center justify-center">
                    <div className="pointer-events-auto absolute inset-y-0 left-0 flex items-center">
                      <SidebarMobileTrigger />
                    </div>
                    <div className="pointer-events-auto">
                      <TopBarLogo />
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col md:flex-row min-h-0">
                  <Sidebar />
                  <main className="flex-1 min-h-0 min-w-0 overflow-y-auto">
                    <div className="mx-auto w-full max-w-7xl p-2 pt-14 sm:p-4 sm:pt-14 md:p-6 md:pt-6">
                      <Outlet />
                    </div>
                  </main>
                </div>
              </div>
              <ToastContainer
                position="bottom-right"
                autoClose={5000}
                newestOnTop
                closeOnClick
                theme="light"
                toastClassName="!bg-transparent !shadow-none !p-0"
                closeButton={false}
              />
            </SidebarDrawerProvider>
          </PinnedAirportsProvider>
        </DataRefreshProvider>
      </CurrentFlightProvider>
    </AuthGuard>
  );
}
