"use client";

import { useEffect, useState } from "react";

const SNIPPET = `local Players = game:GetService("Players")
local player = Players.LocalPlayer

local ScriptHub = {}
ScriptHub.AutoFarm = true
ScriptHub.ESP = true

print("Loaded from Zenix Scripts ✓")`;

/** Types the sample snippet out once on mount — the single orchestrated motion moment for the page. */
export function HeroCode() {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(SNIPPET);
      setDone(true);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 2;
      setShown(SNIPPET.slice(0, i));
      if (i >= SNIPPET.length) {
        clearInterval(id);
        setDone(true);
      }
    }, 18);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="card-surface w-full overflow-hidden rounded-2xl shadow-lift">
      <div className="flex items-center gap-1.5 border-b border-ink/8 bg-raised/60 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-ok/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-azure/60" />
        <span className="ml-2 font-mono text-xs text-mute">hub.lua</span>
      </div>
      <pre className="min-h-[220px] p-5 text-[13px] leading-relaxed">
        <code className="font-mono text-ink/90">
          {shown}
          {!done && <span className="animate-caret text-iris">▍</span>}
        </code>
      </pre>
    </div>
  );
}
