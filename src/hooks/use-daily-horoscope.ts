import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useDailyHoroscope(rashiId: string | undefined | null) {
  return useQuery({
    queryKey: ["daily-horoscope", rashiId],
    queryFn: async () => {
      if (!rashiId) return null;
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("daily_horoscopes")
        .select("content_hi, content_en")
        .eq("rashi_id", rashiId)
        .eq("horoscope_date", today)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!rashiId,
    staleTime: 1000 * 60 * 30, // 30 min
  });
}
