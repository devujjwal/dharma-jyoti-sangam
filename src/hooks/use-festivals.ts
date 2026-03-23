import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Festival = Tables<"festivals">;

export function useFestivals() {
  return useQuery({
    queryKey: ["festivals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("festivals")
        .select("*")
        .eq("status", "published")
        .order("festival_date", { ascending: true });
      if (error) throw error;
      return data as Festival[];
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useFestival(slugOrId: string | undefined) {
  return useQuery({
    queryKey: ["festival", slugOrId],
    queryFn: async () => {
      if (!slugOrId) return null;
      // Try slug first, then id
      let { data, error } = await supabase
        .from("festivals")
        .select("*")
        .eq("slug", slugOrId)
        .eq("status", "published")
        .maybeSingle();
      if (!data && !error) {
        ({ data, error } = await supabase
          .from("festivals")
          .select("*")
          .eq("id", slugOrId)
          .eq("status", "published")
          .maybeSingle());
      }
      if (error) throw error;
      return data as Festival | null;
    },
    enabled: !!slugOrId,
    staleTime: 1000 * 60 * 10,
  });
}
