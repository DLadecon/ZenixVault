import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateScript } from "@/lib/actions";
import { ScriptForm } from "@/components/admin/ScriptForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditScriptPage({ params }: Props) {
  const { id } = await params;
  const [script, games] = await Promise.all([
    prisma.script.findUnique({ where: { id } }),
    prisma.game.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!script) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Edit script</h1>
      <div className="mt-6">
        <ScriptForm action={updateScript.bind(null, id)} games={games} defaultValues={script} submitLabel="Save changes" />
      </div>
    </div>
  );
}
