import type { Metadata } from "next";
import { isAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Admin login", robots: { index: false, follow: false } };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <div className="bg-grid bg-aurora flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="card-surface w-full max-w-sm rounded-2xl p-8 shadow-lift">
        <h1 className="font-display text-xl font-semibold text-ink">Admin sign in</h1>
        <p className="mt-1 text-sm text-mute">Private area — owner access only.</p>
        <LoginForm />
      </div>
    </div>
  );
}
