

# Plan: Add Comprehensive Project Documentation to Codebase

## What will be created

A `docs/` directory in the project root with a structured documentation set covering the entire Divya Jyoti application.

---

## Files to Create

### 1. `docs/README.md` — Master Index
Links to all sub-documents. Brief project overview (Divya Jyoti — Hindi spiritual/astrology platform built with React + Vite + Tailwind + Lovable Cloud).

### 2. `docs/ARCHITECTURE.md` — Technical Architecture
- **Tech stack**: React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, Lovable Cloud (Supabase), next-themes
- **Project structure**: pages/, components/, contexts/, data/, lib/, integrations/
- **Providers hierarchy**: QueryClientProvider → ThemeProvider → LanguageProvider → AuthProvider → TooltipProvider → BrowserRouter
- **Authentication flow**: Email/password via Supabase Auth, profile auto-created via trigger, session managed in AuthContext
- **Edge Functions**: `daily-horoscope` (AI-generated, cached in DB), `ai-astrologer` (streaming chat with credit system)
- **Database tables**: profiles, daily_horoscopes, chat_messages, saved_kundalis, bookmarked_bhajans, credit_transactions — with RLS policies summary

### 3. `docs/PAGES.md` — Page-by-Page Documentation
For each route, document:
- URL path, source file
- Data source (static/dynamic), logic explanation
- Dynamic vs static classification
- Future dynamification potential

**Page inventory with static/dynamic classification:**

| Page | Route | Data Source | Type |
|------|-------|-------------|------|
| Homepage | `/` | Static data + DB (DailyHoroscope) | Mixed |
| Panchang | `/panchang` | `getTodayPanchang()` — pseudo-dynamic (date-based modulo rotation of static arrays) | **Static** (can be dynamic via API) |
| Horoscope List | `/horoscope` | `RASHIS` array in astroData.ts | **Static** |
| Horoscope Detail | `/horoscope/:rashiId` | `RASHIS[].todayHi/todayEn` — hardcoded text | **Static** (can use daily_horoscopes DB) |
| AI Astrologer | `/ai-astrologer` | Edge function + Gemini 2.5 Flash, streamed SSE, chat persisted in `chat_messages` | **Dynamic** |
| Kundali | `/kundali` | Client-side calculation (`kundaliCalc.ts` — simplified Lahiri ayanamsha), saved to `saved_kundalis` | **Dynamic** (computed) |
| Kundali Matching | `/kundali-matching` | Client-side Ashtakoot calc (`ashtakootCalc.ts` — 8 koot, 36 points) | **Dynamic** (computed) |
| Daily Horoscope (component) | Homepage widget | Edge function → AI-generated, cached in `daily_horoscopes` table by rashi+date | **Dynamic** |
| Festivals List | `/festivals` | `UPCOMING_FESTIVALS` array (20 festivals, hardcoded 2025-2026 dates) | **Static** |
| Festival Detail | `/festivals/:festivalId` | Same static array lookup, .ics download generation | **Static** |
| Temples | `/temples` | Hardcoded `TEMPLES` array (9 temples), client-side search/filter | **Static** |
| Bhajans | `/bhajans` | `BHAJANS` array (6 items) + `bookmarked_bhajans` DB table for user bookmarks | **Mixed** |
| Articles | `/articles` | Hardcoded array in page component | **Static** |
| Vrat | `/vrat` | Hardcoded array in page component | **Static** |
| Subscribe | `/subscribe` | `SUBSCRIPTION_PLANS` from astroData.ts, dummy payment flow | **Static** (dummy) |
| Profile | `/profile` | DB queries: profiles, saved_kundalis, bookmarked_bhajans, credit_transactions | **Dynamic** |
| Login/Register | `/login`, `/register` | Supabase Auth | **Dynamic** |
| About/Privacy/Terms/Ads/Contact/Support | Static content pages | Hardcoded text | **Static** |

### 4. `docs/DATA-LOGIC.md` — Data & Business Logic
- **Panchang calculation**: `getTodayPanchang()` uses `day % length` to rotate through tithi (15), nakshatra (27), yoga (27) arrays. Sunrise/sunset/Rahu Kaal are hardcoded. Paksha determined by day ≤ 15. Not astronomically accurate.
- **Kundali calculation**: `kundaliCalc.ts` — Julian Day → mean planetary longitudes using simplified orbital elements → Lahiri ayanamsha correction → sidereal positions → house placement relative to ascendant. Includes Manglik and Kaal Sarp dosha detection.
- **Ashtakoot matching**: `ashtakootCalc.ts` — 27 nakshatras with gana/yoni/nadi/varna attributes → 8 koot scores (Varna 1, Vashya 2, Tara 3, Yoni 4, Graha Maitri 5, Gana 6, Bhakoot 7, Nadi 8) → total/36.
- **AI credit system**: Users start with 2 credits. Each AI question deducts 1 (optimistic lock on profile). Credit packs purchasable (dummy flow). Transactions logged in `credit_transactions`.
- **Daily horoscope caching**: Edge function checks `daily_horoscopes` table for today's date+rashi. If miss, calls Gemini 2.5 Flash, parses JSON response, upserts to DB.
- **i18n**: LanguageContext with `translations` map (hi/en primary, ta/te/bn/mr stubs). `t(key)` function. Most pages use inline `language === "hi" ? ... : ...` pattern.

### 5. `docs/DYNAMIC-ROADMAP.md` — What Can Be Made Dynamic
Sections currently static that could be database-driven:
1. **Panchang** — integrate a real Panchang API (e.g., Prokerala, VedicRishi) for accurate tithi/nakshatra/sunrise
2. **Horoscope detail text** — already have `daily_horoscopes` table; wire individual rashi pages to use it instead of hardcoded `todayHi/todayEn`
3. **Festivals** — move to DB table with admin CRUD; auto-calculate `daysLeft`; support year rollover
4. **Temples** — move to DB table; add user reviews, photos, GPS coordinates
5. **Bhajans** — add audio file storage (Supabase Storage); lyrics content; play tracking
6. **Articles** — move to DB with CMS-like admin; categories, tags, author attribution
7. **Vrat calendar** — integrate with Panchang data for date-accurate vrat scheduling
8. **Subscription/Payment** — integrate Razorpay/Stripe for real payments
9. **Contact form** — persist submissions to DB, send email notifications

---

## Implementation

- Create 5 markdown files in `docs/` directory
- All documentation written in English with Hindi terms where relevant (since it's a Hindu spiritual app)
- Include code references (file paths) throughout
- ASCII diagrams for architecture where helpful

