import React from "react";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import { Sidebar, SidebarDrawerProvider, SidebarMobileTrigger } from "~/components/shared/Sidebar/Sidebar";
import { BreadcrumbsHeader } from "~/components/shared/TopBar/BreadcrumbsHeader";
import { TopBar } from "~/components/shared/TopBar/TopBar";
import { AuthGuard } from "~/routes/auth/AuthGuard";
import { DataRefreshProvider } from "~/state/app/context/useDataRefresh";

export default function AppLayout() {
  return (
    <AuthGuard>
      <DataRefreshProvider>
        <SidebarDrawerProvider>
          <div className="h-screen flex flex-col overflow-hidden dark:bg-gray-900">
            <div className="shrink-0">
              <TopBar mobileMenuTrigger={<SidebarMobileTrigger />} />
            </div>
            <div className="flex-1 flex flex-col md:flex-row min-h-0">
              <Sidebar />
              <main className="flex-1 flex flex-col px-3 pb-3 md:px-5 md:pb-5 min-h-0">
                <div className="flex-1 flex flex-col min-h-0 w-full bg-white dark:bg-gray-950 rounded-2xl overflow-hidden">
                  <div className="shrink-0">
                    <BreadcrumbsHeader />
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    <Outlet />
                  </div>
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
