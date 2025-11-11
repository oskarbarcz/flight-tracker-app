"use client";

import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { useAuth } from "~/state/contexts/session/auth.context";
import { usePageTitle } from "~/state/hooks/usePageTitle";
import { Button, FloatingLabel, Spinner } from "flowbite-react";
import { FaArrowRight } from "react-icons/fa";
import Container from "~/components/Layout/Container";
import Logo from "~/components/Layout/Logo";

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
    <div className="z-10 flex min-h-full flex-col justify-center md:mt-[-100px] gap-4 sm:gap-6 md:gap-8 p-3 items-center">
      <aside className="flex items-center justify-center">
        <Logo />
      </aside>
      <Container className="w-full max-w-[350px] shadow-none border-0">
        <h1 className="text-center mb-4 sm:mb-8 text-2xl sm:text-3xl font-bold text-gray-700 dark:text-gray-300">
          Sign in
        </h1>
        <form onSubmit={handleSubmit} className="w-full space-y-2 rounded-4xl">
          <FloatingLabel
            variant="outlined"
            label="Email"
            id="email"
            type="email"
            autoComplete="email"
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
            autoComplete="current-password"
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
              <Button type="submit" color="indigo">
                <Spinner color="purple" size="md" />
              </Button>
            ) : (
              <Button type="submit" color="indigo">
                <span className="font-bold">Sign in</span>
                <FaArrowRight className="ms-2 inline-block" />
              </Button>
            )}
          </div>
        </form>
      </Container>
    </div>
  );
}
