# Data & Business Logic

## 1. Panchang Calculation

**File**: `src/data/astroData.ts` → `getTodayPanchang()`

### How It Works

```
dayOfYear = current day number (1–365)

tithi     = TITHIS[dayOfYear % 15]       // 15 tithis: Pratipada → Purnima/Amavasya
nakshatra = NAKSHATRAS[dayOfYear % 27]   // 27 nakshatras: Ashwini → Revati
yoga      = YOGAS[dayOfYear % 27]        // 27 yogas: Vishkambha → Vaidhriti
paksha    = dayOfYear % 30 <= 15 ? "Shukla" : "Krishna"
```

**Hardcoded values**: Sunrise (6:12 AM), Sunset (6:38 PM), Rahu Kaal (varies by weekday — static lookup).

**Accuracy**: This is a **simplified demonstration** — real Panchang requires astronomical ephemeris data (Sun/Moon longitude, local coordinates, timezone). The rotation-based approach gives plausible-looking but not accurate results.

---

## 2. Kundali (Birth Chart) Calculation

**File**: `src/lib/kundaliCalc.ts`

### Algorithm

```
Input: Date of Birth, Time of Birth, Place of Birth

1. Convert date/time to Julian Day Number (JD)
2. Calculate centuries since J2000.0 epoch (T)
3. Compute mean tropical longitudes for 7 planets + Rahu/Ketu:
   - Sun:     280.46646 + 36000.76983 × T
   - Moon:    218.3165  + 481267.8813 × T
   - Mars:    355.4330  + 19140.2993 × T
   - Mercury: 252.2509  + 149472.6746 × T
   - Jupiter: 34.3515   + 3034.9057 × T
   - Venus:   181.9798  + 58517.8149 × T
   - Saturn:  49.5574   + 1222.1138 × T
   - Rahu:    125.0445  - 1934.1363 × T  (retrograde)
   - Ketu:    Rahu + 180°

4. Apply Lahiri Ayanamsha correction:
   ayanamsha ≈ 23.85 + 0.0137 × (year - 2000)
   sidereal_longitude = tropical - ayanamsha

5. Calculate Ascendant (Lagna):
   - Local Sidereal Time from JD + longitude offset
   - Ascendant = atan2(cos(LST), -(sin(obliquity) × tan(latitude) + cos(obliquity) × sin(LST)))

6. Determine house placement:
   house = ((planet_longitude - ascendant_longitude + 360) % 360) / 30
   → Maps to rashi (Aries=1 through Pisces=12)
```

### Dosha Detection

**Manglik Dosha**: Mars in houses 1, 2, 4, 7, 8, or 12 from Lagna.

**Kaal Sarp Dosha**: All 7 planets (Sun–Saturn) fall between Rahu and Ketu in the zodiac.

### Limitations

- Uses mean orbital elements only (no perturbation corrections)
- Simplified ayanamsha (real Lahiri has more complex precession model)
- Place of Birth is used for display but latitude/longitude are approximated
- No divisional charts (D-9 Navamsha, etc.)

---

## 3. Ashtakoot Kundali Matching

**File**: `src/lib/ashtakootCalc.ts`

### Data Model

Each of 27 nakshatras has attributes:
```typescript
{
  name: string,
  lord: Planet,        // Ruling planet (for Graha Maitri)
  gana: "Dev" | "Manush" | "Rakshas",  // Temperament
  yoni: Animal,        // Animal symbol (14 pairs)
  nadi: "Aadi" | "Madhya" | "Antya",   // Pulse/health
  varna: "Brahmin" | "Kshatriya" | "Vaishya" | "Shudra"
}
```

### 8 Koot Scoring

| # | Koot | Max | Logic |
|---|------|-----|-------|
| 1 | **Varna** | 1 | Boy's varna ≥ Girl's varna in hierarchy → 1 point |
| 2 | **Vashya** | 2 | Based on rashi-pair compatibility matrix |
| 3 | **Tara** | 3 | `(boyNakshatra - girlNakshatra) % 9` → favorable if result in {1,2,4,6,8} |
| 4 | **Yoni** | 4 | Animal pair compatibility: same=4, friendly=3, neutral=2, enemy=1, extreme enemy=0 |
| 5 | **Graha Maitri** | 5 | Planetary friendship between nakshatra lords |
| 6 | **Gana** | 6 | Dev-Dev=6, Dev-Manush=5, Manush-Manush=6, others less |
| 7 | **Bhakoot** | 7 | Moon sign distance: 2/12, 6/8, 5/9 patterns reduce score |
| 8 | **Nadi** | 8 | Same nadi=0 (inauspicious), different=8 |

**Total**: Sum of all 8 scores, maximum 36.

**Interpretation**:
- < 18: Not recommended
- 18–24: Average, proceed with caution
- 24–32: Good match
- 32–36: Excellent match

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

### Credit Packs (Dummy)

Defined in `SUBSCRIPTION_PLANS` in `astroData.ts`. Currently no payment integration — the subscribe page is a placeholder UI.

---

## 5. Daily Horoscope AI Generation & Caching

### Flow

```
User selects rashi in DailyHoroscope component
  → POST to daily-horoscope edge function
    → Query daily_horoscopes WHERE rashi_id = X AND horoscope_date = today
    → If cached: return immediately
    → If not cached:
        → Prompt Gemini 2.5 Flash for Hindi + English horoscope
        → Parse JSON response { content_hi, content_en }
        → Upsert to daily_horoscopes table
        → Return to frontend
```

**Cache Key**: `(rashi_id, horoscope_date)` — unique constraint in DB.
**Cache Duration**: 1 day (new content generated when date changes).
**Fallback**: If AI returns non-JSON, raw text is used for both languages.

---

## 6. Internationalization (i18n)

**File**: `src/contexts/LanguageContext.tsx`

### Supported Languages

| Code | Language | Status |
|------|----------|--------|
| `hi` | Hindi | ✅ Full (default) |
| `en` | English | ✅ Full |
| `ta` | Tamil | 🔲 Stub |
| `te` | Telugu | 🔲 Stub |
| `bn` | Bengali | 🔲 Stub |
| `mr` | Marathi | 🔲 Stub |

### Usage Patterns

**Translation function**:
```tsx
const { t, language } = useLanguage();
<h1>{t("dailyPanchang")}</h1>
```

**Inline conditional** (common in content-heavy pages):
```tsx
{language === "hi" ? "आज का राशिफल" : "Today's Horoscope"}
```

### Translation Keys

The `translations` object in `LanguageContext.tsx` maps keys like `home`, `panchang`, `horoscope`, `festivals`, etc. to their translations. Navigation labels, section titles, and UI chrome use `t()`. Long-form content typically uses the inline conditional pattern.

---

## 7. Static Data Structure

**File**: `src/data/astroData.ts`

| Export | Type | Count | Usage |
|--------|------|-------|-------|
| `RASHIS` | Array of rashi objects | 12 | Horoscope grid, rashi selection |
| `UPCOMING_FESTIVALS` | Array of festival objects | ~20 | Festival list/detail pages |
| `BHAJANS` | Array of bhajan objects | 6 | Bhajan page |
| `SUBSCRIPTION_PLANS` | Array of plan objects | 3 | Subscribe page |
| `getTodayPanchang()` | Function → Panchang object | — | Panchang page, homepage card |

Additional static data (temples, articles, vrat) is hardcoded directly within their respective page components rather than centralized in `astroData.ts`.
