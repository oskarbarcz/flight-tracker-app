import React from "react";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import { Sidebar, SidebarDrawerProvider, SidebarMobileTrigger } from "~/components/shared/Sidebar/Sidebar";
import { BreadcrumbsHeader } from "~/components/shared/TopBar/BreadcrumbsHeader";
import { TopBar } from "~/components/shared/TopBar/TopBar";
import { AuthGuard } from "~/routes/auth/AuthGuard";

export default function AppLayout() {
  return (
    <AuthGuard>
      <SidebarDrawerProvider>
        <div className="h-screen flex flex-col overflow-hidden dark:bg-gray-900">
          <div className="shrink-0">
            <TopBar mobileMenuTrigger={<SidebarMobileTrigger />} />
          </div>
          <div className="flex-1 flex flex-col md:flex-row min-h-0">
            <Sidebar />
            <main className="flex-1 overflow-y-auto px-3 pb-3 md:px-5 md:pb-5">
              <div className="w-full min-h-full bg-white dark:bg-gray-950 rounded-2xl">
                <BreadcrumbsHeader />
                <div className="p-4 md:p-6">
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
    </AuthGuard>
  );
}
