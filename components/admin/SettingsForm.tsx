"use client";

import { useActionState, useEffect } from "react";
import type { ActionState } from "@/lib/actions";
import { updateSettings } from "@/lib/actions";
import { FormField, inputClass } from "./FormField";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

const initialState: ActionState = { ok: false, message: "" };

type Settings = {
  siteName: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  youtubeChannel: string;
  discordUrl: string | null;
};

export function SettingsForm({ settings }: { settings: Settings }) {
  const [state, formAction, pending] = useActionState(updateSettings, initialState);
  const toast = useToast();

  useEffect(() => {
    if (state.message) toast(state.message, state.ok ? "success" : "error");
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      <FormField label="Site name" name="siteName" error={state.fieldErrors?.siteName}>
        <input id="siteName" name="siteName" required defaultValue={settings.siteName} className={inputClass} />
      </FormField>
      <FormField label="Tagline (footer)" name="tagline" error={state.fieldErrors?.tagline}>
        <input id="tagline" name="tagline" defaultValue={settings.tagline} className={inputClass} />
      </FormField>
      <FormField label="Hero title" name="heroTitle" error={state.fieldErrors?.heroTitle}>
        <input id="heroTitle" name="heroTitle" required defaultValue={settings.heroTitle} className={inputClass} />
      </FormField>
      <FormField label="Hero subtitle" name="heroSubtitle" error={state.fieldErrors?.heroSubtitle}>
        <input id="heroSubtitle" name="heroSubtitle" defaultValue={settings.heroSubtitle} className={inputClass} />
      </FormField>
      <FormField label="YouTube channel URL" name="youtubeChannel" error={state.fieldErrors?.youtubeChannel}>
        <input id="youtubeChannel" name="youtubeChannel" required defaultValue={settings.youtubeChannel} className={inputClass} />
      </FormField>
      <FormField label="Discord URL (optional)" name="discordUrl" error={state.fieldErrors?.discordUrl}>
        <input id="discordUrl" name="discordUrl" defaultValue={settings.discordUrl ?? ""} className={inputClass} />
      </FormField>
      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Saving…" : "Save settings"}
      </Button>
    </form>
  );
}
