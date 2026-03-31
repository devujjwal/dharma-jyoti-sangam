import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useVrats } from "@/hooks/use-vrats";
import { Loader2 } from "lucide-react";

const VratPage = () => {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const { data: vrats, isLoading } = useVrats();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <div className="py-10 border-b border-border" style={{ background: "var(--gradient-sacred)" }}>
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full text-4xl mb-4" style={{ background: "hsl(var(--primary-foreground) / 0.15)" }}>🙏</div>
            <h1 className="text-3xl md:text-4xl font-devanagari-serif font-bold text-primary-foreground mb-2">{isHi ? "व्रत गाइड" : "Vrat Guide"}</h1>
            <p className="text-primary-foreground/75 font-devanagari text-sm max-w-xl mx-auto">{isHi ? "सप्ताहिक और विशेष व्रतों की संपूर्ण जानकारी" : "Complete information on weekly and special fasts"}</p>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {isLoading ? <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" /></div> : (
            <div className="space-y-4">
              {(vrats || []).map(vrat => (
                <div key={vrat.id} className="card-sacred rounded-2xl border border-border bg-card overflow-hidden">
                  <div className="h-1.5 w-full" style={{ background: vrat.color || "hsl(24 95% 48%)" }} />
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0" style={{ background: `${vrat.color || "hsl(24 95% 48%)"}15` }}>{vrat.emoji || "🙏"}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-devanagari-serif font-bold text-foreground text-lg">{isHi ? vrat.name_hi : vrat.name_en}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          {(vrat.deity_hi || vrat.deity_en) && <span className="text-xs px-2 py-0.5 rounded-full font-devanagari" style={{ background: `${vrat.color || "hsl(24 95% 48%)"}15`, color: vrat.color || "hsl(24 95% 48%)" }}>{isHi ? vrat.deity_hi : vrat.deity_en}</span>}
                          {vrat.fasting_day && <span className="text-xs text-muted-foreground font-devanagari">{vrat.fasting_day}</span>}
                        </div>
                        <p className="text-sm text-muted-foreground font-devanagari leading-relaxed mt-2">{isHi ? vrat.description_hi : vrat.description_en}</p>
                        {(vrat.benefits_hi || vrat.benefits_en) && (
                          <div className="mt-3 rounded-lg bg-muted/50 px-3 py-2">
                            <p className="text-xs font-devanagari"><span className="font-semibold text-foreground">{isHi ? "लाभ: " : "Benefits: "}</span><span className="text-muted-foreground">{isHi ? vrat.benefits_hi : vrat.benefits_en}</span></p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default VratPage;
