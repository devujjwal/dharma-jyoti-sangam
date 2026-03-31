
-- Wave 1: content_relations junction table + panchang_cache source_confidence

CREATE TABLE public.content_relations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type text NOT NULL,
  source_id uuid NOT NULL,
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  relation_type text NOT NULL DEFAULT 'related',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (source_type, source_id, target_type, target_id)
);

ALTER TABLE public.content_relations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read content relations"
  ON public.content_relations FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins manage content relations"
  ON public.content_relations FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE INDEX idx_content_relations_source ON public.content_relations (source_type, source_id);
CREATE INDEX idx_content_relations_target ON public.content_relations (target_type, target_id);

-- Add source_confidence to panchang_cache
ALTER TABLE public.panchang_cache ADD COLUMN IF NOT EXISTS source_confidence text NOT NULL DEFAULT 'ai_generated';

-- Add shubh_muhurat to panchang_cache
ALTER TABLE public.panchang_cache ADD COLUMN IF NOT EXISTS shubh_muhurat text;

-- Add samvat_year to panchang_cache  
ALTER TABLE public.panchang_cache ADD COLUMN IF NOT EXISTS samvat_year text;

-- Add vrat_of_day to panchang_cache
ALTER TABLE public.panchang_cache ADD COLUMN IF NOT EXISTS vrat_of_day text;
