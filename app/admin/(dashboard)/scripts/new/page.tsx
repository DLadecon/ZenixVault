import { prisma } from "@/lib/prisma";
import { createScript } from "@/lib/actions";
import { ScriptForm } from "@/components/admin/ScriptForm";

export default async function NewScriptPage() {
  const games = await prisma.game.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Add script</h1>
      {games.length === 0 ? (
        <p className="mt-4 text-sm text-mute">Add a game first, then come back here.</p>
      ) : (
        <div className="mt-6">
          <ScriptForm action={createScript} games={games} submitLabel="Publish or save" />
        </div>
      )}
    </div>
  );
}
