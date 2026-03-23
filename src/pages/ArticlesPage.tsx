import { useState } from "react";
import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useArticles } from "@/hooks/use-articles";
import { Search, Clock, BookOpen, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const ArticlesPage = () => {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const { data: articles, isLoading } = useArticles(filterCat !== "all" ? filterCat : undefined);

  const categories = ["all", ...Array.from(new Set((articles || []).map(a => a.category).filter(Boolean) as string[]))];

  const filtered = (articles || []).filter(a => {
    if (!search) return true;
    return a.title_hi.includes(search) || a.title_en.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <div className="py-10 border-b border-border" style={{ background: "var(--gradient-sacred)" }}>
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full text-4xl mb-4" style={{ background: "hsl(var(--primary-foreground) / 0.15)" }}>📖</div>
            <h1 className="text-3xl md:text-4xl font-devanagari-serif font-bold text-primary-foreground mb-2">{isHi ? "धार्मिक लेख" : "Spiritual Articles"}</h1>
            <p className="text-primary-foreground/75 font-devanagari text-sm max-w-xl mx-auto">{isHi ? "ज्योतिष, वास्तु, पूजा विधि और आध्यात्मिक ज्ञान" : "Astrology, Vastu, Puja methods and spiritual knowledge"}</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder={isHi ? "लेख खोजें..." : "Search articles..."} className="pl-10 font-devanagari" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {categories.map(c => (
                <button key={c} onClick={() => setFilterCat(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-devanagari font-medium transition-colors border ${filterCat === c ? "border-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/50"}`}
                  style={filterCat === c ? { background: "var(--gradient-saffron)" } : {}}>
                  {c === "all" ? (isHi ? "सभी" : "All") : c}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map(article => (
                <Link key={article.id} to={`/articles/${article.slug}`}
                  className="card-sacred rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/30 transition-colors">
                  <div className="h-1.5 w-full" style={{ background: article.color || "hsl(24 95% 48%)" }} />
                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: `${article.color || "hsl(24 95% 48%)"}15` }}>{article.emoji || "📖"}</div>
                      <div className="min-w-0">
                        <h3 className="font-devanagari-serif font-bold text-foreground text-base leading-tight">{isHi ? article.title_hi : article.title_en}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {article.category && <span className="text-xs px-1.5 py-0.5 rounded font-devanagari" style={{ background: `${article.color || "hsl(24 95% 48%)"}15`, color: article.color || "hsl(24 95% 48%)" }}>{article.category}</span>}
                          {article.read_time && <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{article.read_time}</span>}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground font-devanagari leading-relaxed">{isHi ? (article.excerpt_hi || "") : (article.excerpt_en || "")}</p>
                    <div className="mt-3 flex items-center gap-1 text-xs text-primary font-devanagari font-medium"><BookOpen className="w-3 h-3" />{isHi ? "पूरा पढ़ें →" : "Read full →"}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {!isLoading && !filtered.length && <div className="text-center py-12"><p className="text-muted-foreground font-devanagari">{isHi ? "कोई लेख नहीं मिला" : "No articles found"}</p></div>}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default ArticlesPage;
