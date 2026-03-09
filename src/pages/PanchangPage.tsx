import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTodayPanchang } from "@/data/astroData";

const PanchangPage = () => {
  const { language, t } = useLanguage();
  const panchang = getTodayPanchang();

  const sections = [
    { icon: "🌟", labelHi: "तिथि", labelEn: "Tithi", value: language === "hi" ? panchang.tithi.hi : panchang.tithi.en },
    { icon: "⭐", labelHi: "नक्षत्र", labelEn: "Nakshatra", value: language === "hi" ? panchang.nakshatra.hi : panchang.nakshatra.en },
    { icon: "✨", labelHi: "योग", labelEn: "Yoga", value: language === "hi" ? panchang.yoga.hi : panchang.yoga.en },
    { icon: "🔸", labelHi: "करण", labelEn: "Karana", value: language === "hi" ? panchang.karana.hi : panchang.karana.en },
    { icon: "🌅", labelHi: "सूर्योदय", labelEn: "Sunrise", value: panchang.sunrise },
    { icon: "🌇", labelHi: "सूर्यास्त", labelEn: "Sunset", value: panchang.sunset },
    { icon: "🌙", labelHi: "चंद्रोदय", labelEn: "Moonrise", value: panchang.moonrise },
    { icon: "🟢", labelHi: "शुभ मुहूर्त", labelEn: "Auspicious Time", value: language === "hi" ? panchang.auspicious.hi : panchang.auspicious.en },
    { icon: "🔴", labelHi: "राहुकाल", labelEn: "Rahu Kaal", value: panchang.rahuKaal },
    { icon: "🔱", labelHi: "पक्ष", labelEn: "Paksha", value: language === "hi" ? panchang.paksha.hi : panchang.paksha.en },
    { icon: "📅", labelHi: "मास", labelEn: "Masa", value: language === "hi" ? panchang.masa.hi : panchang.masa.en },
    { icon: "🕉️", labelHi: "संवत", labelEn: "Samvat", value: panchang.samvat },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="rounded-2xl overflow-hidden mb-6 shadow-sacred"
          style={{ background: "var(--gradient-saffron)" }}>
          <div className="px-6 py-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">📅</span>
              <h1 className="text-2xl font-devanagari-serif font-bold text-primary-foreground">
                {t("panchang_title")}
              </h1>
            </div>
            <p className="text-primary-foreground/80 font-devanagari text-sm">
              {language === "hi" ? panchang.dateHi : panchang.dateEn}
            </p>
            <p className="text-primary-foreground/70 font-devanagari text-xs mt-1">
              {panchang.samvat} • {language === "hi" ? panchang.paksha.hi : panchang.paksha.en}
            </p>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {sections.map((s, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card shadow-card">
              <span className="text-xl shrink-0">{s.icon}</span>
              <div>
                <div className="text-xs text-muted-foreground font-devanagari">
                  {language === "hi" ? s.labelHi : s.labelEn}
                </div>
                <div className="text-sm font-semibold font-devanagari text-foreground mt-0.5">{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Shubh Muhurat */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card mb-4">
          <h2 className="font-devanagari-serif font-bold text-foreground mb-3 flex items-center gap-2">
            <span>🪔</span>
            <span>{language === "hi" ? "शुभ मुहूर्त" : "Auspicious Times"}</span>
          </h2>
          <div className="space-y-2">
            {panchang.shubhMuhurat.map((m, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-primary/5 border border-primary/15">
                <span className="font-devanagari text-sm font-medium text-foreground">
                  {language === "hi" ? m.hi : m.en}
                </span>
                <span className="font-devanagari text-sm text-primary font-bold">{m.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI CTA */}
        <div className="rounded-2xl p-5 text-center"
          style={{ background: "linear-gradient(135deg, hsl(20 40% 10%), hsl(345 70% 22%))" }}>
          <p className="text-primary-foreground/80 font-devanagari text-sm mb-3">
            {language === "hi" ? "पंचांग से जुड़े प्रश्न AI ज्योतिषी से पूछें" : "Ask AI Astrologer for Panchang queries"}
          </p>
          <Link to="/ai-astrologer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-devanagari font-semibold text-sm text-primary-foreground"
            style={{ background: "var(--gradient-saffron)" }}>
            <span>🔮</span>
            <span>{t("nav_ai")}</span>
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default PanchangPage;
