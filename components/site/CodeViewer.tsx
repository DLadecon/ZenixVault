"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

/**
 * Displays script code as plain, non-executable text (a <pre><code> block).
 * There is no eval / dangerouslySetInnerHTML / script injection path here —
 * the code is rendered as inert text at all times.
 */
export function CodeViewer({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast("Copied!");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast("Couldn't copy — select the text manually", "error");
    }
  }

  if (!code.trim()) {
    return (
      <div className="card-surface rounded-2xl p-8 text-center text-sm text-mute">
        No script code has been added for this showcase yet.
      </div>
    );
  }

  return (
    <div className="card-surface overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between border-b border-ink/8 bg-raised/60 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-ok/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-azure/60" />
          <span className="ml-2 font-mono text-xs text-mute">script.lua</span>
        </div>
        <button
          onClick={copy}
          className="focus-ring inline-flex items-center gap-1.5 rounded-lg bg-iris/15 px-3 py-1.5 text-xs font-medium text-iris transition-colors hover:bg-iris/25"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copied!" : "Copy script"}
        </button>
      </div>
      <pre className="max-h-[520px] overflow-auto p-4 text-[13px] leading-relaxed">
        <code className="font-mono text-ink/90">{code}</code>
      </pre>
    </div>
  );
}
