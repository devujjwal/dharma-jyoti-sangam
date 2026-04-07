# Divya Jyoti — Project Documentation

**Divya Jyoti** (दिव्य ज्योति) is a best-in-class Hindu spiritual and Vedic astrology platform built with React 18, Vite 5, TypeScript, Tailwind CSS, shadcn/ui, React Query, and Lovable Cloud.

All content is **fully dynamic and admin-managed** via a database-backed CMS with AI-powered editorial tools. The platform provides Panchang, Rashifal (horoscopes), Kundali generation, Kundali matching, an AI-powered Vedic astrologer, festival calendars, temple guides (with interactive maps), bhajans (with audio player), vrat information, articles, global search, personalized dashboards, reminders, and structured SEO — all with bilingual Hindi/English support.

---

## Documentation Index

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Tech stack, project structure, provider hierarchy, auth flow, edge functions, database schema, admin intelligence, automation |
| [PAGES.md](./PAGES.md) | Page-by-page breakdown — route, data source, dynamic classification |
| [DATA-LOGIC.md](./DATA-LOGIC.md) | Business logic deep-dive — Panchang, Kundali, Ashtakoot, AI credits, i18n, search, reminders, personalization, SEO |

---

## Quick Start

```bash
npm install
npm run dev
```

## Key URLs

### Public Pages

| Route | Page |
|-------|------|
| `/` | Homepage (personalized for logged-in users) |
| `/panchang` | Daily Panchang (AI-generated, cached) |
| `/horoscope` | Rashifal — 12 Rashi Grid |
| `/horoscope/:rashiId` | Rashi Detail (AI-generated daily horoscope) |
| `/ai-astrologer` | AI Vedic Astrologer (requires login) |
| `/kundali` | Kundali Generator |
| `/kundali-matching` | Ashtakoot Kundali Matching |
| `/festivals` | Hindu Festival Calendar (DB-driven) |
| `/festivals/:slug` | Festival Detail (with reminders, .ics download) |
| `/temples` | Famous Temples Directory (DB-driven, with map) |
| `/temples/:slug` | Temple Detail (with Leaflet/OpenStreetMap) |
| `/bhajans` | Bhajan & Chalisa Collection (DB-driven, audio player) |
| `/vrat` | Vrat & Upvas Guide (DB-driven) |
| `/vrat/:slug` | Vrat Detail (with upcoming dates & reminders) |
| `/articles` | Spiritual Articles (DB-driven) |
| `/articles/:slug` | Article Detail (with breadcrumbs, share, related content) |
| `/subscribe` | Subscription Plans (DB-driven, payment coming soon) |
| `/profile` | User Profile, Credits, Saved Data & Reminders |
| `/contact` | Contact Form (submissions saved to DB) |

### Admin Panel (requires `super_admin` or `editor` role)

| Route | Page |
|-------|------|
| `/admin` | Dashboard with content counts |
| `/admin/festivals` | Manage Festivals |
| `/admin/articles` | Manage Articles (with AI assistant, quality bar, auto-slug) |
| `/admin/temples` | Manage Temples |
| `/admin/bhajans` | Manage Bhajans |
| `/admin/vrats` | Manage Vrats |
| `/admin/plans` | Manage Subscription Plans |
| `/admin/contacts` | Manage Contact Submissions |
| `/admin/settings` | Site Settings (key-value) |
| `/admin/panchang` | Panchang Cache Viewer |

### Static Pages

| Route | Page |
|-------|------|
| `/about` | About |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Service |
| `/ads-policy` | Ads Policy |
| `/support` | Support |

---

## Enhancement Waves (Completed)

The platform was enhanced through 6 implementation waves:

1. **Content Relations & Vrat Detail** — Cross-content linking, vrat detail pages with occurrences
2. **Global Search** — Full-text search across articles, festivals, temples, bhajans, vrats via `global_search()` DB function
3. **Homepage Personalization** — Rashi-specific horoscope, city-based Panchang, dynamic vrat/quote widgets for logged-in users
4. **Temple Maps & Audio Player** — Leaflet/OpenStreetMap for temples, bhajan audio player with queue, article breadcrumbs & share
5. **Admin Intelligence** — AI editor assistant (translate, summarize, SEO), auto-slug, content quality scoring, bulk translation
6. **SEO & Automation** — JSON-LD structured data, XML sitemap edge function, pg_cron scheduled jobs, reminders system
