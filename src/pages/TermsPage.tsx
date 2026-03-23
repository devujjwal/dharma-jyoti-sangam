import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import { useLanguage } from "@/contexts/LanguageContext";

const TermsPage = () => {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const sections = [
    {
      titleHi: "सेवा की शर्तें", titleEn: "Terms of Service",
      contentHi: "दिव्य ज्योति वेबसाइट का उपयोग करके आप इन शर्तों से सहमत होते हैं। यह वेबसाइट ज्योतिषीय ज्ञान और मार्गदर्शन प्रदान करती है, जो केवल सूचनात्मक उद्देश्यों के लिए है।",
      contentEn: "By using the Divya Jyoti website, you agree to these terms. This website provides astrological knowledge and guidance for informational purposes only.",
    },
    {
      titleHi: "सामग्री का उपयोग", titleEn: "Content Usage",
      contentHi: "इस वेबसाइट पर सभी सामग्री — राशिफल, कुंडली, भजन, लेख — दिव्य ज्योति की संपत्ति है। बिना अनुमति के व्यावसायिक उपयोग वर्जित है।",
      contentEn: "All content on this website — horoscopes, Kundali, bhajans, articles — is the property of Divya Jyoti. Commercial use without permission is prohibited.",
    },
    {
      titleHi: "AI ज्योतिषी अस्वीकरण", titleEn: "AI Astrologer Disclaimer",
      contentHi: "AI ज्योतिषी की सभी भविष्यवाणियाँ सांकेतिक हैं। ये पेशेवर ज्योतिषीय परामर्श का विकल्प नहीं हैं। महत्वपूर्ण निर्णयों के लिए किसी योग्य ज्योतिषी से परामर्श लें।",
      contentEn: "All predictions from AI Astrologer are indicative. They are not a substitute for professional astrological consultation. Consult a qualified astrologer for important decisions.",
    },
    {
      titleHi: "भुगतान और रिफंड", titleEn: "Payment & Refund",
      contentHi: "सभी भुगतान भारतीय रुपये में हैं और GST सहित हैं। डिजिटल सेवाओं का रिफंड 7 दिनों के भीतर किया जा सकता है यदि सेवा का उपयोग नहीं हुआ हो।",
      contentEn: "All payments are in Indian Rupees and inclusive of GST. Digital services can be refunded within 7 days if unused.",
    },
    {
      titleHi: "खाता समाप्ति", titleEn: "Account Termination",
      contentHi: "हम अनुचित उपयोग या शर्तों के उल्लंघन पर किसी भी खाते को समाप्त करने का अधिकार रखते हैं।",
      contentEn: "We reserve the right to terminate any account for misuse or violation of terms.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <div className="py-10 border-b border-border" style={{ background: "var(--gradient-sacred)" }}>
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-devanagari-serif font-bold text-primary-foreground mb-2">
              {isHi ? "उपयोग की शर्तें" : "Terms of Use"}
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
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default TermsPage;
