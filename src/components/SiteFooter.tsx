import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const SiteFooter = React.forwardRef<HTMLElement>((_, ref) => {
  const { language, t } = useLanguage();

  const footerLinks = {
    jyotish: {
      titleHi: "ज्योतिष", titleEn: "Jyotish",
      links: [
        { hi: "राशिफल", en: "Horoscope", href: "/horoscope" },
        { hi: "कुंडली", en: "Kundali", href: "/kundali" },
        { hi: "कुंडली मिलान", en: "Kundali Matching", href: "/kundali-matching" },
        { hi: "पंचांग", en: "Panchang", href: "/panchang" },
        { hi: "AI ज्योतिषी", en: "AI Astrologer", href: "/ai-astrologer" },
      ],
    },
    bhakti: {
      titleHi: "भक्ति", titleEn: "Bhakti",
      links: [
        { hi: "भजन-चालीसा", en: "Bhajans & Chalisa", href: "/bhajans" },
        { hi: "त्यौहार कैलेंडर", en: "Festival Calendar", href: "/festivals" },
        { hi: "मंदिर निर्देशिका", en: "Temple Directory", href: "/temples" },
        { hi: "वृत गाइड", en: "Vrat Guide", href: "/vrat" },
        { hi: "धार्मिक लेख", en: "Articles", href: "/articles" },
      ],
    },
    account: {
      titleHi: "अकाउंट", titleEn: "Account",
      links: [
        { hi: "लॉगिन", en: "Login", href: "/login" },
        { hi: "पंजीकरण", en: "Register", href: "/register" },
        { hi: "मेरी प्रोफ़ाइल", en: "My Profile", href: "/profile" },
        { hi: "सदस्यता", en: "Subscription", href: "/subscribe" },
        { hi: "सहायता", en: "Support", href: "/support" },
      ],
    },
    legal: {
      titleHi: "जानकारी", titleEn: "Info",
      links: [
        { hi: "हमारे बारे में", en: "About Us", href: "/about" },
        { hi: "गोपनीयता नीति", en: "Privacy Policy", href: "/privacy" },
        { hi: "उपयोग की शर्तें", en: "Terms of Use", href: "/terms" },
        { hi: "विज्ञापन नीति", en: "Ads Policy", href: "/ads-policy" },
        { hi: "सम्पर्क करें", en: "Contact Us", href: "/contact" },
      ],
    },
  };

  return (
    <footer className="border-t border-border">
      {/* Main footer */}
      <div className="bg-foreground/5">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Brand column */}
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold text-primary-foreground"
                  style={{ background: "var(--gradient-saffron)" }}>
                  ॐ
                </div>
                <div>
                  <div className="font-devanagari-serif font-bold text-foreground">{t("appName")}</div>
                  <div className="text-xs text-muted-foreground">Divya Jyoti</div>
                </div>
              </Link>
              <p className="text-sm text-muted-foreground font-devanagari leading-relaxed mb-4">
                {t("tagline")}
              </p>
              <div className="flex gap-2">
                {["📘", "📸", "🐦", "▶️"].map((icon, i) => (
                  <button key={i} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm hover:bg-primary/10 transition-colors">
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.values(footerLinks).map((section, i) => (
              <div key={i}>
                <h4 className="font-devanagari-serif font-bold text-foreground mb-3 text-sm">
                  {language === "hi" ? section.titleHi : section.titleEn}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <Link to={link.href} className="text-sm text-muted-foreground font-devanagari hover:text-primary transition-colors">
                        {language === "hi" ? link.hi : link.en}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground font-devanagari text-center sm:text-left">
              © 2025 दिव्य ज्योति। सर्वाधिकार सुरक्षित।
            </p>
            <p className="text-xs text-muted-foreground font-devanagari text-center max-w-md leading-relaxed">
              {t("footer_disclaimer")}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>🔒 SSL</span>
              <span>|</span>
              <span>🇮🇳 India First</span>
              <span>|</span>
              <span>GST Reg.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
