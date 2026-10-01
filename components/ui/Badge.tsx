import { cn } from "@/lib/utils";

export function Badge({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "accent" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        tone === "accent" ? "bg-iris/15 text-iris" : "bg-raised text-mute",
      )}
    >
      {children}
    </span>
  );
}
