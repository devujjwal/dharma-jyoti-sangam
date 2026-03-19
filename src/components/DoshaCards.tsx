import { AlertTriangle, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { DoshaResult } from "@/lib/kundaliCalc";

interface DoshaInfo {
  id: string;
  emoji: string;
  nameHi: string;
  nameEn: string;
  presentLabelHi: string;
  presentLabelEn: string;
  absentLabelHi: string;
  absentLabelEn: string;
  explanationHi: string;
  explanationEn: string;
  remediesHi: string[];
  remediesEn: string[];
  /** hsl color values (without hsl() wrapper) for theming */
  hsl: string;
}

const DOSHA_INFO: Record<"manglik" | "kaalSarp", DoshaInfo> = {
  manglik: {
    id: "manglik",
    emoji: "♂",
    nameHi: "मांगलिक दोष",
    nameEn: "Manglik Dosha",
    presentLabelHi: "मांगलिक दोष विद्यमान है",
    presentLabelEn: "Manglik Dosha Present",
    absentLabelHi: "मांगलिक दोष नहीं है",
    absentLabelEn: "No Manglik Dosha",
    explanationHi:
      "मांगलिक दोष तब बनता है जब मंगल ग्रह लग्न, द्वितीय, चतुर्थ, सप्तम, अष्टम या द्वादश भाव में स्थित होता है। इसे कुज दोष भी कहते हैं। यह विशेष रूप से विवाह और वैवाहिक सुख को प्रभावित करता है।",
    explanationEn:
      "Manglik Dosha (Kuja Dosha) occurs when Mars is placed in the 1st, 2nd, 4th, 7th, 8th, or 12th house. It is traditionally associated with challenges in marriage, temperament, and partnerships.",
    remediesHi: [
      "मंगलवार का व्रत रखें और हनुमान जी की पूजा करें।",
      "लाल मूंगा (Coral) धारण करें — किसी विद्वान ज्योतिषी की सलाह से।",
      "विवाह से पूर्व कुंभ-विवाह या विष्णु-विवाह संस्कार कराएं।",
      "मंगल स्तोत्र या मंगल चालीसा का पाठ करें।",
      "दोनों जातकों की कुंडली मिलाएं — यदि दूसरा भी मांगलिक हो तो दोष निरस्त होता है।",
    ],
    remediesEn: [
      "Observe fast on Tuesdays and worship Lord Hanuman.",
      "Wear a Red Coral gemstone after consulting a learned astrologer.",
      "Perform Kumbh Vivah or Vishnu Vivah ritual before marriage.",
      "Recite Mangal Stotra or Mangal Chalisa daily.",
      "If both partners are Manglik, the dosha is considered neutralized.",
    ],
    hsl: "0 80% 45%",
  },
  kaalSarp: {
    id: "kaalSarp",
    emoji: "🐍",
    nameHi: "काल सर्प दोष",
    nameEn: "Kaal Sarp Dosha",
    presentLabelHi: "काल सर्प दोष विद्यमान है",
    presentLabelEn: "Kaal Sarp Dosha Present",
    absentLabelHi: "काल सर्प दोष नहीं है",
    absentLabelEn: "No Kaal Sarp Dosha",
    explanationHi:
      "काल सर्प दोष तब बनता है जब सभी सात ग्रह (सूर्य, चंद्र, मंगल, बुध, बृहस्पति, शुक्र, शनि) राहु और केतु के बीच एक ओर स्थित हों। यह दोष जीवन में अनेक प्रकार की बाधाएँ, विलंब और संघर्ष उत्पन्न कर सकता है।",
    explanationEn:
      "Kaal Sarp Dosha forms when all seven classical planets (Sun through Saturn) are hemmed between Rahu and Ketu on one side of the chart. It can bring delays, obstacles, and karmic challenges in various life areas.",
    remediesHi: [
      "त्र्यंबकेश्वर (नासिक) या उज्जैन में काल सर्प दोष निवारण पूजा कराएं।",
      "नागपंचमी पर नाग देवता की पूजा करें।",
      "महामृत्युंजय मंत्र का जाप करें — प्रतिदिन 108 बार।",
      "सोमवार को शिवलिंग पर जल और बेलपत्र अर्पित करें।",
      "श्रावण मास में रुद्राभिषेक करवाएं।",
    ],
    remediesEn: [
      "Perform Kaal Sarp Dosha Nivaran Puja at Trimbakeshwar (Nasik) or Ujjain.",
      "Worship Nag Devata on Nag Panchami.",
      "Chant the Mahamrityunjaya Mantra 108 times daily.",
      "Offer water and Belpatra on Shivalinga every Monday.",
      "Arrange Rudrabhishek during Shravan month.",
    ],
    hsl: "160 50% 30%",
  },
};

interface Props {
  manglik: DoshaResult;
  kaalSarp: DoshaResult;
  isHi: boolean;
}

function DoshaCard({
  info,
  result,
  isHi,
}: {
  info: DoshaInfo;
  result: DoshaResult;
  isHi: boolean;
}) {
  const [open, setOpen] = useState(false);
  const present = result.present;

  return (
    <div
      className="rounded-2xl border bg-card shadow-card overflow-hidden"
      style={{
        borderColor: present ? `hsl(${info.hsl} / 0.5)` : "hsl(var(--border))",
      }}
    >
      {/* Colored top bar */}
      {present && (
        <div className="h-1.5 w-full" style={{ background: `hsl(${info.hsl})` }} />
      )}

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Icon badge */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 font-bold"
              style={{
                background: present ? `hsl(${info.hsl} / 0.12)` : "hsl(var(--muted))",
                color: present ? `hsl(${info.hsl})` : "hsl(var(--muted-foreground))",
                border: present ? `1.5px solid hsl(${info.hsl} / 0.35)` : "1.5px solid hsl(var(--border))",
              }}
            >
              {info.emoji}
            </div>

            <div>
              <h3 className="font-devanagari-serif font-bold text-foreground text-base leading-tight">
                {isHi ? info.nameHi : info.nameEn}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                {present ? (
                  <AlertTriangle
                    className="w-3.5 h-3.5 shrink-0"
                    style={{ color: `hsl(${info.hsl})` }}
                  />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-green-600" />
                )}
                <span
                  className="text-xs font-devanagari font-semibold"
                  style={{ color: present ? `hsl(${info.hsl})` : "hsl(142 60% 35%)" }}
                >
                  {present
                    ? (isHi ? info.presentLabelHi : info.presentLabelEn)
                    : (isHi ? info.absentLabelHi : info.absentLabelEn)}
                </span>
              </div>
              {present && result.detail && (
                <p className="text-[11px] text-muted-foreground font-devanagari mt-0.5">
                  {result.detail}
                </p>
              )}
            </div>
          </div>

          {/* Expand toggle — only when present */}
          {present && (
            <button
              onClick={() => setOpen(o => !o)}
              className="shrink-0 p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
              aria-label="Toggle details"
            >
              {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Expandable content */}
        {present && open && (
          <div className="mt-4 space-y-4 animate-fade-in">
            {/* Explanation */}
            <div
              className="rounded-xl p-4 text-sm font-devanagari leading-relaxed text-foreground"
              style={{ background: `hsl(${info.hsl} / 0.07)` }}
            >
              {isHi ? info.explanationHi : info.explanationEn}
            </div>

            {/* Remedies */}
            <div>
              <p
                className="text-xs font-devanagari-serif font-bold mb-2"
                style={{ color: `hsl(${info.hsl})` }}
              >
                {isHi ? "✦ उपाय (Remedies)" : "✦ Recommended Remedies"}
              </p>
              <ul className="space-y-1.5">
                {(isHi ? info.remediesHi : info.remediesEn).map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm font-devanagari text-foreground">
                    <span
                      className="mt-0.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 text-white"
                      style={{ background: `hsl(${info.hsl})` }}
                    >
                      {i + 1}
                    </span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Disclaimer */}
            <p className="text-[11px] text-muted-foreground font-devanagari italic border-t border-border pt-3">
              {isHi
                ? "* यह केवल सांकेतिक जानकारी है। सटीक निदान व उपाय के लिए विद्वान ज्योतिषी से परामर्श लें।"
                : "* This is indicative only. Consult a learned Jyotishi for precise diagnosis and remedies."}
            </p>
          </div>
        )}

        {/* If not present, show a brief positive note */}
        {!present && (
          <p className="mt-3 text-xs font-devanagari text-muted-foreground">
            {isHi
              ? "आपकी कुंडली में यह दोष नहीं पाया गया। शुभम् भवतु 🙏"
              : "This dosha is not detected in your chart. Auspicious! 🙏"}
          </p>
        )}
      </div>
    </div>
  );
}

export default function DoshaCards({ manglik, kaalSarp, isHi }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="font-devanagari-serif font-bold text-foreground text-lg flex items-center gap-2">
        <span className="text-primary">⚡</span>
        {isHi ? "दोष विश्लेषण" : "Dosha Analysis"}
      </h3>
      <DoshaCard info={DOSHA_INFO.manglik} result={manglik} isHi={isHi} />
      <DoshaCard info={DOSHA_INFO.kaalSarp} result={kaalSarp} isHi={isHi} />
    </div>
  );
}
