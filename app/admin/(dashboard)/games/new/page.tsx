import { createGame } from "@/lib/actions";
import { GameForm } from "@/components/admin/GameForm";

export default function NewGamePage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Add game</h1>
      <div className="mt-6">
        <GameForm action={createGame} submitLabel="Create game" />
      </div>
    </div>
  );
}
