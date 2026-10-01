import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-32 text-center sm:px-6">
      <p className="font-mono text-sm text-iris">404</p>
      <h1 className="font-display mt-3 text-3xl font-bold text-ink">Nothing here</h1>
      <p className="mt-3 text-sm text-mute">The page you're looking for doesn't exist or was moved.</p>
      <Link href="/" className="focus-ring mt-8 inline-flex items-center gap-2 rounded-xl bg-iris px-5 py-2.5 text-sm font-medium text-white shadow-glow">
        Back home
      </Link>
    </div>
  );
}
