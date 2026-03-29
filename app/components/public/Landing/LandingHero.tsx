import { Button } from "flowbite-react";
import React from "react";
import { Link } from "react-router";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-gray-50 dark:bg-gray-900 pt-24 pb-32 sm:pt-32 sm:pb-40">
      {/* Blob animation background */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob" />
      <div className="absolute top-0 right-40 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center animate-fade-in-up">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
          Bring Your Virtual Flights <span className="text-indigo-600 dark:text-indigo-400">To Life</span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          The comprehensive platform for flight simulator enthusiasts. Whether you're managing full airline operations
          or flying complex routes, track everything from payload to live airborne events.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button as={Link} to="/sign-in" color="indigo" size="xl" className="w-full sm:w-auto">
            Fly as Pilot
          </Button>
          <Button as={Link} to="/sign-in" color="light" size="xl" className="w-full sm:w-auto">
            Run as Operator
          </Button>
        </div>
      </div>
    </section>
  );
}
