import { Link } from "react-router-dom";
import { Check, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSubscriptionPlans } from "@/hooks/use-subscription-plans";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const SubscriptionSection = () => {
  const { language, t } = useLanguage();
  const { data: plans, isLoading } = useSubscriptionPlans();

  if (isLoading || !plans?.length) return null;

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, hsl(20 40% 10%), hsl(345 70% 22%), hsl(20 50% 15%))" }} />
      <div className="absolute inset-0 bg-pattern-sacred opacity-20" />

      <div className="relative container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 mb-4">
            <Zap className="w-4 h-4 text-secondary" />
            <span className="text-xs font-devanagari font-semibold text-primary-foreground/90">
              {language === "hi" ? "जल्द आ रहा है" : "Coming Soon"}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-devanagari-serif font-bold text-primary-foreground mb-3">
            {t("subscribe_title")}
          </h2>
          <p className="text-primary-foreground/70 font-devanagari text-base max-w-xl mx-auto">
            {t("subscribe_subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border overflow-hidden transition-all ${
                plan.is_featured ? "border-secondary shadow-gold scale-105 z-10" : "border-white/10"
              }`}
              style={{ background: plan.is_featured ? "hsl(20 40% 14%)" : "hsl(20 40% 12% / 0.6)" }}
            >
              {plan.badge && (
                <>
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "var(--gradient-saffron)" }} />
                  <div className="absolute -top-0 right-3 px-2 py-0.5 rounded-b-lg text-xs font-bold"
                    style={{ background: "var(--gradient-saffron)", color: "white" }}>
                    {plan.badge}
                  </div>
                </>
              )}

              <div className="p-5">
                <h3 className="font-devanagari-serif font-bold text-lg text-primary-foreground mb-1">
                  {plan.name}
                </h3>
                <div className="flex items-end gap-1 mb-4">
                  {plan.price_inr === 0 ? (
                    <span className="text-2xl font-bold text-primary-foreground">
                      {language === "hi" ? "निःशुल्क" : "Free"}
                    </span>
                  ) : (
                    <>
                      <span className="text-xs text-primary-foreground/60 mb-1">₹</span>
                      <span className="text-3xl font-bold text-secondary leading-none">{plan.price_inr}</span>
                      {plan.billing_type === "monthly" && (
                        <span className="text-xs text-primary-foreground/60 mb-1">
                          /{language === "hi" ? "माह" : "mo"}
                        </span>
                      )}
                    </>
                  )}
                </div>

                <ul className="space-y-2 mb-5">
                  {(language === "hi" ? plan.features_hi : plan.features_en).map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-primary-foreground/80 font-devanagari">
                      <Check className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild={plan.price_inr === 0}
                  disabled={plan.price_inr > 0 && !plan.purchase_enabled}
                  size="sm"
                  className={`w-full text-sm font-devanagari font-semibold ${
                    plan.is_featured ? "shadow-gold" : "bg-white/10 hover:bg-white/20 text-primary-foreground border-0"
                  }`}
                  style={plan.is_featured ? { background: "var(--gradient-saffron)" } : {}}
                >
                  {plan.price_inr === 0 ? (
                    <Link to="/register">
                      {language === "hi" ? "मुफ्त शुरू करें" : "Start Free"}
                    </Link>
                  ) : plan.purchase_enabled ? (
                    <span>{language === "hi" ? "अभी लें" : "Get Now"}</span>
                  ) : (
                    <span>{language === "hi" ? "जल्द उपलब्ध" : "Coming Soon"}</span>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-primary-foreground/40 text-xs mt-8 font-devanagari">
          {language === "hi"
            ? "* भुगतान सुविधा जल्द ही उपलब्ध होगी। UPI, कार्ड और नेट बैंकिंग से भुगतान कर पाएंगे।"
            : "* Payment facility coming soon. Pay via UPI, Cards & Net Banking."}
        </p>
      </div>
    </section>
  );
};

export default SubscriptionSection;
