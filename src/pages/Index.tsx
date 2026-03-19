import { useState } from "react";
import { StandupForm } from "@/components/StandupForm";
import { StandupFeed } from "@/components/StandupFeed";
import { Radio } from "lucide-react";

const Index = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Radio className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-foreground leading-tight">
              Standup
            </h1>
            <p className="text-xs text-muted-foreground">Async daily updates for your team</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <section className="rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="font-display font-semibold text-foreground mb-4">Post your standup</h2>
          <StandupForm onSubmitted={() => setRefreshKey((k) => k + 1)} />
        </section>

        <section>
          <h2 className="font-display font-semibold text-foreground mb-4">Today's feed</h2>
          <StandupFeed refreshKey={refreshKey} />
        </section>
      </main>
    </div>
  );
};

export default Index;
