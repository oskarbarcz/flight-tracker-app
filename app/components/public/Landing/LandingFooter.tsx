import { Footer } from "flowbite-react";
import React from "react";
import { FaDiscord, FaGithub } from "react-icons/fa6";
import { Link } from "react-router";
import logo from "~/assets/logo.svg";
import { useAppEnvironment } from "~/state/app/hooks/useAppEnvironment";

export function LandingFooter() {
  const { discordInvitationHash } = useAppEnvironment();

  return (
    <Footer
      container
      className="rounded-none border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 shadow-none"
    >
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-12 pb-4">
        <div className="grid w-full grid-cols-1 gap-12 md:grid-cols-2">
          {/* First Column */}
          <div>
            <Link to="/" className="flex items-center mb-4 w-fit">
              <img src={logo} className="mr-3 h-8" alt="Flight Tracker app logo" />
              <span className="self-center whitespace-nowrap text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                Flight Tracker
              </span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 font-medium max-w-sm leading-relaxed">
              The ultimate toolkit built exclusively for your flight simulation ecosystem. Master the skies with
              complete operational and cockpit immersion.
            </p>
          </div>

          {/* Second Column */}
          <div className="flex flex-col md:text-right md:items-end">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wide">Contact</h3>
            <div className="flex flex-col gap-4 text-gray-500 dark:text-gray-400 font-medium md:items-end">
              <p className="text-gray-900 dark:text-gray-100 font-semibold mb-1">Oskar Barcz</p>

              <a
                href="https://github.com/oskarbarcz"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors w-fit"
              >
                <FaGithub size={20} className="text-gray-900 dark:text-white" />
                <span>oskarbarcz</span>
              </a>

              {discordInvitationHash && (
                <a
                  href={`https://discord.gg/${discordInvitationHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors w-fit"
                >
                  <FaDiscord size={20} className="text-[#5865F2]" />
                  <span>Discord Community</span>
                </a>
              )}
            </div>
          </div>
        </div>

        <hr className="my-8 border-gray-200 dark:border-gray-800" />
        <div className="w-full text-center">
          <p className="text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()}{" "}
            <a href="https://github.com/oskarbarcz" className="hover:underline">
              Oskar Barcz.
            </a>{" "}
            All rights reserved.
          </p>
        </div>
      </div>
    </Footer>
  );
}
