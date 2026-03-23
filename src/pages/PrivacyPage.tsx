import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import { useLanguage } from "@/contexts/LanguageContext";

const PrivacyPage = () => {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const sections = [
    {
      titleHi: "जानकारी का संग्रह", titleEn: "Information Collection",
      contentHi: "हम आपकी पंजीकरण जानकारी (नाम, ईमेल, जन्मतिथि), उपयोग डेटा, और ज्योतिषीय प्रश्नों को एकत्र करते हैं। यह जानकारी आपको बेहतर सेवा प्रदान करने के लिए उपयोग की जाती है।",
      contentEn: "We collect your registration information (name, email, date of birth), usage data, and astrological queries. This information is used to provide you with better services.",
    },
    {
      titleHi: "जानकारी का उपयोग", titleEn: "Use of Information",
      contentHi: "आपकी जानकारी का उपयोग व्यक्तिगत राशिफल, कुंडली निर्माण, AI ज्योतिषीय परामर्श, और सेवा सुधार के लिए किया जाता है। हम आपकी जानकारी किसी तीसरे पक्ष को नहीं बेचते।",
      contentEn: "Your information is used for personalized horoscopes, Kundali generation, AI astrological consultations, and service improvement. We do not sell your information to any third party.",
    },
    {
      titleHi: "डेटा सुरक्षा", titleEn: "Data Security",
      contentHi: "हम SSL एन्क्रिप्शन और सुरक्षित सर्वर का उपयोग करते हैं। आपका डेटा भारतीय सर्वर पर सुरक्षित रूप से संग्रहीत है और IT Act 2000 के अनुसार सुरक्षित है।",
      contentEn: "We use SSL encryption and secure servers. Your data is securely stored on Indian servers and protected under the IT Act 2000.",
    },
    {
      titleHi: "कुकीज़", titleEn: "Cookies",
      contentHi: "हम आपके अनुभव को बेहतर बनाने के लिए कुकीज़ का उपयोग करते हैं। आप अपने ब्राउज़र सेटिंग्स से कुकीज़ को अक्षम कर सकते हैं।",
      contentEn: "We use cookies to enhance your experience. You can disable cookies through your browser settings.",
    },
    {
      titleHi: "आपके अधिकार", titleEn: "Your Rights",
      contentHi: "आप किसी भी समय अपना खाता हटा सकते हैं, अपना डेटा डाउनलोड कर सकते हैं, या हमसे संपर्क करके अपनी जानकारी में सुधार करा सकते हैं।",
      contentEn: "You can delete your account at any time, download your data, or contact us to correct your information.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <div className="py-10 border-b border-border" style={{ background: "var(--gradient-sacred)" }}>
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-devanagari-serif font-bold text-primary-foreground mb-2">
              {isHi ? "गोपनीयता नीति" : "Privacy Policy"}
            </h1>
            <p className="text-primary-foreground/75 font-devanagari text-sm">
              {isHi ? "अंतिम अपडेट: जनवरी 2025" : "Last updated: January 2025"}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-3xl space-y-4">
          {sections.map((s, i) => (
            <section key={i} className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h2 className="text-lg font-devanagari-serif font-bold text-foreground mb-2">
                {i + 1}. {isHi ? s.titleHi : s.titleEn}
              </h2>
              <p className="text-muted-foreground font-devanagari leading-relaxed">
                {isHi ? s.contentHi : s.contentEn}
              </p>
            </section>
          ))}
          <p className="text-xs text-muted-foreground font-devanagari text-center pt-4">
            {isHi ? "प्रश्नों के लिए: privacy@divyajyoti.in" : "For queries: privacy@divyajyoti.in"}
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default PrivacyPage;
