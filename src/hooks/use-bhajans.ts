import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Bhajan = Tables<"bhajans">;

export function useBhajans() {
  return useQuery({
    queryKey: ["bhajans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bhajans")
        .select("*")
        .eq("status", "published")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Bhajan[];
    },
    staleTime: 1000 * 60 * 10,
  });
}
