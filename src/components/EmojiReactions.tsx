import { supabase } from "@/integrations/supabase/client";

const EMOJIS = ["👍", "🔥", "💪", "🎉", "❤️"];

interface ReactionCount {
  emoji: string;
  count: number;
}

interface EmojiReactionsProps {
  standupId: string;
  reactions: ReactionCount[];
  onReacted: () => void;
}

export function EmojiReactions({ standupId, reactions, onReacted }: EmojiReactionsProps) {
  const handleReaction = async (emoji: string) => {
    await supabase.from("reactions").insert({ standup_id: standupId, emoji });
    onReacted();
  };

  return (
    <div className="flex flex-wrap gap-1.5 pt-2">
      {EMOJIS.map((emoji) => {
        const count = reactions.find((r) => r.emoji === emoji)?.count || 0;
        return (
          <button
            key={emoji}
            onClick={() => handleReaction(emoji)}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm transition-all hover:scale-110 active:scale-95 ${
              count > 0
                ? "bg-primary/10 border border-primary/20"
                : "bg-secondary border border-transparent hover:border-border"
            }`}
          >
            <span>{emoji}</span>
            {count > 0 && (
              <span className="text-xs font-medium text-muted-foreground">{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
