import HeroSection from "@/components/HeroSection";
import PanchangCard from "@/components/PanchangCard";
import HoroscopeGrid from "@/components/HoroscopeGrid";
import AIDivider from "@/components/AIDivider";
import FestivalsSection from "@/components/FestivalsSection";
import BhajansSection from "@/components/BhajansSection";
import SubscriptionSection from "@/components/SubscriptionSection";
import SiteFooter from "@/components/SiteFooter";
import Navigation from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

const QuickStats = () => {
  const { language } = useLanguage();
  const stats = [
    { icon: "📅", labelHi: "पंचांग", labelEn: "Panchang", href: "/panchang", color: "hsl(24 95% 48%)" },
    { icon: "⭐", labelHi: "राशिफल", labelEn: "Horoscope", href: "/horoscope", color: "hsl(43 95% 50%)" },
    { icon: "🔮", labelHi: "कुंडली", labelEn: "Kundali", href: "/kundali", color: "hsl(290 55% 48%)" },
    { icon: "💑", labelHi: "कुंडली मिलान", labelEn: "Matching", href: "/kundali-matching", color: "hsl(355 70% 45%)" },
    { icon: "🛕", labelHi: "मंदिर", labelEn: "Temples", href: "/temples", color: "hsl(150 45% 38%)" },
    { icon: "📖", labelHi: "लेख", labelEn: "Articles", href: "/articles", color: "hsl(200 70% 48%)" },
  ];

  return (
    <section className="py-6 bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {stats.map((s) => (
            <Link
              key={s.href}
              to={s.href}
              className="card-sacred flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border bg-card hover:border-primary/30 text-center"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                style={{ background: `${s.color}15` }}>
                {s.icon}
              </div>
              <span className="text-xs font-devanagari font-medium text-foreground/80">
                {language === "hi" ? s.labelHi : s.labelEn}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const TodaySection = () => {
  const { language } = useLanguage();

  return (
    <section className="py-10 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panchang card - takes 1 col */}
          <div className="lg:col-span-1">
            <PanchangCard />
          </div>
          {/* Today's highlight - takes 2 cols */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Today's Tip */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card"
              style={{ background: "var(--gradient-card)" }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🌅</span>
                <h3 className="font-devanagari-serif font-bold text-foreground">
                  {language === "hi" ? "आज का सुविचार" : "Thought of the Day"}
                </h3>
              </div>
              <blockquote className="text-lg font-devanagari-serif font-semibold text-foreground leading-relaxed mb-2"
                style={{ color: "hsl(var(--primary-deep))" }}>
                {language === "hi"
                  ? "\"कर्म करो, फल की चिंता मत करो।\""
                  : "\"Perform your duty, do not worry about the fruit.\""}
              </blockquote>
              <p className="text-sm text-muted-foreground font-devanagari">
                {language === "hi" ? "— श्रीमद् भगवद्गीता, अध्याय २" : "— Shrimad Bhagavad Gita, Chapter 2"}
              </p>
            </div>

            {/* Today's vrat */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🙏</span>
                <h3 className="font-devanagari-serif font-bold text-foreground">
                  {language === "hi" ? "आज का व्रत-पर्व" : "Today's Vrat & Parva"}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {[
                  { icon: "🌕", hi: "एकादशी व्रत", en: "Ekadashi Vrat" },
                  { icon: "🔱", hi: "शिव पूजा", en: "Shiva Puja" },
                ].map((v, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                    <span>{v.icon}</span>
                    <span className="text-xs font-devanagari font-semibold text-primary">
                      {language === "hi" ? v.hi : v.en}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground font-devanagari leading-relaxed">
                {language === "hi"
                  ? "एकादशी व्रत में भगवान विष्णु की पूजा करें। चावल का सेवन वर्जित है। अनाज से परहेज करें।"
                  : "Observe Ekadashi fast by worshipping Lord Vishnu. Avoid rice and grains. Consume fruits and milk."}
              </p>
            </div>

            {/* Ad placeholder (respectful) */}
            <div className="rounded-2xl border border-border/50 bg-muted/30 p-4 flex items-center justify-center min-h-[80px]">
              <span className="text-xs text-muted-foreground/40 font-devanagari">
                {language === "hi" ? "प्रायोजित सामग्री" : "Sponsored Content"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <HeroSection />
        <QuickStats />
        <TodaySection />
        <HoroscopeGrid />
        <AIDivider />
        <FestivalsSection />
        <BhajansSection />
        <SubscriptionSection />
      </main>
      <SiteFooter />
    </div>
  );
};

export default Index;
