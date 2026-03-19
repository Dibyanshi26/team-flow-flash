import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StandupCard } from "./StandupCard";
import { Loader2 } from "lucide-react";

interface Standup {
  id: string;
  author_name: string;
  yesterday: string;
  today: string;
  blockers: string;
  created_at: string;
}

interface ReactionRow {
  standup_id: string;
  emoji: string;
}

export function StandupFeed({ refreshKey }: { refreshKey: number }) {
  const [standups, setStandups] = useState<Standup[]>([]);
  const [reactions, setReactions] = useState<ReactionRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [{ data: standupData }, { data: reactionData }] = await Promise.all([
      supabase
        .from("standups")
        .select("*")
        .gte("created_at", todayStart.toISOString())
        .order("created_at", { ascending: false }),
      supabase.from("reactions").select("standup_id, emoji"),
    ]);

    setStandups(standupData || []);
    setReactions(reactionData || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshKey]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("standups-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "standups" }, () => fetchData())
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "reactions" }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData]);

  const getReactionsForStandup = (standupId: string) => {
    const counts: Record<string, number> = {};
    reactions
      .filter((r) => r.standup_id === standupId)
      .forEach((r) => {
        counts[r.emoji] = (counts[r.emoji] || 0) + 1;
      });
    return Object.entries(counts).map(([emoji, count]) => ({ emoji, count }));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (standups.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-3">☕</p>
        <p className="text-muted-foreground font-medium">No standups yet today.</p>
        <p className="text-sm text-muted-foreground">Be the first to share what you're working on!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground font-medium">
        {standups.length} standup{standups.length !== 1 ? "s" : ""} today
      </p>
      {standups.map((standup) => (
        <StandupCard
          key={standup.id}
          standup={standup}
          reactions={getReactionsForStandup(standup.id)}
          onReacted={fetchData}
        />
      ))}
    </div>
  );
}
