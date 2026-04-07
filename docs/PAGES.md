# Pages Documentation

Each page uses `Navigation` (top navbar with search, dark mode toggle) and `SiteFooter` (global footer). Language is controlled via `useLanguage()` hook. All content pages are fully dynamic and database-driven.

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
**Components**: Navigation, HeroSection, PersonalizedDashboard (logged-in), DailyHoroscope, HoroscopeGrid, AIDivider, FestivalsSection, BhajansSection, SubscriptionSection, SiteFooter
**Data Sources**:
- `PersonalizedDashboard` — 🟢 Rashi horoscope, city Panchang, upcoming vrats (from `profiles` preferences)
- `DailyHoroscope` — 🟢 AI-generated horoscope from `daily_horoscopes` table via edge function
- `HoroscopeGrid` — 🟢 Rashi metadata from `RASHIS` + dynamic horoscope on click
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

---

### Horoscope List — `/horoscope`
**File**: `src/pages/HoroscopePage.tsx`
**Type**: 🟢 Dynamic
**Data**: `RASHIS` array provides timeless zodiac metadata. Daily predictions fetched from `daily_horoscopes` DB table.

### Horoscope Detail — `/horoscope/:rashiId`
**File**: `src/pages/HoroscopePage.tsx`
**Type**: 🟢 Dynamic
**Hook**: `useDailyHoroscope(rashiId)`

---

### AI Astrologer — `/ai-astrologer`
**File**: `src/pages/AstrologerPage.tsx`
**Type**: 🟢 Dynamic
**Auth**: Required (redirects to login)
**Features**: Streaming AI chat, conversation history, credit management, context-enriched with birth details

---

### Kundali — `/kundali`
**File**: `src/pages/KundaliPage.tsx`
**Type**: 🟢 Dynamic (client-side computed)
**Visualization**: `NorthIndianChart.tsx` renders traditional diamond-style chart as SVG
**Persistence**: Logged-in users can save to `saved_kundalis` table

### Kundali Matching — `/kundali-matching`
**File**: `src/pages/KundaliMatchingPage.tsx`
**Type**: 🟢 Dynamic (client-side computed)

---

### Festivals — `/festivals`
**File**: `src/pages/FestivalsPage.tsx`
**Type**: 🟢 Dynamic
**Hook**: `useFestivals()`
**Features**: Search, category filter, `daysLeft` computed client-side, .ics download

### Festival Detail — `/festivals/:slug`
**File**: `src/pages/FestivalDetailPage.tsx`
**Type**: 🟢 Dynamic
**Hook**: `useFestival(slug)`
**Features**: DOMPurify sanitization, SEO meta + JSON-LD (Event schema), reminder button, .ics download, related content
**SEO**: Dynamic title, meta description, JSON-LD structured data

---

### Temples — `/temples`
**File**: `src/pages/TemplesPage.tsx`
**Type**: 🟢 Dynamic
**Hook**: `useTemples()`
**Features**: Search, state/deity/type filters

### Temple Detail — `/temples/:slug`
**File**: `src/pages/TempleDetailPage.tsx`
**Type**: 🟢 Dynamic
**Features**: Interactive Leaflet/OpenStreetMap (`TempleMap.tsx`), breadcrumbs, share button, DOMPurify, SEO + JSON-LD (HinduTemple schema)

---

### Bhajans — `/bhajans`
**File**: `src/pages/BhajansPage.tsx`
**Type**: 🟢 Dynamic
**Hook**: `useBhajans()`
**Features**: Category filter, bookmark toggle, play count, audio player with queue (`BhajanPlayer.tsx`)

---

### Articles — `/articles`
**File**: `src/pages/ArticlesPage.tsx`
**Type**: 🟢 Dynamic
**Hook**: `useArticles()`
**Features**: Category/tag filtering, featured articles

### Article Detail — `/articles/:slug`
**File**: `src/pages/ArticleDetailPage.tsx`
**Type**: 🟢 Dynamic
**Features**: Breadcrumbs, share button (Web Share API), related content, DOMPurify, SEO + JSON-LD (Article schema)

---

### Vrat & Upvas — `/vrat`
**File**: `src/pages/VratPage.tsx`
**Type**: 🟢 Dynamic
**Hook**: `useVrats()`
**Data**: Queries `vrats` + `vrat_occurrences` for upcoming dates

### Vrat Detail — `/vrat/:slug`
**File**: `src/pages/VratDetailPage.tsx`
**Type**: 🟢 Dynamic
**Features**: Description, rules, benefits sections, upcoming occurrence dates with per-date reminder buttons, related content, SEO + JSON-LD

---

### Subscribe — `/subscribe`
**File**: `src/pages/SubscribePage.tsx`
**Type**: 🔧 Future-Ready
**Hook**: `useSubscriptionPlans()`
**Status**: Plans display from DB. Purchase buttons show "Coming Soon" when `purchase_enabled = false`.

---

### Contact — `/contact`
**File**: `src/pages/ContactPage.tsx`
**Type**: 🟢 Dynamic
**Hook**: `useContactSubmit()`
**Features**: Client-side validation, rate limiting, submissions saved to `contact_submissions`

---

### Profile — `/profile`
**File**: `src/pages/ProfilePage.tsx`
**Type**: 🟢 Dynamic
**Auth**: Required
**Tabs**:
- **Profile**: Personal info, rashi, preferred city/deity, edit mode
- **Kundalis**: Saved birth charts with delete
- **Bhajans**: Bookmarked bhajans with remove
- **Credits**: AI credit balance, purchase packs, transaction history
- **Reminders**: Upcoming reminders with festival/vrat names, links to detail pages, cancel option, count badge on tab

---

### Login — `/login`
**File**: `src/pages/LoginPage.tsx`
**Type**: 🟢 Dynamic

### Register — `/register`
**File**: `src/pages/RegisterPage.tsx`
**Type**: 🟢 Dynamic (email verification required)

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
| `/admin/articles/new` | `AdminArticleForm.tsx` | Create article (with AI assistant, quality bar, auto-slug) |
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

### Admin Intelligence Features

Available in article forms (extensible to other content types):
- **AI Editor Assistant**: Sidebar panel with translate, summarize, expand, SEO generate actions
- **Auto Slug**: Generates URL-safe slug from English title on blur
- **Content Quality Bar**: Real-time completeness scoring with missing field alerts
- **Bulk Translate**: Button on list pages to batch-translate all records missing translations

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
