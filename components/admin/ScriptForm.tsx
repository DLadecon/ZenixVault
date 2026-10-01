"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ActionState } from "@/lib/actions";
import { FormField, inputClass } from "./FormField";
import { ImageUpload } from "./ImageUpload";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

const initialState: ActionState = { ok: false, message: "" };

type Game = { id: string; name: string };

type ScriptDefaults = {
  title: string;
  gameId: string;
  description: string;
  features: string[];
  scriptCode: string;
  scriptUrl: string | null;
  youtubeUrl: string | null;
  thumbnail: string | null;
  version: string;
  category: string;
  tags: string[];
  published: boolean;
  featured: boolean;
};

export function ScriptForm({
  action,
  games,
  defaultValues,
  submitLabel,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  games: Game[];
  defaultValues?: ScriptDefaults;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (state.ok && state.message) {
      toast(state.message);
      router.push("/admin/scripts");
    }
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Script title" name="title" error={state.fieldErrors?.title}>
          <input id="title" name="title" required defaultValue={defaultValues?.title} className={inputClass} placeholder="Auto Dungeon Script" />
        </FormField>
        <FormField label="Game" name="gameId" error={state.fieldErrors?.gameId}>
          <select id="gameId" name="gameId" required defaultValue={defaultValues?.gameId ?? ""} className={inputClass}>
            <option value="" disabled>Select a game…</option>
            {games.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField label="Description" name="description" error={state.fieldErrors?.description}>
        <textarea id="description" name="description" rows={4} defaultValue={defaultValues?.description} className={inputClass} placeholder="Automatically farms the new dungeon mode and collects rewards." />
      </FormField>

      <FormField label="Features (one per line)" name="features" error={state.fieldErrors?.features}>
        <textarea
          id="features"
          name="features"
          rows={4}
          defaultValue={defaultValues?.features.join("\n")}
          className={`${inputClass} font-mono`}
          placeholder={"Auto Dungeon\nAuto Farm\nAuto Collect Rewards"}
        />
      </FormField>

      <FormField label="Script code" name="scriptCode" error={state.fieldErrors?.scriptCode}>
        <textarea
          id="scriptCode"
          name="scriptCode"
          rows={10}
          defaultValue={defaultValues?.scriptCode}
          className={`${inputClass} font-mono text-xs`}
          placeholder="-- Lua script code"
        />
        <p className="mt-1 text-xs text-mute">Displayed as read-only text on the script page. It's never executed by the website.</p>
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="External script URL (e.g. your Linkvertise link)" name="scriptUrl" error={state.fieldErrors?.scriptUrl}>
          <input id="scriptUrl" name="scriptUrl" defaultValue={defaultValues?.scriptUrl ?? ""} className={inputClass} placeholder="https://linkvertise.com/…" />
          <p className="mt-1 text-xs text-mute">
            If you set this, the script page shows only a "Get script" button linking here — the code below won't be shown on the site. Leave this blank to show the code directly instead.
          </p>
        </FormField>
        <FormField label="YouTube video URL" name="youtubeUrl" error={state.fieldErrors?.youtubeUrl}>
          <input id="youtubeUrl" name="youtubeUrl" defaultValue={defaultValues?.youtubeUrl ?? ""} className={inputClass} placeholder="https://youtube.com/watch?v=…" />
        </FormField>
      </div>

      <FormField label="Thumbnail (optional)" name="thumbnail">
        <ImageUpload name="thumbnail" defaultValue={defaultValues?.thumbnail} />
        <p className="mt-1 text-xs text-mute">
          If you skip this, the site automatically uses a thumbnail from the YouTube video above instead.
        </p>
      </FormField>

      <div className="grid gap-5 sm:grid-cols-3">
        <FormField label="Version" name="version" error={state.fieldErrors?.version}>
          <input id="version" name="version" defaultValue={defaultValues?.version ?? "1.0"} className={inputClass} />
        </FormField>
        <FormField label="Category" name="category" error={state.fieldErrors?.category}>
          <input id="category" name="category" defaultValue={defaultValues?.category ?? "General"} className={inputClass} />
        </FormField>
        <FormField label="Tags (comma separated)" name="tags" error={state.fieldErrors?.tags}>
          <input id="tags" name="tags" defaultValue={defaultValues?.tags.join(", ")} className={inputClass} placeholder="Auto Farm, Dungeon" />
        </FormField>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" name="published" value="true" defaultChecked={defaultValues?.published ?? false} className="h-4 w-4 rounded accent-iris" />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" name="featured" value="true" defaultChecked={defaultValues?.featured ?? false} className="h-4 w-4 rounded accent-iris" />
          Featured on homepage
        </label>
      </div>

      {state.message && !state.ok && <p className="text-sm text-danger">{state.message}</p>}
      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
