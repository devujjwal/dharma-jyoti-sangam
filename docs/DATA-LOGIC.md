# Data & Business Logic

## 1. Panchang Generation

**Edge Function**: `supabase/functions/panchang/index.ts`
**Hook**: `src/hooks/use-panchang.ts`

### How It Works

```
User visits Panchang page (default: today, Delhi)
  → usePanchang(date, locationKey) hook fires
  → Queries panchang_cache table for (date, location_key)
  → If cached and not expired: return cached data
  → If not cached:
      → POST to panchang edge function
      → Edge function calls Lovable AI (Gemini 2.5 Flash)
      → AI generates bilingual Panchang data for given date/location
      → Result cached in panchang_cache with 24-hour expiry
      → Returns structured data to frontend
```

**Data Fields**: Tithi, Nakshatra, Yoga, Karana, Paksha, Masa (month), Sunrise, Sunset, Moonrise, Rahu Kaal, Shubh Muhurat, Samvat year, Vrat of the day.

**Cache Key**: `(panchang_date, location_key)` — composite unique in DB.

**Personalization**: Logged-in users with `preferred_city` set in their profile automatically get Panchang data for their city.

---

## 2. Kundali (Birth Chart) Calculation

**File**: `src/lib/kundaliCalc.ts`

### Algorithm

```
Input: Date of Birth, Time of Birth, Place of Birth

1. Convert date/time to Julian Day Number (JD)
2. Calculate centuries since J2000.0 epoch (T)
3. Compute mean tropical longitudes for 9 grahas:
   - Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn
   - Rahu (retrograde), Ketu = Rahu + 180°

4. Apply Lahiri Ayanamsha correction:
   ayanamsha ≈ 23.85 + 0.0137 × (year - 2000)
   sidereal_longitude = tropical - ayanamsha

5. Calculate Ascendant (Lagna):
   - Local Sidereal Time from JD + longitude offset
   - Ascendant via trigonometric computation

6. Determine house placement:
   house = ((planet_longitude - ascendant_longitude + 360) % 360) / 30
   → Maps to rashi (Aries=1 through Pisces=12)
```

### Dosha Detection

**Manglik Dosha**: Mars in houses 1, 2, 4, 7, 8, or 12 from Lagna.
**Kaal Sarp Dosha**: All 7 planets (Sun–Saturn) fall between Rahu and Ketu.

### Limitations

- Uses mean orbital elements (no perturbation corrections)
- Simplified Lahiri ayanamsha
- No divisional charts (D-9 Navamsha, etc.)

---

## 3. Ashtakoot Kundali Matching

**File**: `src/lib/ashtakootCalc.ts`

### 8 Koot Scoring

| # | Koot | Max | Logic |
|---|------|-----|-------|
| 1 | Varna | 1 | Caste hierarchy compatibility |
| 2 | Vashya | 2 | Rashi-pair compatibility matrix |
| 3 | Tara | 3 | Birth star modular arithmetic |
| 4 | Yoni | 4 | Animal pair compatibility |
| 5 | Graha Maitri | 5 | Planetary friendship between nakshatra lords |
| 6 | Gana | 6 | Temperament (Dev/Manush/Rakshas) |
| 7 | Bhakoot | 7 | Moon sign distance patterns |
| 8 | Nadi | 8 | Same nadi = 0, different = 8 |

**Total**: Maximum 36. ≥18 considered acceptable.

---

## 4. AI Credit System

### Flow

```
User signs up → profiles.ai_credits = 2 (default)

User asks AI question:
  1. Edge function checks profile.ai_credits > 0
  2. Deducts 1 credit with optimistic lock:
     UPDATE profiles SET ai_credits = ai_credits - 1
     WHERE id = user_id AND ai_credits = current_value
  3. Logs to credit_transactions: { amount: -1, type: "usage" }
  4. Calls AI → streams response
  5. On AI failure → refunds credit back to original value
```

### Credit Packs

Defined in `subscription_plans` database table. Plans have `purchase_enabled` flag — currently `false` for all plans. When Razorpay integration is added:
1. Set `purchase_enabled = true` on desired plans
2. Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` secrets
3. Create `razorpay-webhook` edge function
4. Frontend checkout flow is already structured for this

### Credit Transaction History

Visible on the Profile page → Credits tab. Queries `credit_transactions` table showing purchases and AI usage with timestamps.

---

## 5. Daily Horoscope AI Generation & Caching

### Flow

```
User selects rashi (on homepage widget or horoscope detail page)
  → useDailyHoroscope(rashiId) hook queries daily_horoscopes table
  → If cached for today: return immediately
  → If not cached:
      → POST to daily-horoscope edge function
      → Prompts Gemini 2.5 Flash for Hindi + English horoscope
      → Parses JSON response { content_hi, content_en }
      → Upserts to daily_horoscopes table
      → Returns to frontend
```

**Cache Key**: `(rashi_id, horoscope_date)` — unique constraint.
**Cache Duration**: 1 day (new content on date change).
**Automation**: pg_cron job at 5:00 AM IST pre-generates all 12 rashis daily.

---

## 6. Internationalization (i18n)

**File**: `src/contexts/LanguageContext.tsx`

### Supported Languages

| Code | Language | Status |
|------|----------|--------|
| `hi` | Hindi | ✅ Full (default) |
| `en` | English | ✅ Full |

### Usage Patterns

**Translation function** (for UI labels):
```tsx
const { t, language } = useLanguage();
<h1>{t("dailyPanchang")}</h1>
```

**Bilingual DB content** (for dynamic data):
```tsx
{language === "hi" ? festival.name_hi : festival.name_en}
```

All database content tables store bilingual fields (`*_hi`, `*_en`).

---

## 7. Content Sanitization

**File**: `src/lib/sanitize.ts`

Two sanitization functions using DOMPurify:
- `sanitizeHtml(html)` — Allows safe HTML tags (p, h1-h6, ul, ol, li, a, strong, em, br, img, blockquote, pre, code). Used for article/description content rendering.
- `sanitizeText(text)` — Strips ALL HTML tags. Used for titles, excerpts, plain text fields.

Applied on all detail pages: `ArticleDetailPage`, `TempleDetailPage`, `FestivalDetailPage`, `VratDetailPage`.

---

## 8. Global Search

**Hook**: `src/hooks/use-global-search.ts`
**Component**: `src/components/GlobalSearch.tsx`
**DB Function**: `global_search(search_query, result_limit)`

### How It Works

```
User presses Cmd+K or clicks search icon
  → Opens search dialog
  → Debounced input calls global_search() RPC
  → DB function searches across 5 tables:
      articles, festivals, temples, bhajans, vrats
  → Returns unified results with:
      content_type, title_en, title_hi, slug, emoji, color, excerpt, rank
  → Results ranked by relevance
  → Clicking result navigates to detail page
```

**Search scope**: Published content only (status = 'published').
**Bilingual**: Searches both Hindi and English title fields.

---

## 9. Content Relations

**Hook**: `src/hooks/use-content-relations.ts`
**Component**: `src/components/RelatedContent.tsx`
**Table**: `content_relations`

Allows admins to link content across types (e.g., a festival linked to related articles or vrats). The `RelatedContent` component displays these on detail pages. Relations are bidirectional and sorted by `sort_order`.

---

## 10. Reminders System

**Hook**: `src/hooks/use-reminders.ts`
**Component**: `src/components/ReminderButton.tsx`
**Table**: `reminders`

### How It Works

```
User views a festival or vrat detail page
  → Clicks "Set Reminder" button
  → Creates reminder record: { content_type, content_id, remind_date, user_id }
  → Button toggles to "Cancel" state
  → Reminders visible on Profile → Reminders tab
  → Each reminder shows the actual festival/vrat name (fetched from DB)
  → Links to the detail page for quick navigation
  → Users can cancel reminders from the profile page
```

**RLS**: Users can only manage their own reminders.
**Status**: `pending` (active) or `cancelled`.

---

## 11. Homepage Personalization

**Component**: `src/components/PersonalizedDashboard.tsx`

For logged-in users, the homepage shows:
- **Rashi-specific horoscope** based on `profiles.rashi_id`
- **City-based Panchang** from `profiles.preferred_city`
- **Upcoming vrat dates** from `vrat_occurrences` table
- **Quick actions** for frequently used features

Anonymous users see the standard homepage layout.

---

## 12. SEO & Structured Data

**Hook**: `src/hooks/use-seo.ts`
**File**: `src/lib/jsonLd.ts`

### JSON-LD Schemas

| Content Type | Schema | Key Fields |
|-------------|--------|------------|
| Articles | `Article` | headline, datePublished, author, description |
| Temples | `HinduTemple` | name, address, geo coordinates, description |
| Festivals | `Event` | name, startDate, description, location |
| Vrats | `Event` | name, description |

### XML Sitemap

**Edge Function**: `supabase/functions/sitemap/index.ts`
Dynamically generates sitemap.xml with all published content URLs.

---

## 13. Static Data (Retained)

**File**: `src/data/astroData.ts`

Only timeless zodiac metadata remains static:

| Export | Content |
|--------|---------|
| `RASHIS` | 12 rashis with id, nameHi, nameEn, symbol, element, lord, dateRange, color, luckyNum, description |
| `PanchangData` | TypeScript interface for Panchang shape |

All other data (festivals, bhajans, temples, articles, vrats, subscription plans) is database-driven.

---

## 14. Theme Persistence

User's theme preference (`light`, `dark`, `system`) is:
1. Stored in `profiles.theme` column
2. Applied on login via `AuthContext`
3. Synced to `next-themes` provider
4. Persisted across devices for logged-in users
5. Falls back to `system` (OS preference) for anonymous users

---

## 15. Admin Intelligence

### AI Editor Assistant

**Component**: `src/components/admin/AIEditorAssistant.tsx`
**AI Model**: Gemini 3 Flash via `ai-astrologer` edge function

Actions available in admin forms:
- **Translate**: Auto-fill missing Hindi/English fields from existing content
- **Summarize**: Generate concise excerpts from full descriptions
- **SEO Generate**: Create optimized seo_title and seo_description
- **Expand**: Elaborate on brief content for richer descriptions

### Bulk Translation

**Component**: `src/components/admin/BulkTranslateButton.tsx`
**Edge Function**: `supabase/functions/bulk-translate/index.ts`

Batch-translates all records with missing translations for a given content type. Supports articles, festivals, temples, bhajans, and vrats.

### Content Quality Scoring

**Component**: `src/components/admin/ContentQualityBar.tsx`

Calculates completeness percentage based on:
- Both language fields populated (title, description, excerpt)
- SEO metadata present (seo_title, seo_description)
- Optional fields filled (image, emoji, category)

Displays as a progress bar with color coding: green (≥80%), yellow (50-79%), red (<50%).
