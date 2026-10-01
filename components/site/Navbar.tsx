"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/scripts", label: "Scripts" },
  { href: "/games", label: "Games" },
  { href: "/tutorials", label: "Tutorials" },
];

export function Navbar({ siteName, youtubeChannel }: { siteName: string; youtubeChannel: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/8 bg-void/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="focus-ring flex items-center gap-2 rounded-lg">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-iris to-azure">
            <Sparkles size={16} className="text-white" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink">{siteName}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "focus-ring rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === l.href ? "text-ink" : "text-mute hover:text-ink",
              )}
            >
              {l.label}
            </Link>
          ))}
          <a
            href={youtubeChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring rounded-lg px-3 py-2 text-sm font-medium text-mute transition-colors hover:text-ink"
          >
            YouTube
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/scripts"
            className="focus-ring hidden items-center gap-2 rounded-lg border border-ink/10 px-3 py-2 text-sm text-mute transition-colors hover:text-ink sm:flex"
            aria-label="Search scripts"
          >
            <Search size={15} />
            <span>Search</span>
          </Link>
          <button
            className="focus-ring rounded-lg p-2 text-ink md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-ink/8 bg-void px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="focus-ring rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-raised"
              >
                {l.label}
              </Link>
            ))}
            <a
              href={youtubeChannel}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-raised"
            >
              YouTube
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
