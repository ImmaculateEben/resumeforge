"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";

interface ApiErrorShape {
  error?: {
    message?: string;
  };
}

function formatSignupError(error?: string | null) {
  if (!error) {
    return "";
  }

  switch (error) {
    case "CredentialsSignin":
    case "CallbackRouteError":
      return "Your account was created, but the automatic sign-in failed. Try logging in manually.";
    default:
      return error;
  }
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
        }),
      });

      const payload = (await response.json()) as ApiErrorShape;
      if (!response.ok) {
        throw new Error(payload.error?.message || "Unable to create your account right now.");
      }

      const signInResult = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
        callbackUrl,
      });

      if (signInResult?.error) {
        setError(formatSignupError(signInResult.error));
        return;
      }

      router.push(signInResult?.url || callbackUrl);
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to create your account right now."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          Create your account
        </h1>
        <p className="text-gray-500">
          Save your resumes to the cloud and access them from any device.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            className="input-modern"
            placeholder="Jane Doe"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />
        </div>
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
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            className="input-modern"
            placeholder="At least 8 characters"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <p className="mt-1.5 text-xs text-gray-400">Must be at least 8 characters long</p>
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
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            Log in
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

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="animate-pulse h-96 bg-gray-50 rounded-xl" />}>
      <SignupForm />
    </Suspense>
  );
}
