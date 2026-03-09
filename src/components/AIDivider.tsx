import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const AIDivider = () => {
  const { language, t } = useLanguage();

  return (
    <section className="py-14 relative overflow-hidden">
      {/* Saffron gradient background */}
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, hsl(24 95% 48%), hsl(35 100% 60%), hsl(43 95% 55%))" }} />
      <div className="absolute inset-0 bg-pattern-sacred opacity-20" />

      <div className="relative container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Floating mandala behind */}
          <div className="absolute left-10 top-1/2 -translate-y-1/2 w-40 h-40 opacity-10 hidden xl:block">
            <div className="w-full h-full rounded-full border-4 border-white animate-spin-slow"
              style={{ borderStyle: "dashed" }} />
          </div>
          <div className="absolute right-10 top-1/2 -translate-y-1/2 w-40 h-40 opacity-10 hidden xl:block">
            <div className="w-full h-full rounded-full border-4 border-white animate-spin-slow"
              style={{ borderStyle: "dashed", animationDirection: "reverse" }} />
          </div>

          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-5 glow-pulse">
            <span className="text-4xl">🔮</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-devanagari-serif font-bold text-white mb-3">
            {t("ai_title")}
          </h2>
          <p className="text-white/85 font-devanagari text-base md:text-lg mb-6 leading-relaxed">
            {t("ai_subtitle")}
          </p>

          {/* Free questions indicator */}
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 mb-6">
            <div className="flex gap-1">
              {[1, 2].map((q) => (
                <div key={q} className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-sm font-bold text-primary">
                  {q}
                </div>
              ))}
              <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
                <span className="text-white/50 text-xs">+</span>
              </div>
            </div>
            <div className="text-left">
              <div className="text-white font-semibold text-sm font-devanagari">
                {language === "hi" ? "2 निःशुल्क प्रश्न/दिन" : "2 Free Questions/day"}
              </div>
              <div className="text-white/60 text-xs font-devanagari">
                {language === "hi" ? "अधिक के लिए प्रश्न पैक लें" : "Get question packs for more"}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/ai-astrologer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-devanagari font-bold text-base text-primary-deep bg-white shadow-gold hover:shadow-glow transition-all hover:scale-105 active:scale-95"
            >
              <span>✨</span>
              <span>{language === "hi" ? "अभी पूछें — निःशुल्क" : "Ask Now — Free"}</span>
            </Link>
            <Link
              to="/subscribe"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-devanagari font-semibold text-base text-white border-2 border-white/40 hover:bg-white/10 transition-all"
            >
              <span>{language === "hi" ? "प्रश्न पैक देखें" : "View Question Packs"}</span>
              <span>→</span>
            </Link>
          </div>

          {/* Sample questions */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {[
              language === "hi" ? "मेरी शादी कब होगी?" : "When will I get married?",
              language === "hi" ? "करियर में सफलता कब?" : "Career success timing?",
              language === "hi" ? "आज का शुभ समय?" : "Today's auspicious time?",
              language === "hi" ? "कौन सा रत्न पहनूं?" : "Which gemstone to wear?",
            ].map((q, i) => (
              <Link
                key={i}
                to="/ai-astrologer"
                className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs text-white font-devanagari hover:bg-white/20 transition-colors"
              >
                {q}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIDivider;
