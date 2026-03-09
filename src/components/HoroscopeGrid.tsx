import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { RASHIS } from "@/data/astroData";

const HoroscopeGrid = () => {
  const { language, t } = useLanguage();

  return (
    <section className="py-12 bg-pattern-sacred">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px flex-1 max-w-16" style={{ background: "var(--gradient-saffron)" }} />
            <span className="text-2xl">⭐</span>
            <div className="h-px flex-1 max-w-16" style={{ background: "var(--gradient-saffron)" }} />
          </div>
          <h2 className="text-3xl font-devanagari-serif font-bold text-foreground mb-2">
            {t("horoscope_title")}
          </h2>
          <p className="text-muted-foreground font-devanagari text-sm">
            {language === "hi" ? "अपनी राशि चुनें और आज का राशिफल पढ़ें" : "Select your Rashi to read today's horoscope"}
          </p>
        </div>

        {/* Rashi Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {RASHIS.map((rashi) => (
            <Link
              key={rashi.id}
              to={`/horoscope/${rashi.id}`}
              className="card-sacred group flex flex-col items-center gap-2 p-3 rounded-xl border border-border bg-card hover:border-primary/40 cursor-pointer"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-card group-hover:scale-110 transition-transform"
                style={{ background: `${rashi.color}20`, border: `2px solid ${rashi.color}40` }}
              >
                {rashi.symbol}
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold font-devanagari text-foreground leading-tight">
                  {language === "hi" ? rashi.nameHi : rashi.nameEn}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {language === "hi" ? `${rashi.lordHi}` : rashi.lord}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-6">
          <Link
            to="/horoscope"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/30 text-primary text-sm font-devanagari hover:bg-primary/5 transition-colors"
          >
            <span>सभी राशिफल देखें</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HoroscopeGrid;
