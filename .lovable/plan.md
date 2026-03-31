

# Enhancement Plan: Divya Jyoti — From Production-Ready to Best-in-Class

This is a massive scope request (~17 major feature areas). To keep it manageable and deliverable, the plan is organized into 6 implementation waves, each independently shippable. Each wave builds on the prior one.

---

## Current State Summary

The app is a fully dynamic, admin-managed Hindu spiritual platform with: 18 DB tables, 3 edge functions, auth/profiles, AI astrologer with credits/streaming, admin CRUD for all content types, bilingual (Hi/En) support, dark mode with persistence, DOMPurify sanitization, ErrorBoundary, and dynamic SEO via `useSeo`.

**Key gaps identified:** No content relationships, no global search, basic audio (no real player), no map integration, static homepage sections (vrat/thought of day), no reminders architecture, no sitemap/structured data, no admin AI assist, no automation jobs, basic search (keyword-to-route routing only).

---

## Wave 1: Content Relationships & Cross-Linking (Foundation)

This underpins many later features (related content on detail pages, search, personalization).

### Database Changes
- Create a `content_relations` junction table:
  ```
  content_relations (
    id uuid PK,
    source_type text NOT NULL,  -- 'festival','temple','article','vrat','bhajan'
    source_id uuid NOT NULL,
    target_type text NOT NULL,
    target_id uuid NOT NULL,
    relation_type text DEFAULT 'related',  -- 'related','linked','prerequisite'
    sort_order int DEFAULT 0,
    created_at timestamptz DEFAULT now()
  )
  ```
  With RLS: public read, admin write.

### Frontend
- New hook: `use-content-relations.ts` — fetch related items for any entity
- Add "Related" sections to detail pages: FestivalDetailPage, TempleDetailPage, ArticleDetailPage, VratPage (when expanded to detail pages)
- Admin: add a linked-content picker component to all content forms

### Vrat Detail Page
- Create `/vrat/:slug` route and `VratDetailPage.tsx`
- Show vrat details, rules, benefits, upcoming occurrences, related festivals/bhajans/articles

---

## Wave 2: Global Search & Discovery

### Database
- Create a Postgres `search_index` view or use existing tables with full-text search columns
- Add `tsvector` generated columns to articles, festivals, temples, bhajans, vrats for both Hindi and English text

### Frontend
- Replace the current keyword-to-route search in Navigation with a real search overlay
- New component: `GlobalSearch.tsx` — modal/drawer with:
  - Debounced input
  - Grouped results by type (articles, festivals, temples, bhajans, vrats)
  - Result cards with emoji, title, type badge
  - Recent searches (localStorage)
- Hook: `use-global-search.ts` — queries across multiple tables using `textSearch` or `ilike`

---

## Wave 3: Homepage Personalization & Dynamic Widgets

### Make Homepage Dynamic for Logged-in Users
- Replace static "Today's Vrat" section with dynamic data from `vrat_occurrences` + `panchang_cache`
- Replace static "Thought of the Day" with data from `site_settings` (admin-managed key: `daily_quote`)
- For logged-in users, add a personalized dashboard strip:
  - Today's horoscope for saved rashi (from `daily_horoscopes`)
  - Today's Panchang for preferred city
  - Upcoming vrat countdown
  - Next festival countdown
  - Bookmarked bhajans quick access
  - Recent AI conversations
- Keep generic homepage for anonymous users

### Profile Enhancements
- Add columns to `profiles`: `preferred_city text`, `preferred_deity text`, `reminder_preferences jsonb DEFAULT '{}'`
- Update ProfilePage to include city/deity preferences
- Update `use-panchang` to use preferred city when available

---

## Wave 4: Temple Maps, Bhajan Player & Rich Detail Pages

### Temple Upgrades
- Add Leaflet + OpenStreetMap map to TempleDetailPage (lazy-loaded)
- Add "near me" button on TemplesPage using browser geolocation + distance sort
- Add temple collections filter: Jyotirlinga, Shakti Peetha, by state/city (using `type` column)
- Enhance detail page: aarti timings, best time to visit, related festivals/bhajans

### Bhajan Audio Player
- Build a `BhajanPlayer.tsx` component:
  - HTML5 Audio with play/pause/progress/volume
  - Fixed bottom bar when playing
  - Queue management (next/previous)
  - Graceful handling when `audio_url` is null
- Add playlist filtering by deity, category
- Add lyrics display section (expandable)
- Preserve existing bookmark integration

### Article Detail Enhancements
- Add breadcrumbs component
- Add related articles section
- Add share button (Web Share API with fallback to copy link)
- Add FAQ section (stored in `extra_data` jsonb or new `article_faqs` field)

---

## Wave 5: Admin Intelligence & AI Editor Assistant

### Admin Workflow Improvements
- Auto slug generation from title on all content forms
- Content quality score indicator per record (checks: has both languages, has SEO fields, has image, has description)
- Missing translation warning badge
- Missing SEO warning badge
- Stale content warning (updated_at > 90 days)
- Preview before publish button

### AI Editor Assistant
- New edge function: `admin-ai-assist/index.ts`
- Features (all editable before save):
  - Generate bilingual draft from title
  - Rewrite/improve description
  - Generate excerpt
  - Suggest SEO title + description
  - Suggest tags/categories
  - Suggest internal links from existing content
- Frontend: Add "AI Assist" button/panel to article, festival, temple, vrat, bhajan forms
- Uses Lovable AI gateway (google/gemini-3-flash-preview)

---

## Wave 6: SEO, Automation & Reminders Architecture

### Advanced SEO
- Add canonical URL meta tags via `useSeo` hook enhancement
- Add JSON-LD structured data for: articles (Article schema), temples (Place schema), festivals (Event schema), breadcrumbs
- Add Open Graph and Twitter Card meta tags
- Create XML sitemap edge function: `sitemap/index.ts` — queries all published content and generates sitemap.xml
- Add `robots.txt` enhancement

### Automation Jobs
- Edge function: `scheduled-tasks/index.ts`
  - Panchang prewarm for top 10 Indian cities (calls existing panchang function)
  - Monthly vrat occurrence generation
  - Stale content flagging
- Set up pg_cron jobs for nightly/monthly execution

### Reminders Architecture (DB + UI only, delivery later)
- Create `user_reminders` table:
  ```
  user_reminders (
    id uuid PK,
    user_id uuid NOT NULL,
    reminder_type text NOT NULL,  -- 'vrat','festival','panchang','horoscope'
    entity_id uuid,
    enabled boolean DEFAULT true,
    channel text DEFAULT 'in_app',
    created_at timestamptz DEFAULT now()
  )
  ```
- Add reminder toggle UI on festival detail, vrat detail, and profile settings
- No push/email delivery yet — architecture only

---

## Panchang Provider Abstraction (Wave 1 or 2)

Refactor the panchang edge function to support a provider pattern:

```text
┌─────────────┐     ┌──────────────────┐     ┌──────────────┐
│  Client      │────▶│  panchang edge   │────▶│  Provider    │
│  (hook)      │     │  function        │     │  Interface   │
└─────────────┘     └──────────────────┘     └──────┬───────┘
                                                     │
                                    ┌────────────────┼────────────────┐
                                    │                │                │
                              ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐
                              │ AI Provider│   │ API/Ephem │   │ Fallback  │
                              │ (current)  │   │ (future)  │   │ (cached)  │
                              └───────────┘   └───────────┘   └───────────┘
```

- Add `source_confidence` field to `panchang_cache` ('ai_generated', 'api_verified', 'manual')
- Refactor edge function with provider switch
- No page component changes needed (same cache table)

---

## Performance & Polish (Throughout All Waves)

- Add skeleton loading states to all list pages (replace spinner)
- Add share actions (Web Share API) to temples, festivals, articles, bhajans
- Lazy-load Leaflet map component
- Review and optimize React Query stale times
- Add cache invalidation after admin edits (queryClient.invalidateQueries)
- Ensure all pages handle empty/missing related data gracefully

---

## Files Estimate Per Wave

| Wave | New Files | Modified Files | Migrations |
|------|-----------|----------------|------------|
| 1    | ~4        | ~8             | 1          |
| 2    | ~3        | ~3             | 1          |
| 3    | ~3        | ~5             | 1          |
| 4    | ~5        | ~6             | 0          |
| 5    | ~4        | ~10            | 0          |
| 6    | ~4        | ~4             | 2          |

**Total:** ~23 new files, ~36 modified files, 5 migrations, 2 new edge functions

---

## Implementation Order

Start with **Wave 1** (content relations + vrat detail page) as it's foundational. Then proceed sequentially. Each wave is independently deployable and testable.

Shall I begin with Wave 1?

