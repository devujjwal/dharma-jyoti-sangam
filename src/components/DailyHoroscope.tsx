import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { RASHIS } from "@/data/astroData";
import { Star, Loader2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const DailyHoroscope = () => {
  const { language } = useLanguage();
  const { user, profile } = useAuth();
  const [content, setContent] = useState<{ content_hi: string; content_en: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const rashiId = profile?.rashi_id;
  const rashi = RASHIS.find((r) => r.id === rashiId);

  useEffect(() => {
    if (!rashiId || !rashi) return;

    const fetchHoroscope = async () => {
      setLoading(true);
      setError(false);

      // Try cache from DB first
      const today = new Date().toISOString().split("T")[0];
      const { data: cached } = await supabase
        .from("daily_horoscopes")
        .select("content_hi, content_en")
        .eq("rashi_id", rashiId)
        .eq("horoscope_date", today)
        .maybeSingle();

      if (cached) {
        setContent(cached);
        setLoading(false);
        return;
      }

      // Call edge function to generate
      try {
        const resp = await supabase.functions.invoke("daily-horoscope", {
          body: { rashiId, rashiNameHi: rashi.nameHi, rashiNameEn: rashi.nameEn },
        });
        if (resp.error) throw resp.error;
        setContent(resp.data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchHoroscope();
  }, [rashiId, rashi]);

  // Not logged in or no rashi set
  if (!user || !rashiId) {
    return (
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card text-center">
            <Sparkles className="w-8 h-8 mx-auto mb-3 text-secondary" />
            <h3 className="font-devanagari-serif font-bold text-lg text-foreground mb-2">
              {language === "hi" ? "आज का AI राशिफल" : "Today's AI Horoscope"}
            </h3>
            <p className="text-sm text-muted-foreground font-devanagari mb-4">
              {language === "hi"
                ? "अपनी राशि चुनकर प्रतिदिन व्यक्तिगत राशिफल प्राप्त करें।"
                : "Set your rashi in your profile to get a personalized daily horoscope."}
            </p>
            <Link
              to={user ? "/profile" : "/login"}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-devanagari font-semibold hover:opacity-90 transition-opacity"
            >
              {user
                ? language === "hi" ? "प्रोफ़ाइल में राशि चुनें" : "Set Rashi in Profile"
                : language === "hi" ? "लॉगिन करें" : "Login"}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-background">
      <div className="container mx-auto px-4">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card"
          style={{ background: "var(--gradient-card)" }}>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
              style={{ background: `${rashi?.color}20` }}
            >
              {rashi?.symbol}
            </div>
            <div>
              <h3 className="font-devanagari-serif font-bold text-lg text-foreground flex items-center gap-2">
                <Star className="w-4 h-4 text-secondary" />
                {language === "hi" ? "आज का AI राशिफल" : "Today's AI Horoscope"}
              </h3>
              <p className="text-xs text-muted-foreground font-devanagari">
                {language === "hi" ? rashi?.nameHi : rashi?.nameEn} • {new Date().toLocaleDateString(language === "hi" ? "hi-IN" : "en-IN")}
              </p>
            </div>
          </div>

          {loading && (
            <div className="flex items-center gap-2 py-6 justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground font-devanagari">
                {language === "hi" ? "राशिफल तैयार हो रहा है..." : "Generating horoscope..."}
              </span>
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive font-devanagari py-4 text-center">
              {language === "hi" ? "राशिफल लोड नहीं हो सका। बाद में पुनः प्रयास करें।" : "Could not load horoscope. Please try again later."}
            </p>
          )}

          {content && !loading && (
            <p className="text-sm font-devanagari leading-relaxed text-foreground/90">
              {language === "hi" ? content.content_hi : content.content_en}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default DailyHoroscope;
