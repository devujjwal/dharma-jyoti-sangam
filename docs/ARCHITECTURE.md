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
| Security | DOMPurify for content sanitization, ErrorBoundary for crash recovery |
| SEO | Dynamic `<title>` and `<meta>` via `useSeo()` hook |

---

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/              # shadcn/ui primitives (button, card, dialog, etc.)
│   ├── admin/           # Admin panel components (AdminLayout, AdminGuard, AdminSidebar, AdminDataTable)
│   ├── Navigation.tsx   # Top navbar with auth-aware menu + dark mode toggle
│   ├── HeroSection.tsx  # Homepage hero banner
│   ├── DailyHoroscope.tsx  # AI-powered daily rashifal widget
│   ├── HoroscopeGrid.tsx   # 12-rashi grid
│   ├── PanchangCard.tsx    # Panchang display card
│   ├── NorthIndianChart.tsx # Kundali chart SVG
│   ├── DoshaCards.tsx      # Manglik/Kaal Sarp dosha display
│   ├── FestivalsSection.tsx # Festival list (DB-driven)
│   ├── BhajansSection.tsx   # Bhajan cards (DB-driven)
│   ├── SubscriptionSection.tsx # Plans section (DB-driven)
│   ├── SiteFooter.tsx      # Global footer
│   ├── ErrorBoundary.tsx   # React error boundary with fallback UI
│   └── ThemeProvider.tsx   # Dark/light/system theme wrapper
├── pages/               # Route-level page components
│   └── admin/           # Admin CRUD pages (16 files)
├── contexts/
│   ├── AuthContext.tsx   # User auth state, profile, credits
│   └── LanguageContext.tsx # i18n with t() translation function
├── data/
│   └── astroData.ts     # Static metadata only: RASHIS (zodiac info), PanchangData interface
├── hooks/               # React Query data-fetching hooks
│   ├── use-daily-horoscope.ts  # Daily horoscope from DB
│   ├── use-panchang.ts         # Panchang from edge function + cache
│   ├── use-festivals.ts        # Festivals CRUD
│   ├── use-articles.ts         # Articles CRUD
│   ├── use-temples.ts          # Temples CRUD
│   ├── use-bhajans.ts          # Bhajans CRUD
│   ├── use-vrats.ts            # Vrats CRUD
│   ├── use-subscription-plans.ts # Subscription plans
│   ├── use-contact-submit.ts   # Contact form submission
│   ├── use-admin.ts            # Admin role check
│   ├── use-admin-content.ts    # Generic admin CRUD operations
│   ├── use-seo.ts              # Dynamic SEO meta tags
│   └── use-mobile.tsx          # Responsive breakpoint hook
├── lib/
│   ├── kundaliCalc.ts   # Vedic birth chart calculation engine
│   ├── ashtakootCalc.ts # Kundali matching (8 koot, 36 points)
│   ├── sanitize.ts      # DOMPurify wrappers (sanitizeHtml, sanitizeText)
│   └── utils.ts         # Tailwind cn() utility
├── integrations/
│   └── supabase/
│       ├── client.ts    # Auto-generated Supabase client (DO NOT EDIT)
│       └── types.ts     # Auto-generated DB types (DO NOT EDIT)
└── index.css            # Design tokens, CSS variables, custom classes

supabase/
├── config.toml          # Edge function config
└── functions/
    ├── ai-astrologer/index.ts   # Streaming AI chat with credit system
    ├── daily-horoscope/index.ts # AI horoscope generation + DB caching
    └── panchang/index.ts        # AI Panchang generation + DB caching
```

---

## Provider Hierarchy

```
QueryClientProvider          ← React Query cache
  └─ ThemeProvider           ← next-themes (light/dark/system)
      └─ LanguageProvider    ← i18n context (hi/en)
          └─ AuthProvider    ← Supabase Auth + profile state
              └─ TooltipProvider
                  └─ BrowserRouter
                      └─ ErrorBoundary
                          └─ Suspense
                              └─ Routes
```

All providers are composed in `src/App.tsx`. The `ErrorBoundary` catches runtime errors and shows a recovery UI. The `AuthProvider` gracefully handles being accessed before mount.

---

## Authentication Flow

1. **Sign Up** (`/register`): Email + password + display name → `supabase.auth.signUp()` with `display_name` in user metadata
2. **Email Verification**: Users must verify email before signing in (auto-confirm is disabled)
3. **Sign In** (`/login`): `supabase.auth.signInWithPassword()`
4. **Profile Creation**: A database trigger (`handle_new_user`) automatically creates a `profiles` row on `auth.users` insert, seeding `ai_credits = 2`
5. **Session Management**: `AuthContext` listens to `onAuthStateChange`, fetches profile on login, clears on logout
6. **Theme Sync**: On login, user's saved theme preference is restored from `profiles.theme`
7. **Protected Features**: AI Astrologer requires auth; Admin panel requires `super_admin` or `editor` role

### Role-Based Access Control

Roles are stored in a separate `user_roles` table (not on profiles) to prevent privilege escalation.

- **Roles**: `super_admin`, `editor`, `support` (defined as `app_role` enum)
- **Check function**: `has_role(_user_id, _role)` — SECURITY DEFINER to bypass RLS recursion
- **Admin check**: `is_admin(_user_id)` — returns true for `super_admin` or `editor`
- **Frontend guard**: `AdminGuard` component wraps all `/admin/*` routes

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

### `panchang`

| Aspect | Detail |
|--------|--------|
| **Trigger** | Called from `usePanchang()` hook when no cache exists |
| **Input** | `{ date, locationKey, city }` (default: Delhi) |
| **Cache** | Checks `panchang_cache` table for `panchang_date + location_key` |
| **AI Call** | Lovable AI Gateway → Gemini 2.5 Flash, generates bilingual Panchang data |
| **Storage** | Inserts to `panchang_cache` with 24-hour expiry |
| **Auth** | No JWT required — public endpoint |

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

### Tables (18 total)

| Table | Purpose | RLS |
|-------|---------|-----|
| `profiles` | User profile data (name, DOB, rashi, credits, theme) | Users read/update own row |
| `user_roles` | Role assignments (super_admin, editor, support) | Super admins manage; users view own |
| `daily_horoscopes` | Cached AI-generated daily horoscopes per rashi | Public read, service-role write |
| `panchang_cache` | Cached AI-generated Panchang data by date + location | Public read, service-role write |
| `chat_messages` | AI astrologer conversation history | Users CRUD own messages |
| `saved_kundalis` | User's saved birth charts | Users CRUD own records |
| `bookmarked_bhajans` | User's bookmarked bhajans | Users CRUD own records |
| `credit_transactions` | AI credit usage/purchase log | Users read/insert own |
| `festivals` | Hindu festival calendar entries | Public read published; admins manage |
| `articles` | Spiritual/religious articles | Public read published; admins manage |
| `temples` | Temple directory entries | Public read published; admins manage |
| `bhajans` | Bhajan & chalisa collection | Public read published; admins manage |
| `vrats` | Vrat/fasting guide entries | Public read published; admins manage |
| `vrat_occurrences` | Specific vrat dates | Public read; admins manage |
| `subscription_plans` | Pricing plans (active ones visible publicly) | Public read active; admins manage |
| `subscriptions` | User subscription records | Users view own; service-role manages |
| `payment_events` | Payment webhook event log | Service-role only |
| `contact_submissions` | Contact form submissions | Public insert; admins manage |
| `site_settings` | Key-value site configuration | Public read; admins manage |

### Key Database Functions

| Function | Purpose |
|----------|---------|
| `has_role(_user_id, _role)` | Check if user has specific role (SECURITY DEFINER) |
| `is_admin(_user_id)` | Check if user is super_admin or editor |
| `handle_new_user()` | Trigger: auto-create profile on auth.users insert |
| `update_updated_at_column()` | Trigger: auto-update `updated_at` timestamp |

---

## Admin Panel Architecture

- **Guard**: `AdminGuard` checks `is_admin(auth.uid())` via RPC, redirects non-admins
- **Layout**: `AdminLayout` with collapsible `AdminSidebar` navigation
- **Data Table**: Generic `AdminDataTable` component for list views with search
- **CRUD Pattern**: Each content type has a List page + Form page (create/edit)
- **Content types managed**: Festivals, Articles, Temples, Bhajans, Vrats, Subscription Plans, Contact Submissions, Site Settings, Panchang Cache

---

## Content Security

- **DOMPurify**: All admin-entered HTML/content is sanitized before rendering via `sanitizeHtml()` and `sanitizeText()` from `src/lib/sanitize.ts`
- **Error Boundary**: `ErrorBoundary` component wraps the app routes, catching crashes and showing a recovery UI
- **SEO**: `useSeo()` hook dynamically sets `document.title` and `<meta name="description">` on detail pages

---

## Design System

Defined in `src/index.css` and `tailwind.config.ts`.

| Token | Value |
|-------|-------|
| Primary (saffron) | `hsl(24 95% 48%)` |
| Secondary (gold) | `hsl(43 95% 50%)` |
| Accent (crimson) | `hsl(355 75% 35%)` |
| Heading font | Noto Serif Devanagari, Cinzel |
| Body font | Noto Sans Devanagari, Lato |

All colors use HSL CSS variables and Tailwind semantic tokens — never hardcoded in components. Dark mode is fully supported via `next-themes` with system preference detection.
