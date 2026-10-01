"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "az", label: "A–Z" },
] as const;

function Select({
  paramKey,
  options,
  placeholder,
}: {
  paramKey: string;
  options: { value: string; label: string }[];
  placeholder: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  return (
    <select
      value={params.get(paramKey) ?? ""}
      onChange={(e) => {
        const next = new URLSearchParams(params.toString());
        if (e.target.value) next.set(paramKey, e.target.value);
        else next.delete(paramKey);
        next.delete("page");
        router.replace(`${pathname}?${next.toString()}`);
      }}
      className="focus-ring card-surface rounded-xl px-3 py-2.5 text-sm text-ink"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Filters({ games, categories }: { games: { slug: string; name: string }[]; categories: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Select paramKey="game" placeholder="All games" options={games.map((g) => ({ value: g.slug, label: g.name }))} />
      <Select paramKey="category" placeholder="All categories" options={categories.map((c) => ({ value: c, label: c }))} />
      <Select paramKey="sort" placeholder="Newest" options={SORTS as unknown as { value: string; label: string }[]} />
    </div>
  );
}
