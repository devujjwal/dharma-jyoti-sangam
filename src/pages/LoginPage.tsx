import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";

const LoginPage = () => {
  const { signIn } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isHi = language === "hi";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(isHi ? "ईमेल या पासवर्ड गलत है। कृपया पुनः प्रयास करें।" : "Invalid email or password. Please try again.");
    } else {
      navigate("/profile");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Sacred header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl"
              style={{ background: "var(--gradient-saffron)" }}>
              🙏
            </div>
            <h1 className="text-2xl font-devanagari-serif font-bold text-foreground mb-1">
              {isHi ? "स्वागत है" : "Welcome Back"}
            </h1>
            <p className="text-sm text-muted-foreground font-devanagari">
              {isHi ? "अपने दिव्य ज्योति खाते में प्रवेश करें" : "Sign in to your Divya Jyoti account"}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="font-devanagari text-sm font-medium text-foreground">
                  {isHi ? "ईमेल पता" : "Email Address"}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={isHi ? "your@email.com" : "your@email.com"}
                  required
                  className="font-devanagari"
                />
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
                  ? (isHi ? "प्रवेश हो रहा है..." : "Signing in...")
                  : (isHi ? "🙏 प्रवेश करें" : "🙏 Sign In")}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground font-devanagari">
                {isHi ? "नया खाता नहीं है?" : "Don't have an account?"}{" "}
                <Link to="/register" className="text-primary font-semibold hover:underline">
                  {isHi ? "पंजीकरण करें" : "Register"}
                </Link>
              </p>
            </div>
          </div>

          {/* Decorative mantra */}
          <p className="text-center text-xs text-muted-foreground/50 font-devanagari mt-6">
            ॐ सर्वे भवन्तु सुखिनः
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default LoginPage;
