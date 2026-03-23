import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search, User, Bell, ChevronDown, LogOut, UserCircle, Zap, Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage, LANGUAGES } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Sync theme from profile on login
  useEffect(() => {
    if (profile?.theme) {
      setTheme(profile.theme);
    }
  }, [profile?.theme]);

  // Persist theme to profile
  const handleSetTheme = useCallback(async (newTheme: string) => {
    setTheme(newTheme);
    if (user) {
      const { supabase } = await import("@/integrations/supabase/client");
      await supabase.from("profiles").update({ theme: newTheme } as any).eq("id", user.id);
    }
  }, [user, setTheme]);

  const currentLang = LANGUAGES.find((l) => l.code === language);

  const navItems = [
    { key: "nav_panchang", href: "/panchang", icon: "📅" },
    { key: "nav_horoscope", href: "/horoscope", icon: "⭐" },
    { key: "nav_kundali", href: "/kundali", icon: "🔮" },
    { key: "nav_matching", href: "/kundali-matching", icon: "💑" },
    { key: "nav_festivals", href: "/festivals", icon: "🎊" },
    { key: "nav_temples", href: "/temples", icon: "🛕" },
    { key: "nav_bhajans", href: "/bhajans", icon: "🎵" },
    { key: "nav_articles", href: "/articles", icon: "📖" },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      {/* Top sacred ticker bar */}
      <div className="nav-ticker-bar">
        <div className="ticker-wrap h-8 flex items-center overflow-hidden bg-primary/90">
          <div className="ticker-move flex gap-16 text-primary-foreground/90 text-xs font-devanagari">
            {[
              "🕉️ ॐ नमः शिवाय",
              "🌸 जय श्री राम",
              "🪔 हरे कृष्ण हरे कृष्ण",
              "✨ ॐ गं गणपतये नमः",
              "🌺 जय माँ दुर्गा",
              "🔱 ॐ नमः शिवाय",
              "🌸 जय श्री राम",
              "🪔 हरे कृष्ण हरे कृष्ण",
              "✨ ॐ गं गणपतये नमः",
              "🌺 जय माँ दुर्गा",
            ].map((item, i) => (
              <span key={i} className="whitespace-nowrap">{item}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-md shadow-card">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
                style={{ background: "var(--gradient-saffron)" }}>
                <span className="text-xl font-bold text-primary-foreground">ॐ</span>
              </div>
              <div className="hidden sm:block">
                <div className="text-lg font-devanagari-serif font-bold text-primary leading-tight">
                  {t("appName")}
                </div>
                <div className="text-xs text-muted-foreground leading-tight hidden md:block">
                  {language === "en" ? "Divya Jyoti" : "Divya Jyoti"}
                </div>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.slice(0, 5).map((item) => (
                <Link
                  key={item.key}
                  to={item.href}
                  className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-devanagari transition-colors ${
                    isActive(item.href)
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground/80 hover:bg-muted hover:text-primary"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{t(item.key)}</span>
                </Link>
              ))}
              {/* More dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-devanagari text-foreground/80 hover:bg-muted hover:text-primary transition-colors">
                    <span>और ▸</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {navItems.slice(5).map((item) => (
                    <DropdownMenuItem key={item.key} asChild>
                      <Link to={item.href} className="flex items-center gap-2 font-devanagari">
                        <span>{item.icon}</span>
                        <span>{t(item.key)}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 px-2 py-1.5 rounded-md border border-border text-xs font-medium hover:bg-muted transition-colors">
                    <span>{currentLang?.nativeLabel}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  {LANGUAGES.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`flex items-center justify-between ${language === lang.code ? "text-primary font-semibold" : ""}`}
                    >
                      <span>{lang.nativeLabel}</span>
                      <span className="text-xs text-muted-foreground">{lang.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Toggle: light → dark → system */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                    aria-label="Toggle theme"
                  >
                    <Sun className="w-4 h-4 hidden dark:block" />
                    <Moon className="w-4 h-4 block dark:hidden" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuItem onClick={() => handleSetTheme("light")} className={`flex items-center gap-2 ${theme === "light" ? "text-primary font-semibold" : ""}`}>
                    <Sun className="w-4 h-4" /> Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSetTheme("dark")} className={`flex items-center gap-2 ${theme === "dark" ? "text-primary font-semibold" : ""}`}>
                    <Moon className="w-4 h-4" /> Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSetTheme("system")} className={`flex items-center gap-2 ${theme === "system" ? "text-primary font-semibold" : ""}`}>
                    <Monitor className="w-4 h-4" /> System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Notifications */}
              <button className="relative p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors hidden sm:flex">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
              </button>

              {/* AI Astrologer CTA */}
              <Link to="/ai-astrologer">
                <Button size="sm" className="hidden sm:flex gap-1.5 text-xs font-devanagari shadow-sacred"
                  style={{ background: "var(--gradient-saffron)" }}>
                  <span>🔮</span>
                  <span>{t("nav_ai")}</span>
                </Button>
              </Link>

              {/* Auth: User menu or Login */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-md border border-border hover:bg-muted transition-colors">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground"
                        style={{ background: "var(--gradient-saffron)" }}>
                        {(profile?.display_name ?? user.email ?? "U")[0].toUpperCase()}
                      </div>
                      <ChevronDown className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-3 py-2 border-b border-border">
                      <p className="text-xs font-semibold font-devanagari text-foreground truncate">
                        {profile?.display_name ?? user.email?.split("@")[0]}
                      </p>
                      <p className="text-xs text-muted-foreground font-devanagari flex items-center gap-1 mt-0.5">
                        <Zap className="w-3 h-3 text-secondary" />
                        {profile?.ai_credits ?? 0} {language === "hi" ? "क्रेडिट" : "credits"}
                      </p>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center gap-2 font-devanagari cursor-pointer">
                        <UserCircle className="w-4 h-4" />
                        {language === "hi" ? "मेरी प्रोफ़ाइल" : "My Profile"}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => { signOut(); navigate("/"); }}
                      className="flex items-center gap-2 font-devanagari text-destructive cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      {language === "hi" ? "लॉगआउट" : "Logout"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/login">
                  <button className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors">
                    <User className="w-4 h-4" />
                  </button>
                </Link>
              )}

              {/* Mobile hamburger */}
              <button
                className="lg:hidden p-2 rounded-md text-foreground hover:bg-muted transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {searchOpen && (
            <div className="pb-3 animate-fade-in">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      const q = searchQuery.trim().toLowerCase();
                      const searchRoutes = [
                        { keywords: ["panchang", "पंचांग", "tithi", "तिथि", "nakshatra", "नक्षत्र"], href: "/panchang" },
                        { keywords: ["horoscope", "rashifal", "राशिफल", "rashi", "राशि"], href: "/horoscope" },
                        { keywords: ["kundali", "कुंडली", "birth chart", "janam"], href: "/kundali" },
                        { keywords: ["matching", "मिलान", "compatibility", "gun milan"], href: "/kundali-matching" },
                        { keywords: ["festival", "त्यौहार", "tyohar", "diwali", "holi", "navratri"], href: "/festivals" },
                        { keywords: ["temple", "मंदिर", "mandir", "tirth"], href: "/temples" },
                        { keywords: ["bhajan", "भजन", "chalisa", "चालीसा", "aarti", "आरती"], href: "/bhajans" },
                        { keywords: ["article", "लेख", "vastu", "वास्तु", "gemstone", "रत्न"], href: "/articles" },
                        { keywords: ["vrat", "व्रत", "fast", "upvas", "उपवास"], href: "/vrat" },
                        { keywords: ["ai", "astrologer", "ज्योतिषी", "question", "प्रश्न"], href: "/ai-astrologer" },
                        { keywords: ["subscribe", "सदस्यता", "premium", "प्रीमियम"], href: "/subscribe" },
                      ];
                      const match = searchRoutes.find(r => r.keywords.some(k => q.includes(k)));
                      navigate(match?.href ?? "/horoscope");
                      setSearchQuery("");
                      setSearchOpen(false);
                    }
                  }}
                  placeholder={t("search_placeholder")}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-muted/50 text-sm font-devanagari focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                />
              </div>
            </div>
          )}
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-background animate-fade-in">
            <div className="container mx-auto px-4 py-3 grid grid-cols-2 gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-devanagari transition-colors ${
                    isActive(item.href)
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground/80 hover:bg-muted"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{t(item.key)}</span>
                </Link>
              ))}
              <Link
                to="/ai-astrologer"
                onClick={() => setMobileOpen(false)}
                className="col-span-2 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-devanagari font-semibold text-primary-foreground mt-1"
                style={{ background: "var(--gradient-saffron)" }}
              >
                <span>🔮</span>
                <span>{t("nav_ai")}</span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navigation;
