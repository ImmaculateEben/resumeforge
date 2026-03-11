"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";

function formatLoginError(error?: string | null) {
  switch (error) {
    case "CredentialsSignin":
    case "CallbackRouteError":
      return "Invalid email or password.";
    case "AccessDenied":
      return "Access denied for this account.";
    case "Configuration":
      return "Authentication is not configured correctly on the server.";
    default:
      return error || "";
  }
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(() => formatLoginError(searchParams.get("error")));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError(formatLoginError(result.error));
        return;
      }

      router.push(result?.url || callbackUrl);
      router.refresh();
    } catch {
      setError("Unable to sign in right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          Welcome back
        </h1>
        <p className="text-gray-500">
          Log in to access your saved resumes and continue building.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="input-modern"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:text-primary-dark transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="input-modern"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full py-2.5 text-sm justify-center"
        >
          {isSubmitting ? "Signing in..." : "Log in"}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            Sign up for free
          </Link>
        </p>
        <p className="text-center text-sm text-gray-400 mt-3">
          Or{" "}
          <Link
            href="/builder"
            className="text-gray-600 hover:text-gray-900 underline underline-offset-2 transition-colors"
          >
            continue as guest
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="animate-pulse h-96 bg-gray-50 rounded-xl" />}>
      <LoginForm />
    </Suspense>
  );
}
