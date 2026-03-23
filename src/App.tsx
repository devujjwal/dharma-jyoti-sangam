import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index.tsx";
import PanchangPage from "./pages/PanchangPage.tsx";
import HoroscopePage from "./pages/HoroscopePage.tsx";
import AstrologerPage from "./pages/AstrologerPage.tsx";
import KundaliPage from "./pages/KundaliPage.tsx";
import KundaliMatchingPage from "./pages/KundaliMatchingPage.tsx";
import FestivalsPage from "./pages/FestivalsPage.tsx";
import FestivalDetailPage from "./pages/FestivalDetailPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import TemplesPage from "./pages/TemplesPage.tsx";
import BhajansPage from "./pages/BhajansPage.tsx";
import ArticlesPage from "./pages/ArticlesPage.tsx";
import VratPage from "./pages/VratPage.tsx";
import SubscribePage from "./pages/SubscribePage.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import PrivacyPage from "./pages/PrivacyPage.tsx";
import TermsPage from "./pages/TermsPage.tsx";
import AdsPolicyPage from "./pages/AdsPolicyPage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import SupportPage from "./pages/SupportPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/panchang" element={<PanchangPage />} />
                <Route path="/horoscope" element={<HoroscopePage />} />
                <Route path="/horoscope/:rashiId" element={<HoroscopePage />} />
                <Route path="/ai-astrologer" element={<AstrologerPage />} />
                <Route path="/kundali" element={<KundaliPage />} />
                <Route path="/kundali-matching" element={<KundaliMatchingPage />} />
                <Route path="/festivals" element={<FestivalsPage />} />
                <Route path="/festivals/:festivalId" element={<FestivalDetailPage />} />
                <Route path="/temples" element={<TemplesPage />} />
                <Route path="/bhajans" element={<BhajansPage />} />
                <Route path="/articles" element={<ArticlesPage />} />
                <Route path="/vrat" element={<VratPage />} />
                <Route path="/subscribe" element={<SubscribePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/ads-policy" element={<AdsPolicyPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
