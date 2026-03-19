import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, X, Calendar, Star, Info, CalendarPlus } from "lucide-react";
import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import { useLanguage } from "@/contexts/LanguageContext";
import { UPCOMING_FESTIVALS, Festival } from "@/data/astroData";
import { Button } from "@/components/ui/button";

// ── .ics generator ────────────────────────────────────────────────────────────
function downloadICS(festival: Festival) {
  const [y, m, d] = festival.isoDate.split("-").map(Number);
  const pad = (n: number) => String(n).padStart(2, "0");
  const dateStr = `${y}${pad(m)}${pad(d)}`;
  const nextDate = new Date(y, m - 1, d + 1);
  const endStr = `${nextDate.getFullYear()}${pad(nextDate.getMonth() + 1)}${pad(nextDate.getDate())}`;
  const uid = `${festival.id}-${dateStr}@divyajyoti`;
  const summary = `${festival.emoji} ${festival.nameEn}`;
  const desc = festival.descEn.replace(/\n/g, "\\n");

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Divya Jyoti//Festival Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTART;VALUE=DATE:${dateStr}`,
    `DTEND;VALUE=DATE:${endStr}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${desc}`,
    festival.tithi ? `LOCATION:Tithi: ${festival.tithi}` : "",
    "TRANSP:TRANSPARENT",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean).join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${festival.id}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── helpers ──────────────────────────────────────────────────────────────────

const MONTH_NAMES_HI = [
  "जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून",
  "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर",
];
const MONTH_NAMES_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_NAMES_HI = ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"];
const DAY_NAMES_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TYPE_LABEL: Record<Festival["type"], { hi: string; en: string; color: string }> = {
  tyohar:    { hi: "त्यौहार",  en: "Tyohar",    color: "hsl(24 95% 48%)" },
  vrat:      { hi: "व्रत",     en: "Vrat",       color: "hsl(220 60% 45%)" },
  jayanti:   { hi: "जयंती",   en: "Jayanti",    color: "hsl(150 45% 35%)" },
  auspicious:{ hi: "शुभ मुहूर्त", en: "Shubh", color: "hsl(43 95% 50%)" },
};

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function firstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

// ── component ─────────────────────────────────────────────────────────────────

const FestivalsPage = () => {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const today = new Date();
  const [viewYear, setViewYear]   = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selected, setSelected]   = useState<Festival | null>(null);
  const [filterType, setFilterType] = useState<Festival["type"] | "all">("all");

  // Build a map: "YYYY-MM-DD" → Festival[]
  const festivalMap = useMemo(() => {
    const map: Record<string, Festival[]> = {};
    UPCOMING_FESTIVALS.forEach(f => {
      if (!map[f.isoDate]) map[f.isoDate] = [];
      map[f.isoDate].push(f);
    });
    return map;
  }, []);

  // Filtered festivals for the sidebar list
  const filteredFestivals = useMemo(() => {
    return UPCOMING_FESTIVALS.filter(f => filterType === "all" || f.type === filterType)
      .sort((a, b) => a.isoDate.localeCompare(b.isoDate));
  }, [filterType]);

  // ── navigation ──
  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };
  const goToday = () => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); };

  // ── grid cells ──
  const totalDays  = daysInMonth(viewYear, viewMonth);
  const startDay   = firstDayOfMonth(viewYear, viewMonth);
  const totalCells = Math.ceil((startDay + totalDays) / 7) * 7;

  const cells = Array.from({ length: totalCells }, (_, i) => {
    const dayNum = i - startDay + 1;
    const valid  = dayNum >= 1 && dayNum <= totalDays;
    const iso    = valid
      ? `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`
      : null;
    const festivals = iso ? (festivalMap[iso] ?? []) : [];
    const isToday   = valid && dayNum === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
    return { dayNum, valid, iso, festivals, isToday };
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1">
        {/* ── Hero ── */}
        <div className="py-10 border-b border-border" style={{ background: "var(--gradient-sacred)" }}>
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full text-4xl mb-4"
              style={{ background: "hsl(var(--primary-foreground) / 0.15)" }}>
              🎊
            </div>
            <h1 className="text-3xl md:text-4xl font-devanagari-serif font-bold text-primary-foreground mb-2">
              {isHi ? "पर्व एवं त्यौहार कैलेंडर" : "Festivals & Vrat Calendar"}
            </h1>
            <p className="text-primary-foreground/75 font-devanagari text-sm md:text-base max-w-xl mx-auto">
              {isHi
                ? "हिंदू पंचांग के अनुसार वार्षिक पर्व, व्रत, जयंती और शुभ मुहूर्त"
                : "Annual Hindu festivals, Vrats, Jayantis, and auspicious dates per Panchang"}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8">

            {/* ── Calendar Grid ── */}
            <div className="space-y-4">

              {/* Month navigation */}
              <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-card">
                <button onClick={prevMonth}
                  className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary">
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="text-center">
                  <h2 className="text-xl font-devanagari-serif font-bold text-foreground">
                    {isHi ? MONTH_NAMES_HI[viewMonth] : MONTH_NAMES_EN[viewMonth]} {viewYear}
                  </h2>
                  <button onClick={goToday}
                    className="text-xs text-primary font-devanagari hover:underline mt-0.5">
                    {isHi ? "आज पर जाएं" : "Go to today"}
                  </button>
                </div>

                <button onClick={nextMonth}
                  className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-3 px-1">
                {(Object.entries(TYPE_LABEL) as [Festival["type"], typeof TYPE_LABEL[Festival["type"]]][]).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ background: val.color }} />
                    <span className="text-xs font-devanagari text-muted-foreground">
                      {isHi ? val.hi : val.en}
                    </span>
                  </div>
                ))}
              </div>

              {/* Day headers */}
              <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
                <div className="grid grid-cols-7 border-b border-border">
                  {(isHi ? DAY_NAMES_HI : DAY_NAMES_EN).map(d => (
                    <div key={d}
                      className="py-2.5 text-center text-xs font-devanagari font-semibold text-muted-foreground">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7">
                  {cells.map((cell, i) => {
                    const hasFest = cell.festivals.length > 0;
                    return (
                      <div
                        key={i}
                        onClick={() => hasFest ? setSelected(cell.festivals[0]) : null}
                        className={`
                          relative min-h-[72px] md:min-h-[80px] p-1.5 border-b border-r border-border/50
                          transition-colors
                          ${!cell.valid ? "bg-muted/20" : ""}
                          ${hasFest ? "cursor-pointer hover:bg-primary/5" : ""}
                          ${cell.isToday ? "bg-primary/8" : ""}
                        `}
                      >
                        {cell.valid && (
                          <>
                            {/* Date number */}
                            <span className={`
                              inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-devanagari font-medium
                              ${cell.isToday
                                ? "text-primary-foreground font-bold"
                                : "text-foreground"}
                            `}
                            style={cell.isToday ? { background: "var(--gradient-saffron)" } : {}}>
                              {cell.dayNum}
                            </span>

                            {/* Festival pills */}
                            <div className="mt-0.5 flex flex-col gap-0.5">
                              {cell.festivals.slice(0, 2).map(f => (
                                <div
                                  key={f.id}
                                  className="rounded px-1 py-0.5 text-[10px] leading-tight font-devanagari font-medium truncate text-white"
                                  style={{ background: f.color }}
                                  title={isHi ? f.nameHi : f.nameEn}
                                >
                                  {f.emoji} {isHi ? f.nameHi : f.nameEn}
                                </div>
                              ))}
                              {cell.festivals.length > 2 && (
                                <div className="text-[9px] text-primary font-devanagari px-1">
                                  +{cell.festivals.length - 2} {isHi ? "और" : "more"}
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Sidebar: Upcoming list ── */}
            <div className="space-y-4">
              {/* Filter tabs */}
              <div className="flex flex-wrap gap-1.5">
                {([["all", isHi ? "सभी" : "All"], ["tyohar", isHi ? "त्यौहार" : "Tyohar"],
                   ["vrat", isHi ? "व्रत" : "Vrat"], ["jayanti", isHi ? "जयंती" : "Jayanti"]] as const).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setFilterType(key as typeof filterType)}
                    className={`px-3 py-1 rounded-full text-xs font-devanagari font-medium transition-colors border ${
                      filterType === key
                        ? "border-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    }`}
                    style={filterType === key ? { background: "var(--gradient-saffron)" } : {}}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <h3 className="font-devanagari-serif font-bold text-foreground text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                {isHi ? "आगामी पर्व" : "Upcoming Festivals"}
              </h3>

              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {filteredFestivals.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setSelected(f)}
                    className={`w-full text-left rounded-xl border p-3 shadow-card transition-all hover:shadow-md font-devanagari
                      ${selected?.id === f.id ? "border-primary/60 bg-primary/5" : "border-border bg-card hover:border-primary/30"}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
                        style={{ background: `${f.color}25` }}>
                        {f.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">
                          {isHi ? f.nameHi : f.nameEn}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {f.isoDate}
                          {f.tithi && <span className="ml-1.5 opacity-70">· {f.tithi}</span>}
                        </p>
                        <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium text-white"
                          style={{ background: TYPE_LABEL[f.type].color }}>
                          {isHi ? TYPE_LABEL[f.type].hi : TYPE_LABEL[f.type].en}
                        </span>
                      </div>
                      <div className="text-xl shrink-0 opacity-0 group-hover:opacity-100" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Detail Panel (slide-up sheet) ── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />
          {/* Panel */}
          <div className="relative z-10 w-full sm:max-w-lg mx-4 mb-0 sm:mb-0 rounded-t-3xl sm:rounded-2xl border border-border bg-card shadow-deep overflow-hidden animate-scale-in">
            {/* Top color bar */}
            <div className="h-2 w-full" style={{ background: selected.color }} />

            <div className="p-6">
              {/* Close */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shrink-0"
                  style={{ background: `${selected.color}20`, border: `2px solid ${selected.color}40` }}>
                  {selected.emoji}
                </div>
                <div>
                  <h2 className="text-xl font-devanagari-serif font-bold text-foreground leading-tight">
                    {isHi ? selected.nameHi : selected.nameEn}
                  </h2>
                  <p className="text-sm text-muted-foreground font-devanagari mt-0.5">
                    {isHi ? selected.deityHi : selected.deity}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium text-white"
                    style={{ background: TYPE_LABEL[selected.type].color }}>
                    {isHi ? TYPE_LABEL[selected.type].hi : TYPE_LABEL[selected.type].en}
                  </span>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="rounded-xl bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground font-devanagari mb-0.5">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    {isHi ? "तारीख" : "Date"}
                  </p>
                  <p className="text-sm font-devanagari font-semibold text-foreground">{selected.isoDate}</p>
                </div>
                {selected.tithi && (
                  <div className="rounded-xl bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground font-devanagari mb-0.5">
                      <Star className="w-3 h-3 inline mr-1" />
                      {isHi ? "तिथि" : "Tithi"}
                    </p>
                    <p className="text-sm font-devanagari font-semibold text-foreground">{selected.tithi}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="rounded-xl bg-muted/40 p-4">
                <div className="flex items-center gap-1.5 mb-2 text-xs text-muted-foreground font-devanagari">
                  <Info className="w-3.5 h-3.5" />
                  {isHi ? "विवरण" : "About"}
                </div>
                <p className="text-sm font-devanagari text-foreground leading-relaxed">
                  {isHi ? selected.descHi : selected.descEn}
                </p>
              </div>

              <div className="flex gap-3 mt-4">
                <Button
                  variant="outline"
                  className="flex-1 font-devanagari gap-2 border-border text-foreground hover:bg-muted"
                  onClick={() => downloadICS(selected)}
                >
                  <CalendarPlus className="w-4 h-4 shrink-0" />
                  {isHi ? "कैलेंडर में जोड़ें" : "Add to Calendar"}
                </Button>
                <Button
                  className="flex-1 font-devanagari"
                  style={{ background: "var(--gradient-saffron)" }}
                  onClick={() => setSelected(null)}
                >
                  {isHi ? "बंद करें" : "Close"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
};

export default FestivalsPage;
