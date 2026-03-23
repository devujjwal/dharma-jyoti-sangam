import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, X, Calendar, CalendarPlus } from "lucide-react";
import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFestivals, type Festival } from "@/hooks/use-festivals";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

function downloadICS(festival: Festival) {
  const [y, m, d] = festival.festival_date.split("-").map(Number);
  const pad = (n: number) => String(n).padStart(2, "0");
  const dateStr = `${y}${pad(m)}${pad(d)}`;
  const nextDate = new Date(y, m - 1, d + 1);
  const endStr = `${nextDate.getFullYear()}${pad(nextDate.getMonth() + 1)}${pad(nextDate.getDate())}`;
  const ics = [
    "BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Divya Jyoti//EN","BEGIN:VEVENT",
    `UID:${festival.slug}@divyajyoti`,`DTSTART;VALUE=DATE:${dateStr}`,`DTEND;VALUE=DATE:${endStr}`,
    `SUMMARY:${festival.emoji || ""} ${festival.name_en}`,`DESCRIPTION:${festival.description_en}`,
    "END:VEVENT","END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = `${festival.slug}.ics`; a.click();
  URL.revokeObjectURL(url);
}

const MONTH_NAMES_HI = ["जनवरी","फरवरी","मार्च","अप्रैल","मई","जून","जुलाई","अगस्त","सितंबर","अक्टूबर","नवंबर","दिसंबर"];
const MONTH_NAMES_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES_HI = ["रवि","सोम","मंगल","बुध","गुरु","शुक्र","शनि"];
const DAY_NAMES_EN = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const FestivalsPage = () => {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const { data: festivals, isLoading } = useFestivals();
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState<Festival | null>(null);
  const [filterCat, setFilterCat] = useState("all");

  const festivalMap = useMemo(() => {
    const map: Record<string, Festival[]> = {};
    (festivals || []).forEach(f => { if (!map[f.festival_date]) map[f.festival_date] = []; map[f.festival_date].push(f); });
    return map;
  }, [festivals]);

  const filtered = useMemo(() => {
    return (festivals || []).filter(f => filterCat === "all" || f.category === filterCat).sort((a, b) => a.festival_date.localeCompare(b.festival_date));
  }, [festivals, filterCat]);

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };
  const goToday = () => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); };

  const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();
  const startDay = new Date(viewYear, viewMonth, 1).getDay();
  const totalCells = Math.ceil((startDay + totalDays) / 7) * 7;
  const cells = Array.from({ length: totalCells }, (_, i) => {
    const dayNum = i - startDay + 1;
    const valid = dayNum >= 1 && dayNum <= totalDays;
    const iso = valid ? `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}` : null;
    const fests = iso ? (festivalMap[iso] ?? []) : [];
    const isToday = valid && dayNum === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
    return { dayNum, valid, iso, festivals: fests, isToday };
  });

  if (isLoading) {
    return (<div className="min-h-screen flex flex-col bg-background"><Navigation /><main className="flex-1 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></main><SiteFooter /></div>);
  }

  const categories = ["all", ...Array.from(new Set((festivals || []).map(f => f.category).filter(Boolean) as string[]))];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <div className="py-10 border-b border-border" style={{ background: "var(--gradient-sacred)" }}>
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full text-4xl mb-4" style={{ background: "hsl(var(--primary-foreground) / 0.15)" }}>🎊</div>
            <h1 className="text-3xl md:text-4xl font-devanagari-serif font-bold text-primary-foreground mb-2">{isHi ? "पर्व एवं त्यौहार कैलेंडर" : "Festivals & Vrat Calendar"}</h1>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-card">
                <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary"><ChevronLeft className="w-5 h-5" /></button>
                <div className="text-center">
                  <h2 className="text-xl font-devanagari-serif font-bold text-foreground">{isHi ? MONTH_NAMES_HI[viewMonth] : MONTH_NAMES_EN[viewMonth]} {viewYear}</h2>
                  <button onClick={goToday} className="text-xs text-primary font-devanagari hover:underline mt-0.5">{isHi ? "आज पर जाएं" : "Go to today"}</button>
                </div>
                <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary"><ChevronRight className="w-5 h-5" /></button>
              </div>
              <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
                <div className="grid grid-cols-7 border-b border-border">
                  {(isHi ? DAY_NAMES_HI : DAY_NAMES_EN).map(d => (<div key={d} className="py-2.5 text-center text-xs font-devanagari font-semibold text-muted-foreground">{d}</div>))}
                </div>
                <div className="grid grid-cols-7">
                  {cells.map((cell, i) => (
                    <div key={i} onClick={() => cell.festivals.length ? setSelected(cell.festivals[0]) : null}
                      className={`relative min-h-[72px] md:min-h-[80px] p-1.5 border-b border-r border-border/50 transition-colors ${!cell.valid ? "bg-muted/20" : ""} ${cell.festivals.length ? "cursor-pointer hover:bg-primary/5" : ""} ${cell.isToday ? "bg-primary/8" : ""}`}>
                      {cell.valid && (<>
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-devanagari font-medium ${cell.isToday ? "text-primary-foreground font-bold" : "text-foreground"}`}
                          style={cell.isToday ? { background: "var(--gradient-saffron)" } : {}}>{cell.dayNum}</span>
                        <div className="mt-0.5 flex flex-col gap-0.5">
                          {cell.festivals.slice(0, 2).map(f => (
                            <div key={f.id} className="rounded px-1 py-0.5 text-[10px] leading-tight font-devanagari font-medium truncate text-white" style={{ background: f.color || "hsl(24 95% 48%)" }}>
                              {f.emoji} {isHi ? f.name_hi : f.name_en}
                            </div>
                          ))}
                        </div>
                      </>)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-1.5">
                {categories.map(c => (
                  <button key={c} onClick={() => setFilterCat(c)}
                    className={`px-3 py-1 rounded-full text-xs font-devanagari font-medium transition-colors border ${filterCat === c ? "border-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/50"}`}
                    style={filterCat === c ? { background: "var(--gradient-saffron)" } : {}}>
                    {c === "all" ? (isHi ? "सभी" : "All") : c}
                  </button>
                ))}
              </div>
              <h3 className="font-devanagari-serif font-bold text-foreground text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />{isHi ? "आगामी पर्व" : "Upcoming Festivals"}
              </h3>
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {filtered.map(f => (
                  <button key={f.id} onClick={() => setSelected(f)}
                    className={`w-full text-left rounded-xl border p-3 shadow-card transition-all hover:shadow-md font-devanagari ${selected?.id === f.id ? "border-primary/60 bg-primary/5" : "border-border bg-card hover:border-primary/30"}`}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0" style={{ background: `${f.color || "hsl(24 95% 48%)"}25` }}>{f.emoji || "🎊"}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">{isHi ? f.name_hi : f.name_en}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{f.festival_date}{f.tithi && <span className="ml-1.5 opacity-70">· {f.tithi}</span>}</p>
                        {f.category && <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium text-white" style={{ background: f.color || "hsl(24 95% 48%)" }}>{f.category}</span>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative z-10 w-full sm:max-w-lg mx-4 rounded-t-3xl sm:rounded-2xl border border-border bg-card shadow-deep overflow-hidden animate-scale-in">
            <div className="h-2 w-full" style={{ background: selected.color || "hsl(24 95% 48%)" }} />
            <div className="p-6">
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:bg-muted"><X className="w-4 h-4" /></button>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shrink-0" style={{ background: `${selected.color || "hsl(24 95% 48%)"}20` }}>{selected.emoji || "🎊"}</div>
                <div>
                  <h2 className="text-xl font-devanagari-serif font-bold text-foreground">{isHi ? selected.name_hi : selected.name_en}</h2>
                  <p className="text-sm text-muted-foreground font-devanagari mt-0.5">{selected.festival_date}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground font-devanagari leading-relaxed mb-4">{isHi ? selected.description_hi : selected.description_en}</p>
              <div className="flex gap-3">
                <Button onClick={() => downloadICS(selected)} variant="outline" size="sm" className="font-devanagari gap-2"><CalendarPlus className="w-4 h-4" />{isHi ? "कैलेंडर में जोड़ें" : "Add to Calendar"}</Button>
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
