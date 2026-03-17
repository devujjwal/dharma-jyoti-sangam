import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import { NorthIndianChart } from "@/components/NorthIndianChart";
import { calculateKundali, RASHI_ORDER } from "@/lib/kundaliCalc";
import { calcAshtakoot, AshtakootResult } from "@/lib/ashtakootCalc";
import { RASHIS } from "@/data/astroData";
import { Heart, RefreshCw, Star, Info, Users } from "lucide-react";

interface PersonForm {
  name: string;
  dob: string;
  tob: string;
  pob: string;
}

const EMPTY_FORM: PersonForm = { name: "", dob: "", tob: "", pob: "" };

interface PersonState {
  form: PersonForm;
  errors: Partial<PersonForm>;
  kundali: ReturnType<typeof calculateKundali> | null;
}

const KOOT_COLORS = {
  excellent: { bar: "hsl(150 50% 40%)", bg: "hsl(150 40% 95%)", text: "hsl(150 45% 28%)" },
  good:      { bar: "hsl(200 65% 42%)", bg: "hsl(200 60% 95%)", text: "hsl(200 60% 28%)" },
  average:   { bar: "hsl(43 90% 48%)",  bg: "hsl(43 80% 94%)",  text: "hsl(43 80% 28%)"  },
  poor:      { bar: "hsl(0 65% 48%)",   bg: "hsl(0 60% 95%)",   text: "hsl(0 60% 35%)"   },
};

export default function KundaliMatchingPage() {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [groom, setGroom] = useState<PersonState>({ form: EMPTY_FORM, errors: {}, kundali: null });
  const [bride, setBride] = useState<PersonState>({ form: EMPTY_FORM, errors: {}, kundali: null });
  const [result, setResult] = useState<AshtakootResult | null>(null);
  const [calculated, setCalculated] = useState(false);

  const validate = (form: PersonForm): Partial<PersonForm> => {
    const e: Partial<PersonForm> = {};
    if (!form.name.trim())  e.name = isHi ? "नाम आवश्यक है" : "Name is required";
    if (!form.dob)          e.dob  = isHi ? "जन्म तिथि आवश्यक है" : "Date of birth required";
    if (!form.tob)          e.tob  = isHi ? "जन्म समय आवश्यक है" : "Time of birth required";
    if (!form.pob.trim())   e.pob  = isHi ? "जन्म स्थान आवश्यक है" : "Place of birth required";
    return e;
  };

  const handleCalculate = () => {
    const ge = validate(groom.form);
    const be = validate(bride.form);
    setGroom(s => ({ ...s, errors: ge }));
    setBride(s => ({ ...s, errors: be }));
    if (Object.keys(ge).length > 0 || Object.keys(be).length > 0) return;

    const groomKundali = calculateKundali(groom.form.dob, groom.form.tob, groom.form.pob);
    const brideKundali = calculateKundali(bride.form.dob, bride.form.tob, bride.form.pob);

    // Extract Moon's sidereal longitude from planets (house → back-calc degree)
    const groomMoon = groomKundali.planets.find(p => p.planet === "Mo");
    const brideMoon = brideKundali.planets.find(p => p.planet === "Mo");

    // Use house-based approximate Moon degree for nakshatra determination
    // Moon house → rashi index → mid-degree of that rashi
    const groomMoonRashi = ((groomKundali.ascendant - 1 + (groomMoon?.house ?? 1) - 1) % 12);
    const brideMoonRashi = ((brideKundali.ascendant - 1 + (brideMoon?.house ?? 1) - 1) % 12);
    const groomMoonDeg = groomMoonRashi * 30 + 15;
    const brideMoonDeg = brideMoonRashi * 30 + 15;

    const ashtakoot = calcAshtakoot(groomMoonDeg, brideMoonDeg);

    setGroom(s => ({ ...s, kundali: groomKundali }));
    setBride(s => ({ ...s, kundali: brideKundali }));
    setResult(ashtakoot);
    setCalculated(true);
  };

  const handleReset = () => {
    setGroom({ form: EMPTY_FORM, errors: {}, kundali: null });
    setBride({ form: EMPTY_FORM, errors: {}, kundali: null });
    setResult(null);
    setCalculated(false);
  };

  const updateForm = (who: "groom" | "bride", field: keyof PersonForm, value: string) => {
    if (who === "groom") setGroom(s => ({ ...s, form: { ...s.form, [field]: value } }));
    else setBride(s => ({ ...s, form: { ...s.form, [field]: value } }));
  };

  const scorePercent = result ? Math.round((result.totalScore / 36) * 100) : 0;
  const compat = result?.compatibility ?? "average";
  const compatColors = KOOT_COLORS[compat];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1">
        {/* Hero */}
        <section
          className="py-12 text-center border-b border-border relative overflow-hidden"
          style={{ background: "var(--gradient-sacred)" }}
        >
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle, hsl(43 95% 50%) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="relative container mx-auto px-4">
            <div className="text-4xl mb-3">💑</div>
            <h1 className="text-3xl md:text-4xl font-devanagari-serif font-bold text-primary-foreground mb-2">
              {isHi ? "कुंडली मिलान" : "Kundali Matching"}
            </h1>
            <p className="text-primary-foreground/75 font-devanagari max-w-xl mx-auto text-sm">
              {isHi
                ? "अष्टकूट गुण मिलान — ३६ गुणों पर आधारित वैवाहिक अनुकूलता विश्लेषण"
                : "Ashtakoot Gun Milan — 36-point Vedic marriage compatibility analysis"}
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-10 max-w-6xl">

          {/* ── Input Forms ── */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {[
              { label: isHi ? "वर (दूल्हा)" : "Groom", who: "groom" as const, state: groom, emoji: "🤵" },
              { label: isHi ? "वधू (दुल्हन)" : "Bride", who: "bride" as const, state: bride, emoji: "👰" },
            ].map(({ label, who, state, emoji }) => (
              <div key={who} className="rounded-2xl border border-border bg-card shadow-card p-6 space-y-4">
                <h2 className="font-devanagari-serif font-bold text-foreground text-lg flex items-center gap-2">
                  <span className="text-2xl">{emoji}</span>
                  {label}
                </h2>

                {/* Name */}
                <div>
                  <Label className="font-devanagari text-sm text-foreground mb-1 block">
                    {isHi ? "नाम *" : "Full Name *"}
                  </Label>
                  <Input
                    value={state.form.name}
                    onChange={e => updateForm(who, "name", e.target.value)}
                    placeholder={who === "groom" ? (isHi ? "जैसे: राम कुमार" : "e.g. Rahul Kumar") : (isHi ? "जैसे: सीता देवी" : "e.g. Priya Sharma")}
                    className="font-devanagari"
                    aria-invalid={!!state.errors.name}
                  />
                  {state.errors.name && <p className="text-xs text-destructive font-devanagari mt-1">{state.errors.name}</p>}
                </div>

                {/* DOB */}
                <div>
                  <Label className="font-devanagari text-sm text-foreground mb-1 block">
                    {isHi ? "जन्म तिथि *" : "Date of Birth *"}
                  </Label>
                  <Input
                    type="date"
                    value={state.form.dob}
                    onChange={e => updateForm(who, "dob", e.target.value)}
                    className="font-devanagari"
                    max={new Date().toISOString().split("T")[0]}
                    aria-invalid={!!state.errors.dob}
                  />
                  {state.errors.dob && <p className="text-xs text-destructive font-devanagari mt-1">{state.errors.dob}</p>}
                </div>

                {/* TOB */}
                <div>
                  <Label className="font-devanagari text-sm text-foreground mb-1 block">
                    {isHi ? "जन्म समय *" : "Time of Birth *"}
                  </Label>
                  <Input
                    type="time"
                    value={state.form.tob}
                    onChange={e => updateForm(who, "tob", e.target.value)}
                    className="font-devanagari"
                    aria-invalid={!!state.errors.tob}
                  />
                  {state.errors.tob && <p className="text-xs text-destructive font-devanagari mt-1">{state.errors.tob}</p>}
                </div>

                {/* POB */}
                <div>
                  <Label className="font-devanagari text-sm text-foreground mb-1 block">
                    {isHi ? "जन्म स्थान *" : "Place of Birth *"}
                  </Label>
                  <Input
                    value={state.form.pob}
                    onChange={e => updateForm(who, "pob", e.target.value)}
                    placeholder={isHi ? "जैसे: दिल्ली, मुम्बई..." : "e.g. Delhi, Mumbai..."}
                    className="font-devanagari"
                    aria-invalid={!!state.errors.pob}
                  />
                  {state.errors.pob && <p className="text-xs text-destructive font-devanagari mt-1">{state.errors.pob}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Button
              onClick={handleCalculate}
              className="font-devanagari gap-2 h-12 px-8 text-base"
              style={{ background: "var(--gradient-saffron)" }}
            >
              <Heart className="w-5 h-5" />
              {isHi ? "गुण मिलान करें" : "Calculate Compatibility"}
            </Button>
            {calculated && (
              <Button
                variant="outline"
                onClick={handleReset}
                className="font-devanagari gap-2 h-12 px-6 border-border text-foreground"
              >
                <RefreshCw className="w-4 h-4" />
                {isHi ? "फिर से करें" : "Reset"}
              </Button>
            )}
          </div>

          {/* ── Results ── */}
          {calculated && result && (
            <div className="space-y-8 animate-fade-in">

              {/* Score Hero Card */}
              <div
                className="rounded-2xl border-2 p-8 text-center relative overflow-hidden"
                style={{
                  borderColor: compatColors.bar,
                  background: `linear-gradient(135deg, ${compatColors.bg}, hsl(38 80% 96%))`,
                }}
              >
                <div className="absolute inset-0 opacity-5" style={{
                  backgroundImage: "radial-gradient(circle at 20% 80%, hsl(24 95% 48%) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(43 95% 50%) 0%, transparent 50%)",
                }} />
                <div className="relative">
                  <p className="font-devanagari text-sm font-semibold mb-3 opacity-70" style={{ color: compatColors.text }}>
                    {isHi ? "कुल गुण मिलान" : "Total Gun Milan"}
                  </p>

                  {/* Big Score Ring */}
                  <div className="relative inline-flex items-center justify-center mb-4">
                    <svg width="140" height="140" viewBox="0 0 140 140">
                      <circle cx="70" cy="70" r="58" fill="none" stroke="hsl(38 30% 88%)" strokeWidth="10" />
                      <circle
                        cx="70" cy="70" r="58"
                        fill="none"
                        stroke={compatColors.bar}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 58}`}
                        strokeDashoffset={`${2 * Math.PI * 58 * (1 - result.totalScore / 36)}`}
                        transform="rotate(-90 70 70)"
                        style={{ transition: "stroke-dashoffset 1s ease" }}
                      />
                      <text x="70" y="62" textAnchor="middle" fontSize="32" fontWeight="700" fill={compatColors.text} fontFamily="Lato, sans-serif">
                        {result.totalScore}
                      </text>
                      <text x="70" y="80" textAnchor="middle" fontSize="13" fill={compatColors.text} fontFamily="Lato, sans-serif" opacity="0.7">
                        / 36
                      </text>
                    </svg>
                  </div>

                  {/* Names */}
                  <div className="flex items-center justify-center gap-3 mb-3 font-devanagari font-semibold text-foreground">
                    <span>{groom.form.name}</span>
                    <Heart className="w-4 h-4 fill-current" style={{ color: compatColors.bar }} />
                    <span>{bride.form.name}</span>
                  </div>

                  {/* Nakshatra labels */}
                  <div className="flex items-center justify-center gap-6 mb-4 text-xs font-devanagari text-muted-foreground">
                    <span>🤵 {isHi ? result.groomNakshatra.nameHi : result.groomNakshatra.nameEn}</span>
                    <span>👰 {isHi ? result.brideNakshatra.nameHi : result.brideNakshatra.nameEn}</span>
                  </div>

                  {/* Verdict */}
                  <p className="font-devanagari-serif font-semibold text-lg" style={{ color: compatColors.text }}>
                    {isHi ? result.verdictHi : result.verdict}
                  </p>

                  {/* Compatibility badge */}
                  <span
                    className="inline-block mt-3 px-4 py-1 rounded-full text-xs font-devanagari font-bold tracking-wider uppercase"
                    style={{ background: compatColors.bar, color: "#fff" }}
                  >
                    {scorePercent}% {isHi ? "अनुकूलता" : "Compatible"}
                  </span>
                </div>
              </div>

              {/* Ashtakoot Breakdown */}
              <div className="rounded-2xl border border-border bg-card shadow-card p-6">
                <h2 className="font-devanagari-serif font-bold text-foreground text-xl mb-6 flex items-center gap-2">
                  <Star className="w-5 h-5 text-secondary fill-secondary" />
                  {isHi ? "अष्टकूट विवरण" : "Ashtakoot Breakdown"}
                </h2>

                <div className="space-y-4">
                  {result.koots.map((koot) => {
                    const c = KOOT_COLORS[koot.status];
                    const fillPct = (koot.score / koot.maxScore) * 100;
                    return (
                      <div key={koot.name} className="rounded-xl border border-border bg-muted/30 p-4">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-devanagari-serif font-bold text-foreground text-sm">
                                {isHi ? koot.nameHi : koot.name}
                              </span>
                              <span className="text-xs text-muted-foreground font-devanagari">
                                ({koot.groomValue} ↔ {koot.brideValue})
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground font-devanagari mt-0.5">
                              {isHi ? koot.descriptionHi : koot.description}
                            </p>
                          </div>
                          <div className="flex flex-col items-end shrink-0">
                            <span
                              className="text-lg font-bold font-display"
                              style={{ color: c.bar }}
                            >
                              {koot.score}
                            </span>
                            <span className="text-xs text-muted-foreground">/{koot.maxScore}</span>
                          </div>
                        </div>
                        {/* Progress bar */}
                        <div className="h-2 rounded-full bg-border overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${fillPct}%`, background: c.bar }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Total row */}
                <div
                  className="mt-4 rounded-xl p-4 flex items-center justify-between"
                  style={{ background: compatColors.bg, border: `1.5px solid ${compatColors.bar}` }}
                >
                  <span className="font-devanagari font-bold" style={{ color: compatColors.text }}>
                    {isHi ? "कुल गुण" : "Total Score"}
                  </span>
                  <span className="text-xl font-bold font-display" style={{ color: compatColors.bar }}>
                    {result.totalScore} / 36
                  </span>
                </div>
              </div>

              {/* Side-by-side Charts */}
              <div>
                <h2 className="font-devanagari-serif font-bold text-foreground text-xl mb-5 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  {isHi ? "जन्म कुंडली" : "Birth Charts"}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { label: isHi ? "वर की कुंडली" : "Groom's Chart", kundali: groom.kundali, form: groom.form, emoji: "🤵" },
                    { label: isHi ? "वधू की कुंडली" : "Bride's Chart", kundali: bride.kundali, form: bride.form, emoji: "👰" },
                  ].map(({ label, kundali: k, form: f, emoji }) => {
                    if (!k) return null;
                    const lagnaRashi = RASHIS.find(r => r.id === RASHI_ORDER[k.ascendant - 1]);
                    return (
                      <div key={label} className="rounded-2xl border border-border bg-card shadow-card p-4">
                        <div className="flex items-center justify-between mb-3 px-1">
                          <div>
                            <h3 className="font-devanagari-serif font-bold text-foreground flex items-center gap-1.5">
                              <span>{emoji}</span> {f.name}
                            </h3>
                            <p className="text-xs text-muted-foreground font-devanagari">
                              {label} · {f.dob}
                            </p>
                          </div>
                          {lagnaRashi && (
                            <div className="text-right">
                              <span className="text-2xl">{lagnaRashi.symbol}</span>
                              <p className="text-xs text-primary font-devanagari font-semibold">
                                {isHi ? lagnaRashi.nameHi : lagnaRashi.nameEn}
                              </p>
                            </div>
                          )}
                        </div>
                        <NorthIndianChart ascendant={k.ascendant} planets={k.planets} size={360} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="flex gap-2 rounded-xl bg-muted/50 border border-border p-4 text-xs text-muted-foreground font-devanagari">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-primary/60" />
                <span>
                  {isHi
                    ? "यह मिलान सांकेतिक ज्योतिषीय गणना पर आधारित है। वैवाहिक निर्णय से पूर्व किसी विद्वान ज्योतिषी से परामर्श अवश्य लें।"
                    : "This compatibility analysis uses simplified Vedic calculations for illustrative purposes. Please consult a learned astrologer before any matrimonial decisions."}
                </span>
              </div>
            </div>
          )}

          {/* Placeholder when not calculated */}
          {!calculated && (
            <div className="rounded-2xl border border-dashed border-border bg-card/50 flex flex-col items-center justify-center py-20 text-center px-6 shadow-card">
              <div className="text-6xl mb-4 animate-float">💑</div>
              <p className="font-devanagari-serif font-bold text-foreground text-xl mb-2">
                {isHi ? "गुण मिलान यहाँ दिखेगा" : "Compatibility results will appear here"}
              </p>
              <p className="text-muted-foreground font-devanagari text-sm max-w-sm">
                {isHi
                  ? "ऊपर वर और वधू का विवरण भरकर गुण मिलान करें"
                  : "Fill in both birth details above and click Calculate"}
              </p>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
