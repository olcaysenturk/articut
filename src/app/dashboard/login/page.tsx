import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Dashboard Login" };

export default function DashboardLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#d9d9d9] px-4">
      <LoginForm />
    </main>
  );
}
