

# Production-Ready Migration Plan — Divya Jyoti

This is a large-scale migration from a prototype with hardcoded data to a fully dynamic, admin-managed, production-ready Hindu spiritual platform. The plan is organized into 9 phases with clear dependencies.

---

## Current State Summary

**Already dynamic:** Auth, profiles, AI astrologer (edge function + streaming + credits), daily horoscope cache (edge function + DB), saved kundalis, bookmarked bhajans, theme persistence.

**Still hardcoded (must migrate):**
- `RASHIS` array — zodiac metadata + hardcoded daily text (todayHi/todayEn)
- `UPCOMING_FESTIVALS` — 20 festivals with hardcoded 2025-2026 dates
- `BHAJANS` — 6 bhajans with fake play counts
- `SUBSCRIPTION_PLANS` — 4 plans with dummy payment
- `getTodayPanchang()` — modulo rotation of static arrays, hardcoded sunrise/sunset
- `ARTICLES` — 8 articles hardcoded in page component
- `TEMPLES` — 9 temples hardcoded in page component
- `VRATS` — 8 vrats hardcoded in page component
- Homepage "Today's Vrat" section — hardcoded Ekadashi/Shiva text
- Homepage "Thought of the Day" — hardcoded Gita quote
- Contact form — simulates sending, stores nothing

**Truly static (keep as-is):** About, Privacy, Terms, Ads Policy, Support pages. RASHIS zodiac metadata (symbol, element, lord, color, luckyNum, description) is timeless and can remain static.

---

## Phase 0: Foundation — DB Schema & Migrations

Create all new tables in a single migration batch. This unblocks all subsequent phases.

### New Tables (13 total)

1. **user_roles** — `user_id uuid PK → auth.users, role app_role enum (super_admin, editor, support), created_at, created_by`
2. **panchang_cache** — date + location_key composite unique, bilingual tithi/nakshatra/yoga/karana/paksha, sunrise/sunset/rahu_kaal, source_provider, extra_data jsonb, fetched_at, expires_at
3. **festivals** — slug unique, bilingual name/excerpt/description/significance, festival_date, end_date, category, emoji, color, image_url, is_featured, sort_order, status (draft/published/archived), SEO fields, audit fields
4. **articles** — slug unique, bilingual title/excerpt/content, category, tags text[], author_name, featured_image_url, is_featured, status, published_at, SEO fields, audit fields
5. **temples** — slug unique, bilingual name/short_description/description/deity/address/timings, city, state, country, lat/lng, website_url, image_url, emoji, type, is_featured, sort_order, status, SEO fields, audit fields
6. **bhajans** — slug unique, bilingual title/deity/short_description/lyrics, audio_url, image_url, duration_seconds, play_count, is_featured, sort_order, status, SEO fields, audit fields
7. **vrats** — slug unique, bilingual name/deity/description/rules/benefits, tithi_rule, nakshatra_rule, fasting_day, image_url, is_featured, sort_order, status, SEO fields, audit fields
8. **vrat_occurrences** — vrat_id FK → vrats, occurrence_date, source_type (computed/manual), notes, unique(vrat_id, occurrence_date)
9. **subscription_plans** — code unique, name, description, price_inr, credit_amount, billing_type (one_time/monthly/yearly), is_active, is_featured, sort_order, purchase_enabled boolean default false, audit fields
10. **subscriptions** — user_id FK → auth.users, plan_id FK → subscription_plans, status (pending/active/expired/cancelled/failed), started_at, expires_at, provider, provider_payment_id, provider_order_id, metadata jsonb, audit fields
11. **payment_events** — provider, event_type, provider_event_id, subscription_id FK, user_id FK, payload jsonb, processed boolean, created_at
12. **contact_submissions** — name, email, phone, subject, message, status (new/in_progress/resolved/spam), admin_notes, handled_by, audit fields
13. **site_settings** — key text PK, value jsonb, updated_at, updated_by

### RLS Policies

- **Public read** (published only): festivals, articles, temples, bhajans, vrats, vrat_occurrences, subscription_plans, panchang_cache, site_settings
- **Admin write** (via `has_role()` security definer function): all content tables
- **User-only**: subscriptions (own rows), contact_submissions (insert only for public)
- **Service role only**: payment_events, panchang_cache writes

### Role System

Create `app_role` enum and `user_roles` table per the project's security guidelines, with `has_role()` security definer function to avoid recursive RLS.

### Seed Data

Write seed migration scripts to import existing static arrays into new tables:
- 20 festivals from `UPCOMING_FESTIVALS`
- 8 articles from `ARTICLES`
- 9 temples from `TEMPLES`
- 6 bhajans from `BHAJANS`
- 8 vrats from `VRATS`
- 4 subscription plans from `SUBSCRIPTION_PLANS`

---

## Phase 1: Quick Wins — Horoscope Detail + Panchang

### 1.1 Horoscope Detail Page (dynamic)

- Update `/horoscope/:rashiId` to fetch from `daily_horoscopes` table (same logic as `DailyHoroscope` component)
- Keep RASHIS metadata (symbol, lord, element, color) as static — it's timeless
- Remove `todayHi`/`todayEn` from RASHIS interface usage on detail page
- Fallback: if no DB row for today, show "horoscope not yet generated" with link to check back later
- Add React Query hook `useDailyHoroscope(rashiId)` reusable across homepage widget and detail page

### 1.2 Panchang Edge Function

- Create `supabase/functions/panchang/index.ts`
- Input: date, optional lat/lng/city (default: New Delhi)
- Use Lovable AI (Gemini 2.5 Flash) to generate accurate Panchang data for the given date and location
- Cache in `panchang_cache` table keyed by date + location_key
- Return bilingual tithi, nakshatra, yoga, karana, paksha, sunrise, sunset, rahu kaal, shubh muhurat
- Add `verify_jwt = false` to config.toml for this function

### 1.3 Panchang Frontend

- Create `usePanchang(date, locationKey)` React Query hook
- Update `PanchangCard` and `PanchangPage` to use the hook instead of `getTodayPanchang()`
- Add loading skeleton and error states
- Default location: New Delhi (can be extended later with geolocation)

---

## Phase 2: Dynamic Content Pages

### 2.1 Festivals

- Create `useFestivals()` and `useFestival(slug)` hooks querying the `festivals` table
- Compute `daysLeft` client-side from `festival_date`
- Update `FestivalsPage`, `FestivalDetailPage`, `FestivalsSection` (homepage) to use DB data
- Preserve .ics download generation
- Route detail pages by slug: `/festivals/:slug`

### 2.2 Articles CMS

- Create `useArticles()` and `useArticle(slug)` hooks
- Create `ArticleDetailPage` at `/articles/:slug`
- Add category/tag filtering, pagination, featured articles
- Render markdown content safely (use a simple markdown renderer or sanitized HTML)
- Only show `status = 'published'` articles publicly

### 2.3 Temples

- Create `useTemples()` and `useTemple(slug)` hooks
- Create `TempleDetailPage` at `/temples/:slug`
- Add Google Maps link from lat/lng coordinates
- Search/filter by state, deity, type from DB

### 2.4 Bhajans

- Create `useBhajans()` hook querying DB
- Update `BhajansPage` and `BhajansSection` to use DB data
- Preserve `bookmarked_bhajans` integration (bhajan_id now references DB bhajans by slug or id)
- Audio player architecture ready but no fake media — show "coming soon" for items without audio_url

### 2.5 Vrats

- Create `useVrats()` hook
- Update `VratPage` to use DB data
- Show upcoming occurrences from `vrat_occurrences` table
- Support both computed (from tithi_rule) and manually entered dates

### 2.6 Subscription Plans

- Create `useSubscriptionPlans()` hook
- Update `SubscribePage` and `SubscriptionSection` to read from DB
- Disable purchase button when `purchase_enabled = false` — show "Coming Soon" state
- Remove fake payment simulation
- Architecture ready for Razorpay: `subscriptions` and `payment_events` tables exist

---

## Phase 3: Contact Form + Homepage Cleanup

### 3.1 Contact Form

- Store submissions in `contact_submissions` table
- Add client-side validation (zod schema)
- Rate limit: simple cooldown in component state (1 submission per 60 seconds)
- Show real success/error feedback
- Remove simulated delay

### 3.2 Homepage Cleanup

- "Thought of the Day" → fetch from `site_settings` table (key: `daily_quote`) or keep as curated static if admin prefers
- "Today's Vrat" → derive from `vrat_occurrences` for today's date or from panchang data
- Remove hardcoded Ekadashi/Shiva vrat text
- All homepage sections now use their respective dynamic hooks

---

## Phase 4: Admin Panel

### 4.1 Admin Auth & Routing

- Add `/admin/*` route group in App.tsx
- Create `AdminLayout` component with sidebar navigation
- Create `AdminGuard` component that checks `has_role(auth.uid(), 'super_admin')` or `'editor'`
- Redirect non-admins to homepage
- Add `<meta name="robots" content="noindex">` to admin pages

### 4.2 Admin Dashboard

- Overview page with content counts (festivals, articles, temples, bhajans, vrats, contact submissions)
- Quick links to each management section

### 4.3 Admin CRUD Modules

For each content type (festivals, articles, temples, bhajans, vrats, subscription_plans, contact_submissions):
- **List view**: paginated table with search, filter by status, sort
- **Create/Edit form**: validated with zod, bilingual fields, image URL input, status toggle (draft/published), featured toggle
- **Delete/Archive**: confirmation dialog, soft archive via status change
- **Contact submissions**: status management (new → in_progress → resolved/spam), admin_notes field

### 4.4 Admin for Panchang & Site Settings

- Panchang cache viewer: see cached entries, trigger manual refresh for a date
- Site settings editor: key-value pairs like `daily_quote`, announcement banners

---

## Phase 5: Hooks, Services & UI Polish

### New Hooks (all using React Query)

- `useDailyHoroscope(rashiId)` — shared between homepage widget and detail page
- `usePanchang(date, locationKey)`
- `useFestivals(filters)`, `useFestival(slug)`
- `useArticles(filters)`, `useArticle(slug)`
- `useTemples(filters)`, `useTemple(slug)`
- `useBhajans(filters)`
- `useVrats()`
- `useSubscriptionPlans()`
- `useContactSubmit()`
- `useAdminContent(table, filters)` — generic admin list hook

### UI States

Every data-fetching page gets:
- Loading skeletons matching card layout
- Empty state with illustration
- Error state with retry button
- Pagination for lists > 20 items

### New Routes

```
/articles/:slug          → ArticleDetailPage
/temples/:slug           → TempleDetailPage
/admin                   → AdminDashboard
/admin/festivals         → AdminFestivalsList
/admin/festivals/new     → AdminFestivalForm
/admin/festivals/:id     → AdminFestivalForm (edit)
/admin/articles          → AdminArticlesList
/admin/articles/new      → AdminArticleForm
/admin/articles/:id      → AdminArticleForm (edit)
/admin/temples           → AdminTemplesList
/admin/temples/new       → AdminTempleForm
/admin/temples/:id       → AdminTempleForm (edit)
/admin/bhajans           → AdminBhajansList
/admin/bhajans/new       → AdminBhajanForm
/admin/bhajans/:id       → AdminBhajanForm (edit)
/admin/vrats             → AdminVratsList
/admin/vrats/new         → AdminVratForm
/admin/vrats/:id         → AdminVratForm (edit)
/admin/plans             → AdminPlansList
/admin/contacts          → AdminContactsList
/admin/settings          → AdminSettings
/admin/panchang          → AdminPanchangCache
```

---

## Phase 6: Cleanup & Decommission

- Remove `todayHi`/`todayEn` from RASHIS (keep metadata only)
- Remove `UPCOMING_FESTIVALS` from astroData.ts
- Remove `BHAJANS` from astroData.ts
- Remove `SUBSCRIPTION_PLANS` from astroData.ts
- Remove `getTodayPanchang()` from astroData.ts
- Remove hardcoded `ARTICLES` from ArticlesPage.tsx
- Remove hardcoded `TEMPLES` from TemplesPage.tsx
- Remove hardcoded `VRATS` from VratPage.tsx
- Keep `RASHIS` metadata (without daily text) and `PanchangData` interface
- Keep `kundaliCalc.ts` and `ashtakootCalc.ts` (client-side computation, not changing)

---

## Phase 7: Production Readiness

- Add error boundaries around major page sections
- Validate all forms with zod
- Ensure mobile responsiveness on all new pages
- Add SEO `<title>` and `<meta description>` for article/temple/festival detail pages using react-helmet or document.title
- Sanitize admin-entered content before rendering (DOMPurify for any HTML)
- Verify React Query caching and staleTime settings for performance
- Confirm all RLS policies match actual access patterns

---

## Technical Details

### Migration Strategy

All 13 tables created in a single migration file with proper constraints, defaults, and RLS policies. Seed data inserted via a separate migration. The `user_roles` table follows the project's security guidelines with `has_role()` security definer function.

### Edge Function: panchang

Uses Lovable AI gateway to generate Panchang data based on astronomical parameters for the given date and location. Results cached in `panchang_cache` with daily expiry. Falls back gracefully if AI is unavailable.

### Admin Architecture

- Single `AdminLayout` wrapper with sidebar nav
- Generic `AdminDataTable` component for list views
- Generic `AdminForm` component for create/edit with bilingual field support
- All admin mutations use React Query's `useMutation` with optimistic updates and toast feedback

### Subscription/Payment Architecture

Tables (`subscription_plans`, `subscriptions`, `payment_events`) are created now. Purchase flow disabled via `purchase_enabled = false`. When Razorpay is ready:
1. Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` as secrets
2. Create `razorpay-webhook` edge function
3. Set `purchase_enabled = true` on plans
4. Frontend checkout code already structured to call the payment edge function

### File Count Estimate

- ~5 migration files
- ~1 new edge function (panchang)
- ~12 new hooks
- ~15 new admin pages/components
- ~3 new public detail pages
- ~5 updated existing pages
- ~5 updated existing components

This is a large implementation that will be executed incrementally across multiple messages, starting with the database foundation.

