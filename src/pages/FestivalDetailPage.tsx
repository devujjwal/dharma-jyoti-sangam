import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import { useLanguage } from "@/contexts/LanguageContext";
import { UPCOMING_FESTIVALS } from "@/data/astroData";
import { Calendar, ArrowLeft, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

function downloadICS(festival: typeof UPCOMING_FESTIVALS[0]) {
  const [y, m, d] = festival.isoDate.split("-").map(Number);
  const pad = (n: number) => String(n).padStart(2, "0");
  const dateStr = `${y}${pad(m)}${pad(d)}`;
  const nextDate = new Date(y, m - 1, d + 1);
  const endStr = `${nextDate.getFullYear()}${pad(nextDate.getMonth() + 1)}${pad(nextDate.getDate())}`;
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Divya Jyoti//EN", "BEGIN:VEVENT",
    `UID:${festival.id}@divyajyoti`, `DTSTART;VALUE=DATE:${dateStr}`, `DTEND;VALUE=DATE:${endStr}`,
    `SUMMARY:${festival.emoji} ${festival.nameEn}`, `DESCRIPTION:${festival.descEn}`,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = `${festival.id}.ics`; a.click();
  URL.revokeObjectURL(url);
}

const FestivalDetailPage = () => {
  const { festivalId } = useParams();
  const { language } = useLanguage();
  const isHi = language === "hi";

  const festival = UPCOMING_FESTIVALS.find(f => f.id === festivalId);

  if (!festival) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-4xl mb-4">🎊</p>
            <h1 className="text-2xl font-devanagari-serif font-bold text-foreground mb-2">{isHi ? "त्यौहार नहीं मिला" : "Festival Not Found"}</h1>
            <Link to="/festivals" className="text-primary font-devanagari hover:underline">{isHi ? "सभी त्यौहार देखें" : "View all festivals"}</Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        {/* Hero */}
        <div className="py-12 border-b border-border" style={{ background: `linear-gradient(135deg, ${festival.color}20, ${festival.color}05)` }}>
          <div className="container mx-auto px-4 max-w-3xl">
            <Link to="/festivals" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary font-devanagari mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              {isHi ? "सभी त्यौहार" : "All Festivals"}
            </Link>
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl shrink-0" style={{ background: `${festival.color}20`, border: `2px solid ${festival.color}40` }}>
                {festival.emoji}
              </div>
              <div>
                <h1 className="text-3xl font-devanagari-serif font-bold text-foreground">{isHi ? festival.nameHi : festival.nameEn}</h1>
                <p className="text-muted-foreground font-devanagari mt-1">{isHi ? festival.deityHi : festival.deity}</p>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="inline-flex items-center gap-1 text-sm font-devanagari" style={{ color: festival.color }}>
                    <Calendar className="w-4 h-4" /> {festival.date}
                  </span>
                  {festival.tithi && <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-devanagari">{festival.tithi}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
          {/* Description */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="text-lg font-devanagari-serif font-bold text-foreground mb-3">{isHi ? "विवरण" : "Description"}</h2>
            <p className="text-muted-foreground font-devanagari leading-relaxed">{isHi ? festival.descHi : festival.descEn}</p>
          </section>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-4 shadow-card">
              <p className="text-xs text-muted-foreground font-devanagari mb-1">{isHi ? "प्रकार" : "Type"}</p>
              <p className="font-devanagari font-semibold text-foreground capitalize">{festival.type}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 shadow-card">
              <p className="text-xs text-muted-foreground font-devanagari mb-1">{isHi ? "तिथि" : "Date"}</p>
              <p className="font-devanagari font-semibold text-foreground">{festival.isoDate}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => downloadICS(festival)} variant="outline" className="font-devanagari gap-2">
              <CalendarPlus className="w-4 h-4" />
              {isHi ? "कैलेंडर में जोड़ें" : "Add to Calendar"}
            </Button>
            <Button asChild variant="outline" className="font-devanagari">
              <Link to="/festivals">{isHi ? "सभी त्यौहार देखें" : "View All Festivals"}</Link>
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default FestivalDetailPage;
