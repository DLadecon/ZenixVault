import Link from "next/link";
import { type ButtonHTMLAttributes, type AnchorHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-150 focus-ring disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

const variants = {
  primary: "bg-iris text-white shadow-glow hover:bg-iris/90",
  secondary: "card-surface text-ink hover:bg-raised hover:border-ink/15",
  ghost: "text-mute hover:text-ink hover:bg-raised",
  danger: "bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25",
};

type Variant = keyof typeof variants;

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }>(
  ({ className, variant = "primary", ...props }, ref) => (
    <button ref={ref} className={cn(base, variants[variant], className)} {...props} />
  ),
);
Button.displayName = "Button";

export function LinkButton({
  variant = "primary",
  className,
  href,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; href: string }) {
  return <Link href={href} className={cn(base, variants[variant], className)} {...props} />;
}
