"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { checkCredentials, createSessionToken, DASHBOARD_SESSION_COOKIE } from "@/lib/dashboard-auth";

export async function loginAction(_prevState: { error?: string } | undefined, formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!(await checkCredentials(username, password))) {
    return { error: "Invalid username or password." };
  }

  const { token, maxAge } = createSessionToken();
  const cookieStore = await cookies();

  cookieStore.set(DASHBOARD_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  redirect("/dashboard");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(DASHBOARD_SESSION_COOKIE);
  redirect("/dashboard/login");
}
