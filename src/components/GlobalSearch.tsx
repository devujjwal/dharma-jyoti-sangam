import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  useGlobalSearch,
  getRecentSearches,
  addRecentSearch,
  clearRecentSearches,
  type SearchResult,
} from "@/hooks/use-global-search";
import { Search, X, Clock, Loader2, Trash2 } from "lucide-react";

const TYPE_ROUTE: Record<string, string> = {
  festival: "/festivals",
  temple: "/temples",
  article: "/articles",
  bhajan: "/bhajans",
  vrat: "/vrat",
};

const TYPE_EMOJI: Record<string, string> = {
  festival: "🎊",
  temple: "🛕",
  article: "📖",
  bhajan: "🎵",
  vrat: "🙏",
};

const TYPE_LABEL: Record<string, { hi: string; en: string }> = {
  festival: { hi: "त्यौहार", en: "Festival" },
  temple: { hi: "मंदिर", en: "Temple" },
  article: { hi: "लेख", en: "Article" },
  bhajan: { hi: "भजन", en: "Bhajan" },
  vrat: { hi: "व्रत", en: "Vrat" },
};

interface Props {
  open: boolean;
  onClose: () => void;
}

const GlobalSearch = ({ open, onClose }: Props) => {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const { data: results, isLoading } = useGlobalSearch(debouncedQuery);

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  // Focus on open
  useEffect(() => {
    if (open) {
      setRecentSearches(getRecentSearches());
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setDebouncedQuery("");
    }
  }, [open]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const handleSelect = useCallback(
    (item: SearchResult) => {
      addRecentSearch(isHi ? item.title_hi : item.title_en);
      const route = `${TYPE_ROUTE[item.content_type]}/${item.slug}`;
      navigate(route);
      onClose();
    },
    [navigate, onClose, isHi]
  );

  const handleRecentClick = useCallback(
    (q: string) => {
      setQuery(q);
      setDebouncedQuery(q);
    },
    []
  );

  const handleClearRecent = useCallback(() => {
    clearRecentSearches();
    setRecentSearches([]);
  }, []);

  if (!open) return null;

  // Group results by type
  const grouped = (results || []).reduce<Record<string, SearchResult[]>>((acc, r) => {
    (acc[r.content_type] = acc[r.content_type] || []).push(r);
    return acc;
  }, {});

  const hasResults = results && results.length > 0;
  const showEmpty = debouncedQuery.length >= 2 && !isLoading && !hasResults;
  const showRecent = query.length < 2 && recentSearches.length > 0;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Search Panel */}
      <div className="fixed inset-x-0 top-0 z-[61] flex justify-center pt-16 sm:pt-24 px-4">
        <div className="w-full max-w-xl bg-background border border-border rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
          {/* Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <Search className="w-5 h-5 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isHi ? "मंदिर, त्यौहार, भजन, लेख खोजें..." : "Search temples, festivals, bhajans, articles..."}
              className="flex-1 bg-transparent text-sm font-devanagari text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            {isLoading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
            <button onClick={onClose} className="p-1 rounded-md hover:bg-muted transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Results area */}
          <div className="max-h-[60vh] overflow-y-auto">
            {/* Recent Searches */}
            {showRecent && (
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground font-devanagari font-semibold">
                    {isHi ? "हाल की खोज" : "Recent Searches"}
                  </p>
                  <button onClick={handleClearRecent} className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleRecentClick(q)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-xs font-devanagari text-foreground hover:bg-muted/80 transition-colors"
                    >
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Grouped Results */}
            {hasResults &&
              Object.entries(grouped).map(([type, items]) => (
                <div key={type} className="border-b border-border last:border-0">
                  <p className="text-xs font-semibold text-muted-foreground font-devanagari px-4 pt-3 pb-1">
                    {TYPE_EMOJI[type]} {isHi ? TYPE_LABEL[type]?.hi : TYPE_LABEL[type]?.en}
                  </p>
                  {items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/60 transition-colors text-left"
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                        style={{ background: `${item.color || "hsl(24 95% 48%)"}15` }}
                      >
                        {item.emoji || TYPE_EMOJI[item.content_type] || "📄"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-devanagari font-semibold text-foreground truncate">
                          {isHi ? item.title_hi : item.title_en}
                        </p>
                        {item.excerpt && (
                          <p className="text-xs text-muted-foreground font-devanagari truncate">
                            {item.excerpt.slice(0, 80)}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ))}

            {/* Empty State */}
            {showEmpty && (
              <div className="py-12 text-center">
                <p className="text-3xl mb-2">🔍</p>
                <p className="text-sm text-muted-foreground font-devanagari">
                  {isHi ? "कोई परिणाम नहीं मिला" : "No results found"}
                </p>
                <p className="text-xs text-muted-foreground/70 font-devanagari mt-1">
                  {isHi ? "कुछ और खोजें" : "Try a different search term"}
                </p>
              </div>
            )}

            {/* Hint when empty and no recent */}
            {query.length < 2 && recentSearches.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-xs text-muted-foreground font-devanagari">
                  {isHi ? "कम से कम 2 अक्षर लिखें" : "Type at least 2 characters to search"}
                </p>
              </div>
            )}
          </div>

          {/* Footer shortcut hint */}
          <div className="px-4 py-2 border-t border-border bg-muted/30 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              <kbd className="px-1.5 py-0.5 rounded border border-border bg-background text-xs">Esc</kbd>
              {" "}{isHi ? "बंद करें" : "to close"}
            </p>
            <p className="text-xs text-muted-foreground font-devanagari">
              <kbd className="px-1.5 py-0.5 rounded border border-border bg-background text-xs">⌘K</kbd>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default GlobalSearch;
