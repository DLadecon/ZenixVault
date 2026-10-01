"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/actions";
import { FormField, inputClass } from "./FormField";
import { ImageUpload } from "./ImageUpload";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const initialState: ActionState = { ok: false, message: "" };

export function GameForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: { name: string; description: string; thumbnail: string | null };
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (state.ok && state.message) {
      toast(state.message);
      router.push("/admin/games");
    }
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      <FormField label="Game name" name="name" error={state.fieldErrors?.name}>
        <input id="name" name="name" required defaultValue={defaultValues?.name} className={inputClass} placeholder="Blox Fruits" />
      </FormField>
      <FormField label="Description" name="description" error={state.fieldErrors?.description}>
        <textarea id="description" name="description" rows={3} defaultValue={defaultValues?.description} className={inputClass} />
      </FormField>
      <FormField label="Thumbnail" name="thumbnail">
        <ImageUpload name="thumbnail" defaultValue={defaultValues?.thumbnail} />
      </FormField>
      {state.message && !state.ok && <p className="text-sm text-danger">{state.message}</p>}
      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
