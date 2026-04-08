DROP FUNCTION IF EXISTS public.global_search(text, integer);

CREATE FUNCTION public.global_search(search_query text, result_limit integer DEFAULT 20)
 RETURNS TABLE(id uuid, content_type text, slug text, title_hi text, title_en text, excerpt text, emoji text, color text, image_url text, sort_rank integer)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  q text := '%' || lower(search_query) || '%';
BEGIN
  RETURN QUERY
  SELECT * FROM (
    (SELECT f.id, 'festival'::text, f.slug, f.name_hi, f.name_en,
           COALESCE(f.excerpt_en, LEFT(f.description_en, 120)),
           f.emoji, f.color, f.image_url, 1 AS sort_rank
    FROM public.festivals f
    WHERE f.status = 'published'
      AND (lower(f.name_hi) LIKE q OR lower(f.name_en) LIKE q OR lower(COALESCE(f.description_en,'')) LIKE q OR lower(COALESCE(f.description_hi,'')) LIKE q)
    LIMIT result_limit)

    UNION ALL

    (SELECT a.id, 'article'::text, a.slug, a.title_hi, a.title_en,
           COALESCE(a.excerpt_en, LEFT(a.content_en, 120)),
           a.emoji, a.color, a.featured_image_url, 2 AS sort_rank
    FROM public.articles a
    WHERE a.status = 'published'
      AND (lower(a.title_hi) LIKE q OR lower(a.title_en) LIKE q OR lower(COALESCE(a.excerpt_en,'')) LIKE q OR lower(COALESCE(a.content_en,'')) LIKE q)
    LIMIT result_limit)

    UNION ALL

    (SELECT t.id, 'temple'::text, t.slug, t.name_hi, t.name_en,
           COALESCE(t.short_description_en, LEFT(COALESCE(t.description_en,''), 120)),
           t.emoji, NULL::text, t.image_url, 3 AS sort_rank
    FROM public.temples t
    WHERE t.status = 'published'
      AND (lower(t.name_hi) LIKE q OR lower(t.name_en) LIKE q OR lower(COALESCE(t.description_en,'')) LIKE q OR lower(COALESCE(t.city,'')) LIKE q)
    LIMIT result_limit)

    UNION ALL

    (SELECT b.id, 'bhajan'::text, b.slug, b.title_hi, b.title_en,
           COALESCE(b.short_description_en, ''),
           NULL::text, NULL::text, b.image_url, 4 AS sort_rank
    FROM public.bhajans b
    WHERE b.status = 'published'
      AND (lower(b.title_hi) LIKE q OR lower(b.title_en) LIKE q OR lower(COALESCE(b.deity_en,'')) LIKE q OR lower(COALESCE(b.deity_hi,'')) LIKE q)
    LIMIT result_limit)

    UNION ALL

    (SELECT v.id, 'vrat'::text, v.slug, v.name_hi, v.name_en,
           COALESCE(v.description_en, ''),
           v.emoji, v.color, v.image_url, 5 AS sort_rank
    FROM public.vrats v
    WHERE v.status = 'published'
      AND (lower(v.name_hi) LIKE q OR lower(v.name_en) LIKE q OR lower(COALESCE(v.description_en,'')) LIKE q OR lower(COALESCE(v.deity_en,'')) LIKE q)
    LIMIT result_limit)
  ) AS combined
  ORDER BY combined.sort_rank
  LIMIT result_limit;
END;
$function$;