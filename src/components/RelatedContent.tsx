import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useContentRelations } from "@/hooks/use-content-relations";
import { Loader2 } from "lucide-react";

const TYPE_ROUTE: Record<string, string> = {
  festival: "/festivals",
  temple: "/temples",
  article: "/articles",
  bhajan: "/bhajans",
  vrat: "/vrat",
};

const TYPE_LABEL: Record<string, { hi: string; en: string }> = {
  festival: { hi: "त्यौहार", en: "Festival" },
  temple: { hi: "मंदिर", en: "Temple" },
  article: { hi: "लेख", en: "Article" },
  bhajan: { hi: "भजन", en: "Bhajan" },
  vrat: { hi: "व्रत", en: "Vrat" },
};

interface Props {
  sourceType: string;
  sourceId?: string;
}

const RelatedContent = ({ sourceType, sourceId }: Props) => {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const { data: items, isLoading } = useContentRelations(sourceType, sourceId);

  if (isLoading) return <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>;
  if (!items || items.length === 0) return null;

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <h2 className="text-lg font-devanagari-serif font-bold text-foreground mb-4">
        {isHi ? "संबंधित सामग्री" : "Related Content"}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => {
          const route = item.type === "vrat" ? `/vrat/${item.slug}` : `${TYPE_ROUTE[item.type]}/${item.slug}`;
          const label = TYPE_LABEL[item.type];
          return (
            <Link
              key={`${item.type}-${item.id}`}
              to={route}
              className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3 hover:bg-muted/60 transition-colors"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: `${item.color || "hsl(24 95% 48%)"}15` }}
              >
                {item.emoji || "📄"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-devanagari font-semibold text-foreground text-sm truncate">
                  {isHi ? item.title_hi : item.title_en}
                </p>
                <p className="text-xs text-muted-foreground font-devanagari">
                  {isHi ? label?.hi : label?.en}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default RelatedContent;
