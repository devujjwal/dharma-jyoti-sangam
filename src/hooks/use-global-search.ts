import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SearchResult {
  id: string;
  content_type: string;
  slug: string;
  title_hi: string;
  title_en: string;
  excerpt: string;
  emoji: string | null;
  color: string | null;
  image_url: string | null;
  sort_rank: number;
}

export function useGlobalSearch(query: string) {
  const trimmed = query.trim();
  return useQuery({
    queryKey: ["global-search", trimmed],
    enabled: trimmed.length >= 2,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("global_search", {
        search_query: trimmed,
        result_limit: 20,
      });
      if (error) throw error;
      return (data || []) as SearchResult[];
    },
    staleTime: 1000 * 60 * 2,
  });
}

const RECENT_KEY = "dj_recent_searches";
const MAX_RECENT = 8;

export function getRecentSearches(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addRecentSearch(query: string) {
  const q = query.trim();
  if (q.length < 2) return;
  const recent = getRecentSearches().filter((r) => r !== q);
  recent.unshift(q);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
}

export function clearRecentSearches() {
  localStorage.removeItem(RECENT_KEY);
}
