import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import { RASHIS } from "@/data/astroData";

const RegisterPage = () => {
  const { signUp } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rashiId, setRashiId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const isHi = language === "hi";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError(isHi ? "पासवर्ड कम से कम 6 अक्षर का होना चाहिए।" : "Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError(isHi ? "पासवर्ड मेल नहीं खा रहे हैं।" : "Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, displayName);
    setLoading(false);

    if (error) {
      if ((error as any)?.message?.includes("already registered")) {
        setError(isHi ? "यह ईमेल पहले से पंजीकृत है।" : "This email is already registered.");
      } else {
        setError(isHi ? "पंजीकरण में त्रुटि हुई। कृपया पुनः प्रयास करें।" : "Registration failed. Please try again.");
      }
    } else {
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md text-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl"
              style={{ background: "var(--gradient-saffron)" }}>
              🌸
            </div>
            <h2 className="text-2xl font-devanagari-serif font-bold text-foreground mb-3">
              {isHi ? "स्वागत है दिव्य ज्योति परिवार में!" : "Welcome to Divya Jyoti!"}
            </h2>
            <p className="text-muted-foreground font-devanagari mb-2">
              {isHi
                ? "आपका पंजीकरण सफल रहा। कृपया अपना ईमेल सत्यापित करें।"
                : "Registration successful. Please verify your email."}
            </p>
            <p className="text-sm text-muted-foreground font-devanagari">
              {isHi ? "लॉगिन पेज पर जा रहे हैं..." : "Redirecting to login..."}
            </p>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl"
              style={{ background: "var(--gradient-saffron)" }}>
              ✨
            </div>
            <h1 className="text-2xl font-devanagari-serif font-bold text-foreground mb-1">
              {isHi ? "नया खाता बनाएं" : "Create Account"}
            </h1>
            <p className="text-sm text-muted-foreground font-devanagari">
              {isHi ? "दिव्य ज्योति परिवार में शामिल हों" : "Join the Divya Jyoti family"}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="font-devanagari text-sm font-medium text-foreground">
                  {isHi ? "पूरा नाम" : "Full Name"}
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder={isHi ? "अपना नाम लिखें" : "Your name"}
                  required
                  className="font-devanagari"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="font-devanagari text-sm font-medium text-foreground">
                  {isHi ? "ईमेल पता" : "Email Address"}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="font-devanagari"
                />
              </div>

              {/* Rashi selection */}
              <div className="space-y-1.5">
                <Label htmlFor="rashi" className="font-devanagari text-sm font-medium text-foreground">
                  {isHi ? "आपकी राशि (वैकल्पिक)" : "Your Rashi (Optional)"}
                </Label>
                <select
                  id="rashi"
                  value={rashiId}
                  onChange={e => setRashiId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-devanagari ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">{isHi ? "— राशि चुनें —" : "— Select Rashi —"}</option>
                  {RASHIS.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.symbol} {isHi ? r.nameHi : r.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="font-devanagari text-sm font-medium text-foreground">
                  {isHi ? "पासवर्ड" : "Password"}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="font-devanagari"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm" className="font-devanagari text-sm font-medium text-foreground">
                  {isHi ? "पासवर्ड पुनः दर्ज करें" : "Confirm Password"}
                </Label>
                <Input
                  id="confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="font-devanagari"
                />
              </div>

              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive font-devanagari">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full font-devanagari font-semibold text-base h-11 shadow-sacred"
                style={{ background: "var(--gradient-saffron)" }}
              >
                {loading
                  ? (isHi ? "पंजीकरण हो रहा है..." : "Registering...")
                  : (isHi ? "🌸 खाता बनाएं" : "🌸 Create Account")}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground font-devanagari">
                {isHi ? "पहले से खाता है?" : "Already have an account?"}{" "}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  {isHi ? "लॉगिन करें" : "Login"}
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground/50 font-devanagari mt-6">
            ॐ सर्वे भवन्तु सुखिनः
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default RegisterPage;
