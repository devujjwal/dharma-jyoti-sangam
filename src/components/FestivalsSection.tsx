import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFestivals } from "@/hooks/use-festivals";
import { Loader2 } from "lucide-react";

const FestivalsSection = () => {
  const { language, t } = useLanguage();
  const { data: festivals, isLoading } = useFestivals();

  const upcoming = (festivals || [])
    .filter(f => new Date(f.festival_date) >= new Date(new Date().toISOString().split("T")[0]))
    .slice(0, 4);

  const daysLeft = (dateStr: string) => {
    const diff = Math.ceil((new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  if (isLoading) {
    return (
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
        </div>
      </section>
    );
  }

  if (!upcoming.length) return null;

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
          {upcoming.map((festival) => {
            const days = daysLeft(festival.festival_date);
            const color = festival.color || "hsl(24 95% 48%)";
            return (
              <Link
                key={festival.id}
                to={`/festivals/${festival.slug}`}
                className="card-sacred group relative rounded-2xl overflow-hidden border border-border bg-card p-5 hover:border-primary/30"
              >
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold font-devanagari"
                  style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}>
                  {days} {language === "hi" ? "दिन" : "days"}
                </div>
                <div className="text-4xl mb-3">{festival.emoji || "🎊"}</div>
                <h3 className="font-devanagari-serif font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                  {language === "hi" ? festival.name_hi : festival.name_en}
                </h3>
                <div className="text-xs text-muted-foreground font-devanagari mt-0.5">
                  {festival.festival_date}
                </div>
                <p className="text-sm text-muted-foreground font-devanagari mt-2 leading-relaxed line-clamp-2">
                  {language === "hi" ? (festival.excerpt_hi || festival.description_hi) : (festival.excerpt_en || festival.description_en)}
                </p>
                <div className="mt-3 text-xs font-devanagari text-primary font-medium">
                  {language === "hi" ? "विस्तार से पढ़ें →" : "Read more →"}
                </div>
              </Link>
            );
          })}
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
