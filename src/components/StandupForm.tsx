import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Send } from "lucide-react";

export function StandupForm({ onSubmitted }: { onSubmitted: () => void }) {
  const { user, displayName } = useAuth();
  const [yesterday, setYesterday] = useState("");
  const [today, setToday] = useState("");
  const [blockers, setBlockers] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!yesterday.trim() || !today.trim()) {
      toast.error("Please fill in yesterday and today fields.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("standups").insert({
      author_name: displayName,
      yesterday: yesterday.trim(),
      today: today.trim(),
      blockers: blockers.trim(),
      user_id: user.id,
    });

    if (error) {
      toast.error("Failed to post standup.");
    } else {
      toast.success("Standup posted! 🎉");
      setYesterday("");
      setToday("");
      setBlockers("");
      onSubmitted();
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Posting as <span className="font-medium text-foreground">{displayName}</span>
      </p>

      <div className="rounded-lg bg-standup-yesterday p-3">
        <label className="block text-sm font-medium text-foreground mb-1.5">🔙 Yesterday</label>
        <Textarea
          value={yesterday}
          onChange={(e) => setYesterday(e.target.value)}
          placeholder="What did you work on?"
          rows={2}
          maxLength={500}
          className="bg-card/80 border-none resize-none"
        />
      </div>

      <div className="rounded-lg bg-standup-today p-3">
        <label className="block text-sm font-medium text-foreground mb-1.5">🎯 Today</label>
        <Textarea
          value={today}
          onChange={(e) => setToday(e.target.value)}
          placeholder="What are you working on today?"
          rows={2}
          maxLength={500}
          className="bg-card/80 border-none resize-none"
        />
      </div>

      <div className="rounded-lg bg-standup-blockers p-3">
        <label className="block text-sm font-medium text-foreground mb-1.5">🚧 Blockers</label>
        <Textarea
          value={blockers}
          onChange={(e) => setBlockers(e.target.value)}
          placeholder="Anything blocking you? (optional)"
          rows={2}
          maxLength={500}
          className="bg-card/80 border-none resize-none"
        />
      </div>

      <Button type="submit" disabled={submitting} className="w-full gap-2 font-display text-base h-11">
        <Send className="w-4 h-4" />
        {submitting ? "Posting…" : "Post Standup"}
      </Button>
    </form>
  );
}
