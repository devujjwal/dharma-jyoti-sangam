import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface RelatedItem {
  id: string;
  type: string;
  slug: string;
  title_hi: string;
  title_en: string;
  emoji?: string | null;
  color?: string | null;
  image_url?: string | null;
}

async function fetchItemsByType(type: string, ids: string[]): Promise<RelatedItem[]> {
  if (ids.length === 0) return [];

  switch (type) {
    case "festival": {
      const { data } = await supabase.from("festivals").select("id,slug,name_hi,name_en,emoji,color,image_url").in("id", ids).eq("status", "published");
      return (data || []).map(r => ({ id: r.id, type, slug: r.slug, title_hi: r.name_hi, title_en: r.name_en, emoji: r.emoji, color: r.color, image_url: r.image_url }));
    }
    case "temple": {
      const { data } = await supabase.from("temples").select("id,slug,name_hi,name_en,emoji,image_url").in("id", ids).eq("status", "published");
      return (data || []).map(r => ({ id: r.id, type, slug: r.slug, title_hi: r.name_hi, title_en: r.name_en, emoji: r.emoji, color: null, image_url: r.image_url }));
    }
    case "article": {
      const { data } = await supabase.from("articles").select("id,slug,title_hi,title_en,emoji,color,featured_image_url").in("id", ids).eq("status", "published");
      return (data || []).map(r => ({ id: r.id, type, slug: r.slug, title_hi: r.title_hi, title_en: r.title_en, emoji: r.emoji, color: r.color, image_url: r.featured_image_url }));
    }
    case "bhajan": {
      const { data } = await supabase.from("bhajans").select("id,slug,title_hi,title_en,image_url").in("id", ids).eq("status", "published");
      return (data || []).map(r => ({ id: r.id, type, slug: r.slug, title_hi: r.title_hi, title_en: r.title_en, emoji: null, color: null, image_url: r.image_url }));
    }
    case "vrat": {
      const { data } = await supabase.from("vrats").select("id,slug,name_hi,name_en,emoji,color,image_url").in("id", ids).eq("status", "published");
      return (data || []).map(r => ({ id: r.id, type, slug: r.slug, title_hi: r.name_hi, title_en: r.name_en, emoji: r.emoji, color: r.color, image_url: r.image_url }));
    }
    default:
      return [];
  }
}

export function useContentRelations(sourceType: string, sourceId?: string) {
  return useQuery({
    queryKey: ["content-relations", sourceType, sourceId],
    enabled: !!sourceId,
    queryFn: async (): Promise<RelatedItem[]> => {
      const { data: relations, error } = await supabase
        .from("content_relations")
        .select("*")
        .or(
          `and(source_type.eq.${sourceType},source_id.eq.${sourceId}),and(target_type.eq.${sourceType},target_id.eq.${sourceId})`
        )
        .order("sort_order", { ascending: true });

      if (error) throw error;
      if (!relations || relations.length === 0) return [];

      const targets: { type: string; id: string }[] = [];
      for (const r of relations) {
        if (r.source_type === sourceType && r.source_id === sourceId) {
          targets.push({ type: r.target_type, id: r.target_id });
        } else {
          targets.push({ type: r.source_type, id: r.source_id });
        }
      }

      const grouped = targets.reduce<Record<string, string[]>>((acc, t) => {
        (acc[t.type] = acc[t.type] || []).push(t.id);
        return acc;
      }, {});

      const results = await Promise.all(
        Object.entries(grouped).map(([type, ids]) => fetchItemsByType(type, ids))
      );

      return results.flat();
    },
    staleTime: 1000 * 60 * 10,
  });
}
