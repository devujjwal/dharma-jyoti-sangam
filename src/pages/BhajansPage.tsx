import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { BHAJANS } from "@/data/astroData";
import { Play, Lock, Search, Bookmark, BookmarkCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const DEITY_COLORS: Record<string, string> = {
  Hanuman: "hsl(24 95% 48%)", Vishnu: "hsl(200 70% 48%)", Durga: "hsl(355 75% 40%)",
  Shiva: "hsl(240 30% 40%)", Ganesha: "hsl(43 95% 45%)", Saraswati: "hsl(210 60% 55%)",
};

const formatPlays = (n: number): string => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toString();
};

const BhajansPage = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const isHi = language === "hi";
  const [search, setSearch] = useState("");
  const [filterDeity, setFilterDeity] = useState("all");
  const [playing, setPlaying] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  const deities = ["all", ...Array.from(new Set(BHAJANS.map(b => b.deity)))];

  useEffect(() => {
    if (!user) { setBookmarks(new Set()); return; }
    supabase.from("bookmarked_bhajans").select("bhajan_id").eq("user_id", user.id)
      .then(({ data }) => { if (data) setBookmarks(new Set(data.map(r => r.bhajan_id))); });
  }, [user]);

  const toggleBookmark = async (bhajanId: string) => {
    if (!user) { toast({ title: isHi ? "लॉगिन करें" : "Please log in", variant: "destructive" }); return; }
    const isBookmarked = bookmarks.has(bhajanId);
    setBookmarks(prev => { const n = new Set(prev); isBookmarked ? n.delete(bhajanId) : n.add(bhajanId); return n; });
    try {
      if (isBookmarked) await supabase.from("bookmarked_bhajans").delete().eq("user_id", user.id).eq("bhajan_id", bhajanId);
      else await supabase.from("bookmarked_bhajans").insert({ user_id: user.id, bhajan_id: bhajanId });
    } catch { setBookmarks(prev => { const n = new Set(prev); isBookmarked ? n.add(bhajanId) : n.delete(bhajanId); return n; }); }
  };

  const filtered = BHAJANS.filter(b => {
    const matchSearch = search === "" || b.titleHi.includes(search) || b.titleEn.toLowerCase().includes(search.toLowerCase());
    const matchDeity = filterDeity === "all" || b.deity === filterDeity;
    return matchSearch && matchDeity;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <div className="py-10 border-b border-border" style={{ background: "var(--gradient-sacred)" }}>
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full text-4xl mb-4" style={{ background: "hsl(var(--primary-foreground) / 0.15)" }}>🎵</div>
            <h1 className="text-3xl md:text-4xl font-devanagari-serif font-bold text-primary-foreground mb-2">
              {isHi ? "भजन और चालीसा" : "Bhajans & Chalisa"}
            </h1>
            <p className="text-primary-foreground/75 font-devanagari text-sm max-w-xl mx-auto">
              {isHi ? "पवित्र भजन, चालीसा, आरती और स्तोत्र संग्रह" : "Collection of sacred bhajans, chalisa, aarti and stotras"}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder={isHi ? "भजन खोजें..." : "Search bhajans..."} className="pl-10 font-devanagari" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {deities.map(d => (
                <button key={d} onClick={() => setFilterDeity(d)}
                  className={`px-3 py-1.5 rounded-full text-xs font-devanagari font-medium transition-colors border ${filterDeity === d ? "border-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/50"}`}
                  style={filterDeity === d ? { background: "var(--gradient-saffron)" } : {}}>
                  {d === "all" ? (isHi ? "सभी" : "All") : d}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(bhajan => {
              const color = DEITY_COLORS[bhajan.deity] || "hsl(24 95% 48%)";
              const isPlaying = playing === bhajan.id;
              const isBookmarked = bookmarks.has(bhajan.id);

              return (
                <div key={bhajan.id} className="card-sacred group relative rounded-2xl border border-border bg-card overflow-hidden">
                  <div className="h-1.5 w-full" style={{ background: color }} />
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <button onClick={() => setPlaying(isPlaying ? null : bhajan.id)}
                        className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center shadow-sacred transition-all group-hover:scale-105 active:scale-95"
                        style={{ background: bhajan.isFree ? `linear-gradient(135deg, ${color}, ${color}cc)` : "hsl(var(--muted))" }}>
                        {bhajan.isFree ? <Play className={`w-4 h-4 text-white ${isPlaying ? "fill-white" : ""}`} /> : <Lock className="w-4 h-4 text-muted-foreground" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-devanagari-serif font-bold text-foreground text-base leading-tight">{isHi ? bhajan.titleHi : bhajan.titleEn}</h4>
                          <button onClick={() => toggleBookmark(bhajan.id)} className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ background: isBookmarked ? `${color}20` : "hsl(var(--muted) / 0.5)" }}>
                            {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5" style={{ color }} /> : <Bookmark className="w-3.5 h-3.5 text-muted-foreground" />}
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs px-1.5 py-0.5 rounded font-devanagari" style={{ background: `${color}15`, color }}>{bhajan.category}</span>
                          <span className="text-xs text-muted-foreground">{bhajan.duration}</span>
                          <span className="text-xs text-muted-foreground">• {formatPlays(bhajan.plays)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground font-devanagari mt-1.5 line-clamp-2 leading-relaxed">{bhajan.firstLineHi}</p>
                        {!bhajan.isFree && <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "hsl(43 95% 50% / 0.15)", color: "hsl(43 95% 40%)" }}>Premium</span>}
                      </div>
                    </div>
                    {isPlaying && (
                      <div className="flex items-center gap-0.5 mt-3 px-1">
                        {[4, 7, 5, 9, 6, 8, 4, 7, 5].map((h, i) => (
                          <div key={i} className="rounded-full w-1" style={{ height: `${h * 2}px`, background: color, animation: `glow-pulse ${0.4 + i * 0.1}s ease-in-out infinite alternate` }} />
                        ))}
                        <span className="ml-2 text-xs font-devanagari text-muted-foreground">{isHi ? "चल रहा है..." : "Playing..."}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground font-devanagari">{isHi ? "कोई भजन नहीं मिला" : "No bhajans found"}</p>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default BhajansPage;
