"use client";

import { useActionState } from "react";
import { loginAction, type ActionState } from "@/lib/actions";
import { Button } from "@/components/ui/Button";

const initialState: ActionState = { ok: false, message: "" };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <div>
        <label htmlFor="username" className="text-sm font-medium text-ink">Username</label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          required
          className="focus-ring mt-1.5 w-full rounded-xl border border-ink/10 bg-raised px-3.5 py-2.5 text-sm text-ink"
        />
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-medium text-ink">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="focus-ring mt-1.5 w-full rounded-xl border border-ink/10 bg-raised px-3.5 py-2.5 text-sm text-ink"
        />
      </div>
      {state.message && !state.ok && <p className="text-sm text-danger">{state.message}</p>}
      <Button type="submit" disabled={pending} className="mt-2 w-full">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
