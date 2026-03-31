import HeroSection from "@/components/HeroSection";
import DailyHoroscope from "@/components/DailyHoroscope";
import PanchangCard from "@/components/PanchangCard";
import HoroscopeGrid from "@/components/HoroscopeGrid";
import AIDivider from "@/components/AIDivider";
import FestivalsSection from "@/components/FestivalsSection";
import BhajansSection from "@/components/BhajansSection";
import SubscriptionSection from "@/components/SubscriptionSection";
import SiteFooter from "@/components/SiteFooter";
import Navigation from "@/components/Navigation";
import PersonalizedDashboard from "@/components/PersonalizedDashboard";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { useVratOccurrences } from "@/hooks/use-vrats";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
  const isHi = language === "hi";

  // Dynamic quote from site_settings
  const { data: quoteData } = useSiteSettings("daily_quote");
  const quote = quoteData as { text_hi?: string; text_en?: string; source_hi?: string; source_en?: string } | null;

  // Today's vrat occurrences
  const today = new Date().toISOString().split("T")[0];
  const { data: vratOccurrences } = useVratOccurrences();

  // Fetch vrat names for today's occurrences
  const todayVrats = (vratOccurrences || []).filter(
    (occ) => occ.occurrence_date === today
  );

  const { data: vratDetails } = useQuery({
    queryKey: ["today-vrat-details", todayVrats.map((v) => v.vrat_id)],
    enabled: todayVrats.length > 0,
    queryFn: async () => {
      const ids = todayVrats.map((v) => v.vrat_id);
      const { data } = await supabase
        .from("vrats")
        .select("id,name_hi,name_en,emoji,slug,color")
        .in("id", ids)
        .eq("status", "published");
      return data || [];
    },
    staleTime: 1000 * 60 * 30,
  });

  return (
    <section className="py-10 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panchang card */}
          <div className="lg:col-span-1">
            <PanchangCard />
          </div>
          {/* Today's highlight */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Thought of the Day */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card"
              style={{ background: "var(--gradient-card)" }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🌅</span>
                <h3 className="font-devanagari-serif font-bold text-foreground">
                  {isHi ? "आज का सुविचार" : "Thought of the Day"}
                </h3>
              </div>
              <blockquote className="text-lg font-devanagari-serif font-semibold text-foreground leading-relaxed mb-2"
                style={{ color: "hsl(var(--primary-deep))" }}>
                {quote
                  ? `"${isHi ? (quote.text_hi || quote.text_en || "") : (quote.text_en || quote.text_hi || "")}"`
                  : isHi
                  ? "\"कर्म करो, फल की चिंता मत करो।\""
                  : "\"Perform your duty, do not worry about the fruit.\""}
              </blockquote>
              <p className="text-sm text-muted-foreground font-devanagari">
                {quote
                  ? `— ${isHi ? (quote.source_hi || quote.source_en || "") : (quote.source_en || quote.source_hi || "")}`
                  : isHi
                  ? "— श्रीमद् भगवद्गीता, अध्याय २"
                  : "— Shrimad Bhagavad Gita, Chapter 2"}
              </p>
            </div>

            {/* Today's vrat - dynamic */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🙏</span>
                <h3 className="font-devanagari-serif font-bold text-foreground">
                  {isHi ? "आज का व्रत-पर्व" : "Today's Vrat & Parva"}
                </h3>
              </div>
              {vratDetails && vratDetails.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {vratDetails.map((v) => (
                    <Link
                      key={v.id}
                      to={`/vrat/${v.slug}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors"
                    >
                      <span>{v.emoji || "🙏"}</span>
                      <span className="text-xs font-devanagari font-semibold text-primary">
                        {isHi ? v.name_hi : v.name_en}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground font-devanagari leading-relaxed">
                  {isHi
                    ? "आज कोई विशेष व्रत नहीं है। व्रत गाइड देखें।"
                    : "No special vrat today. Check the Vrat Guide."}
                </p>
              )}
              <Link
                to="/vrat"
                className="inline-block mt-3 text-xs text-primary font-devanagari hover:underline"
              >
                {isHi ? "सभी व्रत देखें →" : "View all vrats →"}
              </Link>
            </div>

            {/* Ad placeholder */}
            <div className="rounded-2xl border border-border/50 bg-muted/30 p-4 flex items-center justify-center min-h-[80px]">
              <span className="text-xs text-muted-foreground/40 font-devanagari">
                {isHi ? "प्रायोजित सामग्री" : "Sponsored Content"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <HeroSection />
        <QuickStats />
        {user && <PersonalizedDashboard />}
        <DailyHoroscope />
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
