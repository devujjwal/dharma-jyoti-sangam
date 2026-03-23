import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import { useLanguage } from "@/contexts/LanguageContext";

interface Vrat {
  id: string;
  nameHi: string;
  nameEn: string;
  dayHi: string;
  dayEn: string;
  deityHi: string;
  deityEn: string;
  descHi: string;
  descEn: string;
  benefitsHi: string;
  benefitsEn: string;
  emoji: string;
  color: string;
}

const VRATS: Vrat[] = [
  { id: "somvar", nameHi: "सोमवार व्रत", nameEn: "Monday Fast", dayHi: "प्रत्येक सोमवार", dayEn: "Every Monday", deityHi: "भगवान शिव", deityEn: "Lord Shiva", descHi: "सोमवार का व्रत भगवान शिव को समर्पित है। इस दिन शिवलिंग पर जल, दूध और बिल्वपत्र अर्पित करें।", descEn: "Monday fast is dedicated to Lord Shiva. Offer water, milk, and bilva leaves on Shivalinga.", benefitsHi: "वैवाहिक जीवन में सुख, मनोकामना पूर्ति", benefitsEn: "Marital happiness, wish fulfillment", emoji: "🔱", color: "hsl(240 30% 40%)" },
  { id: "mangalvar", nameHi: "मंगलवार व्रत", nameEn: "Tuesday Fast", dayHi: "प्रत्येक मंगलवार", dayEn: "Every Tuesday", deityHi: "हनुमान जी", deityEn: "Lord Hanuman", descHi: "मंगलवार का व्रत हनुमान जी को समर्पित है। हनुमान चालीसा का पाठ करें और सिंदूर चढ़ाएं।", descEn: "Tuesday fast is dedicated to Lord Hanuman. Recite Hanuman Chalisa and offer vermilion.", benefitsHi: "साहस, शक्ति, ऋण से मुक्ति", benefitsEn: "Courage, strength, freedom from debt", emoji: "🐒", color: "hsl(24 95% 48%)" },
  { id: "budhvar", nameHi: "बुधवार व्रत", nameEn: "Wednesday Fast", dayHi: "प्रत्येक बुधवार", dayEn: "Every Wednesday", deityHi: "भगवान गणेश", deityEn: "Lord Ganesha", descHi: "बुधवार का व्रत भगवान गणेश और बुध ग्रह को समर्पित है। दूर्वा और मोदक अर्पित करें।", descEn: "Wednesday fast is dedicated to Lord Ganesha and planet Mercury. Offer durva grass and modak.", benefitsHi: "बुद्धि वृद्धि, व्यापार में लाभ", benefitsEn: "Enhanced intellect, business gains", emoji: "🐘", color: "hsl(150 50% 38%)" },
  { id: "guruvar", nameHi: "गुरुवार व्रत", nameEn: "Thursday Fast", dayHi: "प्रत्येक गुरुवार", dayEn: "Every Thursday", deityHi: "भगवान विष्णु / बृहस्पति", deityEn: "Lord Vishnu / Jupiter", descHi: "गुरुवार का व्रत भगवान विष्णु और बृहस्पति ग्रह के लिए रखा जाता है। पीले वस्त्र पहनें।", descEn: "Thursday fast is observed for Lord Vishnu and planet Jupiter. Wear yellow clothes.", benefitsHi: "ज्ञान, धन, संतान सुख", benefitsEn: "Knowledge, wealth, happiness through children", emoji: "🌟", color: "hsl(43 95% 50%)" },
  { id: "shukravar", nameHi: "शुक्रवार व्रत", nameEn: "Friday Fast", dayHi: "प्रत्येक शुक्रवार", dayEn: "Every Friday", deityHi: "माँ लक्ष्मी / संतोषी माँ", deityEn: "Goddess Lakshmi / Santoshi Maa", descHi: "शुक्रवार का व्रत संतोषी माँ या माँ लक्ष्मी को समर्पित है। गुड़-चना का प्रसाद चढ़ाएं।", descEn: "Friday fast is dedicated to Santoshi Maa or Goddess Lakshmi. Offer jaggery and chickpeas.", benefitsHi: "धन-समृद्धि, सौभाग्य", benefitsEn: "Wealth, prosperity, good fortune", emoji: "🌺", color: "hsl(330 65% 50%)" },
  { id: "shanivar", nameHi: "शनिवार व्रत", nameEn: "Saturday Fast", dayHi: "प्रत्येक शनिवार", dayEn: "Every Saturday", deityHi: "शनि देव", deityEn: "Lord Shani", descHi: "शनिवार का व्रत शनि देव को समर्पित है। काले तिल का दान करें और सरसों के तेल का दीपक जलाएं।", descEn: "Saturday fast is dedicated to Lord Shani. Donate black sesame and light mustard oil lamp.", benefitsHi: "शनि दोष निवारण, कष्ट से मुक्ति", benefitsEn: "Removal of Shani dosha, relief from hardships", emoji: "⚫", color: "hsl(240 30% 30%)" },
  { id: "ekadashi", nameHi: "एकादशी व्रत", nameEn: "Ekadashi Fast", dayHi: "प्रत्येक एकादशी (मास में दो बार)", dayEn: "Every Ekadashi (twice a month)", deityHi: "भगवान विष्णु", deityEn: "Lord Vishnu", descHi: "एकादशी व्रत भगवान विष्णु को समर्पित सबसे महत्वपूर्ण व्रतों में से एक है। अनाज का सेवन वर्जित।", descEn: "Ekadashi fast is one of the most important fasts dedicated to Lord Vishnu. Grain consumption is prohibited.", benefitsHi: "पापों का नाश, मोक्ष प्राप्ति", benefitsEn: "Destruction of sins, attainment of salvation", emoji: "🌕", color: "hsl(220 60% 45%)" },
  { id: "pradosh", nameHi: "प्रदोष व्रत", nameEn: "Pradosh Vrat", dayHi: "प्रत्येक त्रयोदशी", dayEn: "Every Trayodashi", deityHi: "भगवान शिव", deityEn: "Lord Shiva", descHi: "प्रदोष व्रत भगवान शिव की आराधना का विशेष दिन है। संध्या काल में शिव पूजन करें।", descEn: "Pradosh Vrat is a special day for worshipping Lord Shiva. Perform Shiva puja in the evening.", benefitsHi: "पाप नाश, शिव कृपा", benefitsEn: "Destruction of sins, Shiva's grace", emoji: "🌙", color: "hsl(270 50% 40%)" },
];

const VratPage = () => {
  const { language } = useLanguage();
  const isHi = language === "hi";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <div className="py-10 border-b border-border" style={{ background: "var(--gradient-sacred)" }}>
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full text-4xl mb-4" style={{ background: "hsl(var(--primary-foreground) / 0.15)" }}>🙏</div>
            <h1 className="text-3xl md:text-4xl font-devanagari-serif font-bold text-primary-foreground mb-2">
              {isHi ? "व्रत गाइड" : "Vrat Guide"}
            </h1>
            <p className="text-primary-foreground/75 font-devanagari text-sm max-w-xl mx-auto">
              {isHi ? "सप्ताहिक और विशेष व्रतों की संपूर्ण जानकारी" : "Complete information on weekly and special fasts"}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-4">
            {VRATS.map(vrat => (
              <div key={vrat.id} className="card-sacred rounded-2xl border border-border bg-card overflow-hidden">
                <div className="h-1.5 w-full" style={{ background: vrat.color }} />
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0" style={{ background: `${vrat.color}15` }}>
                      {vrat.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-devanagari-serif font-bold text-foreground text-lg">{isHi ? vrat.nameHi : vrat.nameEn}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full font-devanagari" style={{ background: `${vrat.color}15`, color: vrat.color }}>{isHi ? vrat.deityHi : vrat.deityEn}</span>
                        <span className="text-xs text-muted-foreground font-devanagari">{isHi ? vrat.dayHi : vrat.dayEn}</span>
                      </div>
                      <p className="text-sm text-muted-foreground font-devanagari leading-relaxed mt-2">{isHi ? vrat.descHi : vrat.descEn}</p>
                      <div className="mt-3 rounded-lg bg-muted/50 px-3 py-2">
                        <p className="text-xs font-devanagari">
                          <span className="font-semibold text-foreground">{isHi ? "लाभ: " : "Benefits: "}</span>
                          <span className="text-muted-foreground">{isHi ? vrat.benefitsHi : vrat.benefitsEn}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default VratPage;
