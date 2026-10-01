"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastKind = "success" | "error";
type ToastItem = { id: number; message: string; kind: ToastKind };

const ToastContext = createContext<((message: string, kind?: ToastKind) => void) | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const push = useCallback((message: string, kind: ToastKind = "success") => {
    const id = ++counter.current;
    setItems((prev) => [...prev, { id, message, kind }]);
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 2800);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              "animate-toast pointer-events-auto flex items-center gap-2 rounded-xl border px-4 py-3 text-sm shadow-lift backdrop-blur",
              t.kind === "success"
                ? "border-ok/30 bg-panel text-ink"
                : "border-danger/30 bg-panel text-ink",
            )}
          >
            {t.kind === "success" ? (
              <CheckCircle2 size={16} className="shrink-0 text-ok" />
            ) : (
              <AlertCircle size={16} className="shrink-0 text-danger" />
            )}
            <span>{t.message}</span>
            <button
              onClick={() => setItems((prev) => prev.filter((i) => i.id !== t.id))}
              className="ml-1 text-mute hover:text-ink"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
