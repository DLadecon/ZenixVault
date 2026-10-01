"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";

export function ConfirmDeleteButton({
  action,
  confirmText = "Delete this? This can't be undone.",
  label = "Delete",
}: {
  action: () => Promise<{ ok: boolean; message: string }>;
  confirmText?: string;
  label?: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const router = useRouter();

  if (confirming) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="text-mute">{confirmText}</span>
        <button
          onClick={() =>
            startTransition(async () => {
              const res = await action();
              toast(res.message, res.ok ? "success" : "error");
              setConfirming(false);
              if (res.ok) router.refresh();
            })
          }
          className="focus-ring rounded-lg bg-danger/20 px-2.5 py-1 font-medium text-danger hover:bg-danger/30"
        >
          {pending ? <Loader2 size={13} className="animate-spin" /> : "Confirm"}
        </button>
        <button onClick={() => setConfirming(false)} className="focus-ring rounded-lg px-2.5 py-1 text-mute hover:text-ink">
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="focus-ring inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-mute hover:bg-danger/10 hover:text-danger"
    >
      <Trash2 size={13} /> {label}
    </button>
  );
}
