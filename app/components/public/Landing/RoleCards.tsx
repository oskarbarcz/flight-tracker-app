import React from "react";
import { UserRole } from "~/models/user.model";
import { RoleCard } from "./RoleCard";

export function RoleCards() {
  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">Choose Your Path</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Two distinct ways to play
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch max-w-4xl mx-auto">
          <RoleCard role={UserRole.CabinCrew} />
          <RoleCard role={UserRole.Operations} />
        </div>
      </div>
    </section>
  );
}
