import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const siteUrl = "https://dharma-jyoti-sangam.lovable.app";

Deno.serve(async () => {
  const supabase = createClient(supabaseUrl, supabaseKey);

  const [articles, festivals, temples, bhajans, vrats] = await Promise.all([
    supabase.from("articles").select("slug, updated_at").eq("status", "published").limit(500),
    supabase.from("festivals").select("slug, updated_at").eq("status", "published").limit(500),
    supabase.from("temples").select("slug, updated_at").eq("status", "published").limit(500),
    supabase.from("bhajans").select("slug, updated_at").eq("status", "published").limit(500),
    supabase.from("vrats").select("slug, updated_at").eq("status", "published").limit(500),
  ]);

  const staticPages = [
    { loc: "/", priority: "1.0", changefreq: "daily" },
    { loc: "/horoscope", priority: "0.9", changefreq: "daily" },
    { loc: "/panchang", priority: "0.9", changefreq: "daily" },
    { loc: "/festivals", priority: "0.8", changefreq: "weekly" },
    { loc: "/articles", priority: "0.8", changefreq: "weekly" },
    { loc: "/temples", priority: "0.7", changefreq: "monthly" },
    { loc: "/bhajans", priority: "0.7", changefreq: "monthly" },
    { loc: "/vrat", priority: "0.7", changefreq: "weekly" },
    { loc: "/kundali", priority: "0.6", changefreq: "monthly" },
    { loc: "/kundali-matching", priority: "0.6", changefreq: "monthly" },
    { loc: "/about", priority: "0.3", changefreq: "yearly" },
    { loc: "/contact", priority: "0.3", changefreq: "yearly" },
  ];

  const toEntry = (loc: string, lastmod?: string, priority = "0.5", changefreq = "weekly") =>
    `  <url><loc>${siteUrl}${loc}</loc>${lastmod ? `<lastmod>${lastmod.split("T")[0]}</lastmod>` : ""}<changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;

  const urls: string[] = [];

  for (const p of staticPages) urls.push(toEntry(p.loc, undefined, p.priority, p.changefreq));
  for (const a of articles.data || []) urls.push(toEntry(`/articles/${a.slug}`, a.updated_at, "0.7"));
  for (const f of festivals.data || []) urls.push(toEntry(`/festivals/${f.slug}`, f.updated_at, "0.7"));
  for (const t of temples.data || []) urls.push(toEntry(`/temples/${t.slug}`, t.updated_at, "0.6"));
  for (const b of bhajans.data || []) urls.push(toEntry(`/bhajans/${b.slug}`, b.updated_at, "0.5"));
  for (const v of vrats.data || []) urls.push(toEntry(`/vrat/${v.slug}`, v.updated_at, "0.6"));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
});
