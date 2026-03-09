import { Link } from "react-router-dom";
import { Sun, Sunset, Clock, Star, Moon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTodayPanchang } from "@/data/astroData";

const PanchangCard = () => {
  const { language, t } = useLanguage();
  const panchang = getTodayPanchang();

  const items = [
    { icon: "🌟", label: t("tithi"), value: language === "hi" ? panchang.tithi.hi : panchang.tithi.en },
    { icon: "⭐", label: t("nakshatra"), value: language === "hi" ? panchang.nakshatra.hi : panchang.nakshatra.en },
    { icon: "✨", label: t("yoga"), value: language === "hi" ? panchang.yoga.hi : panchang.yoga.en },
    { icon: "🔸", label: t("karana"), value: language === "hi" ? panchang.karana.hi : panchang.karana.en },
    { icon: "🌅", label: t("sunrise"), value: panchang.sunrise },
    { icon: "🌇", label: t("sunset"), value: panchang.sunset },
    { icon: "🟢", label: t("auspicious"), value: language === "hi" ? panchang.auspicious.hi : panchang.auspicious.en },
    { icon: "🔴", label: t("rahu_kaal"), value: panchang.rahuKaal },
  ];

  return (
    <div className="rounded-2xl overflow-hidden border border-border shadow-card"
      style={{ background: "var(--gradient-card)" }}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/50"
        style={{ background: "var(--gradient-saffron)" }}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-devanagari-serif font-bold text-primary-foreground">
              {t("panchang_title")}
            </h3>
            <p className="text-xs text-primary-foreground/80 mt-0.5 font-devanagari">
              {language === "hi" ? panchang.dateHi : panchang.dateEn}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-primary-foreground/80 font-devanagari">{panchang.samvat}</div>
            <div className="text-xs text-primary-foreground/80 font-devanagari mt-0.5">
              {language === "hi" ? panchang.paksha.hi : panchang.paksha.en} •{" "}
              {language === "hi" ? panchang.masa.hi : panchang.masa.en}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-0.5 p-0.5 bg-border/30">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2 p-3 bg-card rounded-lg">
            <span className="text-base shrink-0 mt-0.5">{item.icon}</span>
            <div>
              <div className="text-xs text-muted-foreground font-devanagari">{item.label}</div>
              <div className="text-sm font-semibold font-devanagari text-foreground leading-tight mt-0.5">
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Shubh Muhurat */}
      {panchang.shubhMuhurat.length > 0 && (
        <div className="px-4 py-3 border-t border-border/50 bg-primary/5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">🪔</span>
            <span className="text-xs font-semibold font-devanagari text-primary">{t("auspicious")}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {panchang.shubhMuhurat.map((m, i) => (
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
          <span>विस्तृत पंचांग देखें →</span>
        </Link>
      </div>
    </div>
  );
};

export default PanchangCard;
