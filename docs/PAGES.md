# Pages Documentation

Each page uses `Navigation` (top navbar) and `SiteFooter` (global footer). Language is controlled via `useLanguage()` hook.

---

## Static vs Dynamic Legend

- 🟢 **Dynamic** — Data comes from database or is computed at runtime
- 🟡 **Mixed** — Some data is static, some is dynamic
- 🔴 **Static** — Hardcoded data in source files
- ⚪ **Static (Dummy)** — Placeholder flow, not yet functional

---

## Page Inventory

### Homepage — `/`
**File**: `src/pages/Index.tsx`
**Type**: 🟡 Mixed
**Components**: HeroSection, DailyHoroscope, HoroscopeGrid, PanchangCard, FestivalsSection, BhajansSection, SubscriptionSection, SiteFooter
**Data Sources**:
- `DailyHoroscope` — 🟢 Dynamic (edge function + DB cache)
- `HoroscopeGrid` — 🔴 Static (`RASHIS` array from `astroData.ts`)
- `PanchangCard` — 🔴 Static (`getTodayPanchang()` — date-based rotation)
- `FestivalsSection` — 🔴 Static (`UPCOMING_FESTIVALS` array)
- `BhajansSection` — 🔴 Static (`BHAJANS` array)
- `SubscriptionSection` — 🔴 Static (`SUBSCRIPTION_PLANS` array)

---

### Panchang — `/panchang`
**File**: `src/pages/PanchangPage.tsx`
**Type**: 🔴 Static (pseudo-dynamic)
**Data**: `getTodayPanchang()` from `src/data/astroData.ts`
**Logic**: Uses `day % array.length` to cycle through tithi (15 items), nakshatra (27), yoga (27). Sunrise, sunset, and Rahu Kaal are hardcoded strings. Paksha = Shukla if day ≤ 15, else Krishna.
**Note**: Not astronomically accurate — designed as a demonstration. See [DYNAMIC-ROADMAP.md](./DYNAMIC-ROADMAP.md) for real API integration.

---

### Horoscope List — `/horoscope`
**File**: `src/pages/HoroscopePage.tsx`
**Type**: 🔴 Static
**Data**: `RASHIS` array (12 zodiac signs with id, name, symbol, element, ruling planet, date ranges, and hardcoded `todayHi`/`todayEn` predictions)
**UI**: Grid of 12 rashi cards, each linking to `/horoscope/:rashiId`

### Horoscope Detail — `/horoscope/:rashiId`
**File**: `src/pages/HoroscopePage.tsx` (same component, conditional rendering)
**Type**: 🔴 Static
**Data**: Looks up rashi by `rashiId` param from `RASHIS` array, displays `todayHi`/`todayEn`
**Note**: The `daily_horoscopes` DB table already exists with AI-generated content — this page could easily be wired to use it instead.

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
**Credit System**: 2 free credits on signup. Deducted before AI call, refunded on failure.

---

### Kundali — `/kundali`
**File**: `src/pages/KundaliPage.tsx`
**Type**: 🟢 Dynamic (client-side computed)
**Data**: User inputs (name, DOB, TOB, POB) → `kundaliCalc.ts` computes:
- Planetary positions (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu)
- Ascendant (Lagna)
- House placements
- Manglik Dosha detection
- Kaal Sarp Dosha detection
**Persistence**: Logged-in users can save to `saved_kundalis` table
**Visualization**: `NorthIndianChart.tsx` renders a traditional North Indian diamond-style chart as SVG

---

### Kundali Matching — `/kundali-matching`
**File**: `src/pages/KundaliMatchingPage.tsx`
**Type**: 🟢 Dynamic (client-side computed)
**Data**: Two persons' birth details → `ashtakootCalc.ts` computes 8 Koot scores:

| Koot | Max Points | Basis |
|------|-----------|-------|
| Varna | 1 | Caste compatibility |
| Vashya | 2 | Dominance/control |
| Tara | 3 | Birth star compatibility |
| Yoni | 4 | Sexual/physical compatibility |
| Graha Maitri | 5 | Planetary friendship |
| Gana | 6 | Temperament (Dev/Manush/Rakshas) |
| Bhakoot | 7 | Moon sign relationship |
| Nadi | 8 | Health/genetic compatibility |

**Total**: Score out of 36. ≥18 considered acceptable for marriage.

---

### Festivals — `/festivals`
**File**: `src/pages/FestivalsPage.tsx`
**Type**: 🔴 Static
**Data**: `UPCOMING_FESTIVALS` array in `astroData.ts` — ~20 festivals with name, date (2025-2026), description, significance
**Features**: Search/filter, `daysLeft` calculated client-side from hardcoded dates

### Festival Detail — `/festivals/:festivalId`
**File**: `src/pages/FestivalDetailPage.tsx`
**Type**: 🔴 Static
**Data**: Lookup from same `UPCOMING_FESTIVALS` array by `festivalId` param
**Features**: .ics calendar file download generation (client-side)

---

### Temples — `/temples`
**File**: `src/pages/TemplesPage.tsx`
**Type**: 🔴 Static
**Data**: Hardcoded `TEMPLES` array (~9 famous Hindu temples) with name, location, deity, description, image
**Features**: Client-side search and category filter

---

### Bhajans — `/bhajans`
**File**: `src/pages/BhajansPage.tsx`
**Type**: 🟡 Mixed
**Data**:
- Bhajan list: 🔴 Static (`BHAJANS` array — 6 items with title, deity, lyrics snippet)
- Bookmarks: 🟢 Dynamic (`bookmarked_bhajans` DB table, requires auth)
**Features**: Bookmark toggle for logged-in users

---

### Articles — `/articles`
**File**: `src/pages/ArticlesPage.tsx`
**Type**: 🔴 Static
**Data**: Hardcoded array within the page component (title, excerpt, category, author)

---

### Vrat & Upvas — `/vrat`
**File**: `src/pages/VratPage.tsx`
**Type**: 🔴 Static
**Data**: Hardcoded array of vrat/fasting information (name, day, deity, rules, benefits)

---

### Subscribe — `/subscribe`
**File**: `src/pages/SubscribePage.tsx`
**Type**: ⚪ Static (Dummy)
**Data**: `SUBSCRIPTION_PLANS` from `astroData.ts` (3 tiers with pricing)
**Note**: Payment flow is not connected — placeholder UI only

---

### Profile — `/profile`
**File**: `src/pages/ProfilePage.tsx`
**Type**: 🟢 Dynamic
**Auth**: Required
**Data**: Multiple DB queries:
- `profiles` — user info, credits, preferences
- `saved_kundalis` — list of saved birth charts
- `bookmarked_bhajans` — saved bhajans
- `credit_transactions` — usage history
**Features**: Edit profile, view credits, manage saved data

---

### Login — `/login`
**File**: `src/pages/LoginPage.tsx`
**Type**: 🟢 Dynamic
**Auth**: Supabase `signInWithPassword()`

### Register — `/register`
**File**: `src/pages/RegisterPage.tsx`
**Type**: 🟢 Dynamic
**Auth**: Supabase `signUp()` with email verification required

---

### Static Content Pages

| Page | Route | File |
|------|-------|------|
| About | `/about` | `AboutPage.tsx` |
| Privacy Policy | `/privacy` | `PrivacyPage.tsx` |
| Terms of Service | `/terms` | `TermsPage.tsx` |
| Ads Policy | `/ads-policy` | `AdsPolicyPage.tsx` |
| Contact | `/contact` | `ContactPage.tsx` |
| Support | `/support` | `SupportPage.tsx` |

All are 🔴 **Static** — hardcoded content with no database interaction.
