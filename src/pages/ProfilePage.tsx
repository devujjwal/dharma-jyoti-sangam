import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import { RASHIS } from "@/data/astroData";
import { useBhajans } from "@/hooks/use-bhajans";
import { LogOut, Bookmark, BookOpen, Star, Zap, User, Save, ExternalLink, PlusCircle, Loader2, CheckCircle, Bell, BellOff, CalendarDays } from "lucide-react";
import { useReminders, useCancelReminder } from "@/hooks/use-reminders";
import { useQuery } from "@tanstack/react-query";

interface SavedKundali {
  id: string;
  name: string;
  dob: string;
  tob: string;
  pob: string;
  notes: string | null;
  created_at: string;
}

interface BookmarkedBhajan {
  id: string;
  bhajan_id: string;
  created_at: string;
}

interface CreditTransaction {
  id: string;
  amount: number;
  type: string;
  pack_name: string | null;
  description: string | null;
  created_at: string;
}

const ProfilePage = () => {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isHi = language === "hi";
  const { data: allBhajans } = useBhajans();

  const [activeTab, setActiveTab] = useState<"overview" | "kundalis" | "bhajans" | "credits" | "reminders">("overview");
  const { data: reminders } = useReminders();
  const cancelReminder = useCancelReminder();

  // Resolve festival/vrat names for reminders
  const contentIds = reminders?.map(r => r.content_id) ?? [];
  const festivalIds = reminders?.filter(r => r.content_type === "festival").map(r => r.content_id) ?? [];
  const vratIds = reminders?.filter(r => r.content_type === "vrat").map(r => r.content_id) ?? [];

  const { data: festivalNames } = useQuery({
    queryKey: ["reminder-festival-names", festivalIds],
    enabled: festivalIds.length > 0,
    queryFn: async () => {
      const { data } = await supabase.from("festivals").select("id, name_en, name_hi, slug").in("id", festivalIds);
      return Object.fromEntries((data ?? []).map(f => [f.id, { en: f.name_en, hi: f.name_hi, slug: f.slug }]));
    },
    staleTime: 1000 * 60 * 10,
  });

  const { data: vratNames } = useQuery({
    queryKey: ["reminder-vrat-names", vratIds],
    enabled: vratIds.length > 0,
    queryFn: async () => {
      const { data } = await supabase.from("vrats").select("id, name_en, name_hi, slug").in("id", vratIds);
      return Object.fromEntries((data ?? []).map(v => [v.id, { en: v.name_en, hi: v.name_hi, slug: v.slug }]));
    },
    staleTime: 1000 * 60 * 10,
  });

  const getContentInfo = (r: { content_type: string; content_id: string }) => {
    const names = r.content_type === "festival" ? festivalNames : vratNames;
    const entry = names?.[r.content_id];
    const name = entry ? (isHi ? entry.hi : entry.en) : (r.content_type === "festival" ? (isHi ? "त्योहार" : "Festival") : (isHi ? "व्रत" : "Vrat"));
    const link = entry?.slug ? (r.content_type === "festival" ? `/festivals/${entry.slug}` : `/vrat/${entry.slug}`) : null;
    return { name, link };
  };
  const [savedKundalis, setSavedKundalis] = useState<SavedKundali[]>([]);
  const [bookmarkedBhajans, setBookmarkedBhajans] = useState<BookmarkedBhajan[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [rashiId, setRashiId] = useState("");
  const [dob, setDob] = useState("");
  const [pob, setPob] = useState("");
  const [preferredCity, setPreferredCity] = useState("");
  const [preferredDeity, setPreferredDeity] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [buyingPack, setBuyingPack] = useState<number | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loadingTx, setLoadingTx] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (profile) {
      setDisplayName(profile.display_name ?? "");
      setRashiId(profile.rashi_id ?? "");
      setDob(profile.dob ?? "");
      setPob(profile.pob ?? "");
      setPreferredCity((profile as any).preferred_city ?? "");
      setPreferredDeity((profile as any).preferred_deity ?? "");
    }
    fetchKundalis();
    fetchBookmarks();
    fetchTransactions();
  }, [user, profile]);

  const fetchKundalis = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("saved_kundalis")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setSavedKundalis((data as SavedKundali[]) ?? []);
  };

  const fetchBookmarks = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("bookmarked_bhajans")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setBookmarkedBhajans((data as BookmarkedBhajan[]) ?? []);
  };

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        rashi_id: rashiId || null,
        dob: dob || null,
        pob: pob || null,
        preferred_city: preferredCity || null,
        preferred_deity: preferredDeity || null,
      } as any)
      .eq("id", user.id);
    setSaving(false);
    if (!error) {
      await refreshProfile();
      setEditMode(false);
      setSaveMsg(isHi ? "प्रोफ़ाइल सहेजी गई ✓" : "Profile saved ✓");
      setTimeout(() => setSaveMsg(null), 3000);
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;
    setLoadingTx(true);
    const { data } = await supabase
      .from("credit_transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    setTransactions((data as CreditTransaction[]) ?? []);
    setLoadingTx(false);
  };

  const buyCredits = async (qty: number, packName: string, price: string) => {
    if (!user) return;
    setBuyingPack(qty);
    // Simulate payment delay
    await new Promise(r => setTimeout(r, 1500));
    const currentCredits = profile?.ai_credits ?? 0;
    const { error } = await supabase
      .from("profiles")
      .update({ ai_credits: currentCredits + qty })
      .eq("id", user.id);
    if (!error) {
      await supabase.from("credit_transactions").insert({
        user_id: user.id,
        amount: qty,
        type: "purchase",
        pack_name: packName,
        description: `Purchased ${packName} pack (${price})`,
      });
      await refreshProfile();
      setPurchaseSuccess(isHi ? `${qty} क्रेडिट जोड़े गए ✓` : `${qty} credits added ✓`);
      setTimeout(() => setPurchaseSuccess(null), 3000);
      fetchTransactions();
    }
    setBuyingPack(null);
  };

  const deleteKundali = async (id: string) => {
    await supabase.from("saved_kundalis").delete().eq("id", id);
    fetchKundalis();
  };

  const removeBookmark = async (bhajan_id: string) => {
    if (!user) return;
    await supabase.from("bookmarked_bhajans").delete().eq("user_id", user.id).eq("bhajan_id", bhajan_id);
    fetchBookmarks();
  };

  const myRashi = RASHIS.find(r => r.id === (profile?.rashi_id ?? rashiId));

  const tabs = [
    { key: "overview", icon: <User className="w-4 h-4" />, hiLabel: "प्रोफ़ाइल", enLabel: "Profile" },
    { key: "kundalis", icon: <BookOpen className="w-4 h-4" />, hiLabel: "कुंडली", enLabel: "Kundalis" },
    { key: "bhajans", icon: <Bookmark className="w-4 h-4" />, hiLabel: "भजन", enLabel: "Bhajans" },
    { key: "credits", icon: <Zap className="w-4 h-4" />, hiLabel: "क्रेडिट", enLabel: "Credits" },
    { key: "reminders", icon: <Bell className="w-4 h-4" />, hiLabel: "रिमाइंडर", enLabel: "Reminders" },
  ] as const;

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        {/* Hero banner */}
        <div className="py-8 border-b border-border" style={{ background: "var(--gradient-sacred)" }}>
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl border-2 border-primary-foreground/30"
                style={{ background: "hsl(var(--primary-foreground) / 0.15)" }}>
                {myRashi ? myRashi.symbol : "🙏"}
              </div>
              <div>
                <h1 className="text-2xl font-devanagari-serif font-bold text-primary-foreground">
                  {profile?.display_name || user.email?.split("@")[0]}
                </h1>
                <p className="text-primary-foreground/70 text-sm font-devanagari">
                  {myRashi ? (isHi ? myRashi.nameHi : myRashi.nameEn) : (isHi ? "राशि चुनें" : "Select your Rashi")}
                  {" · "}
                  <span className="font-semibold text-primary-foreground/90">
                    {profile?.ai_credits ?? 0} {isHi ? "AI क्रेडिट" : "AI Credits"}
                  </span>
                </p>
              </div>
              <div className="ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={signOut}
                  className="font-devanagari border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  {isHi ? "लॉगआउट" : "Logout"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-3xl">
          {/* Tabs */}
          <div className="flex gap-1 bg-muted rounded-xl p-1 mb-8">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-devanagari font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{isHi ? tab.hiLabel : tab.enLabel}</span>
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-devanagari-serif font-bold text-foreground text-lg">
                    {isHi ? "व्यक्तिगत जानकारी" : "Personal Info"}
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditMode(!editMode)}
                    className="font-devanagari gap-1.5"
                  >
                    {editMode ? (isHi ? "रद्द करें" : "Cancel") : (isHi ? "✏️ संपादित करें" : "✏️ Edit")}
                  </Button>
                </div>

                {editMode ? (
                  <div className="space-y-4">
                    <div>
                      <Label className="font-devanagari text-sm">{isHi ? "नाम" : "Name"}</Label>
                      <Input value={displayName} onChange={e => setDisplayName(e.target.value)} className="mt-1 font-devanagari" />
                    </div>
                    <div>
                      <Label className="font-devanagari text-sm">{isHi ? "राशि" : "Rashi"}</Label>
                      <select
                        value={rashiId}
                        onChange={e => setRashiId(e.target.value)}
                        className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-devanagari ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">{isHi ? "— राशि चुनें —" : "— Select Rashi —"}</option>
                        {RASHIS.map(r => (
                          <option key={r.id} value={r.id}>
                            {r.symbol} {isHi ? r.nameHi : r.nameEn}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="font-devanagari text-sm">{isHi ? "जन्म तिथि" : "Date of Birth"}</Label>
                        <Input type="date" value={dob} onChange={e => setDob(e.target.value)} className="mt-1 font-devanagari" />
                      </div>
                      <div>
                        <Label className="font-devanagari text-sm">{isHi ? "जन्म स्थान" : "Place of Birth"}</Label>
                        <Input value={pob} onChange={e => setPob(e.target.value)} placeholder={isHi ? "शहर का नाम" : "City name"} className="mt-1 font-devanagari" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="font-devanagari text-sm">{isHi ? "पसंदीदा शहर" : "Preferred City"}</Label>
                        <Input value={preferredCity} onChange={e => setPreferredCity(e.target.value)} placeholder={isHi ? "पंचांग के लिए शहर" : "City for Panchang"} className="mt-1 font-devanagari" />
                      </div>
                      <div>
                        <Label className="font-devanagari text-sm">{isHi ? "पसंदीदा देवता" : "Preferred Deity"}</Label>
                        <Input value={preferredDeity} onChange={e => setPreferredDeity(e.target.value)} placeholder={isHi ? "शिव, विष्णु, दुर्गा..." : "Shiva, Vishnu, Durga..."} className="mt-1 font-devanagari" />
                      </div>
                    </div>
                    <Button
                      onClick={saveProfile}
                      disabled={saving}
                      className="w-full font-devanagari gap-1.5"
                      style={{ background: "var(--gradient-saffron)" }}
                    >
                      <Save className="w-4 h-4" />
                      {saving ? (isHi ? "सहेजा जा रहा है..." : "Saving...") : (isHi ? "सहेजें" : "Save Changes")}
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: isHi ? "ईमेल" : "Email", value: user.email },
                      { label: isHi ? "राशि" : "Rashi", value: myRashi ? `${myRashi.symbol} ${isHi ? myRashi.nameHi : myRashi.nameEn}` : "—" },
                      { label: isHi ? "जन्म तिथि" : "Date of Birth", value: profile?.dob || "—" },
                      { label: isHi ? "जन्म स्थान" : "Place of Birth", value: profile?.pob || "—" },
                      { label: isHi ? "पसंदीदा शहर" : "Preferred City", value: (profile as any)?.preferred_city || "—" },
                      { label: isHi ? "पसंदीदा देवता" : "Preferred Deity", value: (profile as any)?.preferred_deity || "—" },
                    ].map((item, i) => (
                      <div key={i} className="rounded-xl bg-muted/50 p-3">
                        <p className="text-xs text-muted-foreground font-devanagari mb-0.5">{item.label}</p>
                        <p className="text-sm font-devanagari font-medium text-foreground">{item.value}</p>
                      </div>
                    ))}
                  </div>
                )}
                {saveMsg && (
                  <p className="text-sm text-primary font-devanagari mt-3 text-center animate-fade-in">{saveMsg}</p>
                )}
              </div>

              {/* Rashi card */}
              {myRashi && (
                <div className="rounded-2xl border border-border bg-card p-6 shadow-card overflow-hidden relative">
                  <div className="absolute right-4 top-4 text-6xl opacity-10">{myRashi.symbol}</div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-2xl"
                      style={{ background: `${myRashi.color}20` }}>
                      {myRashi.symbol}
                    </div>
                    <div>
                      <h3 className="font-devanagari-serif font-bold text-foreground">
                        {isHi ? myRashi.nameHi : myRashi.nameEn}
                      </h3>
                      <p className="text-xs text-muted-foreground font-devanagari">{isHi ? myRashi.lordHi : myRashi.lord}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                      <Star className="w-3 h-3 text-secondary fill-secondary" />
                      <span className="text-xs font-devanagari text-secondary font-semibold">
                        {myRashi.luckyNum.join(", ")}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground font-devanagari leading-relaxed">
                    {isHi ? myRashi.description.hi : myRashi.description.en}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Kundalis Tab */}
          {activeTab === "kundalis" && (
            <div className="space-y-6">
              {/* Go to Kundali page CTA */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-devanagari-serif font-bold text-foreground text-lg">
                    {isHi ? "🔮 कुंडली" : "🔮 Kundali Charts"}
                  </h2>
                  <Link to="/kundali">
                    <Button size="sm" className="font-devanagari gap-1.5" style={{ background: "var(--gradient-saffron)" }}>
                      <PlusCircle className="w-4 h-4" />
                      {isHi ? "नई कुंडली बनाएं" : "Create New"}
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-muted-foreground font-devanagari">
                  {isHi
                    ? "उत्तर भारतीय शैली में जन्म कुंडली बनाएं और यहाँ सहेजें।"
                    : "Generate a North Indian style birth chart and save it here."}
                </p>
              </div>

              {/* Saved kundalis list */}
              {savedKundalis.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground font-devanagari">
                  <div className="text-4xl mb-3">🔮</div>
                  <p>{isHi ? "अभी तक कोई कुंडली सहेजी नहीं है।" : "No kundalis saved yet."}</p>
                  <Link to="/kundali">
                    <Button className="mt-4 font-devanagari gap-1.5" style={{ background: "var(--gradient-saffron)" }}>
                      <PlusCircle className="w-4 h-4" />
                      {isHi ? "पहली कुंडली बनाएं" : "Create your first Kundali"}
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedKundalis.map(k => (
                    <div key={k.id} className="rounded-xl border border-border bg-card p-4 shadow-card flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-devanagari font-semibold text-foreground">{k.name}</p>
                        <p className="text-xs text-muted-foreground font-devanagari mt-0.5">
                          📅 {k.dob} · ⏰ {k.tob} · 📍 {k.pob}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Link to="/kundali" className="text-xs text-primary hover:underline font-devanagari flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" />
                          {isHi ? "देखें" : "View"}
                        </Link>
                        <button
                          onClick={() => deleteKundali(k.id)}
                          className="text-xs text-destructive hover:underline font-devanagari"
                        >
                          {isHi ? "हटाएं" : "Delete"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bhajans Tab */}
          {activeTab === "bhajans" && (
            <div className="space-y-3">
              {bookmarkedBhajans.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground font-devanagari">
                  <div className="text-4xl mb-3">🎵</div>
                  <p>{isHi ? "अभी तक कोई भजन बुकमार्क नहीं किया।" : "No bhajans bookmarked yet."}</p>
                  <p className="text-sm mt-1">{isHi ? "होमपेज पर भजन अनुभाग से बुकमार्क करें।" : "Bookmark from the bhajans section on homepage."}</p>
                </div>
              ) : (
                bookmarkedBhajans.map(b => {
                  const bhajan = allBhajans?.find(bj => bj.id === b.bhajan_id || bj.slug === b.bhajan_id);
                  if (!bhajan) return null;
                  return (
                    <div key={b.id} className="rounded-xl border border-border bg-card p-4 shadow-card flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-primary/10 shrink-0">
                        🎵
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-devanagari font-semibold text-foreground truncate">
                          {isHi ? bhajan.title_hi : bhajan.title_en}
                        </p>
                        <p className="text-xs text-muted-foreground font-devanagari">
                          {isHi ? bhajan.deity_hi : bhajan.deity_en} · {bhajan.duration_display || ""}
                        </p>
                      </div>
                      <button
                        onClick={() => removeBookmark(b.bhajan_id)}
                        className="text-xs text-destructive hover:underline font-devanagari shrink-0"
                      >
                        {isHi ? "हटाएं" : "Remove"}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Credits Tab */}
          {activeTab === "credits" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl"
                  style={{ background: "var(--gradient-saffron)" }}>
                  ⚡
                </div>
                <p className="text-4xl font-devanagari-serif font-bold text-primary">{profile?.ai_credits ?? 0}</p>
                <p className="text-muted-foreground font-devanagari mt-1">
                  {isHi ? "उपलब्ध AI प्रश्न क्रेडिट" : "Available AI Question Credits"}
                </p>
                <p className="text-xs text-muted-foreground font-devanagari mt-3">
                  {isHi ? "प्रतिदिन 2 निःशुल्क प्रश्न मिलते हैं।" : "2 free questions are provided daily."}
                </p>
              </div>

              <h3 className="font-devanagari-serif font-bold text-foreground">
                {isHi ? "क्रेडिट पैक खरीदें" : "Buy Credit Packs"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { q: 10, price: "₹49", badge: null, hiLabel: "स्टार्टर", enLabel: "Starter" },
                  { q: 50, price: "₹199", badge: isHi ? "लोकप्रिय" : "Popular", hiLabel: "भक्त", enLabel: "Devotee" },
                  { q: 100, price: "₹349", badge: isHi ? "सर्वोत्तम मूल्य" : "Best Value", hiLabel: "प्रीमियम", enLabel: "Premium" },
                ].map(pack => (
                  <div key={pack.q}
                    className={`rounded-2xl border p-5 text-center card-sacred relative ${pack.badge ? "border-primary/40" : "border-border"}`}
                    style={pack.badge ? { background: "var(--gradient-card)" } : {}}>
                    {pack.badge && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-semibold font-devanagari text-primary-foreground"
                        style={{ background: "var(--gradient-saffron)" }}>
                        {pack.badge}
                      </span>
                    )}
                    <p className="text-2xl font-devanagari-serif font-bold text-foreground">{pack.q}</p>
                    <p className="text-xs text-muted-foreground font-devanagari mb-1">
                      {isHi ? "प्रश्न" : "Questions"}
                    </p>
                    <p className="text-sm font-devanagari font-semibold text-primary mb-1">{isHi ? pack.hiLabel : pack.enLabel}</p>
                    <p className="text-xl font-bold text-foreground mb-3">{pack.price}</p>
                    <Button size="sm" className="w-full font-devanagari text-xs"
                      style={{ background: "var(--gradient-saffron)" }}
                      disabled={buyingPack !== null}
                      onClick={() => buyCredits(pack.q, isHi ? pack.hiLabel : pack.enLabel, pack.price)}>
                      {buyingPack === pack.q ? (
                        <><Loader2 className="w-3 h-3 animate-spin mr-1" />{isHi ? "प्रोसेसिंग..." : "Processing..."}</>
                      ) : (isHi ? "खरीदें" : "Buy Now")}
                    </Button>
                  </div>
                ))}
              </div>
              {purchaseSuccess && (
                <div className="flex items-center justify-center gap-2 text-sm font-devanagari text-primary animate-fade-in">
                  <CheckCircle className="w-4 h-4" />
                  {purchaseSuccess}
                </div>
              )}

              {/* Transaction History */}
              <h3 className="font-devanagari-serif font-bold text-foreground">
                {isHi ? "लेन-देन इतिहास" : "Transaction History"}
              </h3>
              {loadingTx ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground font-devanagari text-sm">
                  {isHi ? "अभी तक कोई लेन-देन नहीं।" : "No transactions yet."}
                </div>
              ) : (
                <div className="space-y-2">
                  {transactions.map(tx => (
                    <div key={tx.id} className="rounded-xl border border-border bg-card p-3 shadow-card flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0 ${
                        tx.type === "purchase" ? "bg-primary/10" : "bg-accent/10"
                      }`}>
                        {tx.type === "purchase" ? "💰" : "🔮"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-devanagari font-medium text-foreground truncate">
                          {tx.description || (tx.type === "purchase"
                            ? (isHi ? "क्रेडिट खरीदे" : "Credits purchased")
                            : (isHi ? "AI प्रश्न पूछा" : "AI question asked"))}
                        </p>
                        <p className="text-xs text-muted-foreground font-devanagari">
                          {new Date(tx.created_at).toLocaleDateString(isHi ? "hi-IN" : "en-IN", {
                            day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                          })}
                          {tx.pack_name ? ` · ${tx.pack_name}` : ""}
                        </p>
                      </div>
                      <span className={`text-sm font-bold font-devanagari shrink-0 ${
                        tx.amount > 0 ? "text-primary" : "text-destructive"
                      }`}>
                        {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {/* Reminders Tab */}
          {activeTab === "reminders" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-devanagari-serif font-bold text-foreground text-lg">
                    🔔 {isHi ? "आगामी रिमाइंडर" : "Upcoming Reminders"}
                  </h2>
                  <span className="text-xs text-muted-foreground font-devanagari bg-muted rounded-full px-2 py-0.5">
                    {reminders?.length ?? 0} {isHi ? "सक्रिय" : "active"}
                  </span>
                </div>

                {!reminders || reminders.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-devanagari text-sm">
                      {isHi ? "कोई रिमाइंडर नहीं। त्योहार या व्रत पेज से रिमाइंडर सेट करें।" : "No reminders yet. Set reminders from festival or vrat pages."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reminders.map((r) => (
                      <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 bg-primary/10">
                          {r.content_type === "festival" ? "🎉" : "🙏"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-devanagari font-medium text-foreground">
                            {getContentName(r)}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-devanagari">
                            <CalendarDays className="w-3 h-3" />
                            {new Date(r.remind_date).toLocaleDateString(isHi ? "hi-IN" : "en-IN", {
                              day: "numeric", month: "long", year: "numeric"
                            })}
                            {r.remind_time && ` · ${r.remind_time}`}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={cancelReminder.isPending}
                          onClick={() => cancelReminder.mutate(r.id)}
                          className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10 gap-1 font-devanagari"
                        >
                          <BellOff className="w-4 h-4" />
                          <span className="hidden sm:inline">{isHi ? "हटाएँ" : "Cancel"}</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default ProfilePage;
