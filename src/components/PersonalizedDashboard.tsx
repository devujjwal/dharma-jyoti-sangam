import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDailyHoroscope } from "@/hooks/use-daily-horoscope";
import { usePanchang } from "@/hooks/use-panchang";
import { useVratOccurrences } from "@/hooks/use-vrats";
import { useFestivals } from "@/hooks/use-festivals";
import { RASHIS } from "@/data/astroData";
import { Calendar, Star, Zap, BookOpen, Bookmark, MessageSquare } from "lucide-react";

const PersonalizedDashboard = () => {
  const { user, profile } = useAuth();
  const { language } = useLanguage();
  const isHi = language === "hi";

  const rashiId = profile?.rashi_id;
  const myRashi = RASHIS.find((r) => r.id === rashiId);
  const today = new Date().toISOString().split("T")[0];

  const { data: horoscope } = useDailyHoroscope(rashiId || undefined);
  const { data: panchang } = usePanchang(today, (profile as any)?.preferred_city || "new-delhi");
  const { data: vratOccurrences } = useVratOccurrences();
  const { data: festivals } = useFestivals();

  if (!user || !profile) return null;

  // Next festival
  const upcomingFestival = (festivals || []).find(
    (f) => f.festival_date >= today
  );
  const daysToFestival = upcomingFestival
    ? Math.ceil((new Date(upcomingFestival.festival_date).getTime() - Date.now()) / 86400000)
    : null;

  // Next vrat
  const nextVrat = (vratOccurrences || [])[0];

  const horoscopeText = horoscope
    ? (isHi ? horoscope.content_hi : horoscope.content_en).slice(0, 100) + "..."
    : null;

  return (
    <section className="py-6 bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🙏</span>
          <h2 className="font-devanagari-serif font-bold text-foreground text-lg">
            {isHi ? `नमस्ते, ${profile.display_name || "भक्त"}` : `Namaste, ${profile.display_name || "Devotee"}`}
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Today's Horoscope */}
          {myRashi && (
            <Link
              to={`/horoscope/${rashiId}`}
              className="rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-colors group"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{myRashi.symbol}</span>
                <Star className="w-3.5 h-3.5 text-secondary" />
              </div>
              <p className="text-xs font-devanagari font-semibold text-foreground mb-1">
                {isHi ? myRashi.nameHi : myRashi.nameEn}
              </p>
              {horoscopeText ? (
                <p className="text-xs text-muted-foreground font-devanagari line-clamp-2">{horoscopeText}</p>
              ) : (
                <p className="text-xs text-muted-foreground/60 font-devanagari">{isHi ? "आज का राशिफल देखें" : "View today's horoscope"}</p>
              )}
            </Link>
          )}

          {/* Today's Panchang */}
          <Link
            to="/panchang"
            className="rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-xs font-devanagari font-semibold text-foreground">{isHi ? "पंचांग" : "Panchang"}</span>
            </div>
            {panchang ? (
              <div className="space-y-0.5">
                <p className="text-xs font-devanagari text-muted-foreground">
                  {isHi ? `तिथि: ${panchang.tithi_hi || "—"}` : `Tithi: ${panchang.tithi_en || "—"}`}
                </p>
                <p className="text-xs font-devanagari text-muted-foreground">
                  {isHi ? `नक्षत्र: ${panchang.nakshatra_hi || "—"}` : `Nakshatra: ${panchang.nakshatra_en || "—"}`}
                </p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground/60 font-devanagari">{isHi ? "आज का पंचांग" : "Today's Panchang"}</p>
            )}
          </Link>

          {/* Next Festival */}
          {upcomingFestival && (
            <Link
              to={`/festivals/${upcomingFestival.slug}`}
              className="rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{upcomingFestival.emoji || "🎊"}</span>
              </div>
              <p className="text-xs font-devanagari font-semibold text-foreground truncate">
                {isHi ? upcomingFestival.name_hi : upcomingFestival.name_en}
              </p>
              <p className="text-xs text-muted-foreground font-devanagari">
                {daysToFestival === 0
                  ? (isHi ? "🎉 आज!" : "🎉 Today!")
                  : daysToFestival === 1
                  ? (isHi ? "कल" : "Tomorrow")
                  : `${daysToFestival} ${isHi ? "दिन बाकी" : "days left"}`}
              </p>
            </Link>
          )}

          {/* Quick Links */}
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-devanagari font-semibold text-foreground mb-2">
              {isHi ? "त्वरित पहुँच" : "Quick Access"}
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { icon: <Bookmark className="w-3 h-3" />, href: "/profile", label: isHi ? "भजन" : "Bhajans" },
                { icon: <BookOpen className="w-3 h-3" />, href: "/profile", label: isHi ? "कुंडली" : "Kundali" },
                { icon: <MessageSquare className="w-3 h-3" />, href: "/ai-astrologer", label: isHi ? "AI" : "AI" },
                { icon: <Zap className="w-3 h-3" />, href: "/profile", label: `${profile.ai_credits}` },
              ].map((item, i) => (
                <Link
                  key={i}
                  to={item.href}
                  className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted/50 hover:bg-muted text-xs font-devanagari text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalizedDashboard;
