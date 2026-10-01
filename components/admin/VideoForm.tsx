"use client";

import { useActionState, useEffect, useRef } from "react";
import type { ActionState } from "@/lib/actions";
import { createVideo } from "@/lib/actions";
import { FormField, inputClass } from "./FormField";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";

const initialState: ActionState = { ok: false, message: "" };

export function VideoForm() {
  const [state, formAction, pending] = useActionState(createVideo, initialState);
  const toast = useToast();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok && state.message) {
      toast(state.message);
      formRef.current?.reset();
      router.refresh();
    }
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <form ref={formRef} action={formAction} className="flex max-w-xl flex-col gap-5">
      <FormField label="Title" name="title" error={state.fieldErrors?.title}>
        <input id="title" name="title" required className={inputClass} placeholder="How to install scripts" />
      </FormField>
      <FormField label="YouTube URL" name="youtubeUrl" error={state.fieldErrors?.youtubeUrl}>
        <input id="youtubeUrl" name="youtubeUrl" required className={inputClass} placeholder="https://youtube.com/watch?v=…" />
      </FormField>
      <FormField label="Type" name="kind">
        <select id="kind" name="kind" defaultValue="TUTORIAL" className={inputClass}>
          <option value="TUTORIAL">Tutorial</option>
          <option value="SHOWCASE">Showcase</option>
        </select>
      </FormField>
      {state.message && !state.ok && <p className="text-sm text-danger">{state.message}</p>}
      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Adding…" : "Add video"}
      </Button>
    </form>
  );
}
