import { useState, useEffect } from "react";
import { Play, Lock, Bookmark, BookmarkCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { BHAJANS } from "@/data/astroData";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const formatPlays = (n: number): string => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toString();
};

const DEITY_COLORS: Record<string, string> = {
  Hanuman: "hsl(24 95% 48%)",
  Vishnu: "hsl(200 70% 48%)",
  Durga: "hsl(355 75% 40%)",
  Shiva: "hsl(240 30% 40%)",
  Ganesha: "hsl(43 95% 45%)",
  Saraswati: "hsl(210 60% 55%)",
};

const BhajansSection = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [playing, setPlaying] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [loadingBookmark, setLoadingBookmark] = useState<string | null>(null);

  // Fetch existing bookmarks when user is logged in
  useEffect(() => {
    if (!user) {
      setBookmarks(new Set());
      return;
    }
    const fetchBookmarks = async () => {
      const { data } = await supabase
        .from("bookmarked_bhajans")
        .select("bhajan_id")
        .eq("user_id", user.id);
      if (data) {
        setBookmarks(new Set(data.map((r) => r.bhajan_id)));
      }
    };
    fetchBookmarks();
  }, [user]);

  const toggleBookmark = async (bhajanId: string, titleHi: string, titleEn: string) => {
    if (!user) {
      toast({
        title: language === "hi" ? "लॉगिन करें" : "Please log in",
        description:
          language === "hi"
            ? "भजन बुकमार्क करने के लिए लॉगिन करें।"
            : "Sign in to bookmark bhajans.",
        variant: "destructive",
      });
      return;
    }

    setLoadingBookmark(bhajanId);
    const isBookmarked = bookmarks.has(bhajanId);

    // Optimistic update
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (isBookmarked) next.delete(bhajanId);
      else next.add(bhajanId);
      return next;
    });

    try {
      if (isBookmarked) {
        const { error } = await supabase
          .from("bookmarked_bhajans")
          .delete()
          .eq("user_id", user.id)
          .eq("bhajan_id", bhajanId);

        if (error) throw error;

        toast({
          title: language === "hi" ? "बुकमार्क हटाया" : "Bookmark removed",
          description:
            language === "hi"
              ? `"${titleHi}" बुकमार्क से हटा दिया।`
              : `"${titleEn}" removed from bookmarks.`,
        });
      } else {
        const { error } = await supabase
          .from("bookmarked_bhajans")
          .insert({ user_id: user.id, bhajan_id: bhajanId });

        if (error) throw error;

        toast({
          title: language === "hi" ? "बुकमार्क किया" : "Bookmarked",
          description:
            language === "hi"
              ? `"${titleHi}" बुकमार्क में जोड़ा।`
              : `"${titleEn}" added to bookmarks.`,
        });
      }
    } catch {
      // Revert optimistic update on error
      setBookmarks((prev) => {
        const next = new Set(prev);
        if (isBookmarked) next.add(bhajanId);
        else next.delete(bhajanId);
        return next;
      });
      toast({
        title: language === "hi" ? "त्रुटि" : "Error",
        description:
          language === "hi" ? "कुछ गड़बड़ हुई, पुनः प्रयास करें।" : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingBookmark(null);
    }
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px flex-1 max-w-16" style={{ background: "var(--gradient-saffron)" }} />
            <span className="text-2xl">🎵</span>
            <div className="h-px flex-1 max-w-16" style={{ background: "var(--gradient-saffron)" }} />
          </div>
          <h2 className="text-3xl font-devanagari-serif font-bold text-foreground mb-2">
            {t("bhajan_title")}
          </h2>
          <p className="text-muted-foreground font-devanagari text-sm">
            {language === "hi" ? "पवित्र भजन, चालीसा और स्तोत्र" : "Sacred bhajans, chalisa and stotras"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BHAJANS.map((bhajan) => {
            const color = DEITY_COLORS[bhajan.deity] || "hsl(24 95% 48%)";
            const isPlaying = playing === bhajan.id;
            const isBookmarked = bookmarks.has(bhajan.id);
            const isLoadingThis = loadingBookmark === bhajan.id;

            return (
              <div
                key={bhajan.id}
                className="card-sacred group relative rounded-2xl border border-border bg-card overflow-hidden"
              >
                {/* Color stripe */}
                <div className="h-1.5 w-full" style={{ background: color }} />

                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Play button */}
                    <button
                      onClick={() => setPlaying(isPlaying ? null : bhajan.id)}
                      className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center shadow-sacred transition-all group-hover:scale-105 active:scale-95"
                      style={{
                        background: bhajan.isFree
                          ? `linear-gradient(135deg, ${color}, ${color}cc)`
                          : "hsl(var(--muted))",
                      }}
                    >
                      {bhajan.isFree ? (
                        <Play className={`w-4 h-4 text-white ${isPlaying ? "fill-white" : ""}`} />
                      ) : (
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-devanagari-serif font-bold text-foreground text-base leading-tight">
                          {language === "hi" ? bhajan.titleHi : bhajan.titleEn}
                        </h4>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {!bhajan.isFree && (
                            <span
                              className="text-xs px-2 py-0.5 rounded-full font-bold"
                              style={{ background: "hsl(43 95% 50% / 0.15)", color: "hsl(43 95% 40%)" }}
                            >
                              Premium
                            </span>
                          )}
                          {/* Bookmark button */}
                          <button
                            onClick={() => toggleBookmark(bhajan.id, bhajan.titleHi, bhajan.titleEn)}
                            disabled={isLoadingThis}
                            className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-50"
                            style={{
                              background: isBookmarked
                                ? `${color}20`
                                : "hsl(var(--muted) / 0.5)",
                            }}
                            title={
                              isBookmarked
                                ? language === "hi" ? "बुकमार्क हटाएं" : "Remove bookmark"
                                : language === "hi" ? "बुकमार्क करें" : "Bookmark"
                            }
                          >
                            {isBookmarked ? (
                              <BookmarkCheck
                                className="w-3.5 h-3.5"
                                style={{ color }}
                              />
                            ) : (
                              <Bookmark className="w-3.5 h-3.5 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className="text-xs px-1.5 py-0.5 rounded font-devanagari"
                          style={{ background: `${color}15`, color }}
                        >
                          {bhajan.category}
                        </span>
                        <span className="text-xs text-muted-foreground">{bhajan.duration}</span>
                        <span className="text-xs text-muted-foreground">• {formatPlays(bhajan.plays)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground font-devanagari mt-1.5 line-clamp-2 leading-relaxed">
                        {bhajan.firstLineHi}
                      </p>
                    </div>
                  </div>

                  {/* Playing waveform indicator */}
                  {isPlaying && (
                    <div className="flex items-center gap-0.5 mt-3 px-1">
                      {[4, 7, 5, 9, 6, 8, 4, 7, 5].map((h, i) => (
                        <div
                          key={i}
                          className="rounded-full w-1"
                          style={{
                            height: `${h * 2}px`,
                            background: color,
                            animation: `glow-pulse ${0.4 + i * 0.1}s ease-in-out infinite alternate`,
                          }}
                        />
                      ))}
                      <span className="ml-2 text-xs font-devanagari text-muted-foreground">चल रहा है...</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-6">
          <Link
            to="/bhajans"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/30 text-primary text-sm font-devanagari hover:bg-primary/5 transition-colors"
          >
            {language === "hi" ? "सभी भजन देखें" : "View all bhajans"} →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BhajansSection;
