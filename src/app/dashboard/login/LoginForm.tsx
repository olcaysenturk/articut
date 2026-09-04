"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, undefined);

  return (
    <form action={formAction} className="w-full max-w-sm space-y-5 rounded-xl bg-white p-8 shadow-xl">
      <div className="text-center">
        <div className="text-xl font-bold text-[#e04d26]">Articut CMS</div>
        <p className="mt-1 text-sm text-[#6f6f6f]">Sign in to manage site content</p>
      </div>

      {state?.error ? (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {state.error}
        </div>
      ) : null}

      <label className="block text-sm">
        <span className="font-medium text-[#1f1f1f]">Username</span>
        <input
          type="text"
          name="username"
          autoComplete="username"
          required
          className="mt-1 block h-11 w-full rounded-lg border border-[#b8b8b8] bg-[#f4f4f4] px-3 text-sm text-[#1f1f1f] focus:border-[#e04d26] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fab446]/45"
        />
      </label>

      <label className="block text-sm">
        <span className="font-medium text-[#1f1f1f]">Password</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          className="mt-1 block h-11 w-full rounded-lg border border-[#b8b8b8] bg-[#f4f4f4] px-3 text-sm text-[#1f1f1f] focus:border-[#e04d26] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fab446]/45"
        />
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-[#e04d26] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#c9411f] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
