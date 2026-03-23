import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { HelpCircle, MessageCircle, Mail, BookOpen } from "lucide-react";

const SupportPage = () => {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const faqs = [
    {
      qHi: "AI ज्योतिषी कैसे काम करता है?", qEn: "How does AI Astrologer work?",
      aHi: "AI ज्योतिषी उन्नत AI मॉडल और वैदिक ज्योतिष सिद्धांतों का उपयोग करके आपके प्रश्नों का उत्तर देता है। यह आपकी जन्मतिथि और ग्रह स्थिति के आधार पर व्यक्तिगत मार्गदर्शन प्रदान करता है।",
      aEn: "AI Astrologer uses advanced AI models and Vedic astrology principles to answer your questions. It provides personalized guidance based on your birth date and planetary positions.",
    },
    {
      qHi: "क्रेडिट कैसे खरीदें?", qEn: "How to buy credits?",
      aHi: "अपनी प्रोफ़ाइल पर जाएं → क्रेडिट टैब → अपनी पसंद का पैक चुनें। UPI, कार्ड या नेट बैंकिंग से भुगतान करें।",
      aEn: "Go to your Profile → Credits tab → Choose your preferred pack. Pay via UPI, Card or Net Banking.",
    },
    {
      qHi: "कुंडली मिलान कितना सटीक है?", qEn: "How accurate is Kundali Matching?",
      aHi: "हमारा कुंडली मिलान अष्टकूट पद्धति पर आधारित है जो 36 गुणों का विश्लेषण करता है। यह पारंपरिक ज्योतिषीय गणनाओं का सटीक अनुसरण करता है।",
      aEn: "Our Kundali Matching is based on the Ashtakoot system analyzing 36 gunas. It accurately follows traditional astrological calculations.",
    },
    {
      qHi: "क्या मेरा डेटा सुरक्षित है?", qEn: "Is my data safe?",
      aHi: "हाँ, आपका सभी डेटा SSL एन्क्रिप्शन से सुरक्षित है और हम किसी तीसरे पक्ष को आपकी जानकारी साझा नहीं करते।",
      aEn: "Yes, all your data is protected with SSL encryption and we do not share your information with any third party.",
    },
    {
      qHi: "रिफंड कैसे प्राप्त करें?", qEn: "How to get a refund?",
      aHi: "अप्रयुक्त क्रेडिट पैक का रिफंड खरीद के 7 दिनों के भीतर support@divyajyoti.in पर अनुरोध करके प्राप्त किया जा सकता है।",
      aEn: "Refund for unused credit packs can be obtained by requesting at support@divyajyoti.in within 7 days of purchase.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <div className="py-10 border-b border-border" style={{ background: "var(--gradient-sacred)" }}>
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full text-3xl mb-4" style={{ background: "hsl(var(--primary-foreground) / 0.15)" }}>
              <HelpCircle className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-devanagari-serif font-bold text-primary-foreground mb-2">
              {isHi ? "सहायता केंद्र" : "Help Center"}
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-3xl">
          {/* Quick links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              { icon: <MessageCircle className="w-5 h-5" />, labelHi: "AI ज्योतिषी से पूछें", labelEn: "Ask AI Astrologer", href: "/ai-astrologer" },
              { icon: <Mail className="w-5 h-5" />, labelHi: "संपर्क करें", labelEn: "Contact Us", href: "/contact" },
              { icon: <BookOpen className="w-5 h-5" />, labelHi: "लेख पढ़ें", labelEn: "Read Articles", href: "/articles" },
            ].map((item, i) => (
              <Link key={i} to={item.href} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-primary shrink-0" style={{ background: "hsl(var(--primary) / 0.1)" }}>
                  {item.icon}
                </div>
                <span className="font-devanagari font-medium text-foreground text-sm">{isHi ? item.labelHi : item.labelEn}</span>
              </Link>
            ))}
          </div>

          {/* FAQ */}
          <h2 className="text-xl font-devanagari-serif font-bold text-foreground mb-4">
            {isHi ? "अक्सर पूछे जाने वाले प्रश्न" : "Frequently Asked Questions"}
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="group rounded-xl border border-border bg-card shadow-card overflow-hidden">
                <summary className="cursor-pointer px-5 py-4 font-devanagari font-semibold text-foreground flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <span>{isHi ? faq.qHi : faq.qEn}</span>
                  <span className="text-muted-foreground group-open:rotate-45 transition-transform text-lg">+</span>
                </summary>
                <div className="px-5 pb-4">
                  <p className="text-muted-foreground font-devanagari leading-relaxed text-sm">
                    {isHi ? faq.aHi : faq.aEn}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default SupportPage;
