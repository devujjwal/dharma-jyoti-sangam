import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import Breadcrumbs from "@/components/Breadcrumbs";
import ShareButton from "@/components/ShareButton";
import RelatedContent from "@/components/RelatedContent";
import { useLanguage } from "@/contexts/LanguageContext";
import { useArticle } from "@/hooks/use-articles";
import { useSeo } from "@/hooks/use-seo";
import { articleJsonLd } from "@/lib/jsonLd";
import { sanitizeHtml } from "@/lib/sanitize";
import { Clock, Loader2 } from "lucide-react";

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const { language } = useLanguage();
  const isHi = language === "hi";
  const { data: article, isLoading } = useArticle(slug);

  const displayTitle = article ? (isHi ? article.title_hi : article.title_en) : undefined;

  useSeo({
    title: displayTitle,
    description: article?.seo_description || (article ? (isHi ? article.excerpt_hi : article.excerpt_en) || undefined : undefined),
    jsonLd: article ? articleJsonLd({
      title: article.title_en, slug: article.slug, excerpt: article.excerpt_en || undefined,
      author_name: article.author_name, published_at: article.published_at,
      updated_at: article.updated_at, featured_image_url: article.featured_image_url,
    }) : undefined,
  });

  if (isLoading) return (<div className="min-h-screen flex flex-col bg-background"><Navigation /><main className="flex-1 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></main><SiteFooter /></div>);

  if (!article) return (
    <div className="min-h-screen flex flex-col bg-background"><Navigation /><main className="flex-1 flex items-center justify-center"><div className="text-center"><p className="text-4xl mb-4">📖</p><h1 className="text-2xl font-devanagari-serif font-bold text-foreground mb-2">{isHi ? "लेख नहीं मिला" : "Article Not Found"}</h1><Link to="/articles" className="text-primary font-devanagari hover:underline">{isHi ? "सभी लेख देखें" : "View all articles"}</Link></div></main><SiteFooter /></div>
  );

  const content = isHi ? article.content_hi : article.content_en;
  const hasHtml = /<[a-z][\s\S]*>/i.test(content);
  const displayTitle = isHi ? article.title_hi : article.title_en;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <div className="py-12 border-b border-border" style={{ background: `linear-gradient(135deg, ${article.color || "hsl(24 95% 48%)"}20, ${article.color || "hsl(24 95% 48%)"}05)` }}>
          <div className="container mx-auto px-4 max-w-3xl">
            <Breadcrumbs crumbs={[
              { label: isHi ? "लेख" : "Articles", href: "/articles" },
              ...(article.category ? [{ label: article.category, href: "/articles" }] : []),
              { label: displayTitle },
            ]} />
            <h1 className="text-3xl font-devanagari-serif font-bold text-foreground mb-2">{displayTitle}</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground font-devanagari flex-wrap">
              {article.author_name && <span>{article.author_name}</span>}
              {article.read_time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.read_time}</span>}
              {article.category && <span className="px-2 py-0.5 rounded-full bg-muted text-xs">{article.category}</span>}
              {article.tags && article.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {article.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full bg-muted/60 text-xs">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8 max-w-3xl space-y-8">
          {/* Content */}
          {hasHtml ? (
            <div
              className="prose prose-neutral dark:prose-invert max-w-none font-devanagari"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
            />
          ) : (
            <div className="prose prose-neutral dark:prose-invert max-w-none font-devanagari">
              {content.split("\n").map((p, i) => p.trim() ? <p key={i}>{p}</p> : null)}
            </div>
          )}

          {/* Share */}
          <div className="flex gap-3 border-t border-border pt-6">
            <ShareButton title={displayTitle} />
          </div>

          {/* Related */}
          <RelatedContent sourceType="article" sourceId={article.id} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default ArticleDetailPage;
