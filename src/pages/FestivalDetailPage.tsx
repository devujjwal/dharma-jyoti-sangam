import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFestival } from "@/hooks/use-festivals";
import { useSeo } from "@/hooks/use-seo";
import { sanitizeText } from "@/lib/sanitize";
import { Calendar, ArrowLeft, CalendarPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import RelatedContent from "@/components/RelatedContent";

function downloadICS(festival: any) {
  const [y, m, d] = festival.festival_date.split("-").map(Number);
  const pad = (n: number) => String(n).padStart(2, "0");
  const dateStr = `${y}${pad(m)}${pad(d)}`;
  const nextDate = new Date(y, m - 1, d + 1);
  const endStr = `${nextDate.getFullYear()}${pad(nextDate.getMonth() + 1)}${pad(nextDate.getDate())}`;
  const ics = ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Divya Jyoti//EN","BEGIN:VEVENT",`UID:${festival.slug}@divyajyoti`,`DTSTART;VALUE=DATE:${dateStr}`,`DTEND;VALUE=DATE:${endStr}`,`SUMMARY:${festival.emoji||""} ${festival.name_en}`,`DESCRIPTION:${sanitizeText(festival.description_en)}`,"END:VEVENT","END:VCALENDAR"].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `${festival.slug}.ics`; a.click(); URL.revokeObjectURL(url);
}

const FestivalDetailPage = () => {
  const { festivalId } = useParams();
  const { language } = useLanguage();
  const isHi = language === "hi";
  const { data: festival, isLoading } = useFestival(festivalId);

  useSeo({
    title: festival ? (isHi ? festival.name_hi : festival.name_en) : undefined,
    description: festival?.seo_description || (festival ? sanitizeText(isHi ? festival.excerpt_hi : festival.excerpt_en) || undefined : undefined),
  });

  if (isLoading) return (<div className="min-h-screen flex flex-col bg-background"><Navigation /><main className="flex-1 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></main><SiteFooter /></div>);

  if (!festival) return (
    <div className="min-h-screen flex flex-col bg-background"><Navigation /><main className="flex-1 flex items-center justify-center"><div className="text-center"><p className="text-4xl mb-4">🎊</p><h1 className="text-2xl font-devanagari-serif font-bold text-foreground mb-2">{isHi ? "त्यौहार नहीं मिला" : "Festival Not Found"}</h1><Link to="/festivals" className="text-primary font-devanagari hover:underline">{isHi ? "सभी त्यौहार देखें" : "View all festivals"}</Link></div></main><SiteFooter /></div>
  );

  const color = festival.color || "hsl(24 95% 48%)";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <div className="py-12 border-b border-border" style={{ background: `linear-gradient(135deg, ${color}20, ${color}05)` }}>
          <div className="container mx-auto px-4 max-w-3xl">
            <Link to="/festivals" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary font-devanagari mb-4 transition-colors"><ArrowLeft className="w-4 h-4" />{isHi ? "सभी त्यौहार" : "All Festivals"}</Link>
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl shrink-0" style={{ background: `${color}20`, border: `2px solid ${color}40` }}>{festival.emoji || "🎊"}</div>
              <div>
                <h1 className="text-3xl font-devanagari-serif font-bold text-foreground">{isHi ? festival.name_hi : festival.name_en}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="inline-flex items-center gap-1 text-sm font-devanagari" style={{ color }}><Calendar className="w-4 h-4" /> {festival.festival_date}</span>
                  {festival.tithi && <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-devanagari">{festival.tithi}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="text-lg font-devanagari-serif font-bold text-foreground mb-3">{isHi ? "विवरण" : "Description"}</h2>
            <p className="text-muted-foreground font-devanagari leading-relaxed">{sanitizeText(isHi ? festival.description_hi : festival.description_en)}</p>
          </section>
          {(festival.significance_hi || festival.significance_en) && (
            <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h2 className="text-lg font-devanagari-serif font-bold text-foreground mb-3">{isHi ? "महत्व" : "Significance"}</h2>
              <p className="text-muted-foreground font-devanagari leading-relaxed">{sanitizeText(isHi ? festival.significance_hi : festival.significance_en)}</p>
            </section>
          )}
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => downloadICS(festival)} variant="outline" className="font-devanagari gap-2"><CalendarPlus className="w-4 h-4" />{isHi ? "कैलेंडर में जोड़ें" : "Add to Calendar"}</Button>
            <Button asChild variant="outline" className="font-devanagari"><Link to="/festivals">{isHi ? "सभी त्यौहार देखें" : "View All Festivals"}</Link></Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default FestivalDetailPage;
