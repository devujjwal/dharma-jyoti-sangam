CREATE TABLE public.daily_horoscopes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rashi_id text NOT NULL,
  horoscope_date date NOT NULL DEFAULT CURRENT_DATE,
  content_hi text NOT NULL,
  content_en text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (rashi_id, horoscope_date)
);

ALTER TABLE public.daily_horoscopes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read daily horoscopes"
  ON public.daily_horoscopes
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Service role can insert horoscopes"
  ON public.daily_horoscopes
  FOR INSERT
  TO service_role
  WITH CHECK (true);