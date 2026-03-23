import { useState, useRef } from "react";
import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useContactSubmit } from "@/hooks/use-contact-submit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Send, Mail, MapPin, Phone } from "lucide-react";

const ContactPage = () => {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const contactMutation = useContactSubmit();
  const formRef = useRef<HTMLFormElement>(null);
  const [cooldown, setCooldown] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cooldown) { toast({ title: isHi ? "कृपया प्रतीक्षा करें" : "Please wait", variant: "destructive" }); return; }
    const fd = new FormData(e.currentTarget);
    const data = {
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      subject: fd.get("subject") as string || undefined,
      message: fd.get("message") as string,
    };
    try {
      await contactMutation.mutateAsync(data);
      toast({ title: isHi ? "संदेश भेजा गया" : "Message Sent", description: isHi ? "हम जल्द ही आपसे संपर्क करेंगे।" : "We will get back to you soon." });
      formRef.current?.reset();
      setCooldown(true);
      setTimeout(() => setCooldown(false), 60000);
    } catch {
      toast({ title: isHi ? "त्रुटि" : "Error", description: isHi ? "संदेश नहीं भेजा जा सका।" : "Could not send message.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <div className="py-10 border-b border-border" style={{ background: "var(--gradient-sacred)" }}>
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-devanagari-serif font-bold text-primary-foreground mb-2">{isHi ? "सम्पर्क करें" : "Contact Us"}</h1>
            <p className="text-primary-foreground/75 font-devanagari text-sm max-w-md mx-auto">{isHi ? "आपके सुझाव, प्रश्न या शिकायत — हम सुनने के लिए तैयार हैं" : "Your suggestions, questions or concerns — we are here to listen"}</p>
          </div>
        </div>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-xl font-devanagari-serif font-bold text-foreground">{isHi ? "संपर्क जानकारी" : "Contact Information"}</h2>
              {[
                { icon: <Mail className="w-5 h-5" />, label: isHi ? "ईमेल" : "Email", value: "support@divyajyoti.in" },
                { icon: <Phone className="w-5 h-5" />, label: isHi ? "फोन" : "Phone", value: "+91-11-XXXX-XXXX" },
                { icon: <MapPin className="w-5 h-5" />, label: isHi ? "पता" : "Address", value: isHi ? "नई दिल्ली, भारत 110001" : "New Delhi, India 110001" },
              ].map((c, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-card">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-primary shrink-0" style={{ background: "hsl(var(--primary) / 0.1)" }}>{c.icon}</div>
                  <div><p className="text-xs text-muted-foreground font-devanagari">{c.label}</p><p className="font-devanagari font-medium text-foreground">{c.value}</p></div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h2 className="text-xl font-devanagari-serif font-bold text-foreground mb-4">{isHi ? "संदेश भेजें" : "Send a Message"}</h2>
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                <div><label className="text-sm font-devanagari text-foreground mb-1 block">{isHi ? "नाम" : "Name"}</label><Input name="name" required placeholder={isHi ? "आपका नाम" : "Your name"} className="font-devanagari" /></div>
                <div><label className="text-sm font-devanagari text-foreground mb-1 block">{isHi ? "ईमेल" : "Email"}</label><Input name="email" required type="email" placeholder={isHi ? "आपका ईमेल" : "Your email"} className="font-devanagari" /></div>
                <div><label className="text-sm font-devanagari text-foreground mb-1 block">{isHi ? "विषय" : "Subject"}</label><Input name="subject" placeholder={isHi ? "विषय लिखें" : "Enter subject"} className="font-devanagari" /></div>
                <div><label className="text-sm font-devanagari text-foreground mb-1 block">{isHi ? "संदेश" : "Message"}</label><Textarea name="message" required rows={4} placeholder={isHi ? "आपका संदेश..." : "Your message..."} className="font-devanagari" /></div>
                <Button type="submit" disabled={contactMutation.isPending || cooldown} className="w-full font-devanagari gap-2" style={{ background: "var(--gradient-saffron)" }}>
                  <Send className="w-4 h-4" />
                  {contactMutation.isPending ? (isHi ? "भेज रहा है..." : "Sending...") : (isHi ? "संदेश भेजें" : "Send Message")}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default ContactPage;
