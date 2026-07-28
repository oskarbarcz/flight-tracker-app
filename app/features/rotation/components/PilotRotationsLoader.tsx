import React from "react";

export function PilotRotationsLoader() {
  return (
    <div className="flex animate-pulse flex-col gap-6">
      {[0, 1].map((group) => (
        <section key={group} className="flex flex-col gap-3">
          <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-start justify-between gap-3">
              <div className="h-6 w-56 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-5 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="mt-3 h-4 w-44 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mt-4 flex gap-8">
              {[0, 1, 2].map((fact) => (
                <div key={fact}>
                  <div className="h-3 w-14 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="mt-1.5 h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
