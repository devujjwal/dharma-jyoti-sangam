import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Vrat = Tables<"vrats">;
export type VratOccurrence = Tables<"vrat_occurrences">;

export function useVrats() {
  return useQuery({
    queryKey: ["vrats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vrats")
        .select("*")
        .eq("status", "published")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Vrat[];
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useVratOccurrences(vratId?: string) {
  return useQuery({
    queryKey: ["vrat-occurrences", vratId],
    queryFn: async () => {
      let q = supabase
        .from("vrat_occurrences")
        .select("*")
        .gte("occurrence_date", new Date().toISOString().split("T")[0])
        .order("occurrence_date", { ascending: true })
        .limit(10);
      if (vratId) q = q.eq("vrat_id", vratId);
      const { data, error } = await q;
      if (error) throw error;
      return data as VratOccurrence[];
    },
    staleTime: 1000 * 60 * 30,
  });
}
