import { useState, useRef, useEffect } from "react";
import { Send, Lock, Sparkles, Info, ChevronDown, User, Bot } from "lucide-react";
import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SAMPLE_QUESTIONS = {
  hi: [
    "मेरी शादी कब होगी?",
    "करियर में कब सफलता मिलेगी?",
    "आज कौन सा काम करना शुभ है?",
    "मेरे लिए कौन सा रत्न शुभ है?",
    "धन लाभ के उपाय बताएं",
    "राहु-केतु का प्रभाव कैसा रहेगा?",
  ],
  en: [
    "When will I get married?",
    "When will I get career success?",
    "What work is auspicious today?",
    "Which gemstone is lucky for me?",
    "Tell me remedies for wealth",
    "What is the effect of Rahu-Ketu?",
  ],
};

const SAMPLE_RESPONSES = {
  hi: [
    "🙏 आपका प्रश्न बहुत महत्वपूर्ण है। ज्योतिषीय दृष्टि से, विवाह का समय सप्तम भाव, शुक्र और बृहस्पति की स्थिति पर निर्भर करता है। अपनी जन्म तिथि, जन्म स्थान और जन्म समय देकर मैं आपको अधिक सटीक उत्तर दे सकता हूं।\n\n**सामान्य संकेत:** यदि आपकी आयु 25-30 के बीच है और बृहस्पति सप्तम में गोचर कर रहा है, तो यह अवधि विवाह के लिए अनुकूल हो सकती है।\n\n⚠️ *यह जानकारी सांकेतिक है। व्यक्तिगत कुंडली विश्लेषण के लिए विस्तृत विवरण दें।*",
    "🌟 करियर में सफलता के लिए बुध और सूर्य की स्थिति महत्वपूर्ण है। आपके दशमाभाव के स्वामी की गोचर स्थिति देखकर सटीक समय बताया जा सकता है।\n\n**उपाय:** बुधवार को हरे वस्त्र पहनें, बुध यंत्र स्थापित करें और गणेश जी की आराधना करें।\n\n⚠️ *व्यक्तिगत कुंडली के लिए जन्म विवरण साझा करें।*",
  ],
  en: [
    "🙏 Your question is very important. From an astrological perspective, marriage timing depends on the 7th house, Venus and Jupiter's position. By sharing your date of birth, place of birth, and time of birth, I can give you a more accurate answer.\n\n**General indication:** If you are aged 25-30 and Jupiter is transiting your 7th house, this period may be favorable for marriage.\n\n⚠️ *This information is indicative. Share detailed birth information for personal Kundali analysis.*",
    "🌟 For career success, Mercury and Sun's position is important. By checking your 10th house lord's transit position, I can tell the exact timing.\n\n**Remedy:** Wear green clothes on Wednesday, install Mercury Yantra and worship Lord Ganesha.\n\n⚠️ *Share birth details for personal Kundali analysis.*",
  ],
};

const AstrologerPage = () => {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: language === "hi"
        ? "🙏 नमस्ते! मैं दिव्य ज्योति का AI ज्योतिषी हूं। मैं आपके ज्योतिष, धर्म और अध्यात्म संबंधी प्रश्नों का उत्तर देने के लिए तत्पर हूं।\n\nआप मुझसे पूछ सकते हैं:\n• राशिफल और ग्रह-नक्षत्र के बारे में\n• कुंडली और जन्मपत्री विश्लेषण\n• शुभ मुहूर्त और व्रत-त्यौहार\n• वास्तु और उपाय\n\n**आज आपके पास 2 निःशुल्क प्रश्न हैं।**"
        : "🙏 Namaste! I am Divya Jyoti's AI Astrologer. I am ready to answer your questions on astrology, religion and spirituality.\n\nYou can ask me about:\n• Horoscope and planetary positions\n• Kundali and birth chart analysis\n• Auspicious timings and festivals\n• Vastu and remedies\n\n**You have 2 free questions today.**",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [freeQuestionsLeft, setFreeQuestionsLeft] = useState(2);
  const [showUpsell, setShowUpsell] = useState(false);
  const [showDobForm, setShowDobForm] = useState(false);
  const [dob, setDob] = useState({ date: "", place: "", time: "" });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    if (freeQuestionsLeft <= 0) {
      setShowUpsell(true);
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setFreeQuestionsLeft((prev) => prev - 1);

    // Simulate AI response
    setTimeout(() => {
      const responses = language === "hi" ? SAMPLE_RESPONSES.hi : SAMPLE_RESPONSES.en;
      const response = responses[Math.floor(Math.random() * responses.length)];
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      if (freeQuestionsLeft - 1 <= 0) {
        setTimeout(() => setShowUpsell(true), 1500);
      }
    }, 2200);
  };

  const formatMessage = (content: string) => {
    return content
      .split("\n")
      .map((line, i) => {
        if (line.startsWith("**") && line.endsWith("**")) {
          return <strong key={i} className="block mt-2 mb-1">{line.slice(2, -2)}</strong>;
        }
        if (line.startsWith("•")) {
          return <li key={i} className="ml-4 mt-1">{line.slice(1)}</li>;
        }
        if (line.startsWith("⚠️")) {
          return (
            <div key={i} className="mt-2 px-3 py-2 rounded-lg bg-secondary/20 border border-secondary/30 text-xs italic">
              {line}
            </div>
          );
        }
        return <span key={i}>{line}<br /></span>;
      });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl glow-pulse"
              style={{ background: "var(--gradient-saffron)" }}>
              🔮
            </div>
            <div>
              <h1 className="text-xl font-devanagari-serif font-bold text-foreground">{t("ai_title")}</h1>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-muted-foreground font-devanagari">
                  {language === "hi" ? "ऑनलाइन • AI द्वारा संचालित" : "Online • AI Powered"}
                </span>
              </div>
            </div>
          </div>

          {/* Free questions tracker */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card">
            <span className="text-sm">✨</span>
            <div className="text-right">
              <div className="text-xs text-muted-foreground font-devanagari">{t("free_questions_left")}</div>
              <div className="flex gap-1 mt-0.5 justify-end">
                {[1, 2].map((q) => (
                  <div key={q}
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      q <= freeQuestionsLeft
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {q <= freeQuestionsLeft ? "✓" : "✗"}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* DOB form toggle */}
        <button
          onClick={() => setShowDobForm(!showDobForm)}
          className="w-full mb-3 flex items-center justify-between px-4 py-2.5 rounded-xl border border-border bg-card text-sm font-devanagari text-foreground/80 hover:bg-muted transition-colors"
        >
          <span className="flex items-center gap-2">
            <span>📋</span>
            <span>{language === "hi" ? "अपना जन्म विवरण जोड़ें (वैकल्पिक — अधिक सटीक उत्तर के लिए)" : "Add your birth details (optional — for more accurate answers)"}</span>
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showDobForm ? "rotate-180" : ""}`} />
        </button>

        {showDobForm && (
          <div className="mb-3 p-4 rounded-xl border border-border bg-card grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in">
            {[
              { key: "date", labelHi: "जन्म तिथि", labelEn: "Date of Birth", type: "date" },
              { key: "place", labelHi: "जन्म स्थान", labelEn: "Place of Birth", type: "text" },
              { key: "time", labelHi: "जन्म समय", labelEn: "Time of Birth", type: "time" },
            ].map((f) => (
              <div key={f.key}>
                <label className="text-xs font-devanagari text-muted-foreground mb-1 block">
                  {language === "hi" ? f.labelHi : f.labelEn}
                </label>
                <input
                  type={f.type}
                  value={dob[f.key as keyof typeof dob]}
                  onChange={(e) => setDob({ ...dob, [f.key]: e.target.value })}
                  placeholder={f.type === "text" ? (language === "hi" ? "जैसे: दिल्ली" : "e.g. Delhi") : undefined}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm font-devanagari focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <div className="mb-3 flex items-start gap-2 px-3 py-2.5 rounded-lg bg-secondary/10 border border-secondary/20">
          <Info className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground font-devanagari leading-relaxed">
            {language === "hi"
              ? "⚠️ AI ज्योतिषी के उत्तर सांकेतिक हैं और मनोरंजन व ज्ञान के उद्देश्य से हैं। महत्वपूर्ण निर्णयों के लिए किसी प्रमाणित ज्योतिषाचार्य से परामर्श लें।"
              : "⚠️ AI Astrologer responses are indicative and for knowledge/entertainment purposes. For important decisions, consult a certified Jyotishacharya."}
          </p>
        </div>

        {/* Messages */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-card mb-3"
          style={{ minHeight: "420px" }}>
          <div className="overflow-y-auto p-4 space-y-4" style={{ maxHeight: "460px" }}>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  msg.role === "assistant"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}>
                  {msg.role === "assistant" ? "🔮" : <User className="w-4 h-4" />}
                </div>
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm font-devanagari leading-relaxed ${
                  msg.role === "assistant"
                    ? "bg-background border border-border text-foreground rounded-tl-sm"
                    : "text-primary-foreground rounded-tr-sm"
                }`}
                  style={msg.role === "user" ? { background: "var(--gradient-saffron)" } : {}}>
                  <div className="whitespace-pre-wrap">{formatMessage(msg.content)}</div>
                  <div className={`text-xs mt-1.5 ${msg.role === "user" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                    {msg.timestamp.toLocaleTimeString("hi-IN", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">🔮</div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-background border border-border">
                  <div className="flex gap-1 items-center">
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-primary"
                        style={{ animation: `glow-pulse 1s ease-in-out ${delay}s infinite` }} />
                    ))}
                    <span className="ml-2 text-xs text-muted-foreground font-devanagari">
                      {language === "hi" ? "उत्तर तैयार हो रहा है..." : "Generating answer..."}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-border p-3">
            {freeQuestionsLeft > 0 ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder={language === "hi" ? "अपना प्रश्न यहाँ लिखें..." : "Type your question here..."}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-muted/30 text-sm font-devanagari focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  size="sm"
                  className="px-4 py-2.5 rounded-xl"
                  style={{ background: "var(--gradient-saffron)" }}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <Lock className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <div className="text-sm font-devanagari font-semibold text-foreground">
                    {language === "hi" ? "आज के निःशुल्क प्रश्न समाप्त" : "Today's free questions used"}
                  </div>
                  <div className="text-xs text-muted-foreground font-devanagari">
                    {language === "hi" ? "अधिक पूछने के लिए प्रश्न पैक लें" : "Get a question pack for more"}
                  </div>
                </div>
                <Link to="/subscribe">
                  <Button size="sm" className="text-xs font-devanagari"
                    style={{ background: "var(--gradient-saffron)" }}>
                    {t("buy_pack")}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sample questions */}
        {messages.length <= 1 && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground font-devanagari mb-2">
              {language === "hi" ? "💡 ये प्रश्न पूछकर शुरुआत करें:" : "💡 Start by asking these questions:"}
            </p>
            <div className="flex flex-wrap gap-2">
              {(language === "hi" ? SAMPLE_QUESTIONS.hi : SAMPLE_QUESTIONS.en).map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInput(q)}
                  className="px-3 py-1.5 rounded-full border border-border bg-card text-xs font-devanagari text-foreground/80 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Upsell Modal */}
      {showUpsell && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: "hsl(20 40% 8% / 0.7)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-md rounded-3xl overflow-hidden border border-border shadow-deep animate-scale-in">
            {/* Header */}
            <div className="p-6 text-center"
              style={{ background: "var(--gradient-saffron)" }}>
              <div className="text-5xl mb-2">🔮</div>
              <h3 className="text-xl font-devanagari-serif font-bold text-white mb-1">
                {language === "hi" ? "और प्रश्न पूछना चाहते हैं?" : "Want to ask more questions?"}
              </h3>
              <p className="text-white/80 text-sm font-devanagari">
                {language === "hi" ? "आज के निःशुल्क प्रश्न समाप्त हो गए" : "Today's free questions are used up"}
              </p>
            </div>

            <div className="p-6 bg-card">
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { q: 10, price: "₹49", per: "₹4.9/सवाल", popular: false },
                  { q: 50, price: "₹199", per: "₹3.98/सवाल", popular: true },
                  { q: 100, price: "₹349", per: "₹3.49/सवाल", popular: false },
                ].map((pack) => (
                  <Link
                    key={pack.q}
                    to="/subscribe"
                    onClick={() => setShowUpsell(false)}
                    className={`relative rounded-xl border p-3 text-center transition-all ${
                      pack.popular
                        ? "border-secondary shadow-gold scale-105"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    {pack.popular && (
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-xs font-bold text-white"
                        style={{ background: "var(--gradient-saffron)" }}>
                        Best
                      </div>
                    )}
                    <div className="text-2xl font-bold text-foreground">{pack.q}</div>
                    <div className="text-xs text-muted-foreground font-devanagari">प्रश्न</div>
                    <div className="text-lg font-bold text-primary mt-1">{pack.price}</div>
                    <div className="text-xs text-muted-foreground font-devanagari">{pack.per}</div>
                  </Link>
                ))}
              </div>

              <div className="flex gap-2">
                <Link to="/subscribe" onClick={() => setShowUpsell(false)} className="flex-1">
                  <Button className="w-full font-devanagari" style={{ background: "var(--gradient-saffron)" }}>
                    {language === "hi" ? "पैक खरीदें — UPI/Card" : "Buy Pack — UPI/Card"}
                  </Button>
                </Link>
                <Button variant="outline" onClick={() => setShowUpsell(false)} className="font-devanagari">
                  {language === "hi" ? "कल" : "Tomorrow"}
                </Button>
              </div>

              <p className="text-center text-xs text-muted-foreground font-devanagari mt-3">
                {language === "hi"
                  ? "🔒 सुरक्षित भुगतान • GST रसीद • 6 महीने वैध"
                  : "🔒 Secure payment • GST receipt • Valid 6 months"}
              </p>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
};

export default AstrologerPage;
