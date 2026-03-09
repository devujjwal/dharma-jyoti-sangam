import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { UPCOMING_FESTIVALS } from "@/data/astroData";

const FestivalsSection = () => {
  const { language, t } = useLanguage();

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px flex-1 max-w-16" style={{ background: "var(--gradient-saffron)" }} />
            <span className="text-2xl">🎊</span>
            <div className="h-px flex-1 max-w-16" style={{ background: "var(--gradient-saffron)" }} />
          </div>
          <h2 className="text-3xl font-devanagari-serif font-bold text-foreground mb-2">
            {t("festival_title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {UPCOMING_FESTIVALS.map((festival) => (
            <Link
              key={festival.id}
              to={`/festivals/${festival.id}`}
              className="card-sacred group relative rounded-2xl overflow-hidden border border-border bg-card p-5 hover:border-primary/30"
            >
              {/* Days badge */}
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold font-devanagari"
                style={{ background: `${festival.color}20`, color: festival.color, border: `1px solid ${festival.color}40` }}>
                {festival.daysLeft} {language === "hi" ? "दिन" : "days"}
              </div>

              <div className="text-4xl mb-3">{festival.emoji}</div>
              
              <h3 className="font-devanagari-serif font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                {language === "hi" ? festival.nameHi : festival.nameEn}
              </h3>
              
              <div className="text-xs text-muted-foreground font-devanagari mt-0.5">
                {festival.date} • {language === "hi" ? festival.deityHi : festival.deity}
              </div>
              
              <p className="text-sm text-muted-foreground font-devanagari mt-2 leading-relaxed line-clamp-2">
                {language === "hi" ? festival.descHi : festival.descEn}
              </p>

              <div className="mt-3 text-xs font-devanagari text-primary font-medium">
                {language === "hi" ? "विस्तार से पढ़ें →" : "Read more →"}
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-6">
          <Link
            to="/festivals"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/30 text-primary text-sm font-devanagari hover:bg-primary/5 transition-colors"
          >
            {language === "hi" ? "सभी त्यौहार देखें" : "View all festivals"} →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FestivalsSection;
