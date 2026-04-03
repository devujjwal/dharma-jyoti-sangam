import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import Breadcrumbs from "@/components/Breadcrumbs";
import ShareButton from "@/components/ShareButton";
import RelatedContent from "@/components/RelatedContent";
import TempleMap from "@/components/TempleMap";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTemple } from "@/hooks/use-temples";
import { useSeo } from "@/hooks/use-seo";
import { templeJsonLd } from "@/lib/jsonLd";
import { sanitizeText } from "@/lib/sanitize";
import { MapPin, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const TempleDetailPage = () => {
  const { slug } = useParams();
  const { language } = useLanguage();
  const isHi = language === "hi";
  const { data: temple, isLoading } = useTemple(slug);

  useSeo({
    title: temple ? (isHi ? temple.name_hi : temple.name_en) : undefined,
    description: temple?.seo_description || (temple ? sanitizeText(isHi ? temple.short_description_hi : temple.short_description_en) || undefined : undefined),
    jsonLd: temple ? templeJsonLd({
      name: temple.name_en, slug: temple.slug, description: temple.description_en || undefined,
      latitude: temple.latitude ? Number(temple.latitude) : null,
      longitude: temple.longitude ? Number(temple.longitude) : null,
      city: temple.city, state: temple.state, image_url: temple.image_url,
    }) : undefined,
  });

  if (isLoading) return (<div className="min-h-screen flex flex-col bg-background"><Navigation /><main className="flex-1 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></main><SiteFooter /></div>);
  if (!temple) return (<div className="min-h-screen flex flex-col bg-background"><Navigation /><main className="flex-1 flex items-center justify-center"><div className="text-center"><p className="text-4xl mb-4">🛕</p><h1 className="text-2xl font-devanagari-serif font-bold text-foreground mb-2">{isHi ? "मंदिर नहीं मिला" : "Temple Not Found"}</h1><Link to="/temples" className="text-primary font-devanagari hover:underline">{isHi ? "सभी मंदिर देखें" : "View all temples"}</Link></div></main><SiteFooter /></div>);

  const mapsUrl = temple.latitude && temple.longitude ? `https://www.google.com/maps?q=${temple.latitude},${temple.longitude}` : null;
  const description = sanitizeText(isHi ? temple.description_hi : temple.description_en);
  const templeName = isHi ? temple.name_hi : temple.name_en;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <div className="py-12 border-b border-border" style={{ background: "var(--gradient-sacred)" }}>
          <div className="container mx-auto px-4 max-w-3xl">
            <Breadcrumbs crumbs={[
              { label: isHi ? "मंदिर" : "Temples", href: "/temples" },
              { label: templeName },
            ]} />
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl shrink-0" style={{ background: "hsl(var(--primary-foreground) / 0.15)" }}>{temple.emoji || "🛕"}</div>
              <div>
                <h1 className="text-3xl font-devanagari-serif font-bold text-primary-foreground">{templeName}</h1>
                <div className="flex items-center gap-1 mt-1 text-primary-foreground/70"><MapPin className="w-4 h-4" /><span className="font-devanagari">{isHi ? (temple.address_hi || `${temple.city}, ${temple.state}`) : (temple.address_en || `${temple.city}, ${temple.state}`)}</span></div>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
          {/* Map */}
          {temple.latitude && temple.longitude && (
            <TempleMap
              lat={Number(temple.latitude)}
              lng={Number(temple.longitude)}
              name={templeName}
            />
          )}

          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="text-lg font-devanagari-serif font-bold text-foreground mb-3">{isHi ? "परिचय" : "About"}</h2>
            <p className="text-muted-foreground font-devanagari leading-relaxed">{description}</p>
          </section>

          <div className="grid grid-cols-2 gap-4">
            {(temple.deity_hi || temple.deity_en) && <div className="rounded-xl border border-border bg-card p-4 shadow-card"><p className="text-xs text-muted-foreground font-devanagari mb-1">{isHi ? "मुख्य देवता" : "Main Deity"}</p><p className="font-devanagari font-semibold text-foreground">{isHi ? temple.deity_hi : temple.deity_en}</p></div>}
            {(temple.timings_hi || temple.timings_en) && <div className="rounded-xl border border-border bg-card p-4 shadow-card"><p className="text-xs text-muted-foreground font-devanagari mb-1">{isHi ? "समय" : "Timings"}</p><p className="font-devanagari font-semibold text-foreground">{isHi ? temple.timings_hi : temple.timings_en}</p></div>}
            {temple.type && <div className="rounded-xl border border-border bg-card p-4 shadow-card"><p className="text-xs text-muted-foreground font-devanagari mb-1">{isHi ? "प्रकार" : "Type"}</p><p className="font-devanagari font-semibold text-foreground">{temple.type}</p></div>}
            {temple.city && <div className="rounded-xl border border-border bg-card p-4 shadow-card"><p className="text-xs text-muted-foreground font-devanagari mb-1">{isHi ? "शहर" : "City"}</p><p className="font-devanagari font-semibold text-foreground">{temple.city}, {temple.state}</p></div>}
          </div>

          <RelatedContent sourceType="temple" sourceId={temple.id} />

          <div className="flex flex-wrap gap-3">
            {mapsUrl && <Button asChild variant="outline" className="font-devanagari gap-2"><a href={mapsUrl} target="_blank" rel="noopener noreferrer"><MapPin className="w-4 h-4" />{isHi ? "मार्ग देखें" : "Get Directions"}</a></Button>}
            {temple.website_url && <Button asChild variant="outline" className="font-devanagari gap-2"><a href={temple.website_url} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4" />{isHi ? "वेबसाइट" : "Website"}</a></Button>}
            <ShareButton title={templeName} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default TempleDetailPage;
