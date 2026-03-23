import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Temple = Tables<"temples">;

export function useTemples() {
  return useQuery({
    queryKey: ["temples"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("temples")
        .select("*")
        .eq("status", "published")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Temple[];
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useTemple(slug: string | undefined) {
  return useQuery({
    queryKey: ["temple", slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from("temples")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      return data as Temple | null;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 10,
  });
}
