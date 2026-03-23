import { Link, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import { useLanguage } from "@/contexts/LanguageContext";
import { RASHIS } from "@/data/astroData";
import { useDailyHoroscope } from "@/hooks/use-daily-horoscope";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const HoroscopeDetail = ({ rashiId }: { rashiId: string }) => {
  const { language } = useLanguage();
  const rashi = RASHIS.find(r => r.id === rashiId);
  const { data: horoscope, isLoading, isError } = useDailyHoroscope(rashiId);
  const [generating, setGenerating] = useState(false);

  const generateHoroscope = async () => {
    if (!rashi) return;
    setGenerating(true);
    try {
      await supabase.functions.invoke("daily-horoscope", {
        body: { rashiId, rashiNameHi: rashi.nameHi, rashiNameEn: rashi.nameEn },
      });
      window.location.reload();
    } catch { /* ignore */ }
    setGenerating(false);
  };

  if (!rashi) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-4xl mb-4">⭐</p>
            <h1 className="text-2xl font-devanagari-serif font-bold text-foreground mb-2">
              {language === "hi" ? "राशि नहीं मिली" : "Rashi Not Found"}
            </h1>
            <Link to="/horoscope" className="text-primary font-devanagari hover:underline">
              {language === "hi" ? "सभी राशियां देखें" : "View all rashis"}
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <Link to="/horoscope" className="inline-flex items-center gap-2 text-primary text-sm font-devanagari mb-5 hover:underline">
          ← {language === "hi" ? "सभी राशियां" : "All Rashis"}
        </Link>
        <div className="rounded-2xl overflow-hidden border border-border shadow-sacred mb-5">
          <div className="px-6 py-6 flex items-center gap-4"
            style={{ background: `linear-gradient(135deg, ${rashi.color}25, ${rashi.color}10)`, borderBottom: `3px solid ${rashi.color}` }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-4xl shadow-card"
              style={{ background: `${rashi.color}15`, border: `2px solid ${rashi.color}40` }}>
              {rashi.symbol}
            </div>
            <div>
              <h1 className="text-2xl font-devanagari-serif font-bold text-foreground">
                {language === "hi" ? rashi.nameHi : rashi.nameEn}
              </h1>
              <div className="flex gap-3 mt-1 text-sm text-muted-foreground font-devanagari">
                <span>{language === "hi" ? `स्वामी: ${rashi.lordHi}` : `Lord: ${rashi.lord}`}</span>
                <span>•</span>
                <span>{rashi.element}</span>
              </div>
              <p className="text-sm text-muted-foreground font-devanagari mt-1">
                {language === "hi" ? rashi.description.hi : rashi.description.en}
              </p>
            </div>
          </div>
          <div className="p-6 bg-card">
            <h2 className="font-devanagari-serif font-bold text-foreground mb-3 flex items-center gap-2">
              <span>⭐</span>
              <span>{language === "hi" ? "आज का राशिफल" : "Today's Horoscope"}</span>
            </h2>

            {isLoading && (
              <div className="flex items-center gap-2 py-4 justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground font-devanagari">
                  {language === "hi" ? "लोड हो रहा है..." : "Loading..."}
                </span>
              </div>
            )}

            {!isLoading && horoscope && (
              <p className="text-foreground font-devanagari leading-relaxed text-base">
                {language === "hi" ? horoscope.content_hi : horoscope.content_en}
              </p>
            )}

            {!isLoading && !horoscope && !isError && (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground font-devanagari mb-3">
                  {language === "hi" ? "आज का राशिफल अभी तैयार नहीं हुआ है।" : "Today's horoscope has not been generated yet."}
                </p>
                <button
                  onClick={generateHoroscope}
                  disabled={generating}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-devanagari font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {language === "hi" ? "राशिफल बनाएं" : "Generate Horoscope"}
                </button>
              </div>
            )}

            {isError && (
              <p className="text-sm text-destructive font-devanagari py-2">
                {language === "hi" ? "राशिफल लोड नहीं हो सका।" : "Could not load horoscope."}
              </p>
            )}

            <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-devanagari">
                <span>🍀</span>
                <span>{language === "hi" ? `शुभ अंक: ${rashi.luckyNum.join(", ")}` : `Lucky numbers: ${rashi.luckyNum.join(", ")}`}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center">
          <Link to="/ai-astrologer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-devanagari font-semibold text-primary-foreground shadow-sacred"
            style={{ background: "var(--gradient-saffron)" }}>
            <span>🔮</span>
            <span>{language === "hi" ? "AI ज्योतिषी से विस्तृत जानें" : "Ask AI Astrologer for more"}</span>
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

const HoroscopePage = () => {
  const { language, t } = useLanguage();
  const { rashiId } = useParams<{ rashiId?: string }>();

  if (rashiId) return <HoroscopeDetail rashiId={rashiId} />;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-devanagari-serif font-bold text-foreground mb-2">{t("horoscope_title")}</h1>
          <p className="text-muted-foreground font-devanagari">{language === "hi" ? "अपनी राशि चुनें" : "Select your Rashi"}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {RASHIS.map((rashi) => (
            <Link key={rashi.id} to={`/horoscope/${rashi.id}`}
              className="card-sacred flex flex-col items-center gap-3 p-5 rounded-2xl border border-border bg-card hover:border-primary/30 shadow-card">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-3xl"
                style={{ background: `${rashi.color}15`, border: `2px solid ${rashi.color}30` }}>
                {rashi.symbol}
              </div>
              <div className="text-center">
                <div className="font-devanagari-serif font-bold text-foreground">
                  {language === "hi" ? rashi.nameHi : rashi.nameEn}
                </div>
                <div className="text-xs text-muted-foreground font-devanagari mt-0.5">
                  {language === "hi" ? rashi.lordHi : rashi.lord}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default HoroscopePage;
