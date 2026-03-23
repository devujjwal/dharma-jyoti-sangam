import { useState, useEffect } from "react";
import { Play, Lock, Bookmark, BookmarkCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useBhajans } from "@/hooks/use-bhajans";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const formatPlays = (n: number): string => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toString();
};

const DEITY_COLORS: Record<string, string> = {
  Hanuman: "hsl(24 95% 48%)", Vishnu: "hsl(200 70% 48%)", Durga: "hsl(355 75% 40%)",
  Shiva: "hsl(240 30% 40%)", Ganesha: "hsl(43 95% 45%)", Saraswati: "hsl(210 60% 55%)",
};

const BhajansSection = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const { data: bhajans, isLoading } = useBhajans();
  const [playing, setPlaying] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [loadingBookmark, setLoadingBookmark] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { setBookmarks(new Set()); return; }
    supabase.from("bookmarked_bhajans").select("bhajan_id").eq("user_id", user.id)
      .then(({ data }) => { if (data) setBookmarks(new Set(data.map(r => r.bhajan_id))); });
  }, [user]);

  const toggleBookmark = async (bhajanId: string, titleHi: string, titleEn: string) => {
    if (!user) {
      toast({ title: language === "hi" ? "लॉगिन करें" : "Please log in", variant: "destructive" });
      return;
    }
    setLoadingBookmark(bhajanId);
    const isBookmarked = bookmarks.has(bhajanId);
    setBookmarks(prev => { const n = new Set(prev); isBookmarked ? n.delete(bhajanId) : n.add(bhajanId); return n; });
    try {
      if (isBookmarked) {
        await supabase.from("bookmarked_bhajans").delete().eq("user_id", user.id).eq("bhajan_id", bhajanId);
        toast({ title: language === "hi" ? "बुकमार्क हटाया" : "Bookmark removed" });
      } else {
        await supabase.from("bookmarked_bhajans").insert({ user_id: user.id, bhajan_id: bhajanId });
        toast({ title: language === "hi" ? "बुकमार्क किया" : "Bookmarked" });
      }
    } catch {
      setBookmarks(prev => { const n = new Set(prev); isBookmarked ? n.add(bhajanId) : n.delete(bhajanId); return n; });
    } finally { setLoadingBookmark(null); }
  };

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
        </div>
      </section>
    );
  }

  const displayBhajans = (bhajans || []).slice(0, 6);
  if (!displayBhajans.length) return null;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px flex-1 max-w-16" style={{ background: "var(--gradient-saffron)" }} />
            <span className="text-2xl">🎵</span>
            <div className="h-px flex-1 max-w-16" style={{ background: "var(--gradient-saffron)" }} />
          </div>
          <h2 className="text-3xl font-devanagari-serif font-bold text-foreground mb-2">{t("bhajan_title")}</h2>
          <p className="text-muted-foreground font-devanagari text-sm">
            {language === "hi" ? "पवित्र भजन, चालीसा और स्तोत्र" : "Sacred bhajans, chalisa and stotras"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayBhajans.map(bhajan => {
            const color = DEITY_COLORS[bhajan.deity_en || ""] || "hsl(24 95% 48%)";
            const isPlaying = playing === bhajan.id;
            const isBookmarked = bookmarks.has(bhajan.id);
            const isLoadingThis = loadingBookmark === bhajan.id;

            return (
              <div key={bhajan.id} className="card-sacred group relative rounded-2xl border border-border bg-card overflow-hidden">
                <div className="h-1.5 w-full" style={{ background: color }} />
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => bhajan.audio_url ? setPlaying(isPlaying ? null : bhajan.id) : null}
                      className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center shadow-sacred transition-all group-hover:scale-105 active:scale-95"
                      style={{ background: bhajan.is_free ? `linear-gradient(135deg, ${color}, ${color}cc)` : "hsl(var(--muted))" }}
                    >
                      {bhajan.is_free ? (
                        <Play className={`w-4 h-4 text-white ${isPlaying ? "fill-white" : ""}`} />
                      ) : (
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-devanagari-serif font-bold text-foreground text-base leading-tight">
                          {language === "hi" ? bhajan.title_hi : bhajan.title_en}
                        </h4>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {!bhajan.is_free && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "hsl(43 95% 50% / 0.15)", color: "hsl(43 95% 40%)" }}>Premium</span>
                          )}
                          <button
                            onClick={() => toggleBookmark(bhajan.id, bhajan.title_hi, bhajan.title_en)}
                            disabled={isLoadingThis}
                            className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-50"
                            style={{ background: isBookmarked ? `${color}20` : "hsl(var(--muted) / 0.5)" }}
                          >
                            {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5" style={{ color }} /> : <Bookmark className="w-3.5 h-3.5 text-muted-foreground" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs px-1.5 py-0.5 rounded font-devanagari" style={{ background: `${color}15`, color }}>
                          {bhajan.category || (language === "hi" ? bhajan.deity_hi : bhajan.deity_en)}
                        </span>
                        {bhajan.duration_display && <span className="text-xs text-muted-foreground">{bhajan.duration_display}</span>}
                        <span className="text-xs text-muted-foreground">• {formatPlays(bhajan.play_count)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground font-devanagari mt-1.5 line-clamp-2 leading-relaxed">
                        {language === "hi" ? bhajan.short_description_hi : bhajan.short_description_en}
                      </p>
                    </div>
                  </div>
                  {isPlaying && (
                    <div className="flex items-center gap-0.5 mt-3 px-1">
                      {[4, 7, 5, 9, 6, 8, 4, 7, 5].map((h, i) => (
                        <div key={i} className="rounded-full w-1" style={{ height: `${h * 2}px`, background: color, animation: `glow-pulse ${0.4 + i * 0.1}s ease-in-out infinite alternate` }} />
                      ))}
                      <span className="ml-2 text-xs font-devanagari text-muted-foreground">
                        {language === "hi" ? "चल रहा है..." : "Playing..."}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-6">
          <Link to="/bhajans" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/30 text-primary text-sm font-devanagari hover:bg-primary/5 transition-colors">
            {language === "hi" ? "सभी भजन देखें" : "View all bhajans"} →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BhajansSection;
