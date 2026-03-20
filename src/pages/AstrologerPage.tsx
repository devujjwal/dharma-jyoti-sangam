import { useState, useRef, useEffect } from "react";
import { Send, Lock, Info, ChevronDown, User, Sparkles, LogIn } from "lucide-react";
import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

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

function MessageBubble({ msg, isHi }: { msg: Message; isHi: boolean }) {
  const isAssistant = msg.role === "assistant";
  return (
    <div className={`flex gap-3 ${isAssistant ? "" : "flex-row-reverse"}`}>
      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
        isAssistant ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
      }`}>
        {isAssistant ? "🔮" : <User className="w-4 h-4" />}
      </div>
      <div
        className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm font-devanagari leading-relaxed ${
          isAssistant
            ? "bg-background border border-border text-foreground rounded-tl-sm"
            : "text-primary-foreground rounded-tr-sm"
        }`}
        style={!isAssistant ? { background: "var(--gradient-saffron)" } : {}}
      >
        {/* Render markdown-lite: bold, bullets */}
        <div className="whitespace-pre-wrap space-y-1">
          {msg.content.split("\n").map((line, i) => {
            // Bold lines wrapped in **
            if (/^\*\*(.+)\*\*$/.test(line)) {
              return <strong key={i} className="block mt-2 mb-0.5 font-semibold">{line.slice(2, -2)}</strong>;
            }
            // Inline bold replacement
            const parts = line.split(/(\*\*[^*]+\*\*)/g);
            const rendered = parts.map((p, j) =>
              p.startsWith("**") && p.endsWith("**")
                ? <strong key={j} className="font-semibold">{p.slice(2, -2)}</strong>
                : p
            );
            if (line.startsWith("• ") || line.startsWith("- ")) {
              return <li key={i} className="ml-4 list-disc">{rendered}</li>;
            }
            if (line.startsWith("⚠️")) {
              return (
                <div key={i} className="mt-2 px-3 py-2 rounded-lg bg-secondary/20 border border-secondary/30 text-xs italic">
                  {rendered}
                </div>
              );
            }
            if (line === "") return <br key={i} />;
            return <span key={i} className="block">{rendered}</span>;
          })}
        </div>
        <div className={`text-xs mt-1.5 ${isAssistant ? "text-muted-foreground" : "text-primary-foreground/60"}`}>
          {msg.timestamp.toLocaleTimeString("hi-IN", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  );
}

const AstrologerPage = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isHi = language === "hi";

  const [credits, setCredits] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showDobForm, setShowDobForm] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);
  const [birthDetails, setBirthDetails] = useState({ date: "", time: "", place: "" });
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [pastConversations, setPastConversations] = useState<{ id: string; preview: string; date: string }[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const welcomeMessage: Message = {
    id: "welcome",
    role: "assistant",
    content: isHi
      ? "🙏 नमस्ते! मैं दिव्य ज्योति का AI ज्योतिषी हूं। मैं आपके ज्योतिष, धर्म और अध्यात्म संबंधी प्रश्नों का उत्तर देने के लिए तत्पर हूं।\n\nआप मुझसे पूछ सकते हैं:\n• राशिफल और ग्रह-नक्षत्र के बारे में\n• कुंडली और जन्मपत्री विश्लेषण\n• शुभ मुहूर्त और व्रत-त्यौहार\n• वास्तु और उपाय"
      : "🙏 Namaste! I am Divya Jyoti's AI Astrologer. I am ready to answer your questions on astrology, religion and spirituality.\n\nYou can ask me about:\n• Horoscope and planetary positions\n• Kundali and birth chart analysis\n• Auspicious timings and festivals\n• Vastu and remedies",
    timestamp: new Date(),
  };

  // Fetch credits on mount
  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("ai_credits")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) setCredits(data.ai_credits);
      });
  }, [user]);

  // Load past conversations list
  useEffect(() => {
    if (!user) return;
    const loadConversations = async () => {
      // Get distinct conversation_ids with their first user message as preview
      const { data } = await supabase
        .from("chat_messages")
        .select("conversation_id, content, role, created_at")
        .eq("user_id", user.id)
        .eq("role", "user")
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        // Group by conversation_id, take first user message as preview
        const seen = new Map<string, { preview: string; date: string }>();
        for (const row of data) {
          if (!seen.has(row.conversation_id)) {
            seen.set(row.conversation_id, {
              preview: row.content.slice(0, 60) + (row.content.length > 60 ? "…" : ""),
              date: new Date(row.created_at).toLocaleDateString(isHi ? "hi-IN" : "en-IN"),
            });
          }
        }
        setPastConversations(
          Array.from(seen.entries()).map(([id, v]) => ({ id, ...v }))
        );
      }
    };
    loadConversations();
  }, [user, isHi]);

  // Load a specific conversation
  const loadConversation = async (convId: string) => {
    setLoadingHistory(true);
    setConversationId(convId);
    setShowHistory(false);
    const { data } = await supabase
      .from("chat_messages")
      .select("id, role, content, created_at")
      .eq("user_id", user!.id)
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true });

    if (data && data.length > 0) {
      setMessages([
        welcomeMessage,
        ...data.map((row) => ({
          id: row.id,
          role: row.role as "user" | "assistant",
          content: row.content,
          timestamp: new Date(row.created_at),
        })),
      ]);
    }
    setLoadingHistory(false);
  };

  // Start a new conversation
  const startNewConversation = () => {
    setConversationId(null);
    setMessages([welcomeMessage]);
    setShowHistory(false);
  };

  // Set welcome message on mount
  useEffect(() => {
    setMessages([welcomeMessage]);
  }, [isHi]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    if (!user) {
      toast({
        title: isHi ? "लॉगिन आवश्यक है" : "Login required",
        description: isHi ? "AI ज्योतिषी का उपयोग करने के लिए लॉगिन करें।" : "Please log in to use the AI Astrologer.",
        variant: "destructive",
      });
      return;
    }

    if (credits !== null && credits <= 0) {
      setShowUpsell(true);
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    // Build conversation history (exclude welcome message)
    const history = messages
      .filter(m => m.id !== "welcome")
      .map(m => ({ role: m.role, content: m.content }));

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsStreaming(true);

    // Placeholder assistant message for streaming
    const assistantId = (Date.now() + 1).toString();
    setMessages(prev => [
      ...prev,
      { id: assistantId, role: "assistant", content: "", timestamp: new Date() },
    ]);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("No session");

      const resp = await fetch(`${SUPABASE_URL}/functions/v1/ai-astrologer`, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: [...history, { role: "user", content: userMsg.content }],
          birthDetails,
          language,
        }),
      });

      // Handle non-streaming error responses
      if (!resp.ok) {
        let errData: { error?: string } = {};
        try { errData = await resp.json(); } catch { /* ignore */ }

        if (errData.error === "NO_CREDITS" || resp.status === 402) {
          setMessages(prev => prev.filter(m => m.id !== assistantId));
          setCredits(0);
          setShowUpsell(true);
          setIsStreaming(false);
          return;
        }
        if (resp.status === 429 || errData.error === "RATE_LIMITED") {
          toast({
            title: isHi ? "अनुरोध सीमा पार" : "Rate limited",
            description: isHi ? "कृपया कुछ देर बाद पुनः प्रयास करें।" : "Please try again in a moment.",
            variant: "destructive",
          });
          setMessages(prev => prev.filter(m => m.id !== assistantId));
          setIsStreaming(false);
          return;
        }
        throw new Error(errData.error ?? "Unknown error");
      }

      // Update credits from response header
      const remaining = resp.headers.get("X-Credits-Remaining");
      if (remaining !== null) setCredits(Number(remaining));

      // Stream SSE
      const reader = resp.body!.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let fullContent = "";

      outer: while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });

        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ") || line.trim() === "") continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break outer;
          try {
            const parsed = JSON.parse(jsonStr);
            const chunk = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (chunk) {
              fullContent += chunk;
              setMessages(prev =>
                prev.map(m => m.id === assistantId ? { ...m, content: fullContent } : m)
              );
            }
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }

      // Flush remaining buffer
      if (buf.trim()) {
        for (let raw of buf.split("\n")) {
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const chunk = JSON.parse(jsonStr).choices?.[0]?.delta?.content as string | undefined;
            if (chunk) {
              fullContent += chunk;
              setMessages(prev =>
                prev.map(m => m.id === assistantId ? { ...m, content: fullContent } : m)
              );
            }
          } catch { /* ignore */ }
        }
      }

      if (credits !== null && credits - 1 <= 0) {
        setTimeout(() => setShowUpsell(true), 1800);
      }
    } catch (e: unknown) {
      if ((e as Error)?.name === "AbortError") return;
      console.error(e);
      toast({
        title: isHi ? "त्रुटि हुई" : "Error occurred",
        description: isHi ? "कृपया पुनः प्रयास करें।" : "Please try again.",
        variant: "destructive",
      });
      setMessages(prev => prev.filter(m => m.id !== assistantId));
    } finally {
      setIsStreaming(false);
    }
  };

  const canSend = !isStreaming && !!input.trim() && !!user && (credits === null || credits > 0);
  const creditsDisplay = credits ?? 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
              style={{ background: "var(--gradient-saffron)" }}>
              🔮
            </div>
            <div>
              <h1 className="text-xl font-devanagari-serif font-bold text-foreground">
                {isHi ? "AI ज्योतिषी" : "AI Astrologer"}
              </h1>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-muted-foreground font-devanagari">
                  {isHi ? "ऑनलाइन • Gemini 2.5 Flash" : "Online • Gemini 2.5 Flash"}
                </span>
              </div>
            </div>
          </div>

          {/* Credits tracker */}
          {user ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card">
              <Sparkles className="w-4 h-4 text-secondary" />
              <div className="text-right">
                <div className="text-xs text-muted-foreground font-devanagari">
                  {isHi ? "AI क्रेडिट" : "AI Credits"}
                </div>
                <div className="text-sm font-bold text-foreground font-devanagari">
                  {credits === null ? "…" : creditsDisplay}
                </div>
              </div>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="font-devanagari gap-2"
              onClick={() => navigate("/login")}
            >
              <LogIn className="w-4 h-4" />
              {isHi ? "लॉगिन करें" : "Login"}
            </Button>
          )}
        </div>

        {/* Birth details toggle */}
        <button
          onClick={() => setShowDobForm(!showDobForm)}
          className="w-full mb-3 flex items-center justify-between px-4 py-2.5 rounded-xl border border-border bg-card text-sm font-devanagari text-foreground/80 hover:bg-muted transition-colors"
        >
          <span className="flex items-center gap-2">
            <span>📋</span>
            <span>
              {isHi
                ? "अपना जन्म विवरण जोड़ें (वैकल्पिक — अधिक सटीक उत्तर के लिए)"
                : "Add your birth details (optional — for more accurate answers)"}
            </span>
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
                  {isHi ? f.labelHi : f.labelEn}
                </label>
                <input
                  type={f.type}
                  value={birthDetails[f.key as keyof typeof birthDetails]}
                  onChange={(e) => setBirthDetails({ ...birthDetails, [f.key]: e.target.value })}
                  placeholder={f.type === "text" ? (isHi ? "जैसे: दिल्ली" : "e.g. Delhi") : undefined}
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
            {isHi
              ? "⚠️ AI ज्योतिषी के उत्तर सांकेतिक हैं और ज्ञान व मनोरंजन के उद्देश्य से हैं। महत्वपूर्ण निर्णयों के लिए किसी प्रमाणित ज्योतिषाचार्य से परामर्श लें।"
              : "⚠️ AI Astrologer responses are indicative and for knowledge/entertainment. Consult a certified Jyotishacharya for important decisions."}
          </p>
        </div>

        {/* Messages */}
        <div
          className="rounded-2xl border border-border bg-card overflow-hidden shadow-card mb-3"
          style={{ minHeight: "420px" }}
        >
          <div className="overflow-y-auto p-4 space-y-4" style={{ maxHeight: "480px" }}>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} isHi={isHi} />
            ))}

            {/* Streaming typing indicator (only while first tokens haven't arrived) */}
            {isStreaming && messages[messages.length - 1]?.content === "" && (
              <div className="flex gap-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">🔮</div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-background border border-border">
                  <div className="flex gap-1 items-center">
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: `${delay}s` }} />
                    ))}
                    <span className="ml-2 text-xs text-muted-foreground font-devanagari">
                      {isHi ? "उत्तर तैयार हो रहा है..." : "Generating answer..."}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-3">
            {!user ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <Lock className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <div className="text-sm font-devanagari font-semibold text-foreground">
                    {isHi ? "AI ज्योतिषी का उपयोग करने के लिए लॉगिन करें" : "Login to use the AI Astrologer"}
                  </div>
                  <div className="text-xs text-muted-foreground font-devanagari">
                    {isHi ? "नए उपयोगकर्ताओं को 2 निःशुल्क क्रेडिट मिलते हैं" : "New users get 2 free credits"}
                  </div>
                </div>
                <Button size="sm" className="font-devanagari gap-1"
                  style={{ background: "var(--gradient-saffron)" }}
                  onClick={() => navigate("/login")}>
                  <LogIn className="w-3.5 h-3.5" />
                  {isHi ? "लॉगिन" : "Login"}
                </Button>
              </div>
            ) : credits !== null && credits <= 0 ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <Lock className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <div className="text-sm font-devanagari font-semibold text-foreground">
                    {isHi ? "AI क्रेडिट समाप्त" : "AI Credits exhausted"}
                  </div>
                  <div className="text-xs text-muted-foreground font-devanagari">
                    {isHi ? "अधिक प्रश्नों के लिए क्रेडिट पैक लें" : "Get a credit pack for more questions"}
                  </div>
                </div>
                <Link to="/subscribe">
                  <Button size="sm" className="text-xs font-devanagari"
                    style={{ background: "var(--gradient-saffron)" }}>
                    {isHi ? "पैक लें" : "Get Pack"}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder={isHi ? "अपना प्रश्न यहाँ लिखें..." : "Type your question here..."}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-muted/30 text-sm font-devanagari focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  disabled={isStreaming}
                />
                <Button
                  onClick={handleSend}
                  disabled={!canSend}
                  size="sm"
                  className="px-4 py-2.5 rounded-xl"
                  style={{ background: "var(--gradient-saffron)" }}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Sample questions */}
        {messages.length <= 1 && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground font-devanagari mb-2">
              {isHi ? "💡 ये प्रश्न पूछकर शुरुआत करें:" : "💡 Start by asking these questions:"}
            </p>
            <div className="flex flex-wrap gap-2">
              {(isHi ? SAMPLE_QUESTIONS.hi : SAMPLE_QUESTIONS.en).map((q, i) => (
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
            <div className="p-6 text-center" style={{ background: "var(--gradient-saffron)" }}>
              <div className="text-5xl mb-2">🔮</div>
              <h3 className="text-xl font-devanagari-serif font-bold text-white mb-1">
                {isHi ? "और प्रश्न पूछना चाहते हैं?" : "Want to ask more questions?"}
              </h3>
              <p className="text-white/80 text-sm font-devanagari">
                {isHi ? "AI क्रेडिट समाप्त हो गए" : "AI credits have been used up"}
              </p>
            </div>
            <div className="p-6 bg-card">
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { q: 10, price: "₹49", per: "₹4.9/सवाल", popular: false },
                  { q: 50, price: "₹199", per: "₹3.98/सवाल", popular: true },
                  { q: 100, price: "₹349", per: "₹3.49/सवाल", popular: false },
                ].map((pack) => (
                  <Link key={pack.q} to="/subscribe" onClick={() => setShowUpsell(false)}
                    className={`relative rounded-xl border p-3 text-center transition-all ${
                      pack.popular ? "border-secondary shadow-gold scale-105" : "border-border hover:border-primary/30"
                    }`}>
                    {pack.popular && (
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-xs font-bold text-white"
                        style={{ background: "var(--gradient-saffron)" }}>Best</div>
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
                    {isHi ? "पैक खरीदें — UPI/Card" : "Buy Pack — UPI/Card"}
                  </Button>
                </Link>
                <Button variant="outline" onClick={() => setShowUpsell(false)} className="font-devanagari">
                  {isHi ? "कल" : "Later"}
                </Button>
              </div>
              <p className="text-center text-xs text-muted-foreground font-devanagari mt-3">
                🔒 {isHi ? "सुरक्षित भुगतान • GST रसीद • 6 महीने वैध" : "Secure payment • GST receipt • Valid 6 months"}
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
