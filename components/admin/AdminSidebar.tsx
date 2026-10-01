"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ScrollText, Gamepad2, Youtube, Settings, LogOut, ExternalLink } from "lucide-react";
import { logoutAction } from "@/lib/actions";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/scripts", label: "Scripts", icon: ScrollText },
  { href: "/admin/games", label: "Games", icon: Gamepad2 },
  { href: "/admin/videos", label: "Videos", icon: Youtube },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <>
    <MobileAdminNav pathname={pathname} />
    <aside className="sticky top-20 hidden h-fit w-52 shrink-0 md:block">
      <nav className="flex flex-col gap-1">
        {LINKS.map((l) => {
          const active = pathname === l.href;
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "focus-ring flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-iris/15 text-iris" : "text-mute hover:bg-raised hover:text-ink",
              )}
            >
              <Icon size={16} /> {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-6 flex flex-col gap-1 border-t border-ink/8 pt-4">
        <Link href="/" target="_blank" className="focus-ring flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-mute hover:bg-raised hover:text-ink">
          <ExternalLink size={16} /> View site
        </Link>
        <form action={logoutAction}>
          <button type="submit" className="focus-ring flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-mute hover:bg-raised hover:text-danger">
            <LogOut size={16} /> Sign out
          </button>
        </form>
      </div>
    </aside>
    </>
  );
}

function MobileAdminNav({ pathname }: { pathname: string }) {
  const router = useRouter();
  return (
    <div className="mb-2 w-full md:hidden">
      <select
        value={LINKS.find((l) => l.href === pathname)?.href ?? LINKS[0].href}
        onChange={(e) => router.push(e.target.value)}
        className="focus-ring card-surface w-full rounded-xl px-3.5 py-2.5 text-sm text-ink"
      >
        {LINKS.map((l) => (
          <option key={l.href} value={l.href}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
}

