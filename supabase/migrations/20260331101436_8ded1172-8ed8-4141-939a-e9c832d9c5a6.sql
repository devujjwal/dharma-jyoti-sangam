
-- Add preference columns to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_city text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_deity text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS reminder_preferences jsonb NOT NULL DEFAULT '{}';
