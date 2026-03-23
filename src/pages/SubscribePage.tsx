import { useState } from "react";
import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { SUBSCRIPTION_PLANS } from "@/data/astroData";
import { Button } from "@/components/ui/button";
import { Check, Zap, CreditCard } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const SubscribePage = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const isHi = language === "hi";
  const [processing, setProcessing] = useState<string | null>(null);

  const handlePurchase = async (planId: string, planName: string) => {
    if (!user) {
      toast({ title: isHi ? "लॉगिन करें" : "Please log in", description: isHi ? "सदस्यता लेने के लिए पहले लॉगिन करें।" : "Please log in first to subscribe.", variant: "destructive" });
      return;
    }
    setProcessing(planId);
    // Simulate payment flow
    await new Promise(r => setTimeout(r, 2000));
    setProcessing(null);
    toast({
      title: isHi ? "भुगतान सफल! ✅" : "Payment Successful! ✅",
      description: isHi ? `${planName} सक्रिय किया गया। (डेमो)` : `${planName} activated. (Demo)`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        {/* Hero */}
        <div className="py-12 relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(20 40% 10%), hsl(345 70% 22%), hsl(20 50% 15%))" }}>
          <div className="absolute inset-0 bg-pattern-sacred opacity-20" />
          <div className="relative container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 mb-4">
              <Zap className="w-4 h-4 text-secondary" />
              <span className="text-xs font-devanagari font-semibold text-primary-foreground/90">
                {isHi ? "विशेष ऑफर" : "Special Offer"}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-devanagari-serif font-bold text-primary-foreground mb-3">
              {isHi ? "दिव्य प्रीमियम सदस्यता" : "Divya Premium Subscription"}
            </h1>
            <p className="text-primary-foreground/70 font-devanagari max-w-xl mx-auto">
              {isHi ? "असीमित ज्योतिष, विस्तृत कुंडली, सभी भजन और प्रीमियम सामग्री" : "Unlimited astrology, detailed Kundali, all bhajans and premium content"}
            </p>
          </div>
        </div>

        {/* Plans */}
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SUBSCRIPTION_PLANS.map(plan => (
              <div key={plan.id}
                className={`relative rounded-2xl border overflow-hidden transition-all ${plan.highlighted ? "border-secondary shadow-gold scale-105 z-10" : "border-border"}`}
                style={{ background: plan.highlighted ? "hsl(var(--card))" : undefined }}>
                {plan.badge && <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "var(--gradient-saffron)" }} />}
                {plan.badge && <div className="absolute -top-0 right-3 px-2 py-0.5 rounded-b-lg text-xs font-bold" style={{ background: "var(--gradient-saffron)", color: "white" }}>{plan.badge}</div>}
                <div className="p-5">
                  <h3 className="font-devanagari-serif font-bold text-lg text-foreground mb-1">{isHi ? plan.nameHi : plan.nameEn}</h3>
                  <div className="flex items-end gap-1 mb-4">
                    {plan.priceMonthly === 0 ? (
                      <span className="text-2xl font-bold text-foreground">{isHi ? "निःशुल्क" : "Free"}</span>
                    ) : (
                      <>
                        <span className="text-xs text-muted-foreground mb-1">₹</span>
                        <span className="text-3xl font-bold text-primary leading-none">{plan.priceMonthly}</span>
                      </>
                    )}
                  </div>
                  <ul className="space-y-2 mb-5">
                    {(isHi ? plan.features.hi : plan.features.en).map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground font-devanagari">
                        <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.priceMonthly === 0 ? (
                    <Button asChild size="sm" variant="outline" className="w-full font-devanagari">
                      <Link to="/register">{isHi ? "मुफ्त शुरू करें" : "Start Free"}</Link>
                    </Button>
                  ) : (
                    <Button size="sm" disabled={processing === plan.id} onClick={() => handlePurchase(plan.id, isHi ? plan.nameHi : plan.nameEn)}
                      className="w-full font-devanagari gap-2" style={plan.highlighted ? { background: "var(--gradient-saffron)" } : {}}>
                      <CreditCard className="w-4 h-4" />
                      {processing === plan.id ? (isHi ? "प्रोसेसिंग..." : "Processing...") : (isHi ? "अभी खरीदें" : "Buy Now")}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Payment info */}
          <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-card text-center">
            <h3 className="font-devanagari-serif font-bold text-foreground mb-3">{isHi ? "भुगतान विकल्प" : "Payment Options"}</h3>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground font-devanagari">
              <span>💳 Credit/Debit Card</span>
              <span>📱 UPI</span>
              <span>🏦 Net Banking</span>
              <span>📲 Paytm / PhonePe</span>
            </div>
            <p className="text-xs text-muted-foreground font-devanagari mt-3">
              {isHi ? "* सभी भुगतान GST सहित। SSL से सुरक्षित। 7 दिन रिफंड गारंटी।" : "* All payments inclusive of GST. SSL secured. 7-day refund guarantee."}
            </p>
            <p className="text-xs text-accent font-devanagari font-semibold mt-1">
              {isHi ? "⚠️ यह एक डेमो भुगतान प्रवाह है।" : "⚠️ This is a demo payment flow."}
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default SubscribePage;
