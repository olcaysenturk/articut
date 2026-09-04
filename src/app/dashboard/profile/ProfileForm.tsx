"use client";

import { useActionState, useState } from "react";
import { updateProfileAction } from "./actions";

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
      </svg>
    );
  }
  return (
    <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function PasswordInput({
  name,
  placeholder,
  autoComplete,
  required,
}: {
  name: string;
  placeholder?: string;
  autoComplete: string;
  required?: boolean;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="mt-1 block h-11 w-full rounded-lg border border-[#b8b8b8] bg-[#f4f4f4] px-3 pr-11 text-sm text-[#1f1f1f] focus:border-[#e04d26] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fab446]/45"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-2 top-1/2 mt-0.5 grid size-8 -translate-y-1/2 place-items-center rounded-md text-[#6f6f6f] transition-colors hover:bg-black/5 hover:text-[#1f1f1f]"
      >
        <EyeIcon open={visible} />
      </button>
    </div>
  );
}

export function ProfileForm({ currentUsername }: { currentUsername: string }) {
  const [state, formAction, isPending] = useActionState(updateProfileAction, undefined);
  const initial = currentUsername.slice(0, 1).toUpperCase() || "?";

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4 rounded-lg border border-[#d0d0d0] bg-white p-6">
        <div className="grid size-14 shrink-0 place-items-center rounded-full bg-[#e04d26] text-xl font-bold text-white">
          {initial}
        </div>
        <div>
          <div className="text-base font-semibold text-[#1f1f1f]">{currentUsername}</div>
          <p className="text-sm text-[#6f6f6f]">Signed in to the Articut dashboard</p>
        </div>
      </div>

      {state?.error ? (
        <div className="flex items-center gap-3 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {state.error}
        </div>
      ) : null}
      {state?.success ? (
        <div className="flex items-center gap-3 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l2.25 2.25 6-6M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {state.success}
        </div>
      ) : null}

      <form id="profile-form" action={formAction} className="space-y-6">
        <section className="rounded-lg border border-[#d0d0d0] bg-white p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg bg-[#fab446]/20 text-[#e04d26]">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            <div>
              <div className="text-sm font-semibold text-[#1f1f1f]">Username</div>
              <p className="text-xs text-[#6f6f6f]">Used to sign in to the dashboard</p>
            </div>
          </div>
          <input
            type="text"
            name="new-username"
            defaultValue={currentUsername}
            required
            className="block h-11 w-full rounded-lg border border-[#b8b8b8] bg-[#f4f4f4] px-3 text-sm text-[#1f1f1f] focus:border-[#e04d26] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fab446]/45"
          />
        </section>

        <section className="rounded-lg border border-[#d0d0d0] bg-white p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg bg-[#fab446]/20 text-[#e04d26]">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </span>
            <div>
              <div className="text-sm font-semibold text-[#1f1f1f]">Password</div>
              <p className="text-xs text-[#6f6f6f]">Leave blank to keep your current password</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium text-[#1f1f1f]">New password</span>
              <PasswordInput name="new-password" autoComplete="new-password" placeholder="••••••••" />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-[#1f1f1f]">Confirm new password</span>
              <PasswordInput name="confirm-password" autoComplete="new-password" placeholder="••••••••" />
            </label>
          </div>
        </section>

        <section className="rounded-lg border border-[#e04d26]/30 bg-[#fff7e4] p-6">
          <div className="mb-3 flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg bg-white text-[#e04d26]">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </span>
            <div>
              <div className="text-sm font-semibold text-[#1f1f1f]">Confirm your identity</div>
              <p className="text-xs text-[#7a5a2e]">Enter your current password to save these changes</p>
            </div>
          </div>
          <label className="block text-sm">
            <span className="font-medium text-[#1f1f1f]">Current password</span>
            <PasswordInput name="current-password" autoComplete="current-password" required />
          </label>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-[#e04d26] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#c9411f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
