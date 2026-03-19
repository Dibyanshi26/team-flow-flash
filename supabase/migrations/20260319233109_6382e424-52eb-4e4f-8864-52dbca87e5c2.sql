
-- Create standups table
CREATE TABLE public.standups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name TEXT NOT NULL,
  yesterday TEXT NOT NULL,
  today TEXT NOT NULL,
  blockers TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.standups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read standups" ON public.standups FOR SELECT USING (true);
CREATE POLICY "Anyone can insert standups" ON public.standups FOR INSERT WITH CHECK (true);

-- Create reactions table
CREATE TABLE public.reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  standup_id UUID NOT NULL REFERENCES public.standups(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reactions" ON public.reactions FOR SELECT USING (true);
CREATE POLICY "Anyone can insert reactions" ON public.reactions FOR INSERT WITH CHECK (true);

CREATE INDEX idx_reactions_standup_id ON public.reactions(standup_id);
CREATE INDEX idx_standups_created_at ON public.standups(created_at DESC);
