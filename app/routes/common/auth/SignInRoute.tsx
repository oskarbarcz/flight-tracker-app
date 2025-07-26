"use client";

import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { useAuth } from "~/state/contexts/auth.context";
import { usePageTitle } from "~/state/hooks/usePageTitle";
import { FloatingLabel, Spinner } from "flowbite-react";
import logo from "~/assets/logo.svg";
import { FaArrowRight } from "react-icons/fa";
import Container from "~/components/Container";

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
      .then(() => new Promise((resolve) => setTimeout(resolve, 1000)))
      .then(() => navigate("/", { replace: true, viewTransition: true }))
      .catch(() => setError("Incorrect credentials"))
      .finally(() => setLoading(false));
  }

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-full flex-col pt-8 sm:pt-24 md:pt-48 gap-8 p-3 dark:bg-gray-900 sm:items-center">
      <aside className="flex items-center justify-center">
        <img
          src={logo}
          className="h-8 mr-2 sm:h-12 sm:mr-3"
          alt="FlightTracker app logo"
        />
        <span className="text-2xl sm:text-4xl font-bold text-indigo-500">
          FlightTracker
        </span>
      </aside>
      <Container className="w-full sm:w-[400px]">
        <h1 className="text-center mb-4 sm:mb-8 text-2xl sm:text-3xl font-bold text-gray-700 dark:text-gray-300">
          Sign in
        </h1>
        <form
          onSubmit={handleSubmit}
          className="w-full space-y-2 rounded-4xl bg-white dark:bg-gray-800"
        >
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
            {loading ? (
              <button
                type="submit"
                className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <Spinner color="purple" size="md" />
              </button>
            ) : (
              <button
                type="submit"
                className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {"Sign in"}
                <FaArrowRight className="ms-2 inline-block" />
              </button>
            )}
          </div>
        </form>
      </Container>
    </div>
  );
}
