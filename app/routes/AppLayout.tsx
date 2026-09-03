import React from "react";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import { DataRefreshProvider } from "~/app-state/useDataRefresh";
import { SidebarProvider } from "~/app-state/useSidebar";
import { PinnedAirportsProvider } from "~/features/airport/lib/usePinnedAirports";
import { PendingDelaysProvider } from "~/features/delay/hooks/usePendingDelays";
import { CurrentFlightProvider } from "~/features/flight/hooks/useCurrentFlight";
import { PostcardsProvider } from "~/features/postcard/hooks/usePostcards";
import { AuthGuard } from "~/routes/auth/AuthGuard";
import { BottomNav } from "~/shared/ui/BottomNav/BottomNav";
import { Sidebar } from "~/shared/ui/Sidebar/Sidebar";
import { TopBarBackButton } from "~/shared/ui/TopBar/TopBarBackButton";
import { TopBarLogo } from "~/shared/ui/TopBar/TopBarLogo";

export default function AppLayout() {
  return (
    <AuthGuard>
      <CurrentFlightProvider>
        <DataRefreshProvider>
          <PinnedAirportsProvider>
            <PendingDelaysProvider>
              <PostcardsProvider>
                <SidebarProvider>
                  <div className="relative h-dvh flex flex-col overflow-hidden bg-gray-100 dark:bg-gray-950">
                    <div className="md:hidden pointer-events-none absolute inset-x-0 top-0 z-30 bg-gradient-to-b from-gray-100/95 via-gray-100/60 to-transparent px-3 pb-6 pt-[calc(0.75rem_+_env(safe-area-inset-top))] dark:from-gray-950/95 dark:via-gray-950/50">
                      <div className="relative flex items-center justify-center">
                        <div className="pointer-events-auto absolute inset-y-0 left-0 flex items-center">
                          <TopBarBackButton />
                        </div>
                        <div className="pointer-events-auto inline-flex">
                          <TopBarLogo size="lg" />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col md:flex-row min-h-0">
                      <Sidebar />
                      <main className="flex-1 min-h-0 min-w-0 overflow-y-auto [scrollbar-gutter:stable] pb-[calc(5.25rem_+_env(safe-area-inset-bottom))] md:pb-0">
                        <div
                          data-app-entry-content
                          className="mx-auto w-full max-w-7xl p-3 pt-[calc(4rem_+_env(safe-area-inset-top))] sm:p-4 sm:pt-[calc(4rem_+_env(safe-area-inset-top))] md:p-6 md:pt-6"
                        >
                          <Outlet />
                        </div>
                      </main>
                    </div>
                  </div>
                  <BottomNav />
                  <ToastContainer
                    position="bottom-right"
                    autoClose={5000}
                    newestOnTop
                    closeOnClick
                    theme="light"
                    className="!bottom-[calc(4.5rem_+_env(safe-area-inset-bottom))] max-[480px]:!px-3 md:!bottom-4"
                    toastClassName="!bg-transparent !shadow-none !p-0"
                    closeButton={false}
                  />
                </SidebarProvider>
              </PostcardsProvider>
            </PendingDelaysProvider>
          </PinnedAirportsProvider>
        </DataRefreshProvider>
      </CurrentFlightProvider>
    </AuthGuard>
  );
}
