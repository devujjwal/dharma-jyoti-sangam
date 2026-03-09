import { Link, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import { useLanguage } from "@/contexts/LanguageContext";
import { RASHIS } from "@/data/astroData";

const HoroscopePage = () => {
  const { language, t } = useLanguage();
  const { rashiId } = useParams<{ rashiId?: string }>();
  const selectedRashi = rashiId ? RASHIS.find((r) => r.id === rashiId) : null;

  if (selectedRashi) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
          <Link to="/horoscope" className="inline-flex items-center gap-2 text-primary text-sm font-devanagari mb-5 hover:underline">
            ← {language === "hi" ? "सभी राशियां" : "All Rashis"}
          </Link>
          <div className="rounded-2xl overflow-hidden border border-border shadow-sacred mb-5">
            <div className="px-6 py-6 flex items-center gap-4"
              style={{ background: `linear-gradient(135deg, ${selectedRashi.color}25, ${selectedRashi.color}10)`, borderBottom: `3px solid ${selectedRashi.color}` }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-4xl shadow-card"
                style={{ background: `${selectedRashi.color}15`, border: `2px solid ${selectedRashi.color}40` }}>
                {selectedRashi.symbol}
              </div>
              <div>
                <h1 className="text-2xl font-devanagari-serif font-bold text-foreground">
                  {language === "hi" ? selectedRashi.nameHi : selectedRashi.nameEn}
                </h1>
                <div className="flex gap-3 mt-1 text-sm text-muted-foreground font-devanagari">
                  <span>{language === "hi" ? `स्वामी: ${selectedRashi.lordHi}` : `Lord: ${selectedRashi.lord}`}</span>
                  <span>•</span>
                  <span>{selectedRashi.element}</span>
                </div>
                <p className="text-sm text-muted-foreground font-devanagari mt-1">
                  {language === "hi" ? selectedRashi.description.hi : selectedRashi.description.en}
                </p>
              </div>
            </div>
            <div className="p-6 bg-card">
              <h2 className="font-devanagari-serif font-bold text-foreground mb-3 flex items-center gap-2">
                <span>⭐</span>
                <span>{language === "hi" ? "आज का राशिफल" : "Today's Horoscope"}</span>
              </h2>
              <p className="text-foreground font-devanagari leading-relaxed text-base">
                {language === "hi" ? selectedRashi.todayHi : selectedRashi.todayEn}
              </p>
              <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-devanagari">
                  <span>🍀</span>
                  <span>{language === "hi" ? `शुभ अंक: ${selectedRashi.luckyNum.join(", ")}` : `Lucky numbers: ${selectedRashi.luckyNum.join(", ")}`}</span>
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
  }

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
