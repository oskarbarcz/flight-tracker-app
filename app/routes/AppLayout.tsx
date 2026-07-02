import React from "react";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import { AuthGuard } from "~/routes/auth/AuthGuard";
import { Sidebar, SidebarDrawerProvider, SidebarMobileTrigger } from "~/shared/ui/Sidebar/Sidebar";
import { TopBarLogo } from "~/shared/ui/TopBar/TopBarLogo";
import { DataRefreshProvider } from "~/state/app/context/useDataRefresh";

export default function AppLayout() {
  return (
    <AuthGuard>
      <DataRefreshProvider>
        <SidebarDrawerProvider>
          <div className="h-screen flex flex-col overflow-hidden dark:bg-gray-950">
            <div className="md:hidden shrink-0 flex items-center gap-3 border-b border-gray-200 bg-white px-3 py-2.5 dark:border-gray-800 dark:bg-gray-900">
              <SidebarMobileTrigger />
              <TopBarLogo />
            </div>
            <div className="flex-1 flex flex-col md:flex-row min-h-0">
              <Sidebar />
              <main className="flex-1 min-h-0 min-w-0 overflow-y-auto">
                <div className="mx-auto w-full max-w-7xl p-4 md:p-6">
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
      </DataRefreshProvider>
    </AuthGuard>
  );
}
