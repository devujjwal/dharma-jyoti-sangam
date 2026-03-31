# Pages Documentation

Each page uses `Navigation` (top navbar with dark mode toggle) and `SiteFooter` (global footer). Language is controlled via `useLanguage()` hook. All content pages are now fully dynamic and database-driven.

---

## Dynamic Status Legend

- 🟢 **Dynamic** — Data comes from database, edge functions, or is computed at runtime
- ⚪ **Static** — Content is hardcoded (legal/informational pages only)
- 🔧 **Future-Ready** — Architecture in place, pending external integration (e.g., payment gateway)

---

## Page Inventory

### Homepage — `/`
**File**: `src/pages/Index.tsx`
**Type**: 🟢 Dynamic
**Components**: Navigation, HeroSection, QuickStats, DailyHoroscope, TodaySection, HoroscopeGrid, AIDivider, FestivalsSection, BhajansSection, SubscriptionSection, SiteFooter
**Data Sources**:
- `DailyHoroscope` — 🟢 AI-generated horoscope from `daily_horoscopes` table via edge function
- `HoroscopeGrid` — 🟢 Rashi metadata from `RASHIS` (timeless zodiac data) + dynamic horoscope on click
- `PanchangCard` — 🟢 AI-generated from `panchang_cache` table via panchang edge function
- `FestivalsSection` — 🟢 Database query via `useFestivals()` hook
- `BhajansSection` — 🟢 Database query via `useBhajans()` hook
- `SubscriptionSection` — 🟢 Database query via `useSubscriptionPlans()` hook

---

### Panchang — `/panchang`
**File**: `src/pages/PanchangPage.tsx`
**Type**: 🟢 Dynamic
**Hook**: `usePanchang(date, locationKey)`
**Data Flow**: Frontend → panchang edge function → AI generates bilingual Panchang → cached in `panchang_cache` table → returned to frontend
**Fields**: Tithi, Nakshatra, Yoga, Karana, Paksha, Masa, Sunrise, Sunset, Moonrise, Rahu Kaal, Shubh Muhurat
**Default Location**: New Delhi (Delhi)

---

### Horoscope List — `/horoscope`
**File**: `src/pages/HoroscopePage.tsx`
**Type**: 🟢 Dynamic
**Data**: `RASHIS` array provides timeless zodiac metadata (id, name, symbol, element, ruling planet, date ranges, description). Daily predictions fetched from `daily_horoscopes` DB table.

### Horoscope Detail — `/horoscope/:rashiId`
**File**: `src/pages/HoroscopePage.tsx`
**Type**: 🟢 Dynamic
**Hook**: `useDailyHoroscope(rashiId)`
**Data**: Queries `daily_horoscopes` for today's AI-generated content. Falls back to "not yet generated" message.

---

### AI Astrologer — `/ai-astrologer`
**File**: `src/pages/AstrologerPage.tsx`
**Type**: 🟢 Dynamic
**Auth**: Required (redirects to login if not authenticated)
**Data Flow**:
1. User types a question
2. Frontend sends `{ messages, birthDetails, language }` to `ai-astrologer` edge function
3. Edge function verifies JWT, checks credits, deducts 1 credit
4. Calls Lovable AI Gateway (Gemini 2.5 Flash) with streaming enabled
5. Streams SSE response back to frontend
6. Messages persisted in `chat_messages` table with `conversation_id`
7. Credits remaining returned in `X-Credits-Remaining` header
**Features**: Conversation history panel, delete conversations, start new conversation, credit display

---

### Kundali — `/kundali`
**File**: `src/pages/KundaliPage.tsx`
**Type**: 🟢 Dynamic (client-side computed)
**Data**: User inputs (name, DOB, TOB, POB) → `kundaliCalc.ts` computes planetary positions, ascendant, house placements, Manglik/Kaal Sarp Dosha
**Persistence**: Logged-in users can save to `saved_kundalis` table
**Visualization**: `NorthIndianChart.tsx` renders a traditional North Indian diamond-style chart as SVG

---

### Kundali Matching — `/kundali-matching`
**File**: `src/pages/KundaliMatchingPage.tsx`
**Type**: 🟢 Dynamic (client-side computed)
**Data**: Two persons' birth details → `ashtakootCalc.ts` computes 8 Koot scores (max 36 points)

---

### Festivals — `/festivals`
**File**: `src/pages/FestivalsPage.tsx`
**Type**: 🟢 Dynamic
**Hook**: `useFestivals()`
**Data**: Queries `festivals` table (status = published, ordered by date)
**Features**: Search, category filter, `daysLeft` computed client-side, .ics download

### Festival Detail — `/festivals/:slug`
**File**: `src/pages/FestivalDetailPage.tsx`
**Type**: 🟢 Dynamic
**Hook**: `useFestivals()` filtered by slug
**Security**: Content sanitized with DOMPurify before rendering
**SEO**: Dynamic title and meta description via `useSeo()` hook

---

### Temples — `/temples`
**File**: `src/pages/TemplesPage.tsx`
**Type**: 🟢 Dynamic
**Hook**: `useTemples()`
**Data**: Queries `temples` table (status = published)
**Features**: Search, state/deity/type filters

### Temple Detail — `/temples/:slug`
**File**: `src/pages/TempleDetailPage.tsx`
**Type**: 🟢 Dynamic
**Security**: Content sanitized with DOMPurify
**SEO**: Dynamic title and meta description

---

### Bhajans — `/bhajans`
**File**: `src/pages/BhajansPage.tsx`
**Type**: 🟢 Dynamic
**Hook**: `useBhajans()`
**Data**: Queries `bhajans` table (status = published, ordered by sort_order)
**Features**: Category filter, bookmark toggle (requires auth via `bookmarked_bhajans` table), play count display

---

### Articles — `/articles`
**File**: `src/pages/ArticlesPage.tsx`
**Type**: 🟢 Dynamic
**Hook**: `useArticles()`
**Data**: Queries `articles` table (status = published)
**Features**: Category/tag filtering, featured articles

### Article Detail — `/articles/:slug`
**File**: `src/pages/ArticleDetailPage.tsx`
**Type**: 🟢 Dynamic
**Security**: Content sanitized with DOMPurify
**SEO**: Dynamic title and meta description

---

### Vrat & Upvas — `/vrat`
**File**: `src/pages/VratPage.tsx`
**Type**: 🟢 Dynamic
**Hook**: `useVrats()`
**Data**: Queries `vrats` table (status = published) + `vrat_occurrences` for upcoming dates

---

### Subscribe — `/subscribe`
**File**: `src/pages/SubscribePage.tsx`
**Type**: 🔧 Future-Ready
**Hook**: `useSubscriptionPlans()`
**Data**: Queries `subscription_plans` table (is_active = true)
**Status**: Plans display from DB. Purchase buttons show "Coming Soon" when `purchase_enabled = false`. Payment tables (`subscriptions`, `payment_events`) exist and are ready for Razorpay integration.

---

### Contact — `/contact`
**File**: `src/pages/ContactPage.tsx`
**Type**: 🟢 Dynamic
**Hook**: `useContactSubmit()`
**Data**: Submissions saved to `contact_submissions` table
**Features**: Client-side validation, rate limiting, success/error feedback

---

### Profile — `/profile`
**File**: `src/pages/ProfilePage.tsx`
**Type**: 🟢 Dynamic
**Auth**: Required
**Data**: Multiple DB queries:
- `profiles` — user info, credits, theme preference
- `saved_kundalis` — list of saved birth charts
- `bookmarked_bhajans` — saved bhajans
- `credit_transactions` — credit usage/purchase history
**Features**: Edit profile, view/manage credits, theme sync across devices

---

### Login — `/login`
**File**: `src/pages/LoginPage.tsx`
**Type**: 🟢 Dynamic
**Auth**: `supabase.auth.signInWithPassword()`

### Register — `/register`
**File**: `src/pages/RegisterPage.tsx`
**Type**: 🟢 Dynamic
**Auth**: `supabase.auth.signUp()` with email verification required

---

### Admin Panel — `/admin/*`
**Auth**: Requires `super_admin` or `editor` role (checked via `AdminGuard`)
**Layout**: `AdminLayout` with sidebar navigation

| Route | File | Purpose |
|-------|------|---------|
| `/admin` | `AdminDashboard.tsx` | Content counts overview |
| `/admin/festivals` | `AdminFestivalsList.tsx` | Manage festivals |
| `/admin/festivals/new` | `AdminFestivalForm.tsx` | Create festival |
| `/admin/festivals/:id` | `AdminFestivalForm.tsx` | Edit festival |
| `/admin/articles` | `AdminArticlesList.tsx` | Manage articles |
| `/admin/articles/new` | `AdminArticleForm.tsx` | Create article |
| `/admin/articles/:id` | `AdminArticleForm.tsx` | Edit article |
| `/admin/temples` | `AdminTemplesList.tsx` | Manage temples |
| `/admin/temples/new` | `AdminTempleForm.tsx` | Create temple |
| `/admin/temples/:id` | `AdminTempleForm.tsx` | Edit temple |
| `/admin/bhajans` | `AdminBhajansList.tsx` | Manage bhajans |
| `/admin/bhajans/new` | `AdminBhajanForm.tsx` | Create bhajan |
| `/admin/bhajans/:id` | `AdminBhajanForm.tsx` | Edit bhajan |
| `/admin/vrats` | `AdminVratsList.tsx` | Manage vrats |
| `/admin/vrats/new` | `AdminVratForm.tsx` | Create vrat |
| `/admin/vrats/:id` | `AdminVratForm.tsx` | Edit vrat |
| `/admin/plans` | `AdminPlansList.tsx` | Manage subscription plans |
| `/admin/plans/new` | `AdminPlanForm.tsx` | Create plan |
| `/admin/plans/:id` | `AdminPlanForm.tsx` | Edit plan |
| `/admin/contacts` | `AdminContactsList.tsx` | Manage contact submissions |
| `/admin/settings` | `AdminSettings.tsx` | Site settings (key-value) |
| `/admin/panchang` | `AdminPanchangCache.tsx` | View/manage panchang cache |

---

### Static Content Pages

| Page | Route | File |
|------|-------|------|
| About | `/about` | `AboutPage.tsx` |
| Privacy Policy | `/privacy` | `PrivacyPage.tsx` |
| Terms of Service | `/terms` | `TermsPage.tsx` |
| Ads Policy | `/ads-policy` | `AdsPolicyPage.tsx` |
| Support | `/support` | `SupportPage.tsx` |

These are ⚪ **Static** — hardcoded legal/informational content with no database interaction.
