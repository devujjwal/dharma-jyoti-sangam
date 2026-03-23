import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PanchangResult {
  tithi_hi: string | null;
  tithi_en: string | null;
  nakshatra_hi: string | null;
  nakshatra_en: string | null;
  yoga_hi: string | null;
  yoga_en: string | null;
  karana_hi: string | null;
  karana_en: string | null;
  paksha_hi: string | null;
  paksha_en: string | null;
  masa_hi: string | null;
  masa_en: string | null;
  sunrise: string | null;
  sunset: string | null;
  moonrise: string | null;
  rahu_kaal: string | null;
  panchang_date: string;
  city: string | null;
  extra_data: Record<string, any> | null;
}

export function usePanchang(date?: string, locationKey?: string) {
  const dateStr = date || new Date().toISOString().split("T")[0];
  const locKey = locationKey || "delhi";

  return useQuery({
    queryKey: ["panchang", dateStr, locKey],
    queryFn: async (): Promise<PanchangResult> => {
      // Check cache first
      const { data: cached } = await supabase
        .from("panchang_cache")
        .select("*")
        .eq("panchang_date", dateStr)
        .eq("location_key", locKey)
        .maybeSingle();

      if (cached) return cached as PanchangResult;

      // Call edge function to generate
      const { data, error } = await supabase.functions.invoke("panchang", {
        body: { date: dateStr, locationKey: locKey, city: "New Delhi" },
      });
      if (error) throw error;
      return data as PanchangResult;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 2,
  });
}
