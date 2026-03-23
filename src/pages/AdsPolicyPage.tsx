import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import { useLanguage } from "@/contexts/LanguageContext";

const AdsPolicyPage = () => {
  const { language } = useLanguage();
  const isHi = language === "hi";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <div className="py-10 border-b border-border" style={{ background: "var(--gradient-sacred)" }}>
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-devanagari-serif font-bold text-primary-foreground mb-2">
              {isHi ? "विज्ञापन नीति" : "Advertising Policy"}
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-3xl space-y-4">
          {[
            {
              titleHi: "विज्ञापन सिद्धांत", titleEn: "Advertising Principles",
              contentHi: "दिव्य ज्योति पर सभी विज्ञापन धार्मिक और सांस्कृतिक मूल्यों के अनुरूप होते हैं। हम किसी भी अशोभनीय, भ्रामक या हानिकारक विज्ञापन को प्रकाशित नहीं करते।",
              contentEn: "All advertisements on Divya Jyoti align with religious and cultural values. We do not publish any indecent, misleading, or harmful advertisements.",
            },
            {
              titleHi: "स्वीकार्य विज्ञापन", titleEn: "Acceptable Advertisements",
              contentHi: "पूजा सामग्री, धार्मिक पुस्तकें, आयुर्वेदिक उत्पाद, शैक्षिक सामग्री, और अन्य सात्विक उत्पादों के विज्ञापन स्वीकार किए जाते हैं।",
              contentEn: "Advertisements for puja items, religious books, Ayurvedic products, educational materials, and other sattvic products are accepted.",
            },
            {
              titleHi: "अस्वीकार्य विज्ञापन", titleEn: "Prohibited Advertisements",
              contentHi: "मद्य, तंबाकू, जुआ, अश्लील सामग्री, धार्मिक भावनाओं को ठेस पहुँचाने वाले, या किसी भी प्रकार के फर्जी ज्योतिषीय सेवाओं के विज्ञापन सख्त वर्जित हैं।",
              contentEn: "Advertisements for alcohol, tobacco, gambling, obscene content, content hurting religious sentiments, or any fraudulent astrological services are strictly prohibited.",
            },
            {
              titleHi: "विज्ञापन दाता संपर्क", titleEn: "Advertiser Contact",
              contentHi: "विज्ञापन के लिए ads@divyajyoti.in पर संपर्क करें।",
              contentEn: "For advertising inquiries, contact ads@divyajyoti.in",
            },
          ].map((s, i) => (
            <section key={i} className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h2 className="text-lg font-devanagari-serif font-bold text-foreground mb-2">
                {isHi ? s.titleHi : s.titleEn}
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

export default AdsPolicyPage;
