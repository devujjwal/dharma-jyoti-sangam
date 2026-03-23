import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useArticle } from "@/hooks/use-articles";
import { ArrowLeft, Clock, Loader2 } from "lucide-react";

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const { language } = useLanguage();
  const isHi = language === "hi";
  const { data: article, isLoading } = useArticle(slug);

  if (isLoading) return (<div className="min-h-screen flex flex-col bg-background"><Navigation /><main className="flex-1 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></main><SiteFooter /></div>);

  if (!article) return (
    <div className="min-h-screen flex flex-col bg-background"><Navigation /><main className="flex-1 flex items-center justify-center"><div className="text-center"><p className="text-4xl mb-4">📖</p><h1 className="text-2xl font-devanagari-serif font-bold text-foreground mb-2">{isHi ? "लेख नहीं मिला" : "Article Not Found"}</h1><Link to="/articles" className="text-primary font-devanagari hover:underline">{isHi ? "सभी लेख देखें" : "View all articles"}</Link></div></main><SiteFooter /></div>
  );

  const content = isHi ? article.content_hi : article.content_en;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <div className="py-12 border-b border-border" style={{ background: `linear-gradient(135deg, ${article.color || "hsl(24 95% 48%)"}20, ${article.color || "hsl(24 95% 48%)"}05)` }}>
          <div className="container mx-auto px-4 max-w-3xl">
            <Link to="/articles" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary font-devanagari mb-4 transition-colors"><ArrowLeft className="w-4 h-4" />{isHi ? "सभी लेख" : "All Articles"}</Link>
            <h1 className="text-3xl font-devanagari-serif font-bold text-foreground mb-2">{isHi ? article.title_hi : article.title_en}</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground font-devanagari">
              {article.author_name && <span>{article.author_name}</span>}
              {article.read_time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.read_time}</span>}
              {article.category && <span className="px-2 py-0.5 rounded-full bg-muted text-xs">{article.category}</span>}
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <div className="prose prose-neutral dark:prose-invert max-w-none font-devanagari">
            {content.split("\n").map((p, i) => p.trim() ? <p key={i}>{p}</p> : null)}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default ArticleDetailPage;
