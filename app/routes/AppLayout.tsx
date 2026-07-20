import React from "react";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import { DataRefreshProvider } from "~/app-state/useDataRefresh";
import { PinnedAirportsProvider } from "~/features/airport/lib/usePinnedAirports";
import { PendingDelaysProvider } from "~/features/delay/hooks/usePendingDelays";
import { CurrentFlightProvider } from "~/features/flight/hooks/useCurrentFlight";
import { AuthGuard } from "~/routes/auth/AuthGuard";
import { BottomNav } from "~/shared/ui/BottomNav/BottomNav";
import { Sidebar } from "~/shared/ui/Sidebar/Sidebar";
import { TopBarLogo } from "~/shared/ui/TopBar/TopBarLogo";

export default function AppLayout() {
  return (
    <AuthGuard>
      <CurrentFlightProvider>
        <DataRefreshProvider>
          <PinnedAirportsProvider>
            <PendingDelaysProvider>
              <div className="relative h-dvh flex flex-col overflow-hidden dark:bg-gray-950">
                <div className="md:hidden pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-center bg-gradient-to-b from-white/95 via-white/60 to-transparent px-3 pb-6 pt-3 dark:from-gray-950/95 dark:via-gray-950/50">
                  <div className="pointer-events-auto inline-flex">
                    <TopBarLogo size="lg" />
                  </div>
                </div>
                <div className="flex-1 flex flex-col md:flex-row min-h-0">
                  <Sidebar />
                  <main className="flex-1 min-h-0 min-w-0 overflow-y-auto pb-[calc(4.5rem_+_env(safe-area-inset-bottom))] md:pb-0">
                    <div className="mx-auto w-full max-w-7xl p-2 pt-16 sm:p-4 sm:pt-16 md:p-6 md:pt-6">
                      <Outlet />
                    </div>
                  </main>
                </div>
                <BottomNav />
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
            </PendingDelaysProvider>
          </PinnedAirportsProvider>
        </DataRefreshProvider>
      </CurrentFlightProvider>
    </AuthGuard>
  );
}
