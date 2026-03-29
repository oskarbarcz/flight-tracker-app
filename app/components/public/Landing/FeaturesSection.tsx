import { Card } from "flowbite-react";
import React from "react";
import { FaMapMarkedAlt, FaNetworkWired, FaUserTag } from "react-icons/fa";

export function FeaturesSection() {
  const features = [
    {
      title: "Simulated Passengers",
      description: "Passenger tracking system that accurately models boarding, inflight status, and disembarkation.",
      icon: FaUserTag,
    },
    {
      title: "Live Flight Events",
      description: "Log takeoff, landing, block times automatically or manually to capture detailed flight statistics.",
      icon: FaMapMarkedAlt,
    },
    {
      title: "Real Ops Workflows",
      description: "Manage complex fleet rotations, gate turnaround times, and crew assignment just like a real Ops Center.",
      icon: FaNetworkWired,
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">Advanced Features</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Everything you need for virtual operations
          </p>
        </div>
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="dark:bg-gray-800 border-none shadow-sm hover:shadow-md transition-shadow">
                <div className="text-indigo-600 dark:text-indigo-400 mb-4 h-8 w-8">
                  <feature.icon className="h-full w-full" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
