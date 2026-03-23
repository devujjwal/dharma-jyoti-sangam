# Architecture

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 + shadcn/ui components |
| State | React Context + TanStack React Query |
| Routing | React Router DOM v6 |
| Backend | Lovable Cloud (Supabase) — Auth, Database, Edge Functions |
| AI | Lovable AI Gateway → Google Gemini 2.5 Flash |
| Theming | next-themes (light/dark/system) |

---

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/              # shadcn/ui primitives (button, card, dialog, etc.)
│   ├── Navigation.tsx   # Top navbar with auth-aware menu
│   ├── HeroSection.tsx  # Homepage hero banner
│   ├── DailyHoroscope.tsx  # AI-powered daily rashifal widget
│   ├── HoroscopeGrid.tsx   # 12-rashi grid
│   ├── PanchangCard.tsx    # Panchang display card
│   ├── NorthIndianChart.tsx # Kundali chart SVG
│   ├── DoshaCards.tsx      # Manglik/Kaal Sarp dosha display
│   ├── FestivalsSection.tsx # Festival list component
│   ├── BhajansSection.tsx   # Bhajan cards
│   ├── SiteFooter.tsx      # Global footer
│   └── ...
├── pages/               # Route-level page components (one per route)
├── contexts/
│   ├── AuthContext.tsx   # User auth state, profile, credits
│   └── LanguageContext.tsx # i18n with t() translation function
├── data/
│   └── astroData.ts     # Static data: RASHIS, FESTIVALS, BHAJANS, TEMPLES, etc.
├── lib/
│   ├── kundaliCalc.ts   # Vedic birth chart calculation engine
│   ├── ashtakootCalc.ts # Kundali matching (8 koot, 36 points)
│   └── utils.ts         # Tailwind cn() utility
├── integrations/
│   └── supabase/
│       ├── client.ts    # Auto-generated Supabase client (DO NOT EDIT)
│       └── types.ts     # Auto-generated DB types (DO NOT EDIT)
├── hooks/
│   ├── use-mobile.tsx   # Responsive breakpoint hook
│   └── use-toast.ts     # Toast notification hook
└── index.css            # Design tokens, CSS variables, custom classes

supabase/
├── config.toml          # Edge function config (verify_jwt = false)
└── functions/
    ├── ai-astrologer/index.ts   # Streaming AI chat with credit system
    └── daily-horoscope/index.ts # AI horoscope generation + DB caching
```

---

## Provider Hierarchy

```
QueryClientProvider          ← React Query cache
  └─ ThemeProvider           ← next-themes (light/dark)
      └─ LanguageProvider    ← i18n context (hi/en/ta/te/bn/mr)
          └─ AuthProvider    ← Supabase Auth + profile state
              └─ TooltipProvider
                  └─ BrowserRouter
                      └─ Routes
```

All providers are composed in `src/App.tsx`. The `AuthProvider` gracefully handles being accessed before mount (returns safe defaults instead of throwing).

---

## Authentication Flow

1. **Sign Up** (`/register`): Email + password + display name → `supabase.auth.signUp()` with `display_name` in user metadata
2. **Email Verification**: Users must verify email before signing in (auto-confirm is disabled)
3. **Sign In** (`/login`): `supabase.auth.signInWithPassword()`
4. **Profile Creation**: A database trigger automatically creates a `profiles` row on `auth.users` insert, seeding `ai_credits = 2`
5. **Session Management**: `AuthContext` listens to `onAuthStateChange`, fetches profile on login, clears on logout
6. **Protected Features**: AI Astrologer requires auth; Navigation shows login/profile conditionally

---

## Edge Functions

### `daily-horoscope`

| Aspect | Detail |
|--------|--------|
| **Trigger** | Called from `DailyHoroscope.tsx` component on rashi selection |
| **Input** | `{ rashiId, rashiNameHi, rashiNameEn }` |
| **Cache** | Checks `daily_horoscopes` table for `rashi_id + horoscope_date = today` |
| **AI Call** | Lovable AI Gateway → Gemini 2.5 Flash, prompt asks for Hindi + English JSON |
| **Storage** | Upserts result to `daily_horoscopes` (unique on `rashi_id, horoscope_date`) |
| **Auth** | No JWT required (`verify_jwt = false`) — public endpoint |

### `ai-astrologer`

| Aspect | Detail |
|--------|--------|
| **Trigger** | Called from `AstrologerPage.tsx` chat interface |
| **Auth** | Requires valid JWT in Authorization header; verifies user via `getUser()` |
| **Credits** | Checks `profiles.ai_credits > 0`, deducts 1 with optimistic lock before AI call |
| **Context** | Enriches system prompt with user's saved kundali, birth details, rashi |
| **AI Call** | Streaming SSE response from Gemini 2.5 Flash |
| **Refund** | If AI call fails, credit is refunded automatically |
| **Logging** | Each usage logged to `credit_transactions` table |

---

## Database Schema

### Tables

| Table | Purpose | RLS |
|-------|---------|-----|
| `profiles` | User profile data (name, DOB, rashi, credits, preferences) | Users read/update own row |
| `daily_horoscopes` | Cached AI-generated daily horoscopes per rashi | Public read, service-role write |
| `chat_messages` | AI astrologer conversation history | Users read/write own messages |
| `saved_kundalis` | User's saved birth charts | Users CRUD own records |
| `bookmarked_bhajans` | User's bookmarked bhajans | Users CRUD own records |
| `credit_transactions` | AI credit usage/purchase log | Users read own, service-role insert |

### Key Relationships

- `profiles.id` → references `auth.users.id` (auto-created via trigger)
- `saved_kundalis.user_id` → user's auth ID
- `chat_messages.user_id` → user's auth ID
- `bookmarked_bhajans.user_id` → user's auth ID
- `credit_transactions.user_id` → user's auth ID
- `daily_horoscopes` — no user reference (global cache)

---

## Design System

Defined in `src/index.css` and `tailwind.config.ts`. See [Memory Index](../.lovable/memory/index.md) for full token reference.

| Token | Value |
|-------|-------|
| Primary (saffron) | `hsl(24 95% 48%)` |
| Secondary (gold) | `hsl(43 95% 50%)` |
| Accent (crimson) | `hsl(355 75% 35%)` |
| Heading font | Noto Serif Devanagari, Cinzel |
| Body font | Noto Sans Devanagari, Lato |

All colors use HSL CSS variables and Tailwind semantic tokens — never hardcoded in components.
