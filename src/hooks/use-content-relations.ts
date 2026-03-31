import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ContentRelation {
  id: string;
  source_type: string;
  source_id: string;
  target_type: string;
  target_id: string;
  relation_type: string;
  sort_order: number;
}

interface RelatedItem {
  id: string;
  type: string;
  slug: string;
  title_hi: string;
  title_en: string;
  emoji?: string;
  color?: string;
  image_url?: string;
  short_description_hi?: string;
  short_description_en?: string;
}

const TABLE_MAP: Record<string, string> = {
  festival: "festivals",
  temple: "temples",
  article: "articles",
  bhajan: "bhajans",
  vrat: "vrats",
};

const TITLE_FIELDS: Record<string, { hi: string; en: string }> = {
  festival: { hi: "name_hi", en: "name_en" },
  temple: { hi: "name_hi", en: "name_en" },
  article: { hi: "title_hi", en: "title_en" },
  bhajan: { hi: "title_hi", en: "title_en" },
  vrat: { hi: "name_hi", en: "name_en" },
};

export function useContentRelations(sourceType: string, sourceId?: string) {
  return useQuery({
    queryKey: ["content-relations", sourceType, sourceId],
    enabled: !!sourceId,
    queryFn: async (): Promise<RelatedItem[]> => {
      // Get relations where this entity is source OR target
      const { data: relations, error } = await supabase
        .from("content_relations")
        .select("*")
        .or(
          `and(source_type.eq.${sourceType},source_id.eq.${sourceId}),and(target_type.eq.${sourceType},target_id.eq.${sourceId})`
        )
        .order("sort_order", { ascending: true });

      if (error) throw error;
      if (!relations || relations.length === 0) return [];

      // Collect unique target entities to fetch
      const targets: { type: string; id: string }[] = [];
      for (const r of relations) {
        if (r.source_type === sourceType && r.source_id === sourceId) {
          targets.push({ type: r.target_type, id: r.target_id });
        } else {
          targets.push({ type: r.source_type, id: r.source_id });
        }
      }

      // Group by type and fetch
      const grouped = targets.reduce<Record<string, string[]>>((acc, t) => {
        (acc[t.type] = acc[t.type] || []).push(t.id);
        return acc;
      }, {});

      const items: RelatedItem[] = [];

      await Promise.all(
        Object.entries(grouped).map(async ([type, ids]) => {
          const table = TABLE_MAP[type];
          if (!table) return;
          const fields = TITLE_FIELDS[type];
          const selectFields = `id,slug,emoji,color,image_url,${fields.hi},${fields.en}`;
          const { data } = await supabase
            .from(table)
            .select(selectFields)
            .in("id", ids)
            .eq("status", "published");

          if (data) {
            for (const row of data) {
              items.push({
                id: row.id,
                type,
                slug: row.slug,
                title_hi: (row as any)[fields.hi] || "",
                title_en: (row as any)[fields.en] || "",
                emoji: row.emoji,
                color: row.color,
                image_url: row.image_url,
              });
            }
          }
        })
      );

      return items;
    },
    staleTime: 1000 * 60 * 10,
  });
}
