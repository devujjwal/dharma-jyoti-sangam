import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import { NorthIndianChart } from "@/components/NorthIndianChart";
import { calculateKundali, PLANET_LABELS, RASHI_ORDER } from "@/lib/kundaliCalc";
import { RASHIS } from "@/data/astroData";
import { Save, RefreshCw, Star, Sun, Info, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DoshaCards from "@/components/DoshaCards";
import { detectManglikDosha, detectKaalSarpDosha } from "@/lib/kundaliCalc";

const HOUSE_MEANINGS = [
  { hi: "तनु (स्वयं)", en: "Self & Body" },
  { hi: "धन (धन-संपदा)", en: "Wealth & Family" },
  { hi: "भाग्य (पराक्रम)", en: "Siblings & Courage" },
  { hi: "सुख (माता)", en: "Home & Mother" },
  { hi: "पुत्र (विद्या)", en: "Children & Intellect" },
  { hi: "रिपु (रोग)", en: "Enemies & Health" },
  { hi: "जाया (विवाह)", en: "Marriage & Partner" },
  { hi: "मृत्यु (आयु)", en: "Longevity & Secrets" },
  { hi: "भाग्य (धर्म)", en: "Fortune & Dharma" },
  { hi: "कर्म (पिता)", en: "Career & Father" },
  { hi: "लाभ (मित्र)", en: "Gains & Friends" },
  { hi: "व्यय (मोक्ष)", en: "Losses & Moksha" },
];

interface FormState {
  name: string;
  dob: string;
  tob: string;
  pob: string;
}

export default function KundaliPage() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isHi = language === "hi";

  const [form, setForm] = useState<FormState>({ name: "", dob: "", tob: "", pob: "" });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [kundali, setKundali] = useState<ReturnType<typeof calculateKundali> | null>(null);
  const [saving, setSaving] = useState(false);
  const [generated, setGenerated] = useState(false);

  const validate = (): boolean => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = isHi ? "नाम आवश्यक है" : "Name is required";
    if (!form.dob) e.dob = isHi ? "जन्म तिथि आवश्यक है" : "Date of birth is required";
    if (!form.tob) e.tob = isHi ? "जन्म समय आवश्यक है" : "Time of birth is required";
    if (!form.pob.trim()) e.pob = isHi ? "जन्म स्थान आवश्यक है" : "Place of birth is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleGenerate = () => {
    if (!validate()) return;
    const result = calculateKundali(form.dob, form.tob, form.pob);
    setKundali(result);
    setGenerated(true);
  };

  const handleSave = async () => {
    if (!user) { navigate("/login"); return; }
    if (!kundali) return;
    setSaving(true);
    const { error } = await supabase.from("saved_kundalis").insert({
      user_id: user.id,
      name: form.name,
      dob: form.dob,
      tob: form.tob,
      pob: form.pob,
    });
    setSaving(false);
    if (!error) {
      toast({
        title: isHi ? "कुंडली सहेजी गई ✓" : "Kundali Saved ✓",
        description: isHi
          ? `${form.name} की कुंडली आपके प्रोफ़ाइल में सुरक्षित है।`
          : `${form.name}'s kundali is saved to your profile.`,
      });
    } else {
      toast({
        title: isHi ? "त्रुटि" : "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const lagnaRashi = kundali ? RASHIS.find(r => r.id === RASHI_ORDER[kundali.ascendant - 1]) : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1">
        {/* Hero */}
        <section
          className="py-12 text-center border-b border-border relative overflow-hidden"
          style={{ background: "var(--gradient-sacred)" }}
        >
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: "radial-gradient(circle, hsl(43 95% 50%) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }} />
          <div className="relative container mx-auto px-4">
            <div className="text-4xl mb-3">🔮</div>
            <h1 className="text-3xl md:text-4xl font-devanagari-serif font-bold text-primary-foreground mb-2">
              {isHi ? "जन्म कुंडली" : "Birth Chart (Kundali)"}
            </h1>
            <p className="text-primary-foreground/75 font-devanagari max-w-xl mx-auto text-sm">
              {isHi
                ? "अपनी जन्म तिथि, समय और स्थान डालें — उत्तर भारतीय शैली में कुंडली देखें"
                : "Enter your birth details to generate a North Indian style Vedic birth chart"}
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-10 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-10 items-start">

            {/* — Form Panel — */}
            <div className="rounded-2xl border border-border bg-card shadow-card p-6 space-y-5">
              <h2 className="font-devanagari-serif font-bold text-foreground text-xl flex items-center gap-2">
                <Sun className="w-5 h-5 text-primary" />
                {isHi ? "जन्म विवरण भरें" : "Enter Birth Details"}
              </h2>

              {/* Name */}
              <div>
                <Label className="font-devanagari text-sm text-foreground mb-1 block">
                  {isHi ? "नाम *" : "Full Name *"}
                </Label>
                <Input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder={isHi ? "जैसे: राम कुमार शर्मा" : "e.g. Rahul Kumar Sharma"}
                  className="font-devanagari"
                  aria-invalid={!!errors.name}
                />
                {errors.name && <p className="text-xs text-destructive font-devanagari mt-1">{errors.name}</p>}
              </div>

              {/* DOB */}
              <div>
                <Label className="font-devanagari text-sm text-foreground mb-1 block">
                  {isHi ? "जन्म तिथि *" : "Date of Birth *"}
                </Label>
                <Input
                  type="date"
                  value={form.dob}
                  onChange={e => setForm(f => ({ ...f, dob: e.target.value }))}
                  className="font-devanagari"
                  max={new Date().toISOString().split("T")[0]}
                  aria-invalid={!!errors.dob}
                />
                {errors.dob && <p className="text-xs text-destructive font-devanagari mt-1">{errors.dob}</p>}
              </div>

              {/* TOB */}
              <div>
                <Label className="font-devanagari text-sm text-foreground mb-1 block">
                  {isHi ? "जन्म समय *" : "Time of Birth *"}
                </Label>
                <Input
                  type="time"
                  value={form.tob}
                  onChange={e => setForm(f => ({ ...f, tob: e.target.value }))}
                  className="font-devanagari"
                  aria-invalid={!!errors.tob}
                />
                {errors.tob && <p className="text-xs text-destructive font-devanagari mt-1">{errors.tob}</p>}
              </div>

              {/* POB */}
              <div>
                <Label className="font-devanagari text-sm text-foreground mb-1 block">
                  {isHi ? "जन्म स्थान *" : "Place of Birth *"}
                </Label>
                <Input
                  value={form.pob}
                  onChange={e => setForm(f => ({ ...f, pob: e.target.value }))}
                  placeholder={isHi ? "जैसे: दिल्ली, मुम्बई..." : "e.g. Delhi, Mumbai..."}
                  className="font-devanagari"
                  aria-invalid={!!errors.pob}
                />
                {errors.pob && <p className="text-xs text-destructive font-devanagari mt-1">{errors.pob}</p>}
              </div>

              {/* Disclaimer */}
              <div className="flex gap-2 rounded-xl bg-muted/60 border border-border p-3 text-xs text-muted-foreground font-devanagari">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-primary/60" />
                <span>
                  {isHi
                    ? "यह कुंडली सांकेतिक ज्योतिषीय गणना पर आधारित है। सटीक भविष्यवाणी के लिए किसी विद्वान ज्योतिषी से परामर्श लें।"
                    : "This chart uses simplified Vedic calculations for illustrative purposes. Consult a learned astrologer for precise readings."}
                </span>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                className="w-full font-devanagari gap-2 h-11"
                style={{ background: "var(--gradient-saffron)" }}
              >
                <RefreshCw className="w-4 h-4" />
                {isHi ? "कुंडली बनाएं" : "Generate Kundali"}
              </Button>

              {/* Save / Login prompt */}
              {generated && (
                user ? (
                  <Button
                    variant="outline"
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full font-devanagari gap-2 border-primary text-primary hover:bg-primary/10"
                  >
                    <Save className="w-4 h-4" />
                    {saving
                      ? (isHi ? "सहेजा जा रहा है..." : "Saving...")
                      : (isHi ? "प्रोफ़ाइल में सहेजें" : "Save to Profile")}
                  </Button>
                ) : (
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 py-3 text-sm text-primary font-devanagari hover:bg-primary/5 transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    {isHi ? "सहेजने के लिए लॉगिन करें" : "Login to save this kundali"}
                  </button>
                )
              )}
            </div>

            {/* — Chart Panel — */}
            <div className="space-y-6">
              {!generated ? (
                <div className="rounded-2xl border border-dashed border-border bg-card/50 flex flex-col items-center justify-center py-20 text-center px-6 shadow-card">
                  <div className="text-6xl mb-4 animate-spin-slow">🔮</div>
                  <p className="font-devanagari-serif font-bold text-foreground text-lg mb-2">
                    {isHi ? "कुंडली यहाँ दिखेगी" : "Your chart will appear here"}
                  </p>
                  <p className="text-muted-foreground font-devanagari text-sm">
                    {isHi ? "बायीं ओर विवरण भरकर कुंडली बनाएं" : "Fill in your birth details on the left to generate"}
                  </p>
                </div>
              ) : kundali && (
                <>
                  {/* Chart */}
                  <div className="rounded-2xl border border-border bg-card shadow-card p-4">
                    <div className="flex items-center justify-between mb-3 px-2">
                      <div>
                        <h3 className="font-devanagari-serif font-bold text-foreground">{form.name}</h3>
                        <p className="text-xs text-muted-foreground font-devanagari">
                          {form.dob} · {form.tob} · {form.pob}
                        </p>
                      </div>
                      {lagnaRashi && (
                        <div className="text-right">
                          <span className="text-2xl">{lagnaRashi.symbol}</span>
                          <p className="text-xs text-primary font-devanagari font-semibold">
                            {isHi ? `लग्न: ${lagnaRashi.nameHi}` : `Lagna: ${lagnaRashi.nameEn}`}
                          </p>
                        </div>
                      )}
                    </div>
                    <NorthIndianChart
                      ascendant={kundali.ascendant}
                      planets={kundali.planets}
                    />
                  </div>

                  {/* Planet positions table */}
                  <div className="rounded-2xl border border-border bg-card shadow-card p-5">
                    <h3 className="font-devanagari-serif font-bold text-foreground mb-4 flex items-center gap-2">
                      <Star className="w-4 h-4 text-secondary fill-secondary" />
                      {isHi ? "ग्रह स्थिति" : "Planet Positions"}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {kundali.planets.map(p => {
                        const rashiOfHouse = RASHIS[((kundali.ascendant - 1 + p.house - 1) % 12)];
                        return (
                          <div
                            key={p.planet}
                            className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2"
                          >
                            <span className="text-base font-bold" style={{ color: `hsl(${getPlanetHue(p.planet)} 70% 45%)` }}>
                              {p.planet}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-devanagari font-semibold text-foreground truncate">
                                {PLANET_LABELS[p.planet]?.[isHi ? "hi" : "full"] ?? p.planet}
                              </p>
                              <p className="text-xs text-muted-foreground font-devanagari">
                                {isHi
                                  ? `भाव ${p.house} · ${rashiOfHouse?.nameHi ?? ""}`
                                  : `H${p.house} · ${rashiOfHouse?.nameEn ?? ""}`}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* House meanings */}
                  <div className="rounded-2xl border border-border bg-card shadow-card p-5">
                    <h3 className="font-devanagari-serif font-bold text-foreground mb-4 flex items-center gap-2">
                      <span className="text-primary">⌂</span>
                      {isHi ? "भाव अर्थ" : "House Meanings"}
                    </h3>
                    <div className="space-y-1.5">
                      {HOUSE_MEANINGS.map((hm, idx) => {
                        const houseNum = idx + 1;
                        const planetsHere = kundali.planets.filter(p => p.house === houseNum);
                        return (
                          <div
                            key={idx}
                            className="flex items-start gap-2 rounded-lg px-3 py-2 bg-muted/40 hover:bg-muted/70 transition-colors"
                          >
                            <span className="text-xs font-bold text-primary w-5 shrink-0 pt-0.5">{houseNum}</span>
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-devanagari text-foreground">
                                {isHi ? hm.hi : hm.en}
                              </span>
                              {planetsHere.length > 0 && (
                                <span className="ml-2 text-xs font-semibold" style={{ color: "hsl(24 95% 45%)" }}>
                                  {planetsHere.map(p => p.planet).join(" ")}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dosha Cards */}
                  <DoshaCards
                    manglik={detectManglikDosha(kundali.planets)}
                    kaalSarp={detectKaalSarpDosha(kundali.planets)}
                    isHi={isHi}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function getPlanetHue(planet: string): number {
  const map: Record<string, number> = {
    Su: 35, Mo: 220, Ma: 0, Me: 120, Ju: 43, Ve: 290, Sa: 240, Ra: 20, Ke: 155,
  };
  return map[planet] ?? 30;
}
