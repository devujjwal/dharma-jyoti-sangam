import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import mandalaHero from "@/assets/mandala-hero.png";
import templeHero from "@/assets/temple-hero.jpg";

const HeroSection = () => {
  const { language, t } = useLanguage();

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={templeHero}
          alt="Sacred temple"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        {/* Sacred pattern overlay */}
        <div className="absolute inset-0 bg-pattern-sacred opacity-10" />
      </div>

      {/* Floating mandala */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 w-80 h-80 opacity-15 hidden lg:block pointer-events-none">
        <img src={mandalaHero} alt="" className="w-full h-full animate-spin-slow" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="max-w-2xl">
          {/* Om tagline */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm mb-6 animate-fade-in">
            <span className="text-lg">🪔</span>
            <span className="text-sm font-devanagari text-primary-foreground/90 font-medium">
              {language === "hi" ? "आज का पर्व: होली — रंगों का उत्सव" : "Today's festival: Holi — Festival of Colors"}
            </span>
          </div>

          {/* Main title */}
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-devanagari-serif font-bold text-primary-foreground mb-4 leading-tight animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            {t("hero_title")}
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg md:text-xl font-devanagari text-primary-foreground/80 mb-8 leading-relaxed max-w-xl animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            {t("hero_subtitle")}
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-wrap gap-3 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <Link
              to="/panchang"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-base font-devanagari font-semibold text-primary-foreground shadow-sacred transition-all hover:scale-105 active:scale-95"
              style={{ background: "var(--gradient-saffron)" }}
            >
              <span>📅</span>
              <span>{t("hero_cta")}</span>
            </Link>
            <Link
              to="/ai-astrologer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-base font-devanagari font-semibold text-primary-foreground border-2 border-primary-foreground/30 backdrop-blur-sm hover:bg-primary-foreground/10 transition-all"
            >
              <span>🔮</span>
              <span>{t("hero_cta2")}</span>
            </Link>
          </div>

          {/* Stats row */}
          <div
            className="flex flex-wrap gap-6 mt-10 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            {[
              { icon: "👥", num: "12L+", label: language === "hi" ? "भक्त" : "Devotees" },
              { icon: "🔮", num: "50L+", label: language === "hi" ? "ज्योतिष प्रश्न" : "AI Queries" },
              { icon: "🛕", num: "5000+", label: language === "hi" ? "मंदिर" : "Temples" },
              { icon: "🎵", num: "1000+", label: language === "hi" ? "भजन" : "Bhajans" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xl">{stat.icon}</span>
                <div>
                  <div className="text-lg font-bold text-primary-foreground leading-none shimmer">
                    {stat.num}
                  </div>
                  <div className="text-xs text-primary-foreground/60 font-devanagari">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" className="w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="hsl(35 60% 97%)" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
