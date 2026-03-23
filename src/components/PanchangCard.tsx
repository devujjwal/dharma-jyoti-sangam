import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePanchang } from "@/hooks/use-panchang";
import { Loader2 } from "lucide-react";

const PanchangCard = () => {
  const { language, t } = useLanguage();
  const { data: panchang, isLoading, isError } = usePanchang();

  if (isLoading) {
    return (
      <div className="rounded-2xl overflow-hidden border border-border shadow-card p-8 flex items-center justify-center bg-card">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground font-devanagari">
          {language === "hi" ? "पंचांग लोड हो रहा है..." : "Loading Panchang..."}
        </span>
      </div>
    );
  }

  if (isError || !panchang) {
    return (
      <div className="rounded-2xl overflow-hidden border border-border shadow-card p-6 bg-card text-center">
        <p className="text-sm text-muted-foreground font-devanagari">
          {language === "hi" ? "पंचांग लोड नहीं हो सका।" : "Could not load Panchang."}
        </p>
      </div>
    );
  }

  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  const dateStr = language === "hi" ? today.toLocaleDateString("hi-IN", dateOptions) : today.toLocaleDateString("en-IN", dateOptions);
  const extraData = (panchang.extra_data || {}) as Record<string, any>;
  const samvat = extraData.samvat || "विक्रम संवत २०८२";
  const shubhMuhurat = extraData.shubh_muhurat || [];

  const items = [
    { icon: "🌟", label: t("tithi"), value: language === "hi" ? panchang.tithi_hi : panchang.tithi_en },
    { icon: "⭐", label: t("nakshatra"), value: language === "hi" ? panchang.nakshatra_hi : panchang.nakshatra_en },
    { icon: "✨", label: t("yoga"), value: language === "hi" ? panchang.yoga_hi : panchang.yoga_en },
    { icon: "🔸", label: t("karana"), value: language === "hi" ? panchang.karana_hi : panchang.karana_en },
    { icon: "🌅", label: t("sunrise"), value: panchang.sunrise },
    { icon: "🌇", label: t("sunset"), value: panchang.sunset },
    { icon: "🟢", label: t("auspicious"), value: language === "hi" ? panchang.paksha_hi : panchang.paksha_en },
    { icon: "🔴", label: t("rahu_kaal"), value: panchang.rahu_kaal },
  ];

  return (
    <div className="rounded-2xl overflow-hidden border border-border shadow-card"
      style={{ background: "var(--gradient-card)" }}>
      <div className="px-5 py-4 border-b border-border/50"
        style={{ background: "var(--gradient-saffron)" }}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-devanagari-serif font-bold text-primary-foreground">
              {t("panchang_title")}
            </h3>
            <p className="text-xs text-primary-foreground/80 mt-0.5 font-devanagari">{dateStr}</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-primary-foreground/80 font-devanagari">{samvat}</div>
            <div className="text-xs text-primary-foreground/80 font-devanagari mt-0.5">
              {language === "hi" ? panchang.paksha_hi : panchang.paksha_en} •{" "}
              {language === "hi" ? panchang.masa_hi : panchang.masa_en}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-0.5 p-0.5 bg-border/30">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2 p-3 bg-card rounded-lg">
            <span className="text-base shrink-0 mt-0.5">{item.icon}</span>
            <div>
              <div className="text-xs text-muted-foreground font-devanagari">{item.label}</div>
              <div className="text-sm font-semibold font-devanagari text-foreground leading-tight mt-0.5">
                {item.value || "—"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {shubhMuhurat.length > 0 && (
        <div className="px-4 py-3 border-t border-border/50 bg-primary/5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">🪔</span>
            <span className="text-xs font-semibold font-devanagari text-primary">{t("auspicious")}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {shubhMuhurat.map((m: any, i: number) => (
              <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-xs font-devanagari text-primary font-medium">
                  {language === "hi" ? m.hi : m.en}
                </span>
                <span className="text-xs text-primary/70">{m.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 py-2.5 border-t border-border/30">
        <Link to="/panchang" className="text-xs text-primary font-devanagari hover:underline flex items-center gap-1">
          <span>{language === "hi" ? "विस्तृत पंचांग देखें →" : "View detailed Panchang →"}</span>
        </Link>
      </div>
    </div>
  );
};

export default PanchangCard;
