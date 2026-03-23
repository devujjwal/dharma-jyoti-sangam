import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import { useLanguage } from "@/contexts/LanguageContext";

const AboutPage = () => {
  const { language } = useLanguage();
  const isHi = language === "hi";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <div className="py-10 border-b border-border" style={{ background: "var(--gradient-sacred)" }}>
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-devanagari-serif font-bold text-primary-foreground mb-2">
              {isHi ? "हमारे बारे में" : "About Us"}
            </h1>
            <p className="text-primary-foreground/75 font-devanagari text-sm max-w-xl mx-auto">
              {isHi ? "दिव्य ज्योति — ज्ञान, भक्ति और ज्योतिष का पवित्र संगम" : "Divya Jyoti — Sacred Union of Knowledge, Devotion & Astrology"}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="prose prose-lg font-devanagari space-y-6">
            <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h2 className="text-xl font-devanagari-serif font-bold text-foreground mb-3 flex items-center gap-2">
                <span>🕉️</span> {isHi ? "हमारा उद्देश्य" : "Our Mission"}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {isHi
                  ? "दिव्य ज्योति का उद्देश्य भारतीय ज्योतिष शास्त्र, धार्मिक ज्ञान और भक्ति को सुलभ और आधुनिक तरीके से हर व्यक्ति तक पहुँचाना है। हम पारंपरिक ज्ञान को AI तकनीक के साथ जोड़कर सटीक और व्यक्तिगत मार्गदर्शन प्रदान करते हैं।"
                  : "Divya Jyoti aims to make Indian astrology, religious wisdom, and devotion accessible to everyone in a modern way. We combine traditional knowledge with AI technology to provide accurate and personalized guidance."}
              </p>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h2 className="text-xl font-devanagari-serif font-bold text-foreground mb-3 flex items-center gap-2">
                <span>🌸</span> {isHi ? "हमारी सेवाएं" : "Our Services"}
              </h2>
              <ul className="space-y-2 text-muted-foreground">
                {[
                  { icon: "📅", hi: "दैनिक पंचांग — तिथि, नक्षत्र, योग, करण, राहुकाल", en: "Daily Panchang — Tithi, Nakshatra, Yoga, Karana, Rahu Kaal" },
                  { icon: "⭐", hi: "राशिफल — 12 राशियों का दैनिक भविष्यफल", en: "Horoscope — Daily predictions for all 12 zodiac signs" },
                  { icon: "🔮", hi: "AI ज्योतिषी — व्यक्तिगत ज्योतिषीय मार्गदर्शन", en: "AI Astrologer — Personalized astrological guidance" },
                  { icon: "💑", hi: "कुंडली मिलान — अष्टकूट गुण मिलान", en: "Kundali Matching — Ashtakoot compatibility analysis" },
                  { icon: "🎊", hi: "त्यौहार कैलेंडर — वार्षिक पर्व और व्रत सूची", en: "Festival Calendar — Annual festivals and vrat listing" },
                  { icon: "🎵", hi: "भजन-चालीसा — पवित्र भजन और स्तोत्र संग्रह", en: "Bhajans & Chalisa — Sacred hymns and stotras collection" },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="shrink-0">{item.icon}</span>
                    <span className="font-devanagari">{isHi ? item.hi : item.en}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h2 className="text-xl font-devanagari-serif font-bold text-foreground mb-3 flex items-center gap-2">
                <span>🙏</span> {isHi ? "हमारी टीम" : "Our Team"}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {isHi
                  ? "हमारी टीम में अनुभवी ज्योतिषी, संस्कृत विद्वान, और तकनीकी विशेषज्ञ शामिल हैं जो मिलकर प्राचीन ज्ञान को आधुनिक तकनीक के साथ प्रस्तुत करते हैं। हम हर जानकारी की प्रामाणिकता सुनिश्चित करते हैं।"
                  : "Our team includes experienced astrologers, Sanskrit scholars, and technology experts who work together to present ancient wisdom through modern technology. We ensure the authenticity of every piece of information."}
              </p>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h2 className="text-xl font-devanagari-serif font-bold text-foreground mb-3 flex items-center gap-2">
                <span>📧</span> {isHi ? "संपर्क" : "Contact"}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {isHi ? "ईमेल: support@divyajyoti.in" : "Email: support@divyajyoti.in"}<br />
                {isHi ? "कार्यालय: नई दिल्ली, भारत" : "Office: New Delhi, India"}
              </p>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default AboutPage;
