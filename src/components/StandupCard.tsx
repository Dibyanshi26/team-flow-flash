import { EmojiReactions } from "./EmojiReactions";
import { formatDistanceToNow } from "date-fns";

interface ReactionCount {
  emoji: string;
  count: number;
}

interface StandupCardProps {
  standup: {
    id: string;
    author_name: string;
    yesterday: string;
    today: string;
    blockers: string;
    created_at: string;
  };
  reactions: ReactionCount[];
  onReacted: () => void;
}

export function StandupCard({ standup, reactions, onReacted }: StandupCardProps) {
  const initials = standup.author_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const timeAgo = formatDistanceToNow(new Date(standup.created_at), { addSuffix: true });

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-display font-semibold">
          {initials}
        </div>
        <div>
          <p className="font-display font-semibold text-card-foreground">{standup.author_name}</p>
          <p className="text-xs text-muted-foreground">{timeAgo}</p>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="rounded-lg bg-standup-yesterday px-3 py-2">
          <span className="font-medium text-muted-foreground">🔙 Yesterday</span>
          <p className="mt-1 text-card-foreground whitespace-pre-wrap">{standup.yesterday}</p>
        </div>

        <div className="rounded-lg bg-standup-today px-3 py-2">
          <span className="font-medium text-muted-foreground">🎯 Today</span>
          <p className="mt-1 text-card-foreground whitespace-pre-wrap">{standup.today}</p>
        </div>

        {standup.blockers && (
          <div className="rounded-lg bg-standup-blockers px-3 py-2">
            <span className="font-medium text-muted-foreground">🚧 Blockers</span>
            <p className="mt-1 text-card-foreground whitespace-pre-wrap">{standup.blockers}</p>
          </div>
        )}
      </div>

      <EmojiReactions standupId={standup.id} reactions={reactions} onReacted={onReacted} />
    </div>
  );
}
