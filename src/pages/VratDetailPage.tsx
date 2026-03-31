import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import RelatedContent from "@/components/RelatedContent";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSeo } from "@/hooks/use-seo";
import { sanitizeText } from "@/lib/sanitize";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";
import type { Vrat, VratOccurrence } from "@/hooks/use-vrats";

function useVratBySlug(slug?: string) {
  return useQuery({
    queryKey: ["vrat", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vrats")
        .select("*")
        .eq("slug", slug!)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      return data as Vrat | null;
    },
    staleTime: 1000 * 60 * 10,
  });
}

function useUpcomingOccurrences(vratId?: string) {
  return useQuery({
    queryKey: ["vrat-occurrences", vratId],
    enabled: !!vratId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vrat_occurrences")
        .select("*")
        .eq("vrat_id", vratId!)
        .gte("occurrence_date", new Date().toISOString().split("T")[0])
        .order("occurrence_date", { ascending: true })
        .limit(12);
      if (error) throw error;
      return data as VratOccurrence[];
    },
    staleTime: 1000 * 60 * 30,
  });
}

const VratDetailPage = () => {
  const { slug } = useParams();
  const { language } = useLanguage();
  const isHi = language === "hi";
  const { data: vrat, isLoading } = useVratBySlug(slug);
  const { data: occurrences } = useUpcomingOccurrences(vrat?.id);

  useSeo({
    title: vrat ? (isHi ? vrat.name_hi : vrat.name_en) : undefined,
    description: vrat?.seo_description || (vrat ? sanitizeText(isHi ? vrat.description_hi : vrat.description_en) || undefined : undefined),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <main className="flex-1 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></main>
        <SiteFooter />
      </div>
    );
  }

  if (!vrat) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-4xl mb-4">🙏</p>
            <h1 className="text-2xl font-devanagari-serif font-bold text-foreground mb-2">{isHi ? "व्रत नहीं मिला" : "Vrat Not Found"}</h1>
            <Link to="/vrat" className="text-primary font-devanagari hover:underline">{isHi ? "सभी व्रत देखें" : "View all vrats"}</Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const color = vrat.color || "hsl(24 95% 48%)";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        {/* Hero */}
        <div className="py-12 border-b border-border" style={{ background: `linear-gradient(135deg, ${color}20, ${color}05)` }}>
          <div className="container mx-auto px-4 max-w-3xl">
            <Link to="/vrat" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary font-devanagari mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />{isHi ? "सभी व्रत" : "All Vrats"}
            </Link>
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl shrink-0" style={{ background: `${color}20`, border: `2px solid ${color}40` }}>
                {vrat.emoji || "🙏"}
              </div>
              <div>
                <h1 className="text-3xl font-devanagari-serif font-bold text-foreground">{isHi ? vrat.name_hi : vrat.name_en}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {(vrat.deity_hi || vrat.deity_en) && (
                    <span className="text-sm px-3 py-0.5 rounded-full font-devanagari" style={{ background: `${color}15`, color }}>{isHi ? vrat.deity_hi : vrat.deity_en}</span>
                  )}
                  {vrat.fasting_day && <span className="text-sm text-muted-foreground font-devanagari">{vrat.fasting_day}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
          {/* Description */}
          {(vrat.description_hi || vrat.description_en) && (
            <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h2 className="text-lg font-devanagari-serif font-bold text-foreground mb-3">{isHi ? "विवरण" : "Description"}</h2>
              <p className="text-muted-foreground font-devanagari leading-relaxed">{sanitizeText(isHi ? vrat.description_hi : vrat.description_en)}</p>
            </section>
          )}

          {/* Rules */}
          {(vrat.rules_hi || vrat.rules_en) && (
            <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h2 className="text-lg font-devanagari-serif font-bold text-foreground mb-3">{isHi ? "नियम" : "Rules"}</h2>
              <p className="text-muted-foreground font-devanagari leading-relaxed">{sanitizeText(isHi ? vrat.rules_hi : vrat.rules_en)}</p>
            </section>
          )}

          {/* Benefits */}
          {(vrat.benefits_hi || vrat.benefits_en) && (
            <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h2 className="text-lg font-devanagari-serif font-bold text-foreground mb-3">{isHi ? "लाभ" : "Benefits"}</h2>
              <p className="text-muted-foreground font-devanagari leading-relaxed">{sanitizeText(isHi ? vrat.benefits_hi : vrat.benefits_en)}</p>
            </section>
          )}

          {/* Upcoming Occurrences */}
          {occurrences && occurrences.length > 0 && (
            <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h2 className="text-lg font-devanagari-serif font-bold text-foreground mb-3">{isHi ? "आगामी तिथियाँ" : "Upcoming Dates"}</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {occurrences.map((occ) => (
                  <div key={occ.id} className="flex items-center gap-3 rounded-xl bg-muted/40 px-4 py-3">
                    <Calendar className="w-4 h-4 text-primary shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-foreground font-devanagari">{occ.occurrence_date}</p>
                      {occ.notes && <p className="text-xs text-muted-foreground font-devanagari">{occ.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Related Content */}
          <RelatedContent sourceType="vrat" sourceId={vrat.id} />

          <div className="flex flex-wrap gap-3">
            <Link to="/vrat" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card font-devanagari text-sm hover:bg-muted transition-colors">
              {isHi ? "सभी व्रत देखें" : "View All Vrats"}
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default VratDetailPage;
