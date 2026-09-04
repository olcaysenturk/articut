"use server";

import { cookies } from "next/headers";
import {
  DASHBOARD_SESSION_COOKIE,
  createSessionToken,
  getDashboardUsername,
  updateCredentials,
  verifyCurrentPassword,
} from "@/lib/dashboard-auth";

type ProfileActionState = { error?: string; success?: string };

export async function updateProfileAction(
  _prevState: ProfileActionState | undefined,
  formData: FormData,
): Promise<ProfileActionState> {
  const currentPassword = String(formData.get("current-password") ?? "");
  const newUsername = String(formData.get("new-username") ?? "").trim();
  const newPassword = String(formData.get("new-password") ?? "");
  const confirmPassword = String(formData.get("confirm-password") ?? "");

  if (!currentPassword) {
    return { error: "Enter your current password to make changes." };
  }

  if (!(await verifyCurrentPassword(currentPassword))) {
    return { error: "Current password is incorrect." };
  }

  if (!newUsername) {
    return { error: "Username cannot be empty." };
  }

  if (newPassword && newPassword !== confirmPassword) {
    return { error: "New password and confirmation do not match." };
  }

  const finalPassword = newPassword || currentPassword;
  await updateCredentials(newUsername, finalPassword);

  const { token, maxAge } = createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(DASHBOARD_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  return { success: "Profile updated successfully." };
}

export async function getProfileUsername() {
  return getDashboardUsername();
}
