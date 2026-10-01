import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateGame } from "@/lib/actions";
import { GameForm } from "@/components/admin/GameForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditGamePage({ params }: Props) {
  const { id } = await params;
  const game = await prisma.game.findUnique({ where: { id } });
  if (!game) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Edit game</h1>
      <div className="mt-6">
        <GameForm action={updateGame.bind(null, id)} defaultValues={game} submitLabel="Save changes" />
      </div>
    </div>
  );
}
