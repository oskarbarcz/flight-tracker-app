"use client";

import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { useAuth } from "~/state/contexts/auth.context";
import { usePageTitle } from "~/state/hooks/usePageTitle";
import {FloatingLabel, Spinner} from "flowbite-react";
import logoWhite from "~/assets/logo.white.svg";
import { FaArrowRight } from "react-icons/fa";

export default function SignInRoute() {
  usePageTitle("Sign in");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { signIn, user } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    signIn(email, password)
      .then(() => new Promise((resolve) => setTimeout(resolve, 250)))
      .then(() => navigate("/", { replace: true, viewTransition: true }))
      .catch(() => setError("Incorrect credentials"))
      .finally(() => setLoading(false));
  }

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-gray-100 p-3 pt-8 dark:bg-gray-900 sm:items-center sm:pt-3">
      <article className="flex w-full max-w-xl flex-col rounded-2xl bg-indigo-700 shadow-md sm:mt-0 sm:flex-row sm:shadow-xl">
        <aside className="flex flex-row items-center justify-center rounded-2xl py-4 sm:w-96 sm:flex-col sm:px-8">
          <img
            src={logoWhite}
            className="h-8 sm:h-20"
            alt="Flight Tracker app logo"
          />
          <span className="text-xl font-bold text-white sm:mt-4">
            Flight Tracker
          </span>
        </aside>
        <form
          onSubmit={handleSubmit}
          className="w-full space-y-2 rounded-2xl bg-white p-4 dark:bg-gray-800 sm:p-8"
        >
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-700 dark:text-gray-300">
            Sign in
          </h1>
          <FloatingLabel
            variant="outlined"
            label="Email"
            id="email"
            type="email"
            required
            className="dark:bg-gray-800"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FloatingLabel
            variant="outlined"
            label="Password"
            id="password"
            type="password"
            required
            className="dark:bg-gray-800"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <p className="pb-2 pt-1 text-center text-sm text-red-500">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end pt-2">
            {loading && <Spinner className="me-3" color="purple" aria-label="App is loading" />}

            <button
              type="submit"
              className="rounded-md bg-indigo-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {"Sign in"}
              <FaArrowRight className="ms-2 inline-block" />
            </button>
          </div>
        </form>
      </article>
    </div>
  );
}
