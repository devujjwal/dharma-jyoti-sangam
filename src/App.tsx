import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
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
import ArticleDetailPage from "./pages/ArticleDetailPage.tsx";
import TempleDetailPage from "./pages/TempleDetailPage.tsx";

// Admin (lazy loaded)
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminFestivalsList = lazy(() => import("./pages/admin/AdminFestivalsList"));
const AdminFestivalForm = lazy(() => import("./pages/admin/AdminFestivalForm"));
const AdminArticlesList = lazy(() => import("./pages/admin/AdminArticlesList"));
const AdminArticleForm = lazy(() => import("./pages/admin/AdminArticleForm"));
const AdminTemplesList = lazy(() => import("./pages/admin/AdminTemplesList"));
const AdminTempleForm = lazy(() => import("./pages/admin/AdminTempleForm"));
const AdminBhajansList = lazy(() => import("./pages/admin/AdminBhajansList"));
const AdminBhajanForm = lazy(() => import("./pages/admin/AdminBhajanForm"));
const AdminVratsList = lazy(() => import("./pages/admin/AdminVratsList"));
const AdminVratForm = lazy(() => import("./pages/admin/AdminVratForm"));
const AdminPlansList = lazy(() => import("./pages/admin/AdminPlansList"));
const AdminPlanForm = lazy(() => import("./pages/admin/AdminPlanForm"));
const AdminContactsList = lazy(() => import("./pages/admin/AdminContactsList"));
const AdminPanchangCache = lazy(() => import("./pages/admin/AdminPanchangCache"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));

const queryClient = new QueryClient();

const Loading = () => <div className="p-8"><Skeleton className="h-96 w-full" /></div>;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<Loading />}>
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
                  <Route path="/temples/:slug" element={<TempleDetailPage />} />
                  <Route path="/bhajans" element={<BhajansPage />} />
                  <Route path="/articles" element={<ArticlesPage />} />
                  <Route path="/articles/:slug" element={<ArticleDetailPage />} />
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

                  {/* Admin routes */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="festivals" element={<AdminFestivalsList />} />
                    <Route path="festivals/new" element={<AdminFestivalForm />} />
                    <Route path="festivals/:id" element={<AdminFestivalForm />} />
                    <Route path="articles" element={<AdminArticlesList />} />
                    <Route path="articles/new" element={<AdminArticleForm />} />
                    <Route path="articles/:id" element={<AdminArticleForm />} />
                    <Route path="temples" element={<AdminTemplesList />} />
                    <Route path="temples/new" element={<AdminTempleForm />} />
                    <Route path="temples/:id" element={<AdminTempleForm />} />
                    <Route path="bhajans" element={<AdminBhajansList />} />
                    <Route path="bhajans/new" element={<AdminBhajanForm />} />
                    <Route path="bhajans/:id" element={<AdminBhajanForm />} />
                    <Route path="vrats" element={<AdminVratsList />} />
                    <Route path="vrats/new" element={<AdminVratForm />} />
                    <Route path="vrats/:id" element={<AdminVratForm />} />
                    <Route path="plans" element={<AdminPlansList />} />
                    <Route path="plans/new" element={<AdminPlanForm />} />
                    <Route path="plans/:id" element={<AdminPlanForm />} />
                    <Route path="contacts" element={<AdminContactsList />} />
                    <Route path="panchang" element={<AdminPanchangCache />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>

                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
